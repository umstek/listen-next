import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogRoot,
  AlertDialogTitle,
  Button,
} from '@radix-ui/themes';

export function NotImplementedDialog(
  props: React.ComponentProps<typeof AlertDialogRoot>,
) {
  return (
    <AlertDialogRoot {...props}>
      <AlertDialogContent>
        <AlertDialogTitle>😔</AlertDialogTitle>
        <AlertDialogDescription>
          This function is not implemented yet.
        </AlertDialogDescription>
        <AlertDialogCancel>
          <Button variant="ghost" color="gray">
            Okay
          </Button>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
