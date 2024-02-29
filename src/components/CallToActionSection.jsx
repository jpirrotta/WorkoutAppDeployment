import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CallToActionSection({
  title,
  text,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="bg-primary w-full">
      <div className="container px-5 py-24 mx-auto">
        <h2 className="text-4xl font-bold text-center text-primary-foreground">
          {title}
        </h2>
        <p className="mt-4 font-normal text-base text-primary-foreground max-w-lg text-center mx-auto">
          {text}
        </p>
        <div className="flex justify-center mt-8">
          <Link href={buttonLink}>
            <Button
              size="lg"
              variant="secondary"
              className="text-primary-background"
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
