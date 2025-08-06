import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import ButtonLoader from './ButtonLoader'
import ErrorAlert from './ErrorAlert'
import Button from './Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

export const Confirmation = ({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete the selected item.',
  error,
}: {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => Promise<void>
  title?: string
  description?: string
  error?: string
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent title={title}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mb-4">
          {description}
          {!!error && <ErrorAlert>{error}</ErrorAlert>}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <ButtonLoader variant="destructive" onClick={onConfirm}>
            Confirm
          </ButtonLoader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const useConfirmation = ({
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete the selected items.',
}: {
  onConfirm: (params?: any) => Promise<any>
  title?: string
  description?: string
}): [ReactNode, (params?: any) => void] => {
  const [isOpen, setIsOpen] = useState(false)
  const [params, setParams] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) setError('')
  }, [isOpen])

  const component = useMemo(
    () => (
      <Confirmation
        isOpen={isOpen}
        title={title}
        description={description}
        error={error}
        onCancel={() => setIsOpen(false)}
        onConfirm={async () => {
          try {
            await onConfirm(params)
            setIsOpen(false)
          } catch (err: any) {
            setError(err.msg || err || 'Unknown error occured')
          }
        }}
      />
    ),
    [isOpen, title, description, error, onConfirm, setIsOpen, params],
  )

  const promptComfirmation = useCallback(
    (params: any) => {
      setParams(params)
      setIsOpen(true)
    },
    [setParams, setIsOpen],
  )

  return [component, promptComfirmation]
}

export default useConfirmation
