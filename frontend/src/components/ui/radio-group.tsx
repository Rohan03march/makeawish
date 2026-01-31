"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

const RadioGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        onValueChange?: (value: string) => void
        defaultValue?: string
        value?: string
    }
>(({ className, onValueChange, defaultValue, value: controlledValue, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue || "")
    const isControlled = controlledValue !== undefined
    const finalValue = isControlled ? controlledValue : value

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setValue(newValue)
        }
        onValueChange?.(newValue)
    }

    return (
        <div
            ref={ref}
            className={cn("grid gap-2", className)}
            {...props}
        >
            {React.Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        groupValue: finalValue,
                        onGroupChange: handleValueChange,
                    })
                }
                return child
            })}
        </div>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        value: string
        groupValue?: string
        onGroupChange?: (value: string) => void
    }
>(({ className, value, groupValue, onGroupChange, ...props }, ref) => {
    const isChecked = value === groupValue

    return (
        <button
            ref={ref}
            type="button"
            role="radio"
            aria-checked={isChecked}
            data-state={isChecked ? "checked" : "unchecked"}
            onClick={() => onGroupChange?.(value)}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-gold-500 text-gold-500 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
                className
            )}
            {...props}
        >
            {isChecked && (
                <divWrapper>
                    <Circle className="h-2.5 w-2.5 fill-current text-current" />
                </divWrapper>
            )}
        </button>
    )
})

// Wrapper to avoid Lucide warning about string refs if any (though Circle is functional) based on recent Next.js/React versions quirks, 
// usually not strictly needed but good for safety. simpler is just direct render.
const divWrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>

RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
