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

  const handleSaveMark = useCallback(() => {
    if (!selectedCode) return

    const validationError = validateMark(mark)
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    setMarks((prev) => ({ ...prev, [selectedCode]: mark }))
    setSelectedCode(null)
  }, [mark, selectedCode])

  const handleCloseDialog = useCallback(() => {
    setSelectedCode(null)
    setErrorMsg(null)
  }, [])

  if (!data) return <></>

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.scores.map((p) => (
          <Card
            key={p.codeLetter}
            className={`w-40 h-40 flex items-center justify-center ${!!p.mark && p.mark >= 0 ? 'bg-green-600/20 hover:bg-green-600/30 border-green-600/20' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'} cursor-pointer p-6 rounded-lg text-center border`}
            onClick={() => handleCardClick(p.codeLetter)}
          >
            <CardContent className="space-y-2">
              <div className="text-5xl font-bold">{p.codeLetter}</div>
              <div className="text-2xl">
                {!!p.mark && p.mark >= 0 ? p.mark : '-'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
                <Button onClick={handleSaveMark} disabled={!!errorMsg || !mark}>
                  💾 Save Mark
                </Button>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
