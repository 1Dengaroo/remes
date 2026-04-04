'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Mail, Users, Clock } from 'lucide-react';
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { UserFooter } from '@/components/user-footer.client';
import { NewSessionButton } from '@/components/new-session-button.client';
import { NewProfileButton } from '@/components/new-profile-button.client';
import { listSessions } from '@/lib/api';
import type { ResearchSessionSummary } from '@/lib/types';

export function AppSidebar() {
  const pathname = usePathname();
  const [recentSessions, setRecentSessions] = useState<ResearchSessionSummary[]>([]);

  useEffect(() => {
    listSessions()
      .then((sessions) => {
        const sorted = [...sessions].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setRecentSessions(sorted.slice(0, 5));
      })
      .catch(() => {});
  }, []);

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
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            <NewSessionButton />
            <NewProfileButton />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Research</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/research'}
                  tooltip="Research Hub"
                >
                  <Link href="/research">
                    <Search />
                    <span>Research Hub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/profiles')}
                  tooltip="Saved Profiles"
                >
                  <Link href="/profiles">
                    <Users />
                    <span>Saved Profiles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {recentSessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSub>
                    {recentSessions.map((session) => (
                      <SidebarMenuSubItem key={session.id}>
                        <SidebarMenuSubButton
                          asChild
                          size="sm"
                          isActive={pathname === `/research/${session.id}`}
                        >
                          <Link href={`/research/${session.id}`}>
                            <Clock className="size-3" />
                            <span>{session.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Outreach</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/emails')}
                  tooltip="Emails"
                >
                  <Link href="/emails">
                    <Mail />
                    <span>Emails</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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
