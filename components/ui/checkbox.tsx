import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, resolvedRef])

    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={resolvedRef}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-xs transition-all focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            "checked:bg-primary checked:text-primary-foreground",
            "indeterminate:bg-primary/50 indeterminate:border-primary/50",
            className
          )}
          {...props}
        />
        <Check className="absolute left-0 top-0 h-4 w-4 text-primary-foreground opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100 pointer-events-none" />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox } 