import { Checkbox } from '@/components/ui/checkbox'
import { useCallback, useState } from 'react'
import { Route } from '..'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Loader2 } from 'lucide-react'

export default function PrizeParticipantAction({
  itemCode,
  chestNumber,
  momentoDistributed,
  cashDistributed,
}: {
  itemCode: number
  chestNumber: number
  momentoDistributed: boolean
  cashDistributed: boolean
}) {
  const { eventId } = Route.useSearch()

  const [_cashDistributed, setCashDistributed] = useState(cashDistributed)
  const [_momentoDistributed, setMomentoDistributed] =
    useState(momentoDistributed)

  const [_cashSaving, setCashSaving] = useState(false)
  const [_momentoSaving, setMomentoSaving] = useState(false)

  const handlePrizeToggle = useCallback(
    async (chestNumber: number, type: 'momento' | 'cash', checked: boolean) => {
      if (!itemCode) return
      if (type === 'cash') {
        setCashSaving(true)
      } else {
        setMomentoSaving(true)
      }
      try {
        await api.post(`/prizeManagement/updatePrizeDistribution`, {
          itemCode,
          eventId,
          chestNumber,
          ...(type === 'cash' && { cashStatus: checked }),
          ...(type === 'momento' && { momentoStatus: checked }),
        })
      } catch {
        if (type === 'cash') {
          setCashDistributed((p) => !p)
        } else {
          setMomentoDistributed((p) => !p)
        }
      } finally {
        if (type === 'cash') {
          setCashSaving(false)
        } else {
          setMomentoSaving(false)
        }
      }
    },
    [],
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`momento-${chestNumber}`}
          checked={_momentoDistributed}
          onCheckedChange={(checked) => {
            setMomentoDistributed(checked as boolean)
            handlePrizeToggle(chestNumber, 'momento', checked as boolean)
          }}
        />
        <label htmlFor={`momento-${chestNumber}`} className="text-sm">
          Momento
        </label>
        {_momentoSaving && (
          <Badge variant="outline">
            <Loader2 className="animate-spin w-4 h-4 text-gray-500" /> Saving
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`cashPrize-${chestNumber}`}
          checked={_cashDistributed}
          onCheckedChange={(checked) => {
            setCashDistributed(checked as boolean)
            handlePrizeToggle(chestNumber, 'cash', checked as boolean)
          }}
        />
        <label htmlFor={`cash-${chestNumber}`} className="text-sm">
          Cash Prize
        </label>
        {_cashSaving && (
          <Badge variant="outline">
            <Loader2 className="animate-spin w-4 h-4 text-gray-500" /> Saving
          </Badge>
        )}
      </div>
    </div>
  )
}
