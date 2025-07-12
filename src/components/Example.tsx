'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Interactive Counter</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>
    </div>
  )
}