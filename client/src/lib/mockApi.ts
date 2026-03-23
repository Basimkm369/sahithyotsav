import CompetitionStatus from '@/constants/CompetitionStatus'
import ParticipantStatus from '@/constants/ParticipantStatus'
import type { ApiClient, ApiResponse } from '@/lib/api'

type Params = Record<string, any>

const MOCK_DELAY_MS = 150

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const categories = [
  { number: 1, name: 'Music' },
  { number: 2, name: 'Dance' },
  { number: 3, name: 'Drama' },
]

const stages = [
  { number: '1', name: 'Main Stage', competitionsCount: 12 },
  { number: '2', name: 'Open Arena', competitionsCount: 8 },
]

const teams = [
  { number: '1', name: 'Team A' },
  { number: '2', name: 'Team B' },
  { number: '3', name: 'Team C' },
]

const judges = [
  { id: '201', name: 'Judge One' },
  { id: '202', name: 'Judge Two' },
  { id: '203', name: 'Judge Three' },
  { id: '204', name: 'Judge Four' },
]

type BaseCompetition = {
  id: number
  itemCode: number
  name: string
  stageId: string
  stageName: string
  stageType: 'Stage' | 'Non Stage'
  categoryId: string
  categoryName: string
  status: CompetitionStatus
  date: string
  startTime: string
  endTime: string
  judge1Id: string
  judge2Id: string
  judge3Id: string
  judge1Name: string
  judge2Name: string
  judge3Name: string
  judge1Submitted: boolean
  judge2Submitted: boolean
  judge3Submitted: boolean
  resultNumber: number
}

const competitions: BaseCompetition[] = [
  {
    id: 1,
    itemCode: 101,
    name: 'Solo Song',
    stageId: '1',
    stageName: 'Main Stage',
    stageType: 'Stage',
    categoryId: '1',
    categoryName: 'Music',
    status: CompetitionStatus.InProgress,
    date: '2025-08-09',
    startTime: '2025-08-09T09:00:00',
    endTime: '2025-08-09T09:30:00',
    judge1Id: '201',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge One',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: false,
    judge3Submitted: false,
    resultNumber: 1,
  },
  {
    id: 2,
    itemCode: 102,
    name: 'Group Dance',
    stageId: '2',
    stageName: 'Open Arena',
    stageType: 'Stage',
    categoryId: '2',
    categoryName: 'Dance',
    status: CompetitionStatus.Completed,
    date: '2025-08-09',
    startTime: '2025-08-09T10:00:00',
    endTime: '2025-08-09T11:00:00',
    judge1Id: '201',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge One',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: true,
    judge3Submitted: true,
    resultNumber: 2,
  },
  {
    id: 3,
    itemCode: 103,
    name: 'Mono Act',
    stageId: '1',
    stageName: 'Main Stage',
    stageType: 'Non Stage',
    categoryId: '3',
    categoryName: 'Drama',
    status: CompetitionStatus.NotStarted,
    date: '2025-08-10',
    startTime: '2025-08-10T14:00:00',
    endTime: '2025-08-10T15:00:00',
    judge1Id: '204',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge Four',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: false,
    judge2Submitted: false,
    judge3Submitted: false,
    resultNumber: 3,
  },
  {
    id: 4,
    itemCode: 104,
    name: 'Classical Instrument',
    stageId: '1',
    stageName: 'Main Stage',
    stageType: 'Stage',
    categoryId: '1',
    categoryName: 'Music',
    status: CompetitionStatus.Finalized,
    date: '2025-08-10',
    startTime: '2025-08-10T10:00:00',
    endTime: '2025-08-10T10:30:00',
    judge1Id: '201',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge One',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: true,
    judge3Submitted: true,
    resultNumber: 4,
  },
  {
    id: 5,
    itemCode: 105,
    name: 'Folk Dance',
    stageId: '2',
    stageName: 'Open Arena',
    stageType: 'Stage',
    categoryId: '2',
    categoryName: 'Dance',
    status: CompetitionStatus.MediaCompleted,
    date: '2025-08-10',
    startTime: '2025-08-10T11:00:00',
    endTime: '2025-08-10T11:30:00',
    judge1Id: '201',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge One',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: true,
    judge3Submitted: true,
    resultNumber: 5,
  },
  {
    id: 6,
    itemCode: 106,
    name: 'Mime',
    stageId: '1',
    stageName: 'Main Stage',
    stageType: 'Non Stage',
    categoryId: '3',
    categoryName: 'Drama',
    status: CompetitionStatus.Announced,
    date: '2025-08-10',
    startTime: '2025-08-10T12:00:00',
    endTime: '2025-08-10T12:30:00',
    judge1Id: '204',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge Four',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: true,
    judge3Submitted: true,
    resultNumber: 6,
  },
  {
    id: 7,
    itemCode: 107,
    name: 'Poetry Recital',
    stageId: '2',
    stageName: 'Open Arena',
    stageType: 'Non Stage',
    categoryId: '1',
    categoryName: 'Music',
    status: CompetitionStatus.PrizeDistributed,
    date: '2025-08-10',
    startTime: '2025-08-10T13:00:00',
    endTime: '2025-08-10T13:30:00',
    judge1Id: '201',
    judge2Id: '202',
    judge3Id: '203',
    judge1Name: 'Judge One',
    judge2Name: 'Judge Two',
    judge3Name: 'Judge Three',
    judge1Submitted: true,
    judge2Submitted: true,
    judge3Submitted: true,
    resultNumber: 7,
  },
]

const competitionParticipants = (itemCode?: number) => {
  const base = [
    {
      chestNumber: 1001,
      name: 'Asha',
      teamName: 'Team A',
      codeLetter: 'A',
      status: ParticipantStatus.Enrolled,
    },
    {
      chestNumber: 1002,
      name: 'Rahul',
      teamName: 'Team B',
      codeLetter: 'B',
      status: ParticipantStatus.NotEnrolled,
    },
    {
      chestNumber: 1003,
      name: 'Nisha',
      teamName: 'Team C',
      codeLetter: 'C',
      status: ParticipantStatus.Enrolled,
    },
  ]

  if (!itemCode) return base
  if (itemCode === 103) {
    return base.map((p) => ({ ...p, codeLetter: '', status: '' }))
  }
  return base
}

const pickPage = <T,>(items: T[], page: number, limit: number) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : items.length
  const start = (safePage - 1) * safeLimit
  return items.slice(start, start + safeLimit)
}

const respond = async (body: any): Promise<ApiResponse<any>> => {
  if (MOCK_DELAY_MS > 0) {
    await sleep(MOCK_DELAY_MS)
  }
  return { data: body }
}

const normalizeParams = (params: Params) => {
  const page = params?.page ? Number(params.page) : 1
  const limit = params?.limit ? Number(params.limit) : 24
  return { ...params, page, limit }
}

const filterCompetitions = (params: Params) => {
  const { status, stageId, categoryId } = params
  return competitions.filter((c) => {
    if (status && status !== 'all' && c.status !== status) return false
    if (stageId && stageId !== 'all' && c.stageId !== String(stageId))
      return false
    if (categoryId && categoryId !== 'all' && c.categoryId !== String(categoryId))
      return false
    return true
  })
}

export const mockApi: ApiClient = {
  get: async <T = unknown>(
    url: string,
    config?: { params?: Record<string, any> },
  ): Promise<ApiResponse<T>> => {
    const params = normalizeParams(config?.params ?? {})

    if (url === '/admin') {
      return respond({
        data: {
          categories,
          stages,
          teams,
        },
      })
    }

    if (url === '/admin/overview') {
      return respond({
        data: {
          countByStatus: [
            { status: CompetitionStatus.NotStarted, count: 4 },
            { status: CompetitionStatus.InProgress, count: 2 },
            { status: CompetitionStatus.Completed, count: 1 },
          ],
        },
      })
    }

    if (url === '/admin/judges') {
      return respond({ data: judges })
    }

    if (url === '/admin/food') {
      return respond({
        data: [
          { hourSlot: '18:00-19:00', type: 'Dinner', count: 0 },
          { hourSlot: '19:00-20:00', type: 'Dinner', count: 0 },
        ],
      })
    }

    if (url === '/admin/participants') {
      const items = [
        {
          chestNumber: 1001,
          name: 'Asha',
          categoryName: 'Music',
          teamName: 'Team A',
          competitions: [
            {
              itemName: 'Solo Song',
              codeLetter: 'A',
              participantStatus: ParticipantStatus.Enrolled,
              status: CompetitionStatus.InProgress,
              rank: 1,
            },
            {
              itemName: 'Group Dance',
              codeLetter: 'B',
              participantStatus: ParticipantStatus.NotEnrolled,
              status: CompetitionStatus.Completed,
              rank: 0,
            },
          ],
          totalCount: 2,
        },
        {
          chestNumber: 1002,
          name: 'Rahul',
          categoryName: 'Dance',
          teamName: 'Team B',
          competitions: [
            {
              itemName: 'Group Dance',
              codeLetter: 'C',
              participantStatus: ParticipantStatus.Enrolled,
              status: CompetitionStatus.Completed,
              rank: 2,
            },
          ],
          totalCount: 2,
        },
      ]

      return respond({ data: pickPage(items, params.page, params.limit) })
    }

    if (url === '/admin/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          id: c.id,
          itemCode: c.itemCode,
          name: c.name,
          stageName: c.stageName,
          categoryName: c.categoryName,
          status: c.status,
          participants: competitionParticipants(c.itemCode).map((p, idx) => ({
            name: p.name,
            chestNumber: String(p.chestNumber),
            status: p.status,
            rank: idx + 1,
          })),
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
          judge1Name: c.judge1Name,
          judge2Name: c.judge2Name,
          judge3Name: c.judge3Name,
          judge1Id: c.judge1Id,
          judge2Id: c.judge2Id,
          judge3Id: c.judge3Id,
        })),
      })
    }

    if (url === '/stageManagement') {
      const stageName =
        stages.find((s) => s.number === String(params.stageId))?.name ??
        'Stage'
      return respond({
        data: {
          stageName,
          categories,
        },
      })
    }

    if (url === '/stageManagement/competitions') {
      const filtered = filterCompetitions(params).filter(
        (c) => c.stageId === String(params.stageId),
      )
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          itemCode: c.itemCode,
          name: c.name,
          stageType: c.stageType,
          categoryName: c.categoryName,
          status: c.status,
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
          judge1Name: c.judge1Name,
          judge2Name: c.judge2Name,
          judge3Name: c.judge3Name,
          judge1Submitted: c.judge1Submitted,
          judge2Submitted: c.judge2Submitted,
          judge3Submitted: c.judge3Submitted,
        })),
      })
    }

    if (/^\/stageManagement\/competitions\/\d+$/.test(url)) {
      const itemId = Number(url.split('/').pop())
      return respond({
        data: {
          participants: competitionParticipants(itemId),
        },
      })
    }

    if (url === '/offstageManagement') {
      return respond({
        data: {
          stages: stages.map(({ number, name }) => ({ number, name })),
          categories,
        },
      })
    }

    if (url === '/offstageManagement/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          itemCode: c.itemCode,
          name: c.name,
          categoryName: c.categoryName,
          status: c.status,
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
          judge1Name: c.judge1Name,
          judge2Name: c.judge2Name,
          judge3Name: c.judge3Name,
          judge1Submitted: c.judge1Submitted,
          judge2Submitted: c.judge2Submitted,
          judge3Submitted: c.judge3Submitted,
        })),
      })
    }

    if (/^\/offstageManagement\/competitions\/\d+$/.test(url)) {
      const itemId = Number(url.split('/').pop())
      return respond({
        data: {
          participants: competitionParticipants(itemId),
        },
      })
    }

    if (url === '/announceManagement') {
      return respond({
        data: {
          stages: stages.map(({ number, name }) => ({ number, name })),
          categories: categories.map((c) => ({
            name: c.name,
            number: String(c.number),
          })),
        },
      })
    }

    if (url === '/announceManagement/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          itemCode: c.itemCode,
          stageName: c.stageName,
          name: c.name,
          categoryName: c.categoryName,
          status: c.status,
          totalCount,
          resultNumber: c.resultNumber,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      })
    }

    if (/^\/announceManagement\/competitions\/\d+$/.test(url)) {
      const itemId = Number(url.split('/').pop())
      const parts = competitionParticipants(itemId)
      return respond({
        data: {
          participants: parts.map((p, idx) => ({
            chestNumber: p.chestNumber,
            name: p.name,
            teamName: p.teamName,
            codeLetter: p.codeLetter,
            categoryName: categories[0]?.name ?? 'Category',
            grade: idx === 0 ? 'A' : idx === 1 ? 'B' : 'C',
            rank: idx + 1,
            totalPoint: 10 - idx,
          })),
        },
      })
    }

    if (url === '/mediaManagement') {
      return respond({
        data: {
          stages: stages.map(({ number, name }) => ({ number, name })),
          categories: categories.map((c) => ({
            name: c.name,
            number: String(c.number),
          })),
        },
      })
    }

    if (url === '/mediaManagement/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          itemCode: c.itemCode,
          stageName: c.stageName,
          name: c.name,
          categoryName: c.categoryName,
          status: c.status,
          resultNumber: c.resultNumber,
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      })
    }

    if (/^\/mediaManagement\/competitions\/\d+$/.test(url)) {
      const itemId = Number(url.split('/').pop())
      const parts = competitionParticipants(itemId)
      return respond({
        data: {
          participants: parts.map((p, idx) => ({
            chestNumber: p.chestNumber,
            name: p.name,
            teamName: p.teamName,
            codeLetter: p.codeLetter,
            categoryName: categories[0]?.name ?? 'Category',
            grade: idx === 0 ? 'A' : idx === 1 ? 'B' : 'C',
            rank: idx + 1,
            totalPoint: 10 - idx,
          })),
        },
      })
    }

    if (url === '/mediaControl/teamPoints') {
      return respond({
        data: teams.map((t, idx) => ({
          rank: idx + 1,
          teamName: t.name,
          normalCount: 0,
          normalPoints: 0,
          campusCount: 0,
          campusPoints: 0,
          totalPoints: 0,
        })),
      })
    }

    if (url === '/prizeManagement/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          itemCode: c.itemCode,
          stageName: c.stageName,
          name: c.name,
          categoryName: c.categoryName,
          status: c.status,
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      })
    }

    if (/^\/prizeManagement\/competitions\/\d+$/.test(url)) {
      const itemId = Number(url.split('/').pop())
      const parts = competitionParticipants(itemId)
      return respond({
        data: {
          participants: parts.map((p, idx) => ({
            chestNumber: p.chestNumber,
            name: p.name,
            teamName: p.teamName,
            codeLetter: p.codeLetter,
            grade: idx === 0 ? 'A' : idx === 1 ? 'B' : 'C',
            rank: idx + 1,
            momentoDistributed: idx === 0,
            cashDistributed: idx === 0,
          })),
        },
      })
    }

    if (url === '/teamManagement') {
      const teamName =
        teams.find((t) => t.number === String(params.teamId))?.name ?? 'Team'
      return respond({
        data: {
          teamName,
          stages,
          categories: categories.map((c) => ({
            name: c.name,
            number: String(c.number),
          })),
        },
      })
    }

    if (url === '/teamManagement/competitions') {
      const filtered = filterCompetitions(params)
      const totalCount = filtered.length
      const pageItems = pickPage(filtered, params.page, params.limit)
      return respond({
        data: pageItems.map((c) => ({
          id: c.id,
          name: c.name,
          stageName: c.stageName,
          categoryName: c.categoryName,
          status: c.status,
          participants: competitionParticipants(c.itemCode).map((p, idx) => ({
            name: p.name,
            chestNumber: String(p.chestNumber),
            codeLetter: p.codeLetter,
            status: p.status,
            rank: idx + 1,
          })),
          totalCount,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      })
    }

    if (url === '/teamManagement/participants') {
      const items = [
        {
          chestNumber: 1001,
          name: 'Asha',
          categoryName: 'Music',
          competitions: [
            {
              itemName: 'Solo Song',
              participantStatus: ParticipantStatus.Enrolled,
              codeLetter: 'A',
              status: CompetitionStatus.InProgress,
              rank: 1,
            },
          ],
          totalCount: 1,
        },
      ]
      return respond({ data: pickPage(items, params.page, params.limit) })
    }

    if (url === '/teamManagement/foodStats') {
      const items = [
        { chestNumber: 1001, name: 'Asha', categoryName: 'Music', status: 0 },
        { chestNumber: 1002, name: 'Rahul', categoryName: 'Dance', status: 0 },
      ]
      return respond({ data: pickPage(items, params.page, params.limit) })
    }

    if (url === '/judgeLinks') {
      return respond({
        data: {
          categories: categories.map((c) => ({
            name: c.name,
            number: String(c.number),
          })),
        },
      })
    }

    if (url === '/judgeLinks/competitions') {
      const filtered = filterCompetitions(params)
      const baseUrl = window.location.origin
      return respond({
        data: filtered.map((c) => ({
          id: c.id,
          itemCode: c.itemCode,
          name: c.name,
          status: c.status,
          date: c.date,
          startTime: c.startTime,
          endTime: c.endTime,
          Judge1Link: `${baseUrl}/judgement?eventId=${encodeURIComponent(
            String(params.eventId ?? ''),
          )}&itemId=${c.itemCode}&judgeId=${c.judge1Id}`,
          Judge2Link: `${baseUrl}/judgement?eventId=${encodeURIComponent(
            String(params.eventId ?? ''),
          )}&itemId=${c.itemCode}&judgeId=${c.judge2Id}`,
          Judge3Link: `${baseUrl}/judgement?eventId=${encodeURIComponent(
            String(params.eventId ?? ''),
          )}&itemId=${c.itemCode}&judgeId=${c.judge3Id}`,
          judge1Id: Number(c.judge1Id),
          judge2Id: Number(c.judge2Id),
          judge3Id: Number(c.judge3Id),
          judge1Name: c.judge1Name,
          judge2Name: c.judge2Name,
          judge3Name: c.judge3Name,
        })),
      })
    }

    if (url === '/judgement') {
      const item =
        competitions.find((c) => String(c.itemCode) === String(params.itemId)) ??
        competitions[0]
      const judge =
        judges.find((j) => String(j.id) === String(params.judgeId)) ?? judges[0]
      return respond({
        data: {
          judgeName: judge?.name ?? 'Judge',
          itemName: item?.name ?? 'Competition',
          categoryName: item?.categoryName ?? 'Category',
          competitionStatus: CompetitionStatus.InProgress,
          scores: competitionParticipants(item?.itemCode).map((p, idx) => ({
            codeLetter: p.codeLetter || String.fromCharCode(65 + idx),
            mark: 10 - idx,
          })),
          notes: 'Mock mode: marks are not saved.',
          judgeSubmitted: false,
        },
      })
    }

    console.warn('[mockApi] Unhandled GET', url, params)
    return respond({ data: null })
  },

  post: async <T = unknown>(
    url: string,
    body?: any,
    _config?: Record<string, any>,
  ): Promise<ApiResponse<T>> => {
    const ok = (msg = 'OK (mock)') => respond({ msg })

    if (url === '/foodManagement/checkIn') {
      return respond({
        msg: `Checked in (mock) for #${body?.chestNumber ?? ''}`,
      })
    }

    if (
      [
        '/admin/updateCompetition',
        '/stageManagement/updateCompetitionParticipant',
        '/stageManagement/updateCompetitionStatus',
        '/offstageManagement/updateCompetitionStatus',
        '/mediaManagement/updateCompetitionStatus',
        '/announceManagement/updateCompetitionStatus',
        '/prizeManagement/updateCompetitionStatus',
        '/prizeManagement/updatePrizeDistribution',
        '/judgement/updateMark',
        '/judgement/submit',
      ].includes(url)
    ) {
      return ok()
    }

    console.warn('[mockApi] Unhandled POST', url, body)
    return ok()
  },
}
