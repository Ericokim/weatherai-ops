import { ChevronLeft, ChevronRight } from 'lucide-react'
import type * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-0', className)}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row',
        month: 'space-y-4',
        month_caption: 'flex h-9 items-center justify-center px-8',
        caption_label: 'sr-only',
        dropdowns: 'flex items-center justify-center gap-2',
        dropdown_root: 'relative',
        dropdown:
          'cursor-pointer rounded-md border border-border bg-background px-2 py-1 font-medium text-(--sea-ink) text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--lagoon)',
        nav: 'absolute inset-x-3 top-3 flex items-center justify-between',
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 text-muted-foreground hover:text-foreground'
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 text-muted-foreground hover:text-foreground'
        ),
        weekdays: 'grid grid-cols-7',
        weekday: 'py-2 text-center font-medium text-muted-foreground text-xs',
        week: 'grid grid-cols-7',
        day: 'relative p-0 text-center text-sm',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-9 rounded-lg p-0 font-medium text-(--sea-ink) aria-selected:opacity-100'
        ),
        selected: '[&>button]:font-semibold',
        range_start:
          'rounded-l-lg [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_end:
          'rounded-r-lg [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_middle:
          'rounded-none bg-(--lagoon)/20 [&>button]:bg-transparent [&>button]:text-(--sea-ink) [&>button]:hover:bg-(--lagoon)/30',
        today:
          '[&>button]:font-bold [&>button]:text-(--lagoon-deep) [&>button]:ring-1 [&>button]:ring-(--lagoon-deep)/40',
        outside: '[&>button]:text-(--sea-ink-soft)/70',
        disabled: '[&>button]:text-(--sea-ink-soft)/55 [&>button]:hover:bg-transparent',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
