import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Box, Callout } from '@radix-ui/themes';

export function StoreChoiceHelpAlert() {
  return (
    <Callout.Root className="text-blue-1 max-w-96">
      <Callout.Icon>
        <QuestionMarkCircledIcon />
      </Callout.Icon>
      <Box>
        <Callout.Text>
          <span className="font-bold">Play Now</span> option will play the
          selected files without indexing. <br />
          <span className="font-bold">Copy to browser</span> option will create
          a sandboxed copy of the selected files inside your browser. <br />
          <span className="font-bold">Store as links</span> option will index
          and create a link to your original files. you&apos;ll be asked for
          permission each time you use open them and, the changes you do to the
          original files will be reflected here.
        </Callout.Text>
      </Box>
    </Callout.Root>
  );
}
