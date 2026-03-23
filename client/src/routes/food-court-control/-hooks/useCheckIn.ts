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
      const res = await api.post<{ msg: string }>('/foodManagement/checkIn', {
        eventId,
        chestNumber,
        date,
        type,
      });
      return res.data.msg;
    },
    onSuccess,
    onError: (err: any) => {
      onError?.(err?.msg ?? 'Something went wrong');
    },
  });
