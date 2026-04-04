'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function QuickActionButton({
  icon,
  label,
  onClick,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const { state } = useSidebar();

  if (state === 'collapsed') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={label} onClick={onClick} disabled={disabled}>
            {icon}
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
        onClick={onClick}
        disabled={disabled}
        className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 w-full justify-start gap-2"
      >
        {icon}
        {label}
      </Button>
    </div>
  );
}
