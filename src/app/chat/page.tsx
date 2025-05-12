"use client"

import { useState } from "react"
import { Menu, Send, Smile, Paperclip } from "lucide-react"
import { useConnectedUserStore } from "@/stores/socketIo/connectedUsers"
const initialChatData = {
  chatList: [
    {
      id: "1",
      type: "private",
      name: "Alice",
      avatar: "https://i.pravatar.cc/100?img=1",
      unread: 1,
      lastMessage: "Catch you later!",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "Alice",
          content: "Hey, are you free tomorrow?",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
        },
        {
          id: "msg_2",
          sender: "me",
          content: "Yeah, I should be. What’s up?",
          timestamp: new Date(Date.now() - 7000000).toISOString(),
          read: true,
        },
        {
          id: "msg_3",
          sender: "Alice",
          content: "Let’s grab lunch then.",
          timestamp: new Date(Date.now() - 6900000).toISOString(),
          read: true,
        },
        {
          id: "msg_4",
          sender: "me",
          content: "Sounds good!",
          timestamp: new Date(Date.now() - 6800000).toISOString(),
          read: true,
        },
        {
          id: "msg_5",
          sender: "Alice",
          content: "Catch you later!",
          timestamp: new Date(Date.now() - 6700000).toISOString(),
          read: false,
        },
      ],
    },
    {
      id: "2",
      type: "group",
      name: "Dev Team",
      avatar: "https://i.pravatar.cc/100?img=5",
      unread: 0,
      lastMessage: "Let’s do code review after lunch.",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "John",
          content: "Anyone finished the login page?",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          read: true,
        },
        {
          id: "msg_2",
          sender: "Sarah",
          content: "I pushed the PR this morning.",
          timestamp: new Date(Date.now() - 550000).toISOString(),
          read: true,
        },
        {
          id: "msg_3",
          sender: "me",
          content: "Nice! Let’s do code review after lunch.",
          timestamp: new Date(Date.now() - 500000).toISOString(),
          read: true,
        },
      ],
    },
    {
      id: "3",
      type: "private",
      name: "Bob",
      avatar: "https://i.pravatar.cc/100?img=3",
      unread: 0,
      lastMessage: "I'll call you later.",
      timestamp: new Date(Date.now() - 4000000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "Bob",
          content: "Can you send me the file?",
          timestamp: new Date(Date.now() - 4100000).toISOString(),
          read: true,
        },
        {
          id: "msg_2",
          sender: "me",
          content: "Sure, give me a sec.",
          timestamp: new Date(Date.now() - 4050000).toISOString(),
          read: true,
        },
        {
          id: "msg_3",
          sender: "Bob",
          content: "Got it. I'll call you later.",
          timestamp: new Date(Date.now() - 4000000).toISOString(),
          read: true,
        },
      ],
    },
    {
      id: "4",
      type: "group",
      name: "Weekend Trip",
      avatar: "https://i.pravatar.cc/100?img=6",
      unread: 3,
      lastMessage: "Don't forget sunscreen 😎",
      timestamp: new Date(Date.now() - 1000000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "Emma",
          content: "Everyone ready for the trip?",
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          read: true,
        },
        {
          id: "msg_2",
          sender: "Liam",
          content: "Can't wait!",
          timestamp: new Date(Date.now() - 1100000).toISOString(),
          read: true,
        },
        {
          id: "msg_3",
          sender: "me",
          content: "I’ll bring snacks 🍿",
          timestamp: new Date(Date.now() - 1050000).toISOString(),
          read: true,
        },
        {
          id: "msg_4",
          sender: "Emma",
          content: "Don't forget sunscreen 😎",
          timestamp: new Date(Date.now() - 1000000).toISOString(),
          read: false,
        },
      ],
    },
  ],
}


export default function ChatPage() {

  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [chats, setChats] = useState(initialChatData.chatList)
  const [activeChatId, setActiveChatId] = useState("1")
  const [message, setMessage] = useState("")
  const {connectedUserIds}=useConnectedUserStore()

  const activeChat = chats.find(chat => chat.id === activeChatId)

  console.log(connectedUserIds,'connectedUsersIds')

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: "me",
      content: message,
      timestamp: new Date().toISOString(),
      read: false
    }

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.content,
          timestamp: newMessage.timestamp,
        }
      }
      return chat
    })

    setChats(updatedChats)
    setMessage("")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="w-80 border-r bg-background">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chats</h2>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full py-2 px-3 text-sm bg-muted/50 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-73px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center p-4 border-b cursor-pointer hover:bg-accent/10 ${
                  activeChatId === chat.id ? "bg-accent/10" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 flex items-center gap-2 border-b bg-background p-4">
          <button
            className="flex items-center justify-center rounded-md hover:bg-muted"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center ml-2">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <h2 className="text-sm font-medium">{activeChat.name}</h2>
              <p className="text-xs text-muted-foreground">
                {activeChat.type === 'private' ? 'Online' : '3 participants'}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-auto p-4 bg-muted/50">
          <div className="space-y-4">
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 text-muted-foreground text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.sender === 'me' && (
                      <span className="ml-1">
                        {msg.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Message Input */}
        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-muted">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted">
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 py-2 px-3 rounded-full border focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
