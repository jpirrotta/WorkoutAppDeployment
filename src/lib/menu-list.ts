import {
  Scale,
  Settings,
  BicepsFlexed,
  LayoutGrid,
  LucideIcon,
  UserCog,
  Newspaper,
  Dumbbell,
  HeartHandshake,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname.includes('/dashboard'),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/feed',
          label: 'Feed',
          active: pathname.includes('/feed'),
          icon: Newspaper,
          submenus: [],
        },
        {
          href: '/workouts',
          label: 'Workouts',
          active: pathname.includes('/workouts'),
          icon: Dumbbell,
          submenus: [],
        },
        {
          href: '/exercises',
          label: 'Exercises',
          active: pathname.includes('/exercises'),
          icon: BicepsFlexed,
          submenus: [],
        },
        {
          href: '',
          label: 'Calculators',
          active: pathname.includes('/calculators'),
          icon: Scale,
          submenus: [
            {
              href: '/calculators/bmi',
              label: 'BMI Calculator',
              active: pathname.includes('/calculators/bmi'),
            },
            {
              href: '/calculators/calories',
              label: 'Calories',
              active: pathname.includes('/calculators/calories'),
            },
            {
              href: '/calculators/macronutrients',
              label: 'Macronutrients',
              active: pathname.includes('/calculators/macronutrients'),
            },
            {
              href: '/calculators/body-fat',
              label: 'Body Fat',
              active: pathname.includes('/calculators/body-fat'),
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/profile',
          label: 'Profile',
          active: pathname.includes('/profile'),
          icon: Settings,
          submenus: [],
        },
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: UserCog,
          submenus: [],
        },
        {
          href: '/contact-us',
          label: 'Contact Us',
          active: pathname.includes('/contact-us'),
          icon: HeartHandshake,
          submenus: [],
        },
      ],
    },
  ];
}
