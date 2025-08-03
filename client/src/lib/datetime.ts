import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function formatTime(timeStr: string): string {
  const timeOnly = dayjs(timeStr, 'HH:mm:ss') // parses only the time
  return timeOnly.format('hh:mm A')
}
