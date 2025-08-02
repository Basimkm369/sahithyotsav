import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IoEyeOutline } from 'react-icons/io5'
import { useCompetitions } from '@/hooks/useCompetitions'
import { parseJSON } from '@/lib/utils'
import { useTeamManagementSummary } from '@/hooks/useTeamManagementSummary'
import CompetitionsTab from './-components/CompetitionsTab'

interface Competition {
  itemname: string
  categoryname: string
  stage: string
  status: string
  participants: string // This is a JSON string that needs to be parsed
}

interface Participant {
  participant: string
  chestno: number
  status?: string
}

export const Route = createFileRoute('/team-management/')({
  component: TeamManagementPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): { eventId: string; teamId: string } => {
    return {
      eventId: search.eventId as string,
      teamId: search.teamId as string,
    }
  },
})

function TeamManagementPage() {
  const { data, isLoading } = useTeamManagementSummary()

  if (isLoading) return 'Loading...'
  if (!data) return 'No data found'

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Team: {data.teamName}</h2>

      <Card className="shadow-xl">
        <CardContent>
          <Tabs defaultValue="competitions">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="competitions">
              <CompetitionsTab
                categories={data.categories}
                stages={data.stages}
              />
            </TabsContent>

            {/* <TabsContent value="participants">
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
                    {competitions.flatMap((comp) =>
                      parseJSON(comp.participants).map((participant, idx) => (
                        <TableRow key={`${participant.chestno}-${idx}`}>
                          <TableCell>{participant.participant}</TableCell>
                          <TableCell>{participant.chestno}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedParticipant(participant)
                              }
                            >
                              <IoEyeOutline className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
// <Dialog
//     open={!!selectedCompetition}
//     onOpenChange={() => setSelectedCompetition(null)}
//   >
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>
//           {selectedCompetition?.itemname} -{' '}
//           {selectedCompetition?.categoryname}
//         </DialogTitle>
//       </DialogHeader>

//       <div className="grid gap-3 mt-4">
//         {selectedCompetition &&
//           parseParticipants(selectedCompetition.participants).map(
//             (participant, idx) => (
//               <Card key={idx} className="p-3">
//                 <div className="font-medium">{participant.participant}</div>
//                 <div className="text-sm text-gray-600">
//                   Chest #: {participant.chestno}
//                 </div>
//                 {participant.status && (
//                   <div className="text-sm text-gray-600">
//                     Status: {participant.status}
//                   </div>
//                 )}
//               </Card>
//             ),
//           )}
//       </div>
//     </DialogContent>
//   </Dialog>

//   {/* Participant Competitions Modal */}
//   <Dialog
//     open={!!selectedParticipant}
//     onOpenChange={() => setSelectedParticipant(null)}
//   >
//     <DialogContent>
//       <DialogHeader>
//         <DialogTitle>
//           {selectedParticipant?.participant} – Chest #
//           {selectedParticipant?.chestno}
//         </DialogTitle>
//       </DialogHeader>

//       <div className="mt-4 space-y-2">
//         {competitions
//           .filter((comp) =>
//             parseParticipants(comp.participants).some(
//               (p) => p.chestno === selectedParticipant?.chestno,
//             ),
//           )
//           .map((comp, idx) => (
//             <Card key={idx} className="p-3">
//               <div className="font-medium">{comp.itemname}</div>
//               <div className="text-sm text-gray-600">
//                 Category: {comp.categoryname}
//               </div>
//               <div className="text-sm text-gray-600">
//                 Status: {getStatusDisplay(comp.status)}
//               </div>
//               <div className="text-sm text-gray-600">
//                 Stage: {comp.stage}
//               </div>
//             </Card>
//           ))}
//       </div>
//     </DialogContent>
//   </Dialog>
