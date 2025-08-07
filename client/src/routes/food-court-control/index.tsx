import React, { useCallback, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { Alert, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/food-court-control/')({
  component: FoodCourtControlPage,
  validateSearch: (search: Record<string, unknown>): { eventId: string } => {
    return {
      eventId: search.eventId as string,
    };
  },
});

const foodCourtData = [
  {
    date: '07-08-2025',
    types: ['Lunch', 'Dinner'],
  },
  {
    date: '08-08-2025',
    types: ['Break Fast', 'Lunch'],
  },
];

const FoodCourtControlPage = () => {
  const scanner = useRef<QrScanner | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { eventId } = Route.useSearch();
  const lastScanned = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);


  const availableDates = foodCourtData.map((item) => item.date);
  const availableTypes =
    foodCourtData.find((item) => item.date === selectedDate)?.types ?? [];

  const latestState = useRef({ selectedDate, selectedType });
  useEffect(() => {
    latestState.current = { selectedDate, selectedType };
  }, [selectedDate, selectedType]);

  const handleScan = useCallback(
    async (result: QrScanner.ScanResult) => {
      const scanned = result?.data?.trim();
      const { selectedDate, selectedType } = latestState.current;

      if (!selectedDate) {
        toast.error('Please select a date');
        return;
      }

      if (!selectedType) {
        toast.error('Please select a type');
        return;
      }

      if (!scanned || isProcessing) return;

      // Prevent duplicate scan within 5 seconds
      const now = Date.now();
      if (
        scanned === lastScanned.current &&
        now - lastScannedTime.current < 5000
      ) {
        console.log('Duplicate scan ignored:', scanned);
        return;
      }

      lastScanned.current = scanned;
      lastScannedTime.current = now;

      setIsProcessing(true);
      try {
        const { msg } = await api.post(`/foodManagement/checkIn`, {
          eventId,
          chestNumber: scanned,
          date: selectedDate,
          type: selectedType,
        });
        setSuccess(msg);
        setError(null);
      } catch (err: any) {
        setError(err?.msg || 'Something went wrong');
        setSuccess(null);
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          if (scanner.current) {
            scanner.current.start().catch((err) => {
              console.error('Failed to restart scanner:', err);
              initializeScanner();
            });
          }
        }, 300);
      }
    },
    [eventId, isProcessing]
  );


  const initializeScanner = useCallback(() => {
    if (!videoEl.current) return;

    if (scanner.current) {
      try {
        scanner.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scanner.current.destroy();
      scanner.current = null;
    }

    scanner.current = new QrScanner(
      videoEl.current,
      handleScan,
      {
        preferredCamera: selectedCamera || 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        maxScansPerSecond: 5,
      }
    );

    scanner.current
      .start()
      .then(() => console.log('Scanner started'))
      .catch((err) => {
        console.error('Scanner start error:', err);
        setError('Failed to access camera. Please check permissions.');
      });
  }, [handleScan, selectedCamera]);

  useEffect(() => {
    QrScanner.listCameras(true).then(setCameras).catch(console.error);
  }, []);

  useEffect(() => {
    initializeScanner();
    return () => {
      if (scanner.current) {
        try {
          scanner.current.stop();
        } catch (err) {
          console.error('Error stopping scanner on unmount:', err);
        }
        scanner.current.destroy();
        scanner.current = null;
      }
    };
  }, [initializeScanner]);

  useEffect(() => {
    setSelectedType('');
  }, [selectedDate]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
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
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
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
        </Card>

        <Card className="p-4">
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
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex justify-center">
          <video
            ref={videoEl}
            className="w-full max-w-md aspect-video border rounded"
            muted
            playsInline
          />
        </div>
      </Card>

      <div className="text-center flex flex-col items-center my-4">
        {isProcessing && <LoadingSpinner />}
        {error && (
          <Alert status="error" variant="solid">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {success && (
          <Alert status="success" variant="solid">
            <AlertTitle>{success}</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
};