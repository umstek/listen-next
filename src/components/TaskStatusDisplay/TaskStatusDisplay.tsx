import { Pause, X } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Badge } from ':ui/badge'
import { Button } from ':ui/button'
import { Progress } from ':ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ':ui/tooltip'
import { Box } from ':layout/Box'
import { Flex } from ':layout/Flex'

type BadgeColor = 'default' | 'secondary' | 'destructive' | 'outline'

const statuses = [
  'pending',
  'in-progress',
  'paused',
  'failed',
  'success',
] as const

const statusToColor: Record<(typeof statuses)[number], BadgeColor> = {
  pending: 'secondary',
  'in-progress': 'default',
  paused: 'outline',
  failed: 'destructive',
  success: 'default',
}

export interface TaskStatusDefinition {
  id: string
  display: ReactNode
  partsCount: number
  partsDone: number
  status: (typeof statuses)[number]
}

interface TaskStatusDisplayProps extends TaskStatusDefinition {
  onPause?: () => void
  onAbort?: () => void
}

export function TaskStatusDisplay({
  id,
  display,
  partsCount,
  partsDone,
  status,
  onPause,
  onAbort,
}: TaskStatusDisplayProps) {
  const progress =
    partsCount > 0 ? Math.floor((partsDone / partsCount) * 100) : 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Box className="w-max">
            <Flex direction="column" gap="2">
              <Flex gap="1">
                <Box>
                  <small>{display}</small>
                </Box>
                <Badge className="rounded-full" variant={statusToColor[status]}>
                  {status}
                </Badge>
                {onPause && (
                  <Button size="sm" className="rounded-full" variant="ghost" onClick={onPause}>
                    <Pause className="py-1" />
                  </Button>
                )}
                {onAbort && (
                  <Button size="sm" className="rounded-full" variant="ghost" onClick={onAbort}>
                    <X className="py-1" />
                  </Button>
                )}
              </Flex>

              <Progress value={progress} className="w-full" />
            </Flex>
          </Box>
        </TooltipTrigger>
        <TooltipContent>
          {`${display}: ${status} (${progress}%)`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
