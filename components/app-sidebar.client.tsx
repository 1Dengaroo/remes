'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Mail } from 'lucide-react';
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
  SidebarSeparator
} from '@/components/ui/sidebar';
import { UserFooter } from '@/components/user-footer.client';
import { NewSessionButton } from '@/components/new-session-button.client';

const NAV_ITEMS = [
  { href: '/research', label: 'Research Hub', icon: Search },
  { href: '/emails', label: 'Emails', icon: Mail }
];

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
