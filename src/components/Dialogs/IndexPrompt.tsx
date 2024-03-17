import { AlertDialog, Button, Checkbox, Flex, Text } from '@radix-ui/themes';

export function IndexPrompt(
  props: React.ComponentProps<typeof AlertDialog.Root>,
) {
  // TODO Check battery level and charging status and decide default option and
  // also show a info box.

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title>Index Music?</AlertDialog.Title>
        <AlertDialog.Description>
          This will allow you to find audio by genre, artist, album, and more.
        </AlertDialog.Description>
        <Flex gap="3" mt="4" className="flex-col sm:flex-row sm:items-center">
          <Text as="label" size="2">
            <Flex gap="2">
              <Checkbox /> Remember this choice
            </Flex>
          </Text>
          <Flex gap="3" className="flex-grow justify-end">
            <AlertDialog.Cancel>
              <Button variant="outline">Later, at playtime</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid">Now, in background</Button>
            </AlertDialog.Action>
          </Flex>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
