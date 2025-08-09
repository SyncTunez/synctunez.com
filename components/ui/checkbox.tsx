import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, style, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, resolvedRef])

    const baseStyle: React.CSSProperties = {
      accentColor: "var(--primary)",
      color: "var(--primary-foreground)",
      ...(style || {}),
    }

    const indeterminateStyle: React.CSSProperties = indeterminate
      ? {
          // Custom appearance so the hyphen is always visible (white) over theme teal
          WebkitAppearance: 'none',
          appearance: 'none' as any,
          backgroundColor: 'var(--primary)',
          backgroundImage: 'linear-gradient(var(--primary-foreground), var(--primary-foreground))',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '12px 2px',
          borderRadius: '0.25rem',
        }
      : {}

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        className={cn(
          // Use a regular, native checkbox with minimal sizing only
          "h-4 w-4 shrink-0 align-middle disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        // The base style sets theme colors; indeterminate adds a white hyphen overlay
        style={{ ...baseStyle, ...indeterminateStyle }}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox } 