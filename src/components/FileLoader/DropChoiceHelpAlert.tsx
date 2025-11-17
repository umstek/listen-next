import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from ':ui/alert'

export function DropChoiceHelpAlert() {
  return (
    <Alert>
      <QuestionMarkCircledIcon className="h-4 w-4" />
      <AlertTitle>Files or Folders?</AlertTitle>
      <AlertDescription>
        Consider organizing your audio content under a single folder or a few
        folders on your operating system so you can easily add them here.
      </AlertDescription>
    </Alert>
  )
}
