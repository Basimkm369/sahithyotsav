import Transport from 'winston-transport';
import type { LogEntry } from 'winston';
import { ENV } from 'src/config/env';
import notifyTelegram from 'src/utils/telegram';

class TelegramTransport extends Transport {
  override log(info: LogEntry, callback: any) {
    // make sure you installed `@types/node` or this will give a typerror
    // this is the basic default behavior don't forget to add this.
    setImmediate(() => {
      this.emit('logged', info);
    });

    const { level, message, ...meta } = info;

    if (['error'].includes(level)) {
      let msg = '🛑🛑🛑\n\n';
      msg += message;
      msg += '\n\n-------\n';
      if (meta.stack) {
        msg += meta.stack;
        msg += '\n\n-------\n';
      }

      let metaMsg = '';
      if (meta.method) metaMsg += `Method: ${meta.method}\n`;
      if (meta.url) metaMsg += `Url: ${meta.url}\n`;
      if (meta.body) metaMsg += `Body: ${JSON.stringify(meta.body)}\n`;
      if (meta.params) metaMsg += `Params: ${JSON.stringify(meta.params)}\n`;
      if (meta.userId) metaMsg += `UserId: ${meta.userId}\n`;
      if (meta.sessionId) metaMsg += `SessionId: ${meta.sessionId}\n`;
      if (metaMsg) msg += `${metaMsg}\n-------\n`;

      msg += ENV;

      notifyTelegram({
        message: msg,
      });
    }

    if (['warn'].includes(level)) {
      let msg = '⚠️⚠️⚠️\n\n';
      msg += message;
      msg += '\n\n-------\n';
      msg += ENV;

      notifyTelegram({
        message: msg,
      });
    }

    // don't forget this one
    callback();
  }
}

export default TelegramTransport;
