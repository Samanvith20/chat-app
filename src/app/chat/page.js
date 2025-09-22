"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "../zustand/useAuthStore";
import { useFetchUsers } from "../hooks/useFetchUsers";
import ChatUsers from "../_components/chatUsers";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { io } from "socket.io-client";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { Send, Phone, Video, MoreVertical, Smile, Paperclip, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Chat = () => {
  const { authDetails } = useAuthStore();
  const authName = authDetails?.displayName;
  console.log("authName ::",authName)
  const { loading } = useFetchUsers();
  const router = useRouter();
  const[mounted, setMounted] = useState(false)
  
  // Authentication redirect effect - Check early in component
useEffect(() => {
  setMounted(true);
  
  // Only check authentication after loading is complete
  if (mounted&&!loading &&  (!authDetails || !authName)) {
    console.log("User not authenticated, redirecting to login...");
    router.push('/login');
    // setMounted(false);
    return;
  }
}, [authDetails, authName, router, mounted,loading]);

  const [msg, setMsg] = useState("");
  const { updateChatMsgs, chatMsgs } = useChatMsgsStore();
  console.log("chatmsgs::",chatMsgs)
  const { chatReceiver } = useChatReceiverStore();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Optimized online users state management
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [userStatuses, setUserStatuses] = useState(new Map()); // Track detailed status info
  
  const BE = process.env.NEXT_PUBLIC_BE_HOST || "http://localhost:5000";

  // Navigate to homepage
  const goToHomepage = () => {
    router.push('/'); // Adjust the path according to your routing structure
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMsgs]);

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

  // Show loading state while checking authentication or loading data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-white font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will handle navigation)
  if (!authDetails || !authName) {
    return null;
  }

  const onlineArray = Array.from(onlineUsers);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goToHomepage}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105 group"
                title="Go to Homepage"
              >
                <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Home</span>
              </button>
              
              <div className="w-px h-8 bg-white/20"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {authName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Real-Time Chat</h1>
                  <p className="text-xs text-gray-300">Welcome back, {authName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-medium">
                  {onlineArray.length} online
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto h-[calc(100vh-80px)] grid grid-cols-12 gap-6 p-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 h-full flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {authName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">Chats</h2>
                  <p className="text-xs text-gray-300">
                    {authName ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-medium">
                  {onlineArray.length} users online
                </span>
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

            <div className="px-4 py-3 border-t border-white/10 text-xs text-gray-400 text-center bg-black/10">
              🟢 Online  ⚫ Offline
            </div>
          </div>
        </aside>

        {/* Main Chat Panel */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {chatReceiver ? chatReceiver.charAt(0).toUpperCase() : "?"}
                  </div>
                  {chatReceiver && isUserOnline(chatReceiver) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">
                    {chatReceiver ?? "Select a conversation"}
                  </div>
                  <div className="text-sm text-gray-300">
                    {chatReceiver && (
                      isUserOnline(chatReceiver) 
                        ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Online now</span>
                          </div>
                        )
                        : `Offline`
                    )}
                  </div>
                </div>
              </div>

              {chatReceiver && (
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              )}
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {!chatReceiver && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Welcome to Real-Time Chat</h3>
                    <p className="text-gray-300 max-w-md">
                      Select a user from the sidebar to start a conversation. Your messages will be delivered instantly!
                    </p>
                  </div>
                )}

                {chatReceiver && chatMsgs?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-white/60 mb-4">💬</div>
                    <p className="text-gray-300">No messages yet with {chatReceiver}</p>
                    <p className="text-gray-400 text-sm mt-1">Send a message to start the conversation!</p>
                  </div>
                )}

                {chatMsgs?.map((m, index) => {
                  const mine = m.sender === authName;
                  return (
                    <div
                      key={index}
                      className={`flex ${mine ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${mine ? "flex-row-reverse" : ""}`}>
                        {!mine && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {m.sender?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className={`group relative`}>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                              mine 
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/20 rounded-br-md" 
                                : "bg-white/20 text-white border-white/20 rounded-bl-md"
                            }`}
                          >
                            <div className="text-sm leading-relaxed break-words">{m.text}</div>
                          </div>
                          <div className={`text-xs text-gray-400 mt-1 px-1 ${mine ? "text-right" : "text-left"}`}>
                            {m.timestamp && (
                              <span>
                                {new Date(m.timestamp).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-6 py-4 border-t border-white/10 bg-black/10">
                <form onSubmit={sendMsg} className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder={
                        chatReceiver 
                          ? `Message ${chatReceiver}...` 
                          : "Select a user to start chatting"
                      }
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      disabled={!chatReceiver}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                      disabled={!chatReceiver}
                    >
                      
                    </button>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                      disabled={!chatReceiver}
                    >
                     
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!chatReceiver || !msg.trim()}
                    className={`p-3 rounded-full font-medium transition-all shadow-lg ${
                      !chatReceiver || !msg.trim() 
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl"
                    }`}
                    >
                    <Send className="w-5 h-5" />
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