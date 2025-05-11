"use client"

import * as React from "react"
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"

import { NavUser } from "./nav-user"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Drafts",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ],
  mails: [
    {
      name: "William Smith",
      email: "williamsmith@example.com",
      subject: "Meeting Tomorrow",
      date: "09:34 AM",
      teaser:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      name: "Alice Smith",
      email: "alicesmith@example.com",
      subject: "Re: Project Update",
      date: "Yesterday",
      teaser:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
      subject: "Weekend Plans",
      date: "2 days ago",
      teaser:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      subject: "Re: Question about Budget",
      date: "2 days ago",
      teaser:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",
      subject: "Important Announcement",
      date: "1 week ago",
      teaser:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      name: "Sarah Brown",
      email: "sarahbrown@example.com",
      subject: "Re: Feedback on Proposal",
      date: "1 week ago",
      teaser:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      name: "David Lee",
      email: "davidlee@example.com",
      subject: "New Project Idea",
      date: "1 week ago",
      teaser:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      name: "Olivia Wilson",
      email: "oliviawilson@example.com",
      subject: "Vacation Plans",
      date: "1 week ago",
      teaser:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      name: "James Martin",
      email: "jamesmartin@example.com",
      subject: "Re: Conference Registration",
      date: "1 week ago",
      teaser:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      name: "Sophia White",
      email: "sophiawhite@example.com",
      subject: "Team Dinner",
      date: "1 week ago",
      teaser:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
}

export function AppSidebar() {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [mails, setMails] = React.useState(data.mails)
  const [mailsOpen, setMailsOpen] = React.useState(true)

  // Handle mail item click
  const handleMailItemClick = (item: typeof data.navMain[0]) => {
    setActiveItem(item)
    const mail = data.mails.sort(() => Math.random() - 0.5)
    setMails(mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1)))
    setMailsOpen(true)
  }

  return (
    <div className="flex h-full bg-sidebar">
      {/* First sidebar - icon bar */}
      <div className="w-14 border-r h-full flex flex-col">
        <div className="p-2 border-b">
          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-5" />
          </a>
        </div>
        
        <div className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {data.navMain.map((item) => (
              <button
                key={item.title}
                onClick={() => handleMailItemClick(item)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  activeItem?.title === item.title 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-muted/80'
                }`}
                title={item.title}
              >
                <item.icon className="size-5" />
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-2 border-t">
          <button className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-accent text-accent-foreground">
            <span className="text-sm font-medium">
              {data.user.name.charAt(0).toUpperCase()}
            </span>
          </button>
        </div>
      </div>
      
      {/* Second sidebar - mail list */}
      <div className="
        flex-1 flex flex-col">
        <div className="p-4 border-b flex flex-col gap-3 ">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">{activeItem?.title}</h2>
            <div className="flex items-center gap-2">
              <Label className="flex items-center gap-2 text-xs">
                <span>Unreads</span>
                <Switch className="shadow-none" />
              </Label>
            </div>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type to search..."
              className="w-full py-2 px-3 text-sm bg-muted/50 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {mails.map((mail) => (
            <a
              href="#"
              key={mail.email}
              className="flex flex-col items-start gap-2 p-4 border-b last:border-b-0 hover:bg-accent/10"
            >
              <div className="flex w-full items-center gap-2">
                <span className="text-sm">{mail.name}</span> 
                <span className="ml-auto text-xs text-muted-foreground">{mail.date}</span>
              </div>
              <span className="font-medium text-sm">{mail.subject}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{mail.teaser}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}