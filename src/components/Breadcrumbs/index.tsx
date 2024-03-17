import { ChevronRightIcon } from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
  IconButton,
} from '@radix-ui/themes';
import type React from 'react';

interface BreadcrumbsProps {
  children:
    | React.ReactElement<BreadcrumbProps>[]
    | React.ReactElement<BreadcrumbProps>;
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  return <Flex {...props} className="group/breadcrumbs ml-2 *:rounded-[0]" />;
}

interface BreadcrumbProps {
  name: string;
  onClick?: () => void;
  itemNames: string[];
  onItemClick?: (name: string) => void;
  selected?: string;
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
        className="last:rounded-r-1 first:rounded-l-1"
        variant="soft"
        onClick={onClick}
      >
        {name}
      </Button>
      {itemNames.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenuTrigger>
            <IconButton
              className="last:rounded-r-1 first:rounded-l-1"
              variant="soft"
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
        </DropdownMenu.Root>
      )}
    </>
  );
}
