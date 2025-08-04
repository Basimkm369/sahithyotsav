import { useState, useEffect } from 'react'
import { JudgementSummary } from '../-hooks/useJudgementSummary'

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
    <div>
      <textarea
        className="w-full border rounded-lg p-2"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        placeholder="Enter notes here..."
      />
      <div style={{ fontSize: '0.9em', color: '#888' }}>
        {isSaving ? 'Saving...' : 'All changes saved'}
      </div>
    </div>
  )
}
