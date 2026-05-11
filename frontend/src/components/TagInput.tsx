import { useState } from 'react'

const INK = '#1A1A1A'
const CARD = '#FAF6EF'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const DISPLAY = 'var(--font-display)'
const SERIF = 'var(--font-serif)'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
  helper?: string
  maxTags?: number
}

export default function TagInput({
  value,
  onChange,
  placeholder,
  label,
  helper,
  maxTags = 30,
}: TagInputProps) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeTag = (idx: number) => onChange(value.filter((_, i) => i !== idx))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div>
      {label && (
        <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.4rem' }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        alignItems: 'center',
        borderBottom: `2px solid ${focused ? '#8B1A1A' : INK}`,
        padding: '4px 0 8px',
        minHeight: '2.5rem',
        transition: 'border-color 0.2s ease',
      }}>
        {value.map((tag, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: CARD,
              border: `1px solid ${BORDER}`,
              padding: '2px 8px',
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: INK,
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: MUTED,
                fontSize: '0.8rem',
                padding: '0 0 0 2px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) addTag() }}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            flex: 1,
            minWidth: '120px',
            fontFamily: SERIF,
            fontSize: '0.95rem',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: INK,
            padding: '2px 0',
          }}
          className="placeholder:text-[#737373]/50"
        />
      </div>
      {helper && (
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.72rem', color: MUTED, marginTop: '0.3rem' }}>
          {helper}
        </p>
      )}
    </div>
  )
}
