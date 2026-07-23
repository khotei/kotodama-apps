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
export { FilterChip, type FilterChipProps } from './components/atoms/filter-chip'
export {
  HighlightedText,
  type HighlightedTextProps,
} from './components/atoms/highlighted-text'
export { ImageSlot, type ImageSlotProps } from './components/atoms/image-slot'
export { ListenButton, type ListenButtonProps } from './components/atoms/listen-button'
export { Overline, type OverlineProps } from './components/atoms/overline'
export { PosPill } from './components/atoms/pos-pill'
export { RetryButton, type RetryButtonProps } from './components/atoms/retry-button'
export { RetryLink } from './components/atoms/retry-link'
export { Seal, type SealProps } from './components/atoms/seal'
export { SectionRule, type SectionRuleProps } from './components/atoms/section-rule'
export { Skeleton } from './components/atoms/skeleton'
export { Sparkline, type SparklineProps } from './components/atoms/sparkline'
export { Spinner } from './components/atoms/spinner'
export {
  StatusBadge,
  type StatusBadgeProps,
  StatusDot,
  type StatusDotProps,
  type WordStatus,
} from './components/atoms/status-badge'
export {
  TierChip,
  type TierChipProps,
  TierDot,
  type TierDotProps,
  type WordTier,
} from './components/atoms/tier-chip'
export {
  CommandTrigger,
  type CommandTriggerProps,
} from './components/molecules/command-trigger'
export {
  DepthTabs,
  DepthTabsContent,
  DepthTabsList,
  DepthTabsTrigger,
  type DepthTabsTriggerProps,
} from './components/molecules/depth-tabs'
export { EmptyState, type EmptyStateProps } from './components/molecules/empty-state'
export {
  type EtymologyStep,
  EtymologyTimeline,
  type EtymologyTimelineProps,
} from './components/molecules/etymology-timeline'
export {
  type GenerationStep,
  type GenerationStepState,
  GenerationSteps,
  type GenerationStepsProps,
} from './components/molecules/generation-steps'
export {
  LanguageMenu,
  type LanguageMenuProps,
  type LanguageOption,
} from './components/molecules/language-menu'
export { type ColorMode, ModeMenu, type ModeMenuProps } from './components/molecules/mode-menu'
export { RankRow, type RankRowProps } from './components/molecules/rank-row'
export { ResultRow, type ResultRowProps } from './components/molecules/result-row'
export {
  SaveWordButton,
  type SaveWordButtonProps,
} from './components/molecules/save-word-button'
export { SearchBox, type SearchBoxProps } from './components/molecules/search-box'
export { StatusNote, type StatusNoteProps } from './components/molecules/status-note'
export { WordCard, type WordCardProps } from './components/molecules/word-card'
export { CommandPalette, type CommandPaletteProps } from './components/organisms/command-palette'
export { LibraryHero, type LibraryHeroProps } from './components/organisms/library-hero'
export {
  type MobileTab,
  MobileTabBar,
  type MobileTabBarProps,
} from './components/organisms/mobile-tab-bar'
export { ReadingRoom, type ReadingRoomProps } from './components/organisms/reading-room'
export {
  SiteHeader,
  type SiteHeaderProps,
  type SiteHeaderVariant,
  type SiteNavLink,
} from './components/organisms/site-header'
export {
  WordFailedView,
  type WordFailedViewProps,
  WordGeneratingView,
  type WordGeneratingViewProps,
  WordNotFoundView,
  type WordNotFoundViewProps,
} from './components/organisms/word-build'
export { WordEntryView, type WordEntryViewProps } from './components/organisms/word-entry'
export { WordLoadingView, type WordLoadingViewProps } from './components/organisms/word-loading'
export { WordOfTheDay, type WordOfTheDayProps } from './components/organisms/word-of-the-day'
export { SearchPage, type SearchPageProps } from './components/pages/search'
export { WordScreen, type WordScreenProps } from './components/pages/word'
export { LibraryScreen, type LibraryScreenProps } from './components/templates/library-screen'
export { SiteShell, type SiteShellProps } from './components/templates/site-shell'
export { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
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
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/ui/breadcrumb'
export { Button, buttonVariants } from './components/ui/button'
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card'
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
export { Input } from './components/ui/input'
export { Kbd, KbdGroup } from './components/ui/kbd'
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './components/ui/pagination'
export { Separator } from './components/ui/separator'
export { Toaster } from './components/ui/sonner'
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from './components/ui/tabs'
export { Toggle, toggleVariants } from './components/ui/toggle'
export { languageName } from './lib/language-name'
export { pad2 } from './lib/pad2'
export { speechLang } from './lib/speech-lang'
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
export type {
  WordBuildStages,
  WordEntryContent,
  WordScreenView,
} from './views/word.view'
