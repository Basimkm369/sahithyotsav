import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Button from '@/components/Button'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function CodeLetterSelectModal({
  open,
  onClose,
  chestNumber,
  maxCount,
  usedLetters,
  isLoading,
  onContinue,
}: {
  open: boolean
  onClose: () => void
  chestNumber: number
  maxCount: number
  usedLetters: string[]
  isLoading?: boolean
  onContinue?: (letter: string) => void
}) {
  const availableLetters = LETTERS.slice(0, maxCount).filter(
    (l) => !usedLetters.find((x) => x.toUpperCase() === l),
  )

  const [selected, setSelected] = useState<string | null>(null)
  const [randomizing, setRandomizing] = useState(false)

  const handleRandomize = useCallback(() => {
    setRandomizing(true)
    let intervalId: NodeJS.Timeout
    let elapsed = 0
    intervalId = setInterval(() => {
      const randLetter =
        availableLetters[Math.floor(Math.random() * availableLetters.length)]
      setSelected(randLetter)
      elapsed += 100
      if (elapsed >= 3000) {
        clearInterval(intervalId)
        setRandomizing(false)
      }
    }, 100)
  }, [availableLetters, setSelected, setRandomizing])

  useEffect(() => {
    if (open) {
      setSelected(null)
    }
  }, [open])

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
              className={cn(
                `cursor-pointer border rounded-lg w-20 h-18 flex items-center justify-center font-bold text-xl transition`,
                selected === letter
                  ? randomizing
                    ? 'bg-yellow-400 text-yellow-900 border-yellow-600 scale-105'
                    : 'bg-blue-600 text-white border-blue-700'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
              )}
              onClick={() => !randomizing && setSelected(letter)}
              disabled={isLoading || randomizing}
            >
              {letter}
            </button>
          ))}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            disabled={isLoading || randomizing || availableLetters.length === 0}
            onClick={handleRandomize}
            isLoading={randomizing}
            variant="outline"
          >
            Randomize
          </Button>
          <Button
            disabled={!selected || isLoading || randomizing}
            onClick={() => selected && onContinue?.(selected)}
            isLoading={isLoading}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
