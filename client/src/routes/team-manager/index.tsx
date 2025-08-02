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
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IoEyeOutline } from "react-icons/io5"
import { useCompetitions } from '@/hooks/useCompetitions'

interface Competition {
    itemname: string;
    categoryname: string;
    stage: string;
    status: string;
    participants: string; // This is a JSON string that needs to be parsed
}

interface Participant {
    participant: string;
    chestno: number;
    status?: string;
}

export const Route = createFileRoute('/team-manager/')({
    component: TeamManagerPage,
    validateSearch: (search: Record<string, unknown>): { eventId?: string; teamId?: string } => {
        return {
            eventId: search.eventId as string | undefined,
            teamId: search.teamId as string | undefined
        }
    }
})

function TeamManagerPage() {
    const teamName = 'Kannur'

    const [tab, setTab] = useState('competitions')
    const [status, setStatus] = useState('all')
    const [stageId, setStageId] = useState('all')
    const [categoryId, setCategoryId] = useState('all')
    const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
    const [page, setPage] = useState(1)
    const limit = 10

    const { data: apiResponse = { data: [] }, isLoading, isPreviousData, isError } = useCompetitions(status, stageId, categoryId,page,limit)
    const competitions: Competition[] = apiResponse.data || []

    const parseParticipants = (participantsString: string): Participant[] => {
        try {
            return JSON.parse(participantsString)
        } catch (error) {
            console.error('Error parsing participants:', error)
            return []
        }
    }

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'S': return 'Scheduled'
            case 'F': return 'Finished'
            case 'N': return 'Not Started'
            case 'M': return 'In Progress'
            default: return status
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Team: {teamName}</h2>

            <Card className="shadow-xl">
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
                                <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center">
                                    {/* Stage Filter */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Label htmlFor="stageId" className="w-[60px] text-right">Stage</Label>
                                        <Select 
                                            value={stageId} 
                                            onValueChange={(value) => {
                                                setStageId(value)
                                                setPage(1)
                                            }}
                                        >
                                            <SelectTrigger className="w-[160px] sm:w-[200px]">
                                                <SelectValue placeholder="Select stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="1">Stage 1</SelectItem>
                                                <SelectItem value="2">Stage 2</SelectItem>
                                                <SelectItem value="3">Stage 3</SelectItem>
                                                <SelectItem value="4">Stage 4</SelectItem>
                                                <SelectItem value="5">Stage 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Label htmlFor="status" className="w-[60px] text-right">Status</Label>
                                        <Select 
                                            value={status} 
                                            onValueChange={(value) => {
                                                setStatus(value)
                                                setPage(1)
                                            }}
                                        >
                                            <SelectTrigger className="w-[160px] sm:w-[200px]">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="S">S</SelectItem>
                                                <SelectItem value="F">F</SelectItem>
                                                <SelectItem value="N">N</SelectItem>
                                                <SelectItem value="M">M</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Category Filter */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Label htmlFor="categoryId" className="w-[60px] text-right">Category</Label>
                                        <Select 
                                            value={categoryId} 
                                            onValueChange={(value) => {
                                                setCategoryId(value)
                                                setPage(1)
                                            }}
                                        >
                                            <SelectTrigger className="w-[160px] sm:w-[200px]">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="1">Junior</SelectItem>
                                                <SelectItem value="2">Senior</SelectItem>
                                                <SelectItem value="HIGH SCHOOL">High School</SelectItem>
                                                <SelectItem value="HIGHER SEC">Higher Secondary</SelectItem>
                                                <SelectItem value="LOWER PRIMARY">Lower Primary</SelectItem>
                                                <SelectItem value="CAMPUS BOYS">Campus Boys</SelectItem>
                                                <SelectItem value="GENERAL">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {isError && <p className="text-red-500 text-center">Failed to load competitions.</p>}

                                {isLoading || isPreviousData ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <Card key={i} className="p-4 space-y-3">
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-8 w-24 mt-2" />
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {competitions.map((comp) => (
                                            <Card key={`${comp.itemname}-${comp.categoryname}`} className="p-4">
                                                <div className="font-semibold text-lg">{comp.itemname}</div>
                                                <div className="text-sm text-gray-600">
                                                    Stage: {comp.stage}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Category: {comp.categoryname}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Status: {getStatusDisplay(comp.status)}
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
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="participants">
                            <div className="space-y-4">
                               
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Participant</TableHead>
                                            <TableHead>Chest No</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {competitions.flatMap(comp => 
                                            parseParticipants(comp.participants).map((participant, idx) => (
                                                <TableRow key={`${participant.chestno}-${idx}`}>
                                                    <TableCell>{participant.participant}</TableCell>
                                                    <TableCell>{participant.chestno}</TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => setSelectedParticipant(participant)}
                                                        >
                                                            <IoEyeOutline className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

         
            <Dialog open={!!selectedCompetition} onOpenChange={() => setSelectedCompetition(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCompetition?.itemname} - {selectedCompetition?.categoryname}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3 mt-4">
                        {selectedCompetition && parseParticipants(selectedCompetition.participants).map((participant, idx) => (
                            <Card key={idx} className="p-3">
                                <div className="font-medium">{participant.participant}</div>
                                <div className="text-sm text-gray-600">Chest #: {participant.chestno}</div>
                                {participant.status && (
                                    <div className="text-sm text-gray-600">Status: {participant.status}</div>
                                )}
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Participant Competitions Modal */}
            <Dialog open={!!selectedParticipant} onOpenChange={() => setSelectedParticipant(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedParticipant?.participant} – Chest #{selectedParticipant?.chestno}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-2">
                        {competitions
                            .filter(comp => 
                                parseParticipants(comp.participants).some(
                                    p => p.chestno === selectedParticipant?.chestno
                                )
                            )
                            .map((comp, idx) => (
                                <Card key={idx} className="p-3">
                                    <div className="font-medium">{comp.itemname}</div>
                                    <div className="text-sm text-gray-600">Category: {comp.categoryname}</div>
                                    <div className="text-sm text-gray-600">Status: {getStatusDisplay(comp.status)}</div>
                                    <div className="text-sm text-gray-600">Stage: {comp.stage}</div>
                                </Card>
                            ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}