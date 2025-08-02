import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IoEyeOutline } from "react-icons/io5";

// import { useCompetitions } from '@/hooks/useCompetitions'
// import { useCompetitionsSummary } from '@/hooks/useCompetitionsSummary'

export const Route = createFileRoute('/team-manager/')({
    component: TeamManagerPage,
})

function TeamManagerPage() {
    const teamName = 'Kannur'

    const [tab, setTab] = useState('competitions')
    const [status, setStatus] = useState('all')
    const [stage, setStage] = useState('all')
    const [selectedCompetition, setSelectedCompetition] = useState<any | null>(null)
    const [page, setPage] = useState(1)
    const pageSize = 5

    const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null)


    // const { data: competitions = [], isLoading } = useCompetitions(status, stage)


    // const { data: summary = [], isLoading } = useCompetitionsSummary()

    const competitions = [
        {
            id: 1,
            name: 'Mappilappatu',
            stage: '1',
            category: 'High School',
            status: 'Completed',
            participants: [
                { name: 'Ahmed', chestNumber: '1011' },
                { name: 'Jabir', chestNumber: '1023' },
            ],
        },
        {
            id: 2,
            name: 'Eloucution Malayalam',
            stage: '2',
            category: 'Senior',
            status: 'In Progress',
            participants: [
                { name: 'Safwan', chestNumber: '3434' },
                { name: 'Jazir', chestNumber: '3224' },
            ],
        },
    ]

    const filtered = competitions.filter((c) => {
        const statusMatch = status === 'all' || c.status.toLowerCase() === status
        const stageMatch = stage === 'all' || c.stage.toLowerCase() === stage
        return statusMatch && stageMatch
    })

    const allParticipants = competitions.flatMap((comp) =>
        comp.participants.map((p) => ({ ...p, competition: comp.name, status: comp.status }))
    )


    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Team: {teamName}</h2>

            <Card className="shadow-xl">
                {/* <CardHeader>
          <CardTitle className="text-lg">Competitions</CardTitle>
        </CardHeader> */}
                <CardContent>
                    <Tabs value={tab} onValueChange={setTab}>
                        <div className="flex justify-center">
                            <TabsList>
                                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                                <TabsTrigger value="participants">Participants</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="competitions">
                            <div className="grid gap-4 my-4">
                                <div className="flex flex-col md:flex-row gap-6 items-center">

                                    {/* Stage Filter */}
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        <Label htmlFor="stage" className="w-[80px]">Stage</Label>
                                        <Select value={stage} onValueChange={setStage}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Select stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="1">Stage 1</SelectItem>
                                                <SelectItem value="2">Stage 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="flex flex-col md:flex-row gap-4 items-center">
                                        <Label htmlFor="status" className="w-[80px]">Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="ongoing">In Progress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>


                                </div>

                                {/* {isLoading ? (
                                    <div className="text-center py-4">Loading summary...</div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {summary.map((item) => (
                                            <div
                                                key={item.stage}
                                                className="p-4 rounded-xl shadow border bg-white text-center"
                                            >
                                                <div className="text-lg font-semibold">{item.stage}</div>
                                                <div className="text-2xl font-bold text-primary">{item.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                )} */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filtered.map((comp) => (
                                        <Card key={comp.id} className="p-4">
                                            <div className="font-semibold text-lg">{comp.name}</div>
                                            <div className="text-sm text-gray-600">
                                                Stage: {comp.stage}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Category: {comp.category}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Status: {comp.status}
                                            </div>
                                            <Button
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => setSelectedCompetition(comp)}
                                            >
                                                View Participants
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="participants">
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Chest Number</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allParticipants
                                            .slice((page - 1) * pageSize, page * pageSize)
                                            .map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{p.chestNumber}</TableCell>
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="icon" variant="ghost" onClick={() => setSelectedParticipant(p)}>
                                                            <IoEyeOutline />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                        Prev
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= allParticipants.length}>
                                        Next
                                    </Button>
                                </div>
                            </div>

                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={!!selectedCompetition} onOpenChange={() => setSelectedCompetition(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCompetition?.name} - {selectedCompetition?.category}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3 mt-4">
                        {selectedCompetition?.participants.map((p: any, idx: number) => (
                            <Card key={idx} className="p-3">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-gray-600">Chest #: {p.chestNumber}</div>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedParticipant} onOpenChange={() => setSelectedParticipant(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedParticipant?.name} – Chest #{selectedParticipant?.chestNumber}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-2">
                        {competitions
                            .filter(c => c.participants.some(p => p.chestNumber === selectedParticipant?.chestNumber))
                            .map((comp, idx) => (
                                <Card key={idx} className="p-3">
                                    <div className="font-medium">{comp.name}</div>
                                    <div className="text-sm text-gray-600">Category: {comp.category}</div>
                                    <div className="text-sm text-gray-600">Status: {comp.status}</div>
                                </Card>
                            ))}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
