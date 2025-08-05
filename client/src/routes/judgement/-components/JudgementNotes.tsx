import { useState, useEffect } from 'react'
import { JudgementSummary } from '../-hooks/useJudgementSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function JudgementNotes({ data }: { data: JudgementSummary }) {
  const [notes, setNotes] = useState(data.notes || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      if (notes !== data.notes) {
        // setIsSaving(true)
        // Replace with your actual save API call
        // fetch(`/api/judgement/${data.id}/notes`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ notes }),
        // })
        //   .then(() => setIsSaving(false))
        //   .catch(() => setIsSaving(false))
      }
    }, 2000)

    return () => clearTimeout(handler)
  }, [notes, data])

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
        <div className="text-sm text-slate-700">
          {isSaving ? 'Saving...' : 'All changes saved'}
        </div>
      </CardContent>
    </Card>
  )
}
