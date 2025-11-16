import { AlertDialog, Button, Flex } from '@radix-ui/themes'

export function NotImplementedDialog(
  props: React.ComponentProps<typeof AlertDialog.Root>,
) {
  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title>Oops 😞</AlertDialog.Title>
        <AlertDialog.Description>
          This feature is not implemented yet.
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="outline">Okay</Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
