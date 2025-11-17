import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from ':ui/alert-dialog'
import { Button } from ':ui/button'
import { Flex } from ':layout/Flex'

export function NotImplementedDialog(
  props: React.ComponentProps<typeof AlertDialog>,
) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogTitle>Oops</AlertDialogTitle>
        <AlertDialogDescription>
          This feature is not implemented yet.
        </AlertDialogDescription>
        <Flex gap="3" className="mt-4" justify="end">
          <AlertDialogCancel asChild>
            <Button variant="outline">Okay</Button>
          </AlertDialogCancel>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  )
}
