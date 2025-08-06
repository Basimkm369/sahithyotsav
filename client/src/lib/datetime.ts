import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function formatTime(timeStr: string): string {
  const timeOnly = dayjs(timeStr?.split('T')?.[1].substring(0, 8), 'HH:mm:ss')
  return timeOnly.isValid() ? timeOnly.format('h:mm A') : ''
}
