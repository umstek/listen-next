import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Box, Callout, Heading } from '@radix-ui/themes'

export function DropChoiceHelpAlert() {
  return (
    <Callout.Root>
      <Callout.Icon>
        <QuestionMarkCircledIcon />
      </Callout.Icon>
      <Box>
        <Heading as="h4" size="2">
          Files or Folders?
        </Heading>
        <Callout.Text>
          Consider organizing your audio content under a single folder or a few
          folders on your operating system so you can easily add them here.
        </Callout.Text>
      </Box>
    </Callout.Root>
  )
}
