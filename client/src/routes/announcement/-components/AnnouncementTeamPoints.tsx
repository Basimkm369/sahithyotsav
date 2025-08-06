import { Card } from '@/components/ui/card'
import useAnnouncementTeamPoints, { TeamPoint } from '../-hooks/useAnnouncementTeamPoints'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Skeleton } from '@/components/ui/skeleton'
import { Route } from '..'

export default function AnnouncementTeamPoints() {

    const { eventId } = Route.useSearch()
    const { data, isLoading, error } = useAnnouncementTeamPoints({
        eventId,
    })


    if (!isLoading && error) return `Error: ${error}`
    if (!isLoading && !data) return 'No data found'


    return (
        <>
            <div className="grid gap-4">

                <Card className="py-0 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white">
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Team Name</TableHead>
                                <TableHead>Normal Count</TableHead>
                                <TableHead>Normal Points</TableHead>
                                <TableHead>Campus Count</TableHead>
                                <TableHead>Campus Points</TableHead>
                                <TableHead>Total Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 30 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className="flex gap-2 items-center">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-4 w-10" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 flex-wrap">
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xl flex gap-1">
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : data?.map((team) => (
                                    <TableRow
                                        key={team.teamName}
                                    >
                                        <TableCell>
                                            {team.rank}
                                        </TableCell>
                                        <TableCell>
                                            {team.teamName}
                                        </TableCell>
                                        <TableCell>
                                            {team.normalCount}
                                        </TableCell>
                                        <TableCell>
                                            {team.normalPoints}
                                        </TableCell>
                                        <TableCell>
                                            {team.campusCount}
                                        </TableCell>
                                        <TableCell>
                                            {team.campusPoints}
                                        </TableCell>
                                        <TableCell>
                                            {team.totalPoints}
                                        </TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Card>

            </div>

        </>
    )
}
