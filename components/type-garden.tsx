'use client'

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Download, Eraser, Film, RefreshCw, SlidersHorizontal } from 'lucide-react'
import {
  DENSITY_OPTIONS,
  GARDEN_FONTS,
  STYLE_OPTIONS,
  THEMES,
  generateGrowth,
  resolveStyle,
  type Density,
  type FlowerStyle,
  type StyleChoice,
  type Theme,
} from '@/lib/garden'
import { LetterGrowth } from '@/components/letter-growth'
import { Butterflies } from '@/components/butterflies'
import { ChipGroup, ChipToggle } from '@/components/garden-toolbar'
import { Credit } from '@/components/credit'

type Letter = { id: number; char: string; seed: number }

const MAX_LENGTH = 40
const DEMO_WORD = 'sonder'

let nextId = 1
const makeLetter = (char: string, seed = Math.floor(Math.random() * 2 ** 31)): Letter => ({
  id: nextId++,
  char,
  seed,
})

const initialLetters = (): Letter[] =>
  DEMO_WORD.split('').map((char, i) => ({ id: -(i + 1), char, seed: 7919 * (i + 3) }))

function GardenLetter({
  letter,
  theme,
  style,
  density,
  petals,
}: {
  letter: Letter
  theme: Theme
  style: FlowerStyle | 'mix'
  density: Density
  petals: boolean
}) {
  const growth = useMemo(() => generateGrowth(letter.seed, style, density), [letter.seed, style, density])
  return (
    <span className="tg-letter">
      <LetterGrowth growth={growth} theme={theme} layer="back" petals={petals} />
      <span className="tg-glyph">{letter.char}</span>
      <LetterGrowth growth={growth} theme={theme} layer="front" petals={petals} />
    </span>
  )
}

export function TypeGarden({
  themeIndex,
  onThemeChange: setThemeIndex,
  modeSwitch,
}: {
  themeIndex: number
  onThemeChange: (index: number) => void
  modeSwitch?: ReactNode
}) {
  const [letters, setLetters] = useState<Letter[]>(initialLetters)
  const [pristine, setPristine] = useState(true)
  const [focused, setFocused] = useState(false)
  const [styleChoice, setStyleChoice] = useState<StyleChoice>('theme')
  const [fontId, setFontId] = useState(GARDEN_FONTS[0].id)
  const [density, setDensity] = useState<Density>('lush')
  const [butterflies, setButterflies] = useState(true)
  const [petals, setPetals] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const theme = THEMES[themeIndex]
  const font = GARDEN_FONTS.find((g) => g.id === fontId) ?? GARDEN_FONTS[0]
  const flowerStyle = resolveStyle(styleChoice, theme)
  const value = letters.map((l) => l.char).join('')
  const refocus = () => inputRef.current?.focus()

  const handleChange = (next: string) => {
    const clean = next.replace(/[\r\n\t]/g, '').slice(0, MAX_LENGTH)

    if (pristine && clean.length > value.length && clean.startsWith(value)) {
      setPristine(false)
      setLetters(clean.slice(value.length).split('').map((c) => makeLetter(c)))
      return
    }
    setPristine(false)

    let prefix = 0
    while (prefix < clean.length && prefix < value.length && clean[prefix] === value[prefix]) prefix++
    setLetters([...letters.slice(0, prefix), ...clean.slice(prefix).split('').map((c) => makeLetter(c))])
  }

  const regrow = () => {
    setLetters((prev) => prev.map((l) => makeLetter(l.char)))
    refocus()
  }

  const clear = () => {
    setPristine(false)
    setLetters([])
    refocus()
  }

  const saveVideo = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (!ctx || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') return
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
    const recorder = new MediaRecorder(canvas.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8_000_000 })
    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data)
    recorder.onstop = () => {
      const link = document.createElement('a')
      link.download = `type-garden-${value.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'garden'}.webm`
      link.href = URL.createObjectURL(new Blob(chunks, { type: mime }))
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    }
    recorder.start()
    const start = performance.now()
    const draw = (now: number) => {
      const progress = Math.min(1, (now - start) / 2200)
      ctx.fillStyle = theme.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = theme.ink
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${font.italic ? 'italic ' : ''}${font.weight} 130px ${font.family}`
      ctx.globalAlpha = Math.min(1, progress * 2)
      ctx.fillText(value || 'type garden', canvas.width / 2, canvas.height / 2)
      ctx.globalAlpha = 1
      if (progress < 1) requestAnimationFrame(draw)
      else recorder.stop()
    }
    requestAnimationFrame(draw)
  }

  const savePoster = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 3840
    canvas.height = 2160
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = theme.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.08
    ctx.strokeStyle = theme.ink
    ctx.lineWidth = 3
    for (let x = 0; x < canvas.width; x += 72) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 72) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = theme.ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const posterSize = Math.min(520, Math.max(180, 2100 / Math.max(longestWord, 5)))
    ctx.font = `${font.italic ? 'italic ' : ''}${font.weight} ${posterSize}px ${font.family}`
    const lines = value.split(' ')
    const lineHeight = posterSize * 1.25
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2
    lines.forEach((line, index) => ctx.fillText(line || ' ', canvas.width / 2, startY + index * lineHeight))
    ctx.font = '600 30px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.globalAlpha = 0.55
    ctx.fillText('TYPE GARDEN / 4K POSTER', 120, 130)
    ctx.textAlign = 'right'
    ctx.fillText('YASH RAJ', canvas.width - 120, canvas.height - 110)
    ctx.globalAlpha = 1

    const link = document.createElement('a')
    link.download = `type-garden-${value.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'poster'}-4k.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const words = useMemo(() => {
    const groups: Letter[][] = [[]]
    for (const letter of letters) {
      if (letter.char === ' ') groups.push([])
      else groups[groups.length - 1].push(letter)
    }
    return groups
  }, [letters])

  const longestWord = Math.max(5, ...words.map((w) => w.length))
  const vh = Math.max(10, 28 - letters.length * 0.45)
  const fontSize = `calc(${font.scale} * clamp(3rem, min(${(140 / longestWord).toFixed(2)}vw, ${vh.toFixed(1)}vh), 14rem))`

  return (
    <div
      className="tg-root relative flex min-h-dvh flex-col overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: theme.bg, color: theme.ink, '--tg-ink': theme.ink } as CSSProperties}
    >
      {butterflies && <Butterflies theme={theme} />}

      <header className="relative z-50 flex flex-wrap items-center justify-between gap-3 px-4 py-3 isolate sm:gap-4 sm:px-5 sm:py-4 md:px-8 md:py-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="font-serif text-xl tracking-tight sm:text-2xl md:text-3xl">type garden</h1>
          {modeSwitch}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="radiogroup" aria-label="Garden theme" className="flex flex-wrap items-center gap-2">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={i === themeIndex}
                aria-label={`${t.name} theme`}
                title={t.name}
                onClick={() => {
                  setThemeIndex(i)
                  refocus()
                }}
                className="relative z-50 size-7 shrink-0 overflow-hidden rounded-full border-2 bg-white transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 sm:size-8"
                style={{
                  backgroundColor: theme.bg,
                  background: `linear-gradient(135deg, ${t.flower} 50%, ${t.vine} 50%)`,
                  borderColor: i === themeIndex ? theme.ink : 'transparent',
                  outlineColor: theme.ink,
                }}
              />
            ))}
          </div>
          <span className="mx-1 h-5 w-px opacity-30" style={{ backgroundColor: theme.ink }} aria-hidden="true" />
          <button
            type="button"
            onClick={saveVideo}
            aria-label="Save type garden video"
            title="Save type garden video"
            className="rounded-full p-2 transition-opacity hover:opacity-60"
          >
            <Film className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={savePoster}
            aria-label="Save 4K poster"
            title="Save 4K poster"
            className="rounded-full p-2 transition-opacity hover:opacity-60"
          >
            <Download className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="garden-panel"
            aria-label="Toggle style options"
            className="rounded-full p-2 transition-opacity hover:opacity-60"
          >
            <SlidersHorizontal className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={regrow} aria-label="Regrow garden" className="rounded-full p-2 transition-opacity hover:opacity-60">
            <RefreshCw className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={clear} aria-label="Clear text" className="rounded-full p-2 transition-opacity hover:opacity-60">
            <Eraser className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="relative flex min-h-[42vh] flex-1 items-center justify-center overflow-hidden px-3 py-8 sm:px-4 sm:py-10">
        <label htmlFor="garden-input" className="sr-only">
          Type a word to grow a garden
        </label>
        <input
          id="garden-input"
          ref={inputRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={MAX_LENGTH}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="absolute inset-0 z-10 h-full w-full cursor-text bg-transparent text-base text-transparent caret-transparent opacity-0 outline-none"
        />

        <div
          aria-hidden="true"
          className="tg-text pointer-events-none flex max-w-full flex-wrap items-center justify-center"
          style={{
            fontSize,
            fontFamily: font.family,
            fontWeight: font.weight,
            fontStyle: font.italic ? 'italic' : 'normal',
          }}
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-flex whitespace-nowrap">
              {word.map((letter) => (
                <GardenLetter
                  key={`${letter.id}-${flowerStyle}-${density}`}
                  letter={letter}
                  theme={theme}
                  style={flowerStyle}
                  density={density}
                  petals={petals}
                />
              ))}
              {wi < words.length - 1 && <span className="tg-space" />}
              {wi === words.length - 1 && <span className={`tg-caret ${focused ? 'is-active' : ''}`} />}
            </span>
          ))}
        </div>

        {letters.length === 0 && (
          <p className="pointer-events-none absolute font-serif text-4xl italic opacity-40 md:text-6xl">start typing…</p>
        )}
      </main>

      <footer className="relative z-20 flex flex-col items-center gap-4 px-5 pb-5 md:pb-6">
        {panelOpen && (
          <div
            id="garden-panel"
            className="tg-panel flex max-h-[34vh] max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-3 overflow-y-auto rounded-3xl border px-4 py-3 sm:gap-x-6 sm:px-5"
            style={{ '--tg-bg': theme.bg } as CSSProperties}
          >
            <ChipGroup
              label="Flowers"
              value={styleChoice}
              options={STYLE_OPTIONS}
              onChange={(v) => {
                setStyleChoice(v)
                refocus()
              }}
            />
            <ChipGroup
              label="Font"
              value={fontId}
              options={GARDEN_FONTS.map((g) => ({ value: g.id, label: g.label }))}
              onChange={(v) => {
                setFontId(v)
                refocus()
              }}
              renderLabel={(o) => {
                const g = GARDEN_FONTS.find((x) => x.id === o.value)
                return (
                  <span style={{ fontFamily: g?.family, fontWeight: g?.weight, fontStyle: g?.italic ? 'italic' : 'normal' }}>
                    {o.label}
                  </span>
                )
              }}
            />
            <ChipGroup
              label="Growth"
              value={density}
              options={DENSITY_OPTIONS}
              onChange={(v) => {
                setDensity(v)
                refocus()
              }}
            />
            <div className="flex gap-1.5">
              <ChipToggle label="Butterflies" checked={butterflies} onChange={setButterflies} />
              <ChipToggle label="Falling petals" checked={petals} onChange={setPetals} />
            </div>
          </div>
        )}
        <p className="flex items-center gap-2 text-center text-sm opacity-60">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
          {pristine ? 'Type anything — watch it bloom.' : 'Backspace to prune. Regrow for a new garden.'}
          <span className="hidden text-[10px] uppercase tracking-[0.16em] opacity-60 sm:inline">editable canvas</span>
        </p>
        <Credit className="opacity-80" />
      </footer>
    </div>
  )
}
