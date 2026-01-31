import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-chocolate-600 text-white hover:bg-chocolate-700",
                destructive: "bg-red-500 text-white hover:bg-red-600",
                outline: "border border-chocolate-600 bg-transparent text-chocolate-600 hover:bg-chocolate-50",
                secondary: "bg-gold-500 text-chocolate-950 hover:bg-gold-600",
                ghost: "hover:bg-chocolate-50 hover:text-chocolate-900",
                link: "text-chocolate-900 underline-offset-4 hover:underline",
                premium: "bg-gradient-to-r from-gold-400 to-gold-600 text-chocolate-950 hover:from-gold-500 hover:to-gold-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
