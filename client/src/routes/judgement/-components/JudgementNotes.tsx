import { useState, useEffect, useRef } from 'react'
import { JudgementSummary } from '../-hooks/useJudgementSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Route } from '..'
import { formatTime } from '@/lib/datetime'

export default function JudgementNotes({ data }: { data: JudgementSummary }) {
  const { eventId, itemId, judgeId } = Route.useSearch()

  const [notes, setNotes] = useState(data.notes || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setNotes(data.notes || '')
    setLastSaved(null)
    setError(null)
  }, [data.notes])

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    if (notes === data.notes) return

    saveTimeout.current = setTimeout(() => {
      setIsSaving(true)
      setError(null)
      api
        .post(`/judgement/updateNotes`, { eventId, judgeId, itemId, notes })
        .then(() => {
          setLastSaved(new Date())
          setError(null)
        })
        .catch(() => {
          setError('Failed to save.')
        })
        .finally(() => setIsSaving(false))
    }, 2000)

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [notes, eventId, judgeId, itemId, data.notes])

  const handleRetry = () => {
    setIsSaving(true)
    setError(null)
    api
      .post(`/judgement/updateNotes`, { eventId, judgeId, itemId, notes })
      .then(() => {
        setLastSaved(new Date())
        setError(null)
      })
      .catch(() => {
        setError('Failed to save.')
      })
      .finally(() => setIsSaving(false))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full border rounded-lg p-2 text-lg"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="Enter your overall comments or observations about this competition here."
        />
        <div className="text-sm text-slate-700 mt-2">
          {isSaving && !error && 'Saving...'}
          {!isSaving && !error && lastSaved && (
            <>Last saved at {formatTime(lastSaved.toISOString())}</>
          )}
          {!isSaving && !error && !lastSaved && 'All changes saved'}
          {error && (
            <>
              <span className="text-red-500">{error}</span>{' '}
              <span className="underline cursor-pointer" onClick={handleRetry}>
                Retry
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
