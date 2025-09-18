"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../zustand/useAuthStore";
import { useFetchUsers } from "../hooks/useFetchUsers";
import ChatUsers from "../_components/chatUsers";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { io } from "socket.io-client";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";

const Chat = () => {
  const { authDetails } = useAuthStore();
  const authName = authDetails?.displayName;
  const { loading } = useFetchUsers();
  
  const [msg, setMsg] = useState("");
  const { updateChatMsgs, chatMsgs } = useChatMsgsStore();
  console.log("chatmsgs::",chatMsgs)
  const { chatReceiver } = useChatReceiverStore();
  const socketRef = useRef(null);
  
  // Optimized online users state management
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [userStatuses, setUserStatuses] = useState(new Map()); // Track detailed status info
  
  const BE = process.env.NEXT_PUBLIC_BE_HOST || "http://localhost:5000";

  // Optimized status update functions
  const updateUserStatus = useCallback((username, status, lastSeen = null) => {
    console.log(`[Presence] Updating ${username} to ${status}`);
    
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (status === "online") {
        newSet.add(username);
      } else {
        newSet.delete(username);
      }
      return newSet;
    });

    setUserStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(username, {
        status,
        lastSeen: lastSeen || Date.now(),
        lastUpdated: Date.now()
      });
      return newMap;
    });
  }, []);

  // Fetch initial online users
  const fetchInitialOnlineUsers = useCallback(async () => {
    try {
      console.log("[Presence] Fetching initial online users...");
      const response = await fetch(`${BE}/api/users/online`);
      
      if (response.ok) {
        const data = await response.json();
        const onlineUsersList = data.onlineUsers || [];
        
        console.log("[Presence] Initial online users:", onlineUsersList);
        
        // Update state with initial online users
        setOnlineUsers(new Set(onlineUsersList));
        
        // Update detailed status for each online user
        const statusMap = new Map();
        onlineUsersList.forEach(username => {
          statusMap.set(username, {
            status: "online",
            lastSeen: Date.now(),
            lastUpdated: Date.now()
          });
        });
        setUserStatuses(statusMap);
        
      } else {
        console.warn("[Presence] Failed to fetch online users:", response.status);
      }
    } catch (error) {
      console.error("[Presence] Error fetching initial online users:", error);
    }
  }, [BE]);

  // Socket connection and event handling
  useEffect(() => {
    if (!authName) return;

    console.log("[Socket] Connecting to", BE, "as", authName);
    
    const socket = io(BE, {
      query: { username: authName },
      transports: ["websocket"],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("[Socket] Connected with ID:", socket.id);
      
      // Emit user login to register presence
      socket.emit("user:login", { username: authName });
      
      // Fetch initial online users after connection
      fetchInitialOnlineUsers();
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("[Socket] Reconnected after", attemptNumber, "attempts");
      // Re-fetch online users after reconnection
      fetchInitialOnlineUsers();
    });

    // Chat message handler
    socket.on("chat msg", (message) => {
      console.log("[Socket] Received chat message:", message);
          updateChatMsgs([...chatMsgs, message]);
    });

    // Presence update handler - THIS IS THE KEY PART
    socket.on("presence-update", (payload) => {
      console.log("[Socket] Presence update received:", payload);
      
      if (!payload || !payload.username) {
        console.warn("[Socket] Invalid presence payload:", payload);
        return;
      }

      const { username, status, lastSeen } = payload;
      
      // Don't update our own status in the UI (we know we're online)
      if (username === authName) {
        console.log("[Socket] Ignoring own presence update");
        return;
      }

      updateUserStatus(username, status, lastSeen);
    });

    

    // Handle initial online users list
    socket.on("online-users", (users) => {
      console.log("[Socket] Received online users list:", users);
      
      if (Array.isArray(users)) {
        setOnlineUsers(new Set(users));
        
        const statusMap = new Map();
        users.forEach(username => {
          statusMap.set(username, {
            status: "online",
            lastSeen: Date.now(),
            lastUpdated: Date.now()
          });
        });
        setUserStatuses(statusMap);
      }
    });

    // Error handler
    socket.on("error", (error) => {
      console.error("[Socket] Socket error:", error);
    });

    // Cleanup function
    return () => {
      console.log("[Socket] Cleaning up socket connection");
      
      if (socket.connected) {
        socket.emit("user:disconnect");
      }
      
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authName, updateUserStatus, fetchInitialOnlineUsers, updateChatMsgs,chatMsgs]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit("user:disconnect");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Send message function
  const sendMsg = (e) => {
    e.preventDefault();
    
    if (!msg.trim() || !chatReceiver) return;

    const messageToSend = {
      text: msg.trim(),
      sender: authName,
      receiver: chatReceiver,
      timestamp: Date.now()
    };

    const socket = socketRef.current;
    
    if (socket && socket.connected) {
      socket.emit("chat msg", messageToSend);
       updateChatMsgs([...chatMsgs, messageToSend]);;
      setMsg("");
    } else {
      console.error("[Socket] Cannot send message - socket not connected");
    }
  };

  // Utility function to check if user is online
  const isUserOnline = useCallback((username) => {
    return onlineUsers.has(username);
  }, [onlineUsers]);

  // Utility function to get user's last seen
  const getUserLastSeen = useCallback((username) => {
    const status = userStatuses.get(username);
    return status?.lastSeen;
  }, [userStatuses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
      </div>
    );
  }

  const onlineArray = Array.from(onlineUsers);
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-[1200px] mx-auto h-screen grid grid-cols-12 gap-4 p-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md h-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Chats</h2>
              <p className="text-xs text-gray-500 mt-1">
                You are logged in as <span className="font-medium">{authName ?? "—"}</span>
              </p>
              <div className="text-xs text-green-600 mt-1">
                {onlineArray.length} users online
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-4">
                <ChatUsers 
                  onlineList={onlineArray} 
                  isUserOnline={isUserOnline}
                  getUserLastSeen={getUserLastSeen}
                />
              </div>
            </div>

            <div className="px-4 py-3 border-t text-xs text-gray-500">
              Tip: Green dot indicates online users
            </div>
          </div>
        </aside>

        {/* Main Chat Panel */}
        <main className="col-span-12 md:col-span-9 lg:col-span-9 flex flex-col">
          <div className="bg-white rounded-2xl shadow-md flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {chatReceiver ? chatReceiver.charAt(0).toUpperCase() : "?"}
                  </div>
                  {chatReceiver && isUserOnline(chatReceiver) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {chatReceiver ?? "No recipient selected"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {chatReceiver && (
                      isUserOnline(chatReceiver) 
                        ? "Online now" 
                        : `Last seen: ${new Date(getUserLastSeen(chatReceiver) || 0).toLocaleTimeString()}`
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  Connected as {authName}
                </div>
              </div>
            </header>

            {/* Messages area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 max-h-[500px] overflow-auto p-6 bg-[linear-gradient(180deg,#f8fafc,white)]">
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                  {chatMsgs?.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                      No messages yet — say hello 👋
                    </div>
                  )}

                  {chatMsgs?.map((m, index) => {
                    const mine = m.sender === authName;
                    return (
                      <div
                        key={index}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`inline-block max-w-[75%] px-4 py-2 rounded-2xl shadow-sm break-words
                          ${mine ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"}`}
                        >
                          <div className="text-sm">{m.text}</div>
                          <div className={`text-[10px] mt-1 ${mine ? "text-blue-100" : "text-gray-500"}`}>
                            {mine ? "You" : m.sender}
                            {m.timestamp && (
                              <span className="ml-2">
                                {new Date(m.timestamp).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Input area */}
              <div className="px-6 py-4 border-t bg-white">
                <form onSubmit={sendMsg} className="max-w-3xl mx-auto flex gap-3 items-center">
                  <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder={
                      chatReceiver 
                        ? `Message ${chatReceiver}...` 
                        : "Select a user to start chatting"
                    }
                    className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                    disabled={!chatReceiver}
                  />

                  <button
                    type="submit"
                    disabled={!chatReceiver || !msg.trim()}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors
                      ${!chatReceiver || !msg.trim() 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;