import React, { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import useJudgeLinkSummary from '@/routes/j23dgdfge-linfh34/-hooks/useJudgeLinkSummary'
import useJudgeLinkCompetitions from '@/routes/j23dgdfge-linfh34/-hooks/useJudgeLinkCompetitions'
import LoadingSpinner from '@/components/LoadingSpinner'
import useUrlState from '@/hooks/useUrlState'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'



export const Route = createFileRoute('/j23dgdfge-linfh34/')({
  component: JudgeLinkPage,
  validateSearch: (search: Record<string, unknown>): { eventId: string } => ({
    eventId: search.eventId as string,
  }),
})

function JudgeLinkPage() {
  const { eventId } = Route.useSearch()
  const { data, isLoading } = useJudgeLinkSummary({ eventId })
  const [categoryId, setCategoryId] = useUrlState('categoryId', 'all')
  const [competitionId, setCompetitionId] = useUrlState('competitionId', '')

  const { data: competitions, isLoading: loadingCompetitions } =
    useJudgeLinkCompetitions({ eventId, categoryId })

  const selectedCompetition = competitions?.find(
    (comp) => String(comp.id) === competitionId
  )

  const judges =
    selectedCompetition
      ? [
          {
            name: selectedCompetition.judge1Name,
            link: selectedCompetition.Judge1Link,
          },
          {
            name: selectedCompetition.judge2Name,
            link: selectedCompetition.Judge2Link,
          },
          {
            name: selectedCompetition.judge3Name,
            link: selectedCompetition.Judge3Link,
          },
        ].filter((j) => j.link)
      : []

  if (isLoading) {
    return (
      <div className="h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  if (!data) return 'No data found'

  return (
    <div className="space-y-4 px-4 pb-4">
      {/* Banner */}
      <div
        className="flex flex-col gap-4 justify-center items-center pt-8 md:pt-12 -mx-4"
        style={{
          background: 'linear-gradient(to bottom, #f8ebc8 0%, #fff 100%)',
        }}
      >
        <div className="w-full max-w-200 px-6">
          <img
            src="/sahityotsav-banner.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-3 mt-2 border-t pt-3 text-center sm:text-left">
          <div className="text-3xl font-semibold font-heading text-gray-500">
            Judge QR Codes
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
          {/* Category Filter */}
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setCompetitionId('')
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">--</SelectItem>
              {data.categories.map((category) => (
                <SelectItem
                  key={category.number}
                  value={`${category.number}`}
                  className="uppercase"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Competition Filter */}
          <Select
            value={competitionId}
            onValueChange={(value) => setCompetitionId(value)}
            disabled={loadingCompetitions || !competitions?.length}
          >
            <SelectTrigger className="w-full sm:w-[250px] bg-white">
              <SelectValue placeholder="Select competition" />
            </SelectTrigger>
            <SelectContent>
              {competitions?.map((competition) => (
                <SelectItem key={competition.id} value={`${competition.id}`}>
                  {competition.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Judges Carousel */}
      {judges.length > 0 && (
        <div className="max-w-md mx-auto mt-6">
          <Carousel>
            <CarouselContent>
              {judges.map((judge, index) => (
                <CarouselItem key={index}>
                  <Card className="flex flex-col items-center p-4">
                    <div className="font-semibold text-lg mb-3">
                      {judge.name}
                    </div>
                    <CardContent className="flex flex-col items-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          judge.link
                        )}`}
                        alt={`QR Code for ${judge.name}`}
                        className="p-2 bg-white rounded border border-gray-200"
                      />
                      <a
                        href={judge.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-blue-500 underline"
                      >
                        Open Link
                      </a>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  )
}