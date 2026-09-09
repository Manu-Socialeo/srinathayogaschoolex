'use client'

import { Bell, Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface AppHeaderProps {
  userName?: string
  avatarUrl?: string
  onSearchClick?: () => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
}

export function AppHeader({
  userName = 'Student',
  avatarUrl,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
}: AppHeaderProps) {
  const [hasNotifications] = useState(true)

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 safe-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-primary flex items-center justify-center shadow-sm">
            <svg
              viewBox="0 0 40 40"
              className="w-5 h-5 text-white"
              fill="currentColor"
            >
              <path d="M20 5C20 5 25 12 25 18C25 22 23 25 20 28C17 25 15 22 15 18C15 12 20 5 20 5Z" />
              <circle cx="20" cy="32" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground leading-tight">Namaste,</span>
            <span className="text-sm font-semibold text-foreground leading-tight">{userName.split(' ')[0]}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center touch-target transition-transform active:scale-95"
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px] text-foreground" />
          </button>
          <button
            onClick={onNotificationClick}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center relative touch-target transition-transform active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-foreground" />
            {hasNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
            )}
          </button>
          <button
            onClick={onProfileClick}
            className="touch-target transition-transform active:scale-95"
            aria-label="Profile"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-border/50"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
