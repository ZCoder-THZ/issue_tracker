"use client"
import { useState } from "react"
import { AppSidebar } from "../../components/chat/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Menu } from "lucide-react"

export default function Page() {
  // Simple state to control sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true)
  
  return (
    <div className="flex">
   {sidebarVisible && (
        
          <AppSidebar />
     
      )}

    <div className=" h-screen w-full overflow-hidden bg-background">
      {/* The AppSidebar with conditional rendering based on state */}
   
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <button 
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto w-full bg-background">
          <div className="flex flex-1 flex-col gap-4 p-4 w-full">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="h-12 w-full rounded-lg bg-muted/50" />
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  )
}