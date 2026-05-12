import { useEffect, useMemo, useRef, useState } from 'react'
import type { Belt, Technique } from '../lib/types'

const INK = '#1A1A1A'
const CARD = '#FAF6EF'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const OXBLOOD = '#8B1A1A'
const DISPLAY = 'var(--font-display)'
const SERIF = 'var(--font-serif)'

const BELT_COLORS: Record<Belt, string> = {
  WHITE: '#F5F1E6',
  BLUE: '#1F4FA8',
  PURPLE: '#5B2B82',
  BROWN: '#5A3A1B',
  BLACK: '#0A0A0A',
}

export interface SelectedTechnique {
  raw: string
  technique: Technique | null // null = custom free-text
}

interface Props {
  catalog: Technique[]
  value: SelectedTechnique[]
  onChange: (next: SelectedTechnique[]) => void
  maxTags?: number
  label?: string
  helper?: string
  placeholder?: string
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function TechniqueTagInput({
  catalog,
  value,
  onChange,
  maxTags = 30,
  label = 'TECHNIQUES WORKED',
  helper = 'Pick from suggestions, or press Enter to log a custom name.',
  placeholder = 'Start typing — Triangle, Kimura, Knee Slice…',
}: Props) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [hoverIdx, setHoverIdx] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Build a flat normalized search index from name + aliases.
  const searchIndex = useMemo(() => {
    return catalog.map(t => ({
      tech: t,
      keys: [normalize(t.name), ...(t.aliases || []).map(normalize)],
    }))
  }, [catalog])

  const query = normalize(input)
  const usedIds = useMemo(
    () => new Set(value.map(v => v.technique?.id).filter(Boolean) as number[]),
    [value]
  )

  const suggestions = useMemo(() => {
    if (!query) return [] as Technique[]
    const starts: Technique[] = []
    const contains: Technique[] = []
    for (const { tech, keys } of searchIndex) {
      if (usedIds.has(tech.id)) continue
      let bestRank = -1
      for (const k of keys) {
        if (k.startsWith(query)) {
          bestRank = Math.max(bestRank, 2)
        } else if (k.includes(query)) {
          bestRank = Math.max(bestRank, 1)
        }
      }
      if (bestRank === 2) starts.push(tech)
      else if (bestRank === 1) contains.push(tech)
    }
    return [...starts, ...contains].slice(0, 8)
  }, [query, searchIndex, usedIds])

  useEffect(() => {
    setHoverIdx(0)
  }, [suggestions.length, query])

  // Click-outside to close suggestions.
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const addCustom = () => {
    const trimmed = input.trim()
    if (!trimmed || value.length >= maxTags) {
      setInput('')
      return
    }
    if (value.some(v => normalize(v.raw) === normalize(trimmed))) {
      setInput('')
      return
    }
    onChange([...value, { raw: trimmed, technique: null }])
    setInput('')
  }

  const addRecognized = (t: Technique) => {
    if (value.length >= maxTags) return
    if (usedIds.has(t.id)) return
    onChange([...value, { raw: t.name, technique: t }])
    setInput('')
  }

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault()
      setHoverIdx(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault()
      setHoverIdx(i => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0 && hoverIdx < suggestions.length) {
        addRecognized(suggestions[hoverIdx])
      } else if (input.trim()) {
        addCustom()
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeAt(value.length - 1)
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
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
        borderBottom: `2px solid ${focused ? OXBLOOD : INK}`,
        padding: '4px 0 8px',
        minHeight: '2.5rem',
        transition: 'border-color 0.2s ease',
      }}>
        {value.map((tag, i) => {
          const recognized = tag.technique !== null
          return (
            <span
              key={`${tag.raw}-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: recognized ? CARD : 'transparent',
                border: `1px solid ${recognized ? BORDER : MUTED}`,
                padding: '2px 8px',
                fontFamily: SERIF,
                fontStyle: recognized ? 'normal' : 'italic',
                fontSize: '0.82rem',
                color: recognized ? INK : MUTED,
              }}
            >
              {recognized && tag.technique && (
                <span
                  aria-hidden
                  style={{
                    width: '8px', height: '8px', display: 'inline-block',
                    background: BELT_COLORS[tag.technique.belt_required],
                    border: tag.technique.belt_required === 'WHITE' ? `1px solid ${INK}` : 'none',
                  }}
                />
              )}
              {!recognized && (
                <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', color: MUTED, letterSpacing: '0.1em' }}>?</span>
              )}
              {tag.raw}
              <button
                type="button"
                onClick={() => removeAt(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: MUTED, fontSize: '0.85rem', padding: '0 0 0 2px',
                  lineHeight: 1, display: 'flex', alignItems: 'center',
                }}
              >
                ×
              </button>
            </span>
          )
        })}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // Don't blur immediately — let click on a suggestion register first.
            setTimeout(() => {
              if (input.trim() && suggestions.length === 0) addCustom()
            }, 100)
          }}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            flex: 1, minWidth: '160px',
            fontFamily: SERIF, fontSize: '0.95rem',
            background: 'transparent', border: 'none', outline: 'none',
            color: INK, padding: '2px 0',
          }}
          className="placeholder:text-[#737373]/50"
        />
      </div>

      {/* Suggestions dropdown */}
      {focused && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 6px 18px rgba(26,26,26,0.08)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 50,
          }}
        >
          {suggestions.map((t, i) => {
            const isHover = i === hoverIdx
            return (
              <div
                key={t.id}
                onMouseDown={e => { e.preventDefault(); addRecognized(t) }}
                onMouseEnter={() => setHoverIdx(i)}
                style={{
                  padding: '0.5rem 0.75rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  cursor: 'pointer',
                  background: isHover ? '#E3DDD1' : 'transparent',
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: '10px', height: '10px',
                    background: BELT_COLORS[t.belt_required],
                    border: t.belt_required === 'WHITE' ? `1px solid ${INK}` : 'none',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: SERIF, fontSize: '0.92rem', color: INK, flex: 1 }}>
                  {t.name}
                </span>
                <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.18em', color: MUTED }}>
                  {t.belt_required} · {t.category}
                </span>
                {t.user_status === 'MASTERED' && (
                  <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.15em', color: OXBLOOD }}>
                    ★
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {helper && (
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.72rem', color: MUTED, marginTop: '0.3rem' }}>
          {helper}
        </p>
      )}
    </div>
  )
}
