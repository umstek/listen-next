import { Callout, Heading, Text } from '@radix-ui/themes';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export function DropChoiceHelpAlert() {
  return (
    <Callout.Root>
      <Callout.Icon>
        <QuestionMarkCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        <Heading as="h4" size="2">
          Files or Folders?
        </Heading>
        <Text as="p">
          Consider organizing your audio content under a single folder or a few
          folders on your operating system so you can easily add them here.
        </Text>
      </Callout.Text>
    </Callout.Root>
  );
}
