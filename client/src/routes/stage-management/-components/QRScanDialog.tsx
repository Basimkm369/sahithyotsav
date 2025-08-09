import React, { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface QRScanDialogProps {
  open: boolean
  onClose: () => void
  participants: { chestNumber: number; status: string; [key: string]: any }[]
  onValidScan: (participant: { chestNumber: number }) => void
}

const QRScanDialog: React.FC<QRScanDialogProps> = ({
  open,
  onClose,
  participants,
  onValidScan,
}) => {
  const scanner = useRef<QrScanner>(null)
  const videoEl = useRef<HTMLVideoElement>(null)
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [enableRescan, setEnableRescan] = useState<boolean>(false)

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    if (result?.data) {
      const scannedValue = result.data.trim()

      const matched = participants.find(
        (p) => p.chestNumber?.toString() === scannedValue,
      )

      if (!matched) {
        toast.error(`Invalid chest number: ${scannedValue}`)
        setScanResult(null)
        setEnableRescan(true)
        scanner.current?.stop()
        return
      }

      if (matched.status && matched.status !== '') {
        toast.error(`Already enrolled participant: ${scannedValue}`)
        setScanResult(null)
        setEnableRescan(true)
        scanner.current?.stop()
        return
      }

      toast.success(`Valid: ${scannedValue}`)
      setScanResult(scannedValue)
      scanner.current?.stop()

      onValidScan(matched)
    }
  }

  const initScanner = async () => {
    if (!open || !selectedCamera) return

    try {
      if (scanner.current) {
        await scanner.current.stop()
        scanner.current.destroy()
        scanner.current = null
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      const video = videoEl.current
      const container = document.querySelector('#video-container')

      if (video && container) {
        scanner.current = new QrScanner(video, onScanSuccess, {
          preferredCamera: selectedCamera,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
        })

        await scanner.current.start()

        container.innerHTML = ''
        if (scanner.current.$canvas) {
          container.appendChild(scanner.current.$canvas)
        }
      }
    } catch (error) {
      console.error('Scanner initialization failed:', error)
      toast.error('Failed to initialize scanner')
    }
  }

  useEffect(() => {
    const loadCameras = async () => {
      try {
        const availableCameras = await QrScanner.listCameras(true)
        const reversed = [...availableCameras].reverse()
        setCameras(reversed)
        if (reversed.length > 0) {
          setSelectedCamera(reversed[0].id)
        }
      } catch (error) {
        console.error('Error loading cameras:', error)
      }      
    }

    if (open) {
      loadCameras()
    }
  }, [open])

  useEffect(() => {
    if (open && selectedCamera) {
      setScanResult(null)
      setEnableRescan(false)
      if (scanner.current) {
        scanner.current.stop()
        scanner.current.destroy()
        scanner.current = null
      }
      initScanner()
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop()
        scanner.current.destroy()
        scanner.current = null
      }
    }
  }, [open, selectedCamera])

  const handleRescan = () => {
    setScanResult(null)
    setEnableRescan(false)
    initScanner()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select
            value={selectedCamera}
            onValueChange={(value) => {
              setSelectedCamera(value)
              setScanResult(null)
              setEnableRescan(false)
            }}
          >
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

          <div className="relative border rounded-md overflow-hidden h-64 bg-gray-100 flex items-center justify-center">
            {selectedCamera ? (
              <div id="video-container" className="absolute inset-0" />
            ) : (
              <span className="text-muted-foreground">
                Select a camera to start scanning
              </span>
            )}
          </div>

          <div className="sr-only">
            <video ref={videoEl} />
          </div>

          {scanResult && (
            <div className="text-center text-sm font-medium text-green-600">
              Scanned Result: {scanResult}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleRescan}
              variant="outline"
              disabled={!enableRescan && !scanResult}
            >
              Scan Another
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QRScanDialog
