'use client';

import { ChevronsUpDown, Settings } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';

export function UserFooter() {
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
