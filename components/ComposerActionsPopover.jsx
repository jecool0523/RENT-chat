"use client"
import { useState } from "react"
import { Paperclip, Bot, Search, Palette, BookOpen, MoreHorizontal, Globe, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function ComposerActionsPopover({ children }) {
  const [open, setOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const mainActions = [
    {
      icon: Bot,
      label: "Agent mode",
      badge: "NEW",
      action: () => console.log("Agent mode"),
    },
    {
      icon: Search,
      label: "Deep research",
      action: () => console.log("Deep research"),
    },
    {
      icon: BookOpen,
      label: "Study and learn",
      action: () => console.log("Study and learn"),
    },
  ]

  const moreActions = [
    {
      icon: Globe,
      label: "Web search",
      action: () => console.log("Web search"),
    },
    {
      icon: Palette,
      label: "Canvas",
      action: () => console.log("Canvas"),
    },
  ]

  const handleAction = (action) => {
    action()
    setOpen(false)
    setShowMore(false)
  }

  const handleMoreClick = () => {
    setShowMore(true)
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      setShowMore(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start" side="top">
        {!showMore ? (
          // Main actions view
          <div className="p-3">
            <div className="space-y-1">
              {mainActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleAction(action.action)}
                    className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{action.label}</span>
                    {action.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </button>
                )
              })}
              <button
                onClick={handleMoreClick}
                className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            </div>
          </div>
        ) : (
          // More options view with two columns
          <div className="flex">
            <div className="flex-1 p-3 border-r border-zinc-200 dark:border-zinc-800">
              <div className="space-y-1">
                {mainActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleAction(action.action)}
                      className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{action.label}</span>
                      {action.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
                <button
                  onClick={handleMoreClick}
                  className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>More</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="space-y-1">
                {moreActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleAction(action.action)}
                      className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                      {typeof IconComponent === "function" ? <IconComponent /> : <IconComponent className="h-4 w-4" />}
                      <span>{action.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
