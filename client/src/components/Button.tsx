import { buttonVariants, Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type VariantProps } from 'class-variance-authority'
import { LuLoaderCircle } from 'react-icons/lu'

export type ButtonProps = Omit<React.ComponentProps<'button'>, 'variant'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }
const Button = ({ children, isLoading = false, ...props }: ButtonProps) => {
  return (
    <ShadcnButton
      type="button"
      disabled={isLoading}
      {...(props as any)}
      className={cn('rounded-3xl relative cursor-pointer', props.className)}
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LuLoaderCircle className="animate-spin" />
        </div>
      )}
      {isLoading ? (
        <div className="invisible inline-flex gap-2">{children}</div>
      ) : (
        children
      )}
    </ShadcnButton>
  )
}

export default Button
