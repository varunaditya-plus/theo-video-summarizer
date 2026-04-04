import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 text-neutral-100">
      <p className="mb-4">This page does not exist.</p>
      <Link className="font-semibold text-blue-400 hover:underline" to="/">
        ← All videos
      </Link>
    </div>
  )
}