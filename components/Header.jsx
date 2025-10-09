"use client"
import { MoreHorizontal, Menu, ChevronDown, User, LogOut, LogIn } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import GhostIconButton from "./GhostIconButton"
import { createClient } from "@/lib/supabase/client"

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen, user, isLoadingUser }) {
  const [selectedBot, setSelectedBot] = useState("Gemini")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()

  const chatbots = [{ name: "Gemini", icon: "🤖" }]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3 dark:border-zinc-800 dark:bg-zinc-900/70">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 transition-colors touch-manipulation"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden sm:flex relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 transition-colors touch-manipulation"
        >
          {typeof chatbots.find((bot) => bot.name === selectedBot)?.icon === "string" ? (
            <span className="text-sm">{chatbots.find((bot) => bot.name === selectedBot)?.icon}</span>
          ) : (
            chatbots.find((bot) => bot.name === selectedBot)?.icon
          )}
          <span className="hidden sm:inline">{selectedBot}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
              {chatbots.map((bot) => (
                <button
                  key={bot.name}
                  onClick={() => {
                    setSelectedBot(bot.name)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-3 text-sm text-left hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg transition-colors touch-manipulation"
                >
                  {typeof bot.icon === "string" ? <span className="text-sm">{bot.icon}</span> : bot.icon}
                  {bot.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {!isLoadingUser && (
          <div className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-2 sm:px-3 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 transition-colors touch-manipulation"
                  aria-label="User menu"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute top-full right-0 mt-1 w-56 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
                      <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">로그인됨</p>
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-3 text-sm text-left hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 rounded-b-lg text-red-600 dark:text-red-400 transition-colors touch-manipulation"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-2 sm:px-3 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 transition-colors touch-manipulation"
                aria-label="Login"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </button>
            )}
          </div>
        )}

        <GhostIconButton label="More">
          <MoreHorizontal className="h-4 w-4" />
        </GhostIconButton>
      </div>
    </div>
  )
}
