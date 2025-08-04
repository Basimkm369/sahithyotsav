import { useState } from 'react'
import Button, { ButtonProps } from './Button'
import { cn } from '@/lib/utils'

const ButtonLoader = ({ children, ...props }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const onClick = async (e: any) => {
    setIsLoading(true)
    try {
      await props.onClick?.(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      {...props}
      isLoading={isLoading}
      onClick={onClick}
      className={cn('relative', props.className)}
    >
      {children}
    </Button>
  )
}

export default ButtonLoader
