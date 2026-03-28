'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Mail, Settings, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { createSession } from '@/lib/api';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { href: '/research', label: 'Research Hub', icon: Search },
  { href: '/emails', label: 'Emails', icon: Mail }
];

function NewSessionButton() {
  const router = useRouter();
  const { state } = useSidebar();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const session = await createSession();
      router.push(`/research/${session.id}`);
    } catch {
      toast.error('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  if (state === 'collapsed') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="New Research" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <div className="px-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreate}
        disabled={isCreating}
        className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 w-full justify-start gap-2"
      >
        {isCreating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        New Research
      </Button>
    </div>
  );
}

function UserFooter() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);
  const { isMobile } = useSidebar();

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={openAuthModal}
            tooltip="Sign in"
            className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-accent flex size-6 items-center justify-center rounded-md">
              <span className="text-sidebar-foreground text-[10px] font-medium">?</span>
            </div>
            <span className="truncate text-sm font-medium">Sign in</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const initial = (user.email?.[0] ?? '?').toUpperCase();
  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={displayName}
              className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
            >
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="size-6 rounded-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-6 items-center justify-center rounded-md text-[10px] font-semibold">
                  {initial}
                </div>
              )}
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">{displayName}</span>
                <span className="text-sidebar-foreground/60 truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="text-sidebar-foreground/40 ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={() => openProfile()}>
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 px-0.5">
            <Image
              src="/remes-logo.png"
              alt="Remes"
              width={28}
              height={28}
              className="shrink-0 rounded"
            />
            <div className="grid text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="text-sidebar-accent-foreground text-base font-bold tracking-widest uppercase">
                Remes
              </span>
              <span className="text-sidebar-foreground/50 text-[11px] font-medium tracking-wide uppercase">
                Research Hub
              </span>
            </div>
          </Link>
          <SidebarTrigger
            label="Toggle sidebar"
            className="text-sidebar-foreground/40 hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <NewSessionButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
