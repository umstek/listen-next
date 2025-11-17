import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from ':ui/alert-dialog'
import { Button } from ':ui/button'
import { Checkbox } from ':ui/checkbox'
import { Flex } from ':layout/Flex'
import { Text } from ':layout/Text'

export function IndexPrompt(
  props: React.ComponentProps<typeof AlertDialog>,
) {
  // TODO Check battery level and charging status and decide default option and
  // also show a info box.

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogTitle>Index Music?</AlertDialogTitle>
        <AlertDialogDescription>
          This will allow you to find audio by genre, artist, album, and more.
        </AlertDialogDescription>
        <Flex gap="3" className="flex-col sm:items-center sm:flex-row mt-4">
          <Text as="label" size="sm">
            <Flex gap="2">
              <Checkbox /> Remember this choice
            </Flex>
          </Text>
          <Flex gap="3" className="flex-grow justify-end">
            <AlertDialogCancel asChild>
              <Button variant="outline">Later, at playtime</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button>Now, in background</Button>
            </AlertDialogAction>
          </Flex>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  )
}
