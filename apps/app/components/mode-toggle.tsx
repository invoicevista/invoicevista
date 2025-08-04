"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ModeToggle() {
  const [mode, setMode] = useState<'test' | 'live'>('test')

  useEffect(() => {
    // Load mode from localStorage
    const savedMode = localStorage.getItem('invoicevista-mode') as 'test' | 'live' | null
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'test' ? 'live' : 'test'
    setMode(newMode)
    localStorage.setItem('invoicevista-mode', newMode)
    // You could also update this in user metadata with Clerk
  }

  return (
    <div className="flex items-center rounded-lg border p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === 'test' && "bg-muted"
        )}
        onClick={() => mode !== 'test' && toggleMode()}
      >
        Test
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === 'live' && "bg-muted"
        )}
        onClick={() => mode !== 'live' && toggleMode()}
      >
        Live
      </Button>
    </div>
  )
}