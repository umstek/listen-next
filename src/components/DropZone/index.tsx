import { openDirectory, openFiles } from ':FileLoader';
import { Button } from ':ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from ':ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ':ui/dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export function DropZone() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Audio Files</CardTitle>
        <CardDescription>
          Drop files/folders here or click to browse.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full bg-secondary rounded-lg p-4">
          <div className="h-full w-full outline-1 outline-dashed outline-input rounded-lg">
            <Button
              variant="ghost"
              onClick={() => openFiles({ multiple: true }).then(console.log)}
            >
              Add Files
            </Button>
            <Button onClick={() => openDirectory().then(console.log)}>
              Add Folder
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {/* Store in Provider -- someday */}
        <Button variant="ghost">Play Now</Button>
        <div className="flex">
          <Button className="rounded-r-none pr-2">Copy to Browser</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none p-2">
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Store as Links</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  );
}
