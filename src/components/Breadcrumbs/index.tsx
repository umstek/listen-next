import {
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  Flex,
  IconButton,
} from '@radix-ui/themes';
import React from 'react';

interface BreadcrumbsProps {
  onUp?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  children:
    | React.ReactElement<BreadcrumbProps>[]
    | React.ReactElement<BreadcrumbProps>;
}

export function Breadcrumbs({
  onUp = () => {},
  onBack = () => {},
  onForward = () => {},
  children,
}: BreadcrumbsProps) {
  return (
    <Flex>
      <IconButton variant="soft" className="rounded-r-[0]" onClick={onUp}>
        <ArrowUpIcon />
      </IconButton>
      <IconButton variant="soft" className="rounded-[0]" onClick={onBack}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton variant="soft" className="rounded-l-[0]" onClick={onForward}>
        <ArrowRightIcon />
      </IconButton>
      <Flex className="group/breadcrumbs ml-2 *:rounded-[0]">{children}</Flex>
    </Flex>
  );
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
        className="first:rounded-l-1 last:rounded-r-1"
        variant="soft"
        onClick={onClick}
      >
        {name}
      </Button>
      {itemNames.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              className="first:rounded-l-1 last:rounded-r-1"
              variant="soft"
            >
              <ChevronRightIcon />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {itemNames.map((itemName) => (
              <DropdownMenu.Item
                key={itemName}
                onClick={() => onItemClick(itemName)}
                className={selected === itemName ? 'font-bold' : ''}
              >
                {itemName}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </>
  );
}
