import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-slate-100 text-slate-950 hover:bg-slate-200',
        gradient:
          'relative overflow-hidden bg-gradient-to-r from-primary via-blue-500 to-accent text-white shadow-[0_0_30px_rgba(96,165,250,0.35)] hover:shadow-[0_0_40px_rgba(147,51,234,0.45)] transform hover:-translate-y-0.5',
        outline:
          'border border-white/15 bg-white/5 text-white hover:bg-white/10',
        'outline-light':
          'border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5',
        whatsapp:
          'bg-[#25D366] text-[#042A1E] hover:bg-[#22c55e] shadow-[0_0_28px_rgba(37,211,102,0.35)]',
        ghost: 'text-white hover:bg-white/5',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-5',
        xl: 'h-14 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
