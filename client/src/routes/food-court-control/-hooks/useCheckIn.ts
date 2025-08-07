import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'


export const useCheckInMutation = ({ onSuccess, onError }: {
  onSuccess?: (msg: string) => void;
  onError?: (err: string) => void;
}) =>
  useMutation({
    mutationFn: async ({ eventId,chestNumber, date, type }: {
      eventId: string;
      chestNumber: string;
      date: string;
      type: string;
    }) => {
      const { msg } = await api.post('/foodManagement/checkIn', {
        eventId,
        chestNumber,
        date,
        type,
      });
      return msg;
    },
    onSuccess,
    onError: (err: any) => {
      onError?.(err?.msg ?? 'Something went wrong');
    },
  });
