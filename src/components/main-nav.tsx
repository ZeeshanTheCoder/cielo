'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Home, PenSquare, Gem, UserCircle, Menu, Headphones, Music, Moon, History, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Logo } from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import type { Translations } from '@/lib/translations';

const navItems = [
  { href: '/home', labelKey: 'nav_home', icon: Home, pro: false },
  { href: '/journal', labelKey: 'nav_journal', icon: PenSquare, pro: false },
  { href: '/meditations', labelKey: 'nav_meditate', icon: Headphones, pro: false },
  { href: '/soundscapes', labelKey: 'nav_sounds', icon: Music, pro: false },
  { href: '/dream-journal', labelKey: 'nav_dreams', icon: Moon, pro: true },
  { href: '/journal-history', labelKey: 'nav_history', icon: History, pro: true },
];

const accountNavItems = [
    { href: '/pricing', labelKey: 'nav_upgrade', icon: Gem },
    { href: '/profile', labelKey: 'nav_profile', icon: UserCircle },
]

const NavLink = ({ href, labelKey, icon: Icon, pathname, isMobile, closeSheet, t }: { href: string; labelKey: keyof Translations; icon: React.ElementType; pathname: string; isMobile: boolean; closeSheet?: () => void; t: (key: keyof Translations) => string; }) => {
  const isActive = pathname === href;
  const label = t(labelKey);
  return (
    <Link 
      href={href} 
      onClick={closeSheet}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-primary/10 text-primary',
        isMobile && 'flex-col justify-center h-16 text-xs gap-1',
        !isMobile && 'justify-start'
      )}
    >
      <Icon className="h-5 w-5" />
      {isMobile ? label : <span className='font-medium'>{label}</span>}
    </Link>
  );
};

function DesktopNav({ pathname }: { pathname: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const avatarUrl = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl;
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    toast({
        title: t('logout_success_title'),
        description: t('logout_success_description'),
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background md:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link href="/home" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <Logo />
          <span className="sr-only">Cielo</span>
        </Link>
        {navItems.filter(item => !item.pro || user?.isUpgraded).map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname.startsWith(item.href) && "bg-accent text-accent-foreground")}>
             <item.icon className="h-5 w-5" />
             <span className="sr-only">{t(item.labelKey as keyof Translations)}</span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={user?.username} data-ai-hint="person portrait"/>
                <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuLabel>{t('my_account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile">{t('nav_profile')}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/pricing">{t('nav_billing')}</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>{t('nav_logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useTranslation();
  
    const handleLogout = async () => {
      await logout();
      router.push('/login');
      toast({
          title: t('logout_success_title'),
          description: t('logout_success_description'),
      });
      setOpen(false);
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[300px]">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <nav className="flex flex-col gap-4">
                        <Link href="/home" onClick={() => setOpen(false)} className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                            <Logo />
                            <span className="sr-only">Cielo</span>
                        </Link>
                        <div className="flex flex-col gap-1">
                            {navItems.filter(item => !item.pro || user?.isUpgraded).map((item) => (
                                <NavLink key={item.href} {...item} labelKey={item.labelKey as keyof Translations} pathname={pathname} isMobile={false} closeSheet={() => setOpen(false)} t={t} />
                            ))}
                        </div>
                        <DropdownMenuSeparator />
                        <div className="flex flex-col gap-1">
                            {accountNavItems.map((item) => (
                                <NavLink key={item.href} {...item} labelKey={item.labelKey as keyof Translations} pathname={pathname} isMobile={false} closeSheet={() => setOpen(false)} t={t}/>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary justify-start"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="font-medium">{t('nav_logout')}</span>
                            </button>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
            <Link href="/home" className="flex-1">
                <span className="font-headline text-lg font-bold sm:text-xl">Cielo</span>
            </Link>
        </header>
    );
}

export default function MainNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  return isMobile ? <MobileNav pathname={pathname} /> : <DesktopNav pathname={pathname} />;
}
