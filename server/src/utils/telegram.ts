import { TG_BOT_API_KEY, TG_CHANNEL_ID } from 'src/config/env';

const notifyTelegram = async ({ message }: { message: string }) => {
  if (!TG_BOT_API_KEY || !TG_CHANNEL_ID) {
    return;
  }

  await fetch(`https://api.telegram.org/bot${TG_BOT_API_KEY}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TG_CHANNEL_ID,
      text: message,
    }),
  }).catch(() => {});
};

export default notifyTelegram;
