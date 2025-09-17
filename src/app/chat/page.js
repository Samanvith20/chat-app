"use client";

import React, { useEffect, useState } from "react";

import { useAuthStore } from "../zustand/useAuthStore";
import { useFetchUsers } from "../hooks/useFetchUsers";
import ChatUsers from "../_components/chatUsers";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { io } from "socket.io-client";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";

const Chat = () => {
  const { authDetails } = useAuthStore();
  console.log("authName", authDetails);
  let authName = authDetails?.displayName;
  const { loading } = useFetchUsers();
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const { updateChatMsgs, chatMsgs } = useChatMsgsStore();
  console.log("chatMsgs", chatMsgs);
  const { chatReceiver } = useChatReceiverStore();

  useEffect(() => {
    if (!authName) return;
    const newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}`, {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);

    newSocket.on("chat msg", (msg) => {
      console.log("received msg on client " + msg.text);
      updateChatMsgs([...chatMsgs, msg]);
    });

    return () => newSocket.close();
  }, [authName, updateChatMsgs, chatMsgs]);

  const sendMsg = (e) => {
    e.preventDefault();
    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };
    if (socket) {
      socket.emit("chat msg", msgToBeSent);
      updateChatMsgs([...chatMsgs, msgToBeSent]);

      setMsg("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-[1200px] mx-auto h-screen grid grid-cols-12 gap-4 p-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-md h-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Chats</h2>
              <p className="text-xs text-gray-500 mt-1">You are logged in as <span className="font-medium">{authName ?? "—"}</span></p>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {/* Keep your ChatUsers component here (it renders user list) */}
                <ChatUsers />
              </div>
            </div>

            <div className="px-4 py-3 border-t text-xs text-gray-500">
              Tip: select a user to start chatting
            </div>
          </div>
        </aside>

        {/* Main Chat Panel */}
        <main className="col-span-12 md:col-span-9 lg:col-span-9 flex flex-col">
          <div className="bg-white rounded-2xl shadow-md flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {authName ? authName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-sm font-semibold">{chatReceiver ?? "No recipient selected"}</div>
                  <div className="text-xs text-gray-500">
                    {chatReceiver ? "Active now" : "Select someone to chat"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* <button
                  className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
                  onClick={() => {
                   
                  }}
                >
                  New Chat
                </button> */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  {authName}
                </div>
              </div>
            </header>

            {/* Messages area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1  max-h-[500px] overflow-auto p-6 bg-[linear-gradient(180deg,#f8fafc,white)]">
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                  {chatMsgs.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                      No messages yet — say hello 👋
                    </div>
                  )}

                  {chatMsgs.map((m, index) => {
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
                    placeholder={chatReceiver ? "Type a message..." : "Select a user to start chatting"}
                    required
                    className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                    disabled={!chatReceiver}
                  />

                  <button
                    type="submit"
                    disabled={!chatReceiver || !msg.trim()}
                    className={`px-5 py-2 rounded-full text-sm font-medium
                      ${!chatReceiver || !msg.trim() ? "bg-blue-200 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
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
