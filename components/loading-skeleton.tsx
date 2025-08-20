"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function NotesListSkeleton() {
  return (
    <div className="p-2 space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3 mb-2" />
          <div className="flex gap-1 mb-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function EditorSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="p-4 border-b">
        <Skeleton className="h-9 w-full mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <NotesListSkeleton />
    </div>
  )
}
