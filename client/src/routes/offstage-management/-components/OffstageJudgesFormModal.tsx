import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import useCompetitionMutation from '../-hooks/useOffstageJudgesMutation'
import useJudges from '../-hooks/useJudges'
import { Route } from '..'
import { Competition } from '../-hooks/useOffstageJudges'
import Button from '@/components/Button'
import { toast } from 'sonner'

export type Judge = { id: number; name: string }

export default function OffstageJudgesFormModal({
  data,
  open,
  onClose,
}: {
  data?: Competition
  open: boolean
  onClose: () => void
}) {
  const { eventId } = Route.useSearch()
  const { data: judges } = useJudges({ eventId })

  const [judge1Id, setJudge1Id] = useState<string>()
  const [judge2Id, setJudge2Id] = useState<string>()
  const [judge3Id, setJudge3Id] = useState<string>()
  const mutation = useCompetitionMutation()

  const handleSave = async () => {
    const judgeIds = [judge1Id, judge2Id, judge3Id].filter(Boolean)
    const uniqueJudgeIds = new Set(judgeIds)
    if (judgeIds.length !== uniqueJudgeIds.size) {
      toast.error('Judges must be unique.')
      return
    }

    if (!data?.itemCode) return
    await mutation.mutateAsync({
      eventId,
      itemId: data.itemCode,
      judge1Id: judge1Id ? Number(judge1Id) : null,
      judge2Id: judge2Id ? Number(judge2Id) : null,
      judge3Id: judge3Id ? Number(judge3Id) : null,
    })
    toast.success('Judges assigned successfully.')
    onClose()
  }

  useEffect(() => {
    if (open && data) {
      setJudge1Id(data.judge1Id ? String(data.judge1Id) : '')
      setJudge2Id(data.judge2Id ? String(data.judge2Id) : '')
      setJudge3Id(data.judge3Id ? String(data.judge3Id) : '')
    } else {
      setJudge1Id('')
      setJudge2Id('')
      setJudge3Id('')
    }
  }, [data, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Judges</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={judge1Id ?? 'none'}
            onValueChange={(v) => setJudge1Id(v === 'none' ? '' : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Judge 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {judges?.map((j) => (
                <SelectItem key={j.id} value={String(j.id)}>
                  {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={judge2Id ?? 'none'}
            onValueChange={(v) => setJudge2Id(v === 'none' ? '' : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Judge 2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {judges?.map((j) => (
                <SelectItem key={j.id} value={String(j.id)}>
                  {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={judge3Id ?? 'none'}
            onValueChange={(v) => setJudge3Id(v === 'none' ? '' : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Judge 3" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {judges?.map((j) => (
                <SelectItem key={j.id} value={String(j.id)}>
                  {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
