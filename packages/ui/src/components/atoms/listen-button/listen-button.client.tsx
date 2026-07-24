'use client'

import { Button } from '@kotodama/ui'
import { Volume2Icon } from 'lucide-react'
import { useState } from 'react'

export type ListenButtonProps = {
  text: string
  /** BCP-47 speech tag — `es-ES`. */
  lang: string
}

/** Speaks the word via speechSynthesis; the label swaps while playing. */
export function ListenButton({ text, lang }: ListenButtonProps) {
  const [playing, setPlaying] = useState(false)

  const speak = () => {
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
    <Button variant="ghost" size="sm" onClick={speak}>
      <Volume2Icon /> {playing ? 'Playing…' : 'Listen'}
    </Button>
  )
}
