// @kotodama/ui — the web design system in ONE package: Tailwind v4 + shadcn/ui
// primitives (cva variants + `cn`), the semantic `@theme` token layer
// (`styles.css`), and the presentational components built on top. Web-only
// (DOM-bound); imports nothing internal (leaf). Storybook consumes it directly.
//
// Layout: `components/ui/*` = shadcn registry primitives (add more via
// `bunx shadcn@latest add <name>`); `components/<feature>/` = our compositions;
// shared helpers in `lib/`. See `.claude/agent-patterns/tailwind-shadcn.md`.

export {
  type AccentedWord,
  AccentedWordMark,
  accentedWordText,
} from './components/atoms/accented-word'
export { Chip, type ChipProps, chipVariants } from './components/atoms/chip'
export { ListenButton, type ListenButtonProps } from './components/atoms/listen-button'
export { Overline, type OverlineProps } from './components/atoms/overline'
export { PosPill } from './components/atoms/pos-pill'
export { RetryButton, type RetryButtonProps } from './components/atoms/retry-button'
export { RetryLink } from './components/atoms/retry-link'
export { Seal, type SealProps } from './components/atoms/seal'
export { SectionRule, type SectionRuleProps } from './components/atoms/section-rule'
export { Show, type ShowOn, type ShowProps } from './components/atoms/show'
export { SiteContainer, type SiteContainerProps } from './components/atoms/site-container'
export { Sparkline, type SparklineProps } from './components/atoms/sparkline'
export { Spinner } from './components/atoms/spinner'
export { RankRow, type RankRowProps } from './components/core/rank-row'
export {
  SaveWordButton,
  type SaveWordButtonProps,
} from './components/core/save-word-button'
export {
  StatusBadge,
  type StatusBadgeProps,
  StatusDot,
  type StatusDotProps,
  type WordStatus,
} from './components/core/status-badge'
export { StatusNote, type StatusNoteProps } from './components/core/status-note'
export {
  TierChip,
  type TierChipProps,
  TierDot,
  type TierDotProps,
  type WordTier,
} from './components/core/tier-chip'
export { LibraryHero, type LibraryHeroProps } from './components/features/library-hero'
export { ReadingRoom, type ReadingRoomProps } from './components/features/reading-room'
export {
  type CommandAction,
  type PaletteItem,
  SearchCommandPalette,
  type SearchCommandPaletteProps,
  WordCommandItem,
  type WordCommandItemProps,
} from './components/features/search-command-palette'
export { WordOfTheDay, type WordOfTheDayProps } from './components/features/word-of-the-day'
export { CommandFab, type CommandFabProps } from './components/molecules/command-fab'
export {
  CommandTrigger,
  type CommandTriggerProps,
} from './components/molecules/command-trigger'
export {
  LanguageMenu,
  type LanguageMenuProps,
  type LanguageOption,
} from './components/molecules/language-menu'
export { SearchBox, type SearchBoxProps } from './components/molecules/search-box'
export { ThemeMenu, type ThemeMenuProps, type ThemeMode } from './components/molecules/theme-menu'
export {
  CommandPalette,
  CommandPaletteGroup,
  type CommandPaletteGroupProps,
  CommandPaletteItem,
  type CommandPaletteItemProps,
  type CommandPaletteProps,
} from './components/organisms/command-palette'
export {
  type MobileTab,
  MobileTabBar,
  type MobileTabBarProps,
} from './components/organisms/mobile-tab-bar'
export {
  SiteHeader,
  type SiteHeaderProps,
  type SiteNavLink,
} from './components/organisms/site-header'
export { LibraryScreen, type LibraryScreenProps } from './components/pages/library'
export { SiteShell, type SiteShellProps } from './components/templates/site-shell'
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog'
export { Badge, type BadgeProps, badgeVariants } from './components/ui/badge'
export { Button, buttonVariants } from './components/ui/button'
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './components/ui/command'
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu'
export { Kbd, KbdGroup } from './components/ui/kbd'
export { Toaster } from './components/ui/sonner'
export { pad2 } from './lib/pad2'
export { cn } from './lib/utils'
export type {
  GlanceSpan,
  GlanceText,
  LibraryStat,
  LibraryView,
  RankedWordView,
  TryWordView,
  WotdGlanceView,
  WotdView,
} from './views/library.view'
export type { SearchPos, SearchWordView } from './views/search.view'
