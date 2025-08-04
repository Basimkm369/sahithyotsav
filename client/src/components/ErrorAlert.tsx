import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LuCircleAlert } from 'react-icons/lu'

const ErrorAlert = ({ children }: { children?: any }) => {
  if (!children) return <></>

  if (children instanceof Error) {
    children = children.message
  }

  if (typeof children === 'object' && 'msg' in children) {
    children = children.msg
  } else if (
    typeof children === 'object' &&
    Array.isArray(children) &&
    !children.every((c) => !!c || (typeof c === 'string' && c.trim()))
  ) {
    return <></>
  }

  return (
    <Alert variant="destructive">
      <LuCircleAlert className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export default ErrorAlert
