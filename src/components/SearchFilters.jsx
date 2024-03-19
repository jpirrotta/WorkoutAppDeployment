import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

export default function SearchFilters() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Search by...</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto bg-slate-900 border-primary">
        <DropdownMenuGroup>
          <DropdownMenuItem>Body Part</DropdownMenuItem>
          <DropdownMenuItem>Name</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
