import { clsx, type ClassValue } from 'clsx'; 
import { twMerge } from 'tailwind-merge'; 
import { HTMLAttributes } from 'react'; 
 
function cn(...inputs: ClassValue[]) { 
  return twMerge(clsx(inputs)); 
} 
 
type SidebarProps = HTMLAttributes<HTMLElement>; 
type SidebarSectionProps = HTMLAttributes<HTMLDivElement>; 
 
function SidebarRoot({ className, children, ...props }: SidebarProps) { 
  return ( 
    <aside 
      className={cn( 
        'flex h-full w-64 shrink-0 flex-col border-r border-neutral-200 bg-white',
        className, 
      )} 
      {...props} 
    > 
      {children} 
    </aside> 
  ); 
} 
 
function SidebarHeader({ className, children, ...props }: SidebarSectionProps) 
{ 
  return ( 
    <div className={cn('border-b border-slate-200 p-4 dark:border-slate-800', 
className)} {...props}> 
      {children} 
    </div> 
  ); 
} 
 
function SidebarContent({ className, children, ...props }: SidebarSectionProps) 
{ 
  return ( 
    <div className={cn('flex-1 overflow-y-auto p-4', className)} {...props}> 
      {children} 
    </div> 
  ); 
} 
 
function SidebarFooter({ className, children, ...props }: SidebarSectionProps) 
{ 
  return ( 
    <div className={cn('border-t border-slate-200 p-4 dark:border-slate-800', 
className)} {...props}> 
      {children} 
    </div> 
  ); 
} 
 
export const Sidebar = Object.assign(SidebarRoot, { 
  Header: SidebarHeader, 
  Content: SidebarContent, 
  Footer: SidebarFooter, 
}); 