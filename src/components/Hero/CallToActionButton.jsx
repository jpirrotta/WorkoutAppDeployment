'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToActionButton({ children, href, ...props }) {
  return (
    <Link href={href}>
      <Button size="lg" variant="outline" {...props}>
        {children}
      </Button>
    </Link>
  );
}
