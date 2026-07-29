'use client'

import { Volume2Icon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../ui/button'

export type ListenButtonProps = {
  text: string
  /** BCP-47 speech tag — `es-ES`. */
  lang: string
  className?: string
}

/** Speaks the word via speechSynthesis; the label swaps while playing. */
export function ListenButton({ text, lang, className }: ListenButtonProps) {
  const [playing, setPlaying] = useState(false)

  function speak() {
    if (playing || typeof speechSynthesis === 'undefined') return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.92
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    setPlaying(true)
    speechSynthesis.speak(utterance)
  }

  return (
    <Button variant="ghost" size="sm" className={className} onClick={speak}>
      <Volume2Icon /> {playing ? 'Playing…' : 'Listen'}
    </Button>
  )
}
