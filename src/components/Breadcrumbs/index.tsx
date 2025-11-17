import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import type React from 'react'
import { Button } from ':ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ':ui/dropdown-menu'
import { Flex } from ':layout/Flex'
import { IconButton } from ':layout/IconButton'

interface BreadcrumbsProps {
  onUp?: () => void
  onBack?: () => void
  onForward?: () => void
  children:
    | React.ReactElement<BreadcrumbProps>[]
    | React.ReactElement<BreadcrumbProps>
}

export function Breadcrumbs({
  onUp = () => {},
  onBack = () => {},
  onForward = () => {},
  children,
}: BreadcrumbsProps) {
  return (
    <Flex>
      <IconButton variant="ghost" className="rounded-r-[0]" onClick={onUp}>
        <ArrowUpIcon />
      </IconButton>
      <IconButton variant="ghost" className="rounded-[0]" onClick={onBack}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton variant="ghost" className="rounded-l-[0]" onClick={onForward}>
        <ArrowRightIcon />
      </IconButton>
      <Flex className="group/breadcrumbs ml-2 *:rounded-[0]">{children}</Flex>
    </Flex>
  )
}

interface BreadcrumbProps {
  name: string
  onClick?: () => void
  itemNames: string[]
  onItemClick?: (name: string) => void
  selected?: string
}

export function Breadcrumb({
  name,
  onClick = () => {},
  itemNames,
  onItemClick = () => {},
  selected,
}: BreadcrumbProps) {
  return (
    <>
      <Button
        className="first:rounded-l-1 last:rounded-r-1"
        variant="ghost"
        onClick={onClick}
      >
        {name}
      </Button>
      {itemNames.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              className="first:rounded-l-1 last:rounded-r-1"
              variant="ghost"
            >
              <ChevronRightIcon />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {itemNames.map((itemName) => (
              <DropdownMenuItem
                key={itemName}
                onClick={() => onItemClick(itemName)}
                className={selected === itemName ? 'font-bold' : ''}
              >
                {itemName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
