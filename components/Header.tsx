"use client"

import { useSession, signOut } from "next-auth/react"
// next-auth v5: useSession and signOut are still from next-auth/react

export default function Header() {
  const { data: session } = useSession()
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Headliner Cards <span className="text-yellow-400">Home Base</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        {session?.user?.image && (
          <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
        )}
        <span className="text-xs text-gray-400">{session?.user?.email}</span>
        <button
          onClick={() => signOut()}
          className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded border border-white/10 hover:border-white/20"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
