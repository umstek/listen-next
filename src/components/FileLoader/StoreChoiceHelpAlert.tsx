import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Box, Callout } from '@radix-ui/themes';

export function StoreChoiceHelpAlert() {
  return (
    <Callout.Root className="max-w-96 text-blue-1">
      <Callout.Icon>
        <QuestionMarkCircledIcon />
      </Callout.Icon>
      <Box>
        <Callout.Text>
          <span className="font-bold">Play Now:</span> Play the selected files
          without indexing. <br />
          <span className="font-bold">Copy to browser:</span> Create a sandboxed
          copy of the selected files inside your browser. <br />
          <span className="font-bold">Store as links:</span> Store links to the
          original files/folders you dropped. You&apos;ll be asked for
          permission each time you open them and, the changes to the original
          files will be reflected here.
        </Callout.Text>
      </Box>
    </Callout.Root>
  );
}
