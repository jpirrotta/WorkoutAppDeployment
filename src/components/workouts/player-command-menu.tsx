import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';

import { Play, StepBack, StepForward, Check, X } from 'lucide-react';

export default function WorkoutPlayerCommandMenu() {
  return (
    <menu className="flex flex-row gap-6 h-14 border-primary">
      <Button>
        <X />
      </Button>

      <Button>
        <StepBack />
      </Button>

      <Button>
        <Play />
      </Button>

      <Button>
        <StepForward />
      </Button>

      <Button>
        <Check />
      </Button>
    </menu>
  );
}
