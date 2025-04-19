
import React from 'react';
import { 
  Clock, 
  Code, 
  FileText, 
  Shield, 
  Bookmark,
  LayoutTemplate
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu as ShadcnSidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

interface SidebarMenuProps {
  activeItem: string;
  onItemChange: (item: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeItem, onItemChange }) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const mainMenuItems = [
    { id: 'ai', title: 'AI Automation', icon: Clock },
   
    // { id: 'report', title: 'Report', icon: FileText },
  ];

  // Single Templates entry instead of individual attack types
  const templateItems = [
    { id: 'templates', title: 'Attack Templates', icon: LayoutTemplate }
  ];

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarRail />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <ShadcnSidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeItem === item.id}
                    onClick={() => onItemChange(item.id)}
                  >
                    <item.icon className={isCollapsed ? "" : "mr-2"} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </ShadcnSidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <ShadcnSidebarMenu>
              {templateItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeItem === item.id}
                    onClick={() => onItemChange(item.id)}
                  >
                    <item.icon className={isCollapsed ? "" : "mr-2"} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </ShadcnSidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenu;
