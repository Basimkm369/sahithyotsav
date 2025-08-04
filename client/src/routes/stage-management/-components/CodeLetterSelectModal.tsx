import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Button from '@/components/Button'
import { useState } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function CodeLetterSelectModal({
  open,
  onClose,
  chestNumber,
  maxCount,
  usedLetters,
  isLoading,
}: {
  open: boolean
  onClose: () => void
  chestNumber: number
  maxCount: number
  usedLetters: string[]
  isLoading?: boolean
}) {
  const availableLetters = LETTERS.slice(0, maxCount).filter(
    (l) => !usedLetters.includes(l),
  )

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select code letter for #{chestNumber}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 my-4">
          {availableLetters.map((letter) => (
            <button
              key={letter}
              type="button"
              className={`border rounded-lg p-4 font-bold text-xl transition
                ${
                  selected === letter
                    ? 'bg-blue-600 text-white border-blue-700 scale-105'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }
              `}
              onClick={() => setSelected(letter)}
              disabled={isLoading}
            >
              {letter}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button
            disabled={!selected || isLoading}
            // onClick={() => selected && onContinue(selected)}
            isLoading={isLoading}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
