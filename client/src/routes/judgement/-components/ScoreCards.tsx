import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Route } from '..'
import { JudgementSummary } from '../-hooks/useJudgementSummary'
import { useJudgementMarkMutation } from '../-hooks/useJudgementMarkMutation'
import ButtonLoader from '@/components/ButtonLoader'

const validateMark = (value: string): string | null => {
  if (!/^\d+$/.test(value)) {
    return 'Only whole numbers are allowed.'
  }
  const numeric = Number(value)
  if (numeric < 1 || numeric > 100) {
    return 'Value must be between 1 and 100.'
  }
  return null
}

export default function ScoreCards({ data }: { data: JudgementSummary }) {
  const { eventId, itemId, judgeId } = Route.useSearch()
  const mutation = useJudgementMarkMutation()

  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [mark, setMark] = useState('')
  const [marks, setMarks] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCardClick = useCallback(
    (code: string) => {
      setSelectedCode(code)
      setMark(marks[code] ?? '')
    },
    [marks],
  )

  const handleInputChange = useCallback((value: string) => {
    setMark(value)
    setErrorMsg(validateMark(value))
  }, [])

  const handleSaveMark = useCallback(async () => {
    if (!selectedCode) return

    const validationError = validateMark(mark)
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    await mutation.mutateAsync({
      eventId,
      itemId,
      judgeId,
      codeLetter: selectedCode,
      mark: Number(mark),
    })

    setMarks((prev) => ({ ...prev, [selectedCode]: mark }))
    setSelectedCode(null)
  }, [mark, selectedCode, eventId, itemId, judgeId, mutation])

  const handleCloseDialog = useCallback(() => {
    setSelectedCode(null)
    setErrorMsg(null)
  }, [])

  if (!data) return <></>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 ">
          {data.scores.map((p) => (
            <div
              key={p.codeLetter}
              className={`space-y-2 w-30 h-30 flex flex-col items-center justify-center ${!!p.mark && p.mark >= 0 ? 'bg-green-600/20 hover:bg-green-600/30 border-green-600/20' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'} cursor-pointer p-6 rounded-lg text-center border`}
              onClick={() => handleCardClick(p.codeLetter)}
            >
              <div className="text-4xl font-bold">{p.codeLetter}</div>
              <div className="text-2xl">
                {!!p.mark && p.mark >= 0 ? p.mark : '-'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={!!selectedCode} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedCode && (
            <>
              <DialogHeader>
                <DialogTitle>📝 Enter Mark for {selectedCode}</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="1 - 100"
                min={0}
                max={100}
                type="number"
                inputMode="numeric"
                value={mark}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              {errorMsg && (
                <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
              )}

              <DialogFooter className="mt-4">
                <ButtonLoader onClick={handleSaveMark} disabled={!!errorMsg || !mark}>
                  💾 Save Mark
                </ButtonLoader>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
