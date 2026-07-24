'use client'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': '999px',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'rounded-full! border shadow-pop! font-sans text-[13.5px]!',
          title: 'text-[13.5px] font-medium',
          description: 'text-muted-foreground',
          actionButton:
            'rounded-full! bg-secondary! text-seal! px-3! py-1.5! h-auto! text-[12.5px]! font-bold! tracking-[0.02em] hover:bg-accent!',
          cancelButton:
            'rounded-full! bg-secondary! text-muted-foreground! px-3! py-1.5! h-auto! text-[12.5px]! font-bold!',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
