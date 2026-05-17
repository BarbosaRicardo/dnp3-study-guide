import React, { useState } from 'react'
import { GIFS } from '../data/gifs'

export default function GifCard({ gifKey, caption, side = 'right', className = '', tooltip = null }) {
  const [error, setError] = useState(false)
  const id = GIFS[gifKey]

  if (!id || error) return null

  const url = `https://media1.giphy.com/media/${id}/giphy.gif`

  return (
    <div className={`flex ${side === 'left' ? 'justify-start' : 'justify-end'} my-4 ${className}`}>
      <div className="max-w-xs text-center">
        <div
          className="group"
          style={{
            width: 200,
            height: 150,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={url}
            alt={caption || gifKey}
            width="200"
            height="150"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            onError={() => setError(true)}
          />
          {tooltip && (
            <div
              className="absolute inset-0 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.85)', borderRadius: '0.75rem' }}
            >
              <p className="text-xs text-slate-200 text-center leading-relaxed">{tooltip}</p>
            </div>
          )}
        </div>
        {caption && (
          <p className="text-xs text-slate-500 mt-1 italic">{caption}</p>
        )}
      </div>
    </div>
  )
}
