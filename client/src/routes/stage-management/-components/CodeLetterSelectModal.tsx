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
import ButtonLoader from '@/components/ButtonLoader'
import ParticipantStatus from '@/constants/ParticipantStatus'
import { Route } from '..'
import useCompetitionParticipantMutation from '../-hooks/useCompetitionParticipantMutation'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function CodeLetterSelectModal({
  open,
  onClose,
  chestNumber,
  maxCount,
  usedLetters,
  isLoading,
  itemCode,
}: {
  open: boolean
  onClose: () => void
  chestNumber: number
  maxCount: number
  usedLetters: string[]
  isLoading?: boolean
  itemCode: number
}) {
  const { eventId, stageId } = Route.useSearch()
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
      if (elapsed >= 2000) {
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

  const { mutate } = useCompetitionParticipantMutation()

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
          <ButtonLoader
            disabled={!selected || isLoading || randomizing}
            onClick={async () => {
              mutate({
                itemId: itemCode,
                eventId,
                stageId,
                chestNumber,
                codeLetter: selected!,
                status: ParticipantStatus.Enrolled,
              })
              onClose()
            }}
            isLoading={isLoading}
          >
            Continue
          </ButtonLoader>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
