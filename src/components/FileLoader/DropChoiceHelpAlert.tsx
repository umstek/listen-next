import { Callout } from '@radix-ui/themes';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export function DropChoiceHelpAlert() {
  return (
    <Callout.Root>
      <Callout.Icon>
        <QuestionMarkCircledIcon className="h-4 w-4" />
      </Callout.Icon>
      <Callout.Text>
        <h3>Files or Folders?</h3>
        Consider organizing your audio content under a single folder or a few
        folders on your operating system so you can easily add them here.
      </Callout.Text>
    </Callout.Root>
  );
}
