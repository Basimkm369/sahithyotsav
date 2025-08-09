import React, { useCallback, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import LoadingSpinner from '@/components/LoadingSpinner'
import { api } from '@/lib/api'

export const Route = createFileRoute('/food-court-control/')({
  component: FoodCourtControlPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; pin: string } => {
    return {
      eventId: search.eventId as string,
      pin: search.pin as string,
    }
  },
})

const foodCourtData = [
  {
    date: '09-08-2025',
    types: ['Break Fast', 'Lunch', 'Dinner'],
  },
  {
    date: '10-08-2025',
    types: ['Break Fast', 'Lunch'],
  },
]

function FoodCourtControlPage() {
  const { pin } = Route.useSearch()

  if (pin != '1A7KFk1IhCIAL5i') {
    return ''
  }
  const scanner = useRef<QrScanner | undefined>()
  const videoEl = useRef<HTMLVideoElement>(null)
  const containerEl = useRef<HTMLDivElement>(null)

  const [cameras, setCameras] = useState<QrScanner.Camera[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const availableDates = foodCourtData.map((item) => item.date)
  const availableTypes =
    foodCourtData.find((item) => item.date === selectedDate)?.types ?? []

  const { eventId } = Route.useSearch()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [scannedResult, setScannedResult] = useState<string | null>()
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0])
    }
  }, [availableDates, selectedDate, setSelectedDate])

  // Auto-select first type when availableTypes changes and a date is selected
  useEffect(() => {
    if (availableTypes.length > 0 && selectedDate && !selectedType) {
      setSelectedType(availableTypes[0])
    }
  }, [availableTypes, selectedDate, selectedType, setSelectedType])

  // Get available cameras on component mount
  useEffect(() => {
    QrScanner.listCameras(true)
      .then((data) => {
        setCameras(data)
        if (data.length > 0) {
          const preferredCam = data.find((cam) =>
            cam.label.toLowerCase().includes('back'),
          )
          setSelectedCamera(preferredCam ? preferredCam.id : data[0].id)
        } else {
          setError('No cameras found. Please check device permissions.')
        }
      })
      .catch((err) => {
        setError('Failed to access camera. Please check permissions.')
      })
  }, [])

  // Handle camera selection
  useEffect(() => {
    if (selectedCamera && scanner.current) {
      scanner.current.setCamera(selectedCamera)
    }
  }, [selectedCamera])

  // Handle success message timeout
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [success])

  const badgeChestNumbers: number[] = [
    9600, 9601, 9602, 9603, 9604, 9605, 9606, 9607, 9608, 9609, 9610, 9611,
    9612, 9613, 9614, 9615, 9616, 9617, 9618, 9619,
  ]

  // Scan success handler with cooldown logic
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    const scannedCode = result.data.trim()
    setScannedResult(scannedCode)
  }

  // Trigger API call when a QR code is scanned
  useEffect(() => {
    if (!selectedDate) {
      toast.error('Please select a date')
      setScannedResult(null)
      return
    }

    if (!selectedType) {
      toast.error('Please select a type')
      setScannedResult(null)
      return
    }
    if (scannedResult) {
      onSubmit(scannedResult)
    }
  }, [scannedResult])

  // API call function
  const onSubmit = useCallback(
    async (scannedData: string) => {
      try {
        setIsProcessing(true)
        const { data } = await api.post('/foodManagement/checkIn', {
          eventId,
          chestNumber: scannedData,
          date: selectedDate,
          type: selectedType,
        })
        setSuccess(data.msg)
        toast.success(data.msg ?? 'Scanned successfully.', {
          duration: 2000,
        })
        // setScannedResult(null); // Clear result to allow next scan
        setError(null)

        if (badgeChestNumbers.includes(Number(scannedData))) {
          setTimeout(() => {
            window.location.reload()
          }, 500) // small delay so toast can be seen
        }
        // Update cooldown state after a successful API call
      } catch (err: any) {
        toast.error(err?.response?.data?.msg ?? 'An error occurred.', {
          duration: 2000,
        })
        setError(err?.response?.data?.msg ?? 'An error occurred.')
      } finally {
        setIsProcessing(false)
      }
    },
    [selectedDate, selectedType],
  )

  // Initialize and clean up QrScanner
  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        preferredCamera: selectedCamera ?? 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      })

      scanner.current
        .start()
        .then(() => {
          if (containerEl.current) {
            containerEl.current.appendChild(scanner.current.$canvas)
          }
        })
        .catch((err) => {
          console.error('❌ Failed to start scanner:', err)
          setError('Could not start camera. Please check permissions.')
        })
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop()
        scanner.current.destroy()
        scanner.current = undefined
      }
    }
  }, [videoEl, containerEl, selectedCamera])

  return (
    <div className="p-4 space-y-4">
      {/* <Card className="p-4"> */}
      <Select value={selectedCamera} onValueChange={setSelectedCamera}>
        <SelectTrigger>
          <SelectValue placeholder="Select camera" />
        </SelectTrigger>
        <SelectContent>
          {cameras.map((cam) => (
            <SelectItem key={cam.id} value={cam.id}>
              {cam.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* </Card> */}

      <div className="grid grid-cols-2 gap-4">
        {/* <Card className="p-4"> */}
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger>
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            {availableDates.map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* </Card> */}

        {/* <Card className="p-4"> */}
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
          disabled={!selectedDate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* </Card> */}
      </div>

      {/* <Card className='p-2 overflow-hidden'> */}
      <div
        ref={containerEl}
        className="relative w-full h-[400px] flex justify-center items-center"
      >
        <video
          ref={videoEl}
          className="absolute top-0 left-0 w-full h-full opacity-0"
          playsInline
          muted
        />
      </div>
      {/* </Card> */}

      <div className="text-center flex flex-col items-center my-4">
        {isProcessing && <LoadingSpinner />}
      </div>
    </div>
  )
}
