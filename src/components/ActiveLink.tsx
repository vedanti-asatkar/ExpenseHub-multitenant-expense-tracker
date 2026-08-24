'use client';

import { Link, usePathname } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

export const ActiveLink = (props: { href: string; children: React.ReactNode; primary?: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(props.href);

  return (
    <Link
      href={props.href}
      className={cn(
        'px-3 py-2',
        isActive && 'rounded-md bg-primary text-primary-foreground',
        !isActive && props.primary && 'font-semibold text-primary',
      )}
    >
      {props.children}
    </Link>
  );
};
