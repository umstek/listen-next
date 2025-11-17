import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription } from ':ui/alert'

export function StoreChoiceHelpAlert() {
  return (
    <Alert className="max-w-96">
      <QuestionMarkCircledIcon className="h-4 w-4" />
      <AlertDescription>
        <span className="font-bold">Play Now:</span> Play the selected files
        without indexing. <br />
        <span className="font-bold">Copy to browser:</span> Create a sandboxed
        copy of the selected files inside your browser. <br />
        <span className="font-bold">Store as links:</span> Store links to the
        original files/folders you dropped. You&apos;ll be asked for
        permission each time you open them and, the changes to the original
        files will be reflected here.
      </AlertDescription>
    </Alert>
  )
}
