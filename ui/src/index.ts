// @kotodama/ui — the web design system in ONE package: Tailwind v4 + shadcn/ui
// primitives (cva variants + `cn`), the semantic `@theme` token layer
// (`styles.css`), and the presentational components built on top. Web-only
// (DOM-bound); imports nothing internal (leaf). Storybook consumes it directly.
//
// Layout: `components/ui/*` = shadcn registry primitives (add more via
// `bunx shadcn@latest add <name>`); `components/<feature>/` = our compositions;
// shared helpers in `lib/`. See `ui/CLAUDE.md`.

export {
  type AccentedWord,
  AccentedWordMark,
  accentedWordText,
} from './components/atoms/accented-word'
export { AppMainWrapper, type AppMainWrapperProps } from './components/atoms/app-main-wrapper'
export { AppWrapper, type AppWrapperProps } from './components/atoms/app-wrapper'
export { Chip, type ChipProps, chipVariants } from './components/atoms/chip'
export { List, ListItem, type ListItemProps, type ListProps } from './components/atoms/list'
export { ListenButton, type ListenButtonProps } from './components/atoms/listen-button'
export { Overline, type OverlineProps } from './components/atoms/overline'
export { PosPill } from './components/atoms/pos-pill'
export { RetryButton, type RetryButtonProps } from './components/atoms/retry-button'
export { RetryLink } from './components/atoms/retry-link'
export { Seal, type SealProps } from './components/atoms/seal'
export { SectionRule, type SectionRuleProps } from './components/atoms/section-rule'
export { Show, type ShowOn, type ShowProps } from './components/atoms/show'
export { Sparkline, type SparklineProps } from './components/atoms/sparkline'
export { Spinner } from './components/atoms/spinner'
export { Timestamp } from './components/atoms/timestamp'
export { WordRankList, type WordRankListProps } from './components/core/word-rank-list'
export {
  type RetryHandler,
  WordRecentList,
  type WordRecentListProps,
} from './components/core/word-recent-list'
export { WordRow, type WordRowProps, type WordRowTone } from './components/core/word-row'
export {
  WordSaveButton,
  type WordSaveButtonProps,
} from './components/core/word-save-button'
export {
  type WordStatus,
  WordStatusBadge,
  type WordStatusBadgeProps,
  WordStatusDot,
  type WordStatusDotProps,
} from './components/core/word-status'
export { WordStatusNote, type WordStatusNoteProps } from './components/core/word-status-note'
export { type WordTier, WordTierDot, type WordTierDotProps } from './components/core/word-tier'
export {
  AppHeader,
  type AppHeaderProps,
  type AppNavLink,
} from './components/features/app-header'
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
export { LanguageMenu, type LanguageMenuProps } from './components/molecules/language-menu'
export { SearchBox, type SearchBoxProps } from './components/molecules/search-box'
export { ThemeMenu, type ThemeMenuProps, type ThemeMode } from './components/molecules/theme-menu'
export { AppControls, type AppControlsProps } from './components/organisms/app-controls'
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
export { LibraryScreen, type LibraryScreenProps } from './components/pages/library'
export { AppTemplate, type AppTemplateProps } from './components/templates/app-template'
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
export { useDebouncedCallback } from './lib/use-debounced-callback'
export { cn } from './lib/utils'
export type { Language } from './views/language.view'
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
export type { SearchWordView } from './views/search.view'
