import React, { useState } from 'react'
import { GIFS } from '../data/gifs'

export default function GifCard({ gifKey, caption, side = 'right', className = '' }) {
  const [error, setError] = useState(false)
  const id = GIFS[gifKey]

  if (!id || error) return null

  return (
    <div className={`flex ${side === 'left' ? 'justify-start' : 'justify-end'} my-4 ${className}`}>
      <div className="max-w-xs text-center">
        <div
          style={{ width: 200, height: 150, position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}
          className="shadow-md"
        >
          <iframe
            src={`https://giphy.com/embed/${id}`}
            width="200"
            height="150"
            style={{ position: 'absolute', top: 0, left: 0, border: 'none' }}
            frameBorder="0"
            allowFullScreen
            title={caption || gifKey}
            onError={() => setError(true)}
          />
        </div>
        {caption && (
          <p className="text-xs text-slate-500 mt-1 italic">{caption}</p>
        )}
      </div>
    </div>
  )
}
