// @kotodama/ui — the web design system in ONE package: Tailwind v4 + shadcn/ui
// primitives (cva variants + `cn`), the semantic `@theme` token layer
// (`styles.css`), and the presentational components built on top. Web-only
// (DOM-bound); imports nothing internal (leaf). Storybook consumes it directly.
//
// Layout: `components/ui/*` = shadcn registry primitives (add more via
// `bunx shadcn@latest add <name>`); `components/<feature>/` = our compositions;
// shared helpers in `lib/`. See `.claude/agent-patterns/tailwind-shadcn.md`.

export { FilterChip, type FilterChipProps } from './components/atoms/filter-chip'
export {
  HighlightedText,
  type HighlightedTextProps,
} from './components/atoms/highlighted-text'
export { ImageSlot, type ImageSlotProps } from './components/atoms/image-slot'
export { PosPill } from './components/atoms/pos-pill'
export { Seal, type SealProps } from './components/atoms/seal'
export { SectionRule, type SectionRuleProps } from './components/atoms/section-rule'
export { Sparkline, type SparklineProps } from './components/atoms/sparkline'
export {
  StatusBadge,
  type StatusBadgeProps,
  StatusDot,
  type StatusDotProps,
  type WordStatus,
} from './components/atoms/status-badge'
export { TierChip, type TierChipProps, type WordTier } from './components/atoms/tier-chip'
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
export { RankRow, type RankRowProps } from './components/molecules/rank-row'
export { ResultRow, type ResultRowProps } from './components/molecules/result-row'
export { SearchBox, type SearchBoxProps } from './components/molecules/search-box'
export { StatusNote } from './components/molecules/status-note'
export { SearchPage, type SearchPageProps } from './components/pages/search'
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
export { Skeleton } from './components/ui/skeleton'
export { Toaster } from './components/ui/sonner'
export { Spinner } from './components/ui/spinner'
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from './components/ui/tabs'
export { Toggle, toggleVariants } from './components/ui/toggle'
export { WordCard, type WordCardProps } from './components/word-card'
export { cn } from './lib/utils'
export type { SearchPos, SearchWordView } from './views/search.view'
