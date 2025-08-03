import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Participant, useParticipants } from '@/hooks/useParticipants'
import { TeamManagementSummary } from '@/hooks/useTeamManagementSummary'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IoEyeOutline } from "react-icons/io5";

const ITEMS_PER_PAGE = 30;
export default function ParticipantsTab({
    categories
}: {
    categories: TeamManagementSummary['categories']
}) {

    const [categoryId, setCategoryId] = useState('all')

    const [page, setPage] = useState(1)

    const { data, isFetching, error } = useParticipants({
        categoryId,
        page,
        limit: ITEMS_PER_PAGE,
    })

    const [selectedParticipant, setSelectedParticipant] = useState<Participant>()

    if (isFetching) return 'Loading...'
    if (!data) return 'No data found'
    if (error) return `Error: ${error}`
    const totalPages = data?.[0]?.totalCount ? Math.ceil(data[0].totalCount / ITEMS_PER_PAGE) : 1;

    return (
        <>
            <div className="grid gap-4 my-4">
                <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center">

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Label htmlFor="categoryId" className="w-[60px] text-right">
                            Category
                        </Label>
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
                                {categories.map((category) => (
                                    <SelectItem value={category.number}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Chest #</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((partic) => (
                                <TableRow key={partic.id}>
                                    <TableCell>{partic.name}</TableCell>
                                    <TableCell>{partic.chestNumber}</TableCell>
                                    <TableCell>{partic.categoryName}</TableCell>
                                    <TableCell className="text-center">
                                        <button
                                            onClick={() => setSelectedParticipant(partic)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="View Details"
                                        >
                                            <IoEyeOutline />
                                        </button>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="w-full flex justify-center mt-4">
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                    />
                                </PaginationItem>

                                <PaginationItem className="px-4 flex items-center">
                                    Page {page} of {totalPages}
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={page === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
            <Dialog
                open={!!selectedParticipant}
                onOpenChange={() => setSelectedParticipant(undefined)}
            >
                {!!selectedParticipant && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedParticipant!.name} -{' '}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3 mt-4">
                            {selectedParticipant!.competitions.map((competition, idx) => (
                                <Card key={idx} className="p-3">
                                    <div className="font-medium">{competition.itemName}</div>
                                    <div className="text-sm text-gray-600">
                                        Status:  {getCompetitionStatusBadge(competition.competitionStatus)}
                                    </div>

                                </Card>
                            ))}
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    )
}
export const getCompetitionStatusBadge = (status: string) => {
    switch (status) {
        case 'N':
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                >
                    Not Started
                </Badge>
            );
        case 'S':
            return (
                <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                >
                    Started
                </Badge>
            );
        case 'P':
            return (
                <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                    In Progress
                </Badge>
            );
        case 'C':
        case 'M': // Mark Entry Closed
        case 'F': // Finalized
        case 'O': // Media Completed
            return (
                <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                >
                    Completed
                </Badge>
            );
        case 'A':
            return (
                <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                >
                    Announced
                </Badge>
            );
        case 'D':
            return (
                <Badge
                    variant="outline"
                    className="bg-teal-100 text-teal-800 border-teal-200"
                >
                    Prize Distributed
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                    {status}
                </Badge>
            );
    }
};

