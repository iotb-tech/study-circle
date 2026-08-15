import { clsx, type ClassValue } from 'clsx'; 
import { twMerge } from 'tailwind-merge'; 
import { HTMLAttributes } from 'react'; 
 
function cn(...inputs: ClassValue[]) { 
  return twMerge(clsx(inputs)); 
} 
 
type NavbarProps = HTMLAttributes<HTMLElement>; 
 
function NavbarRoot({ className, children, ...props }: NavbarProps) { 
  return ( 
    <header 
      className={cn( 
        'sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-4',
        className, 
      )} 
      {...props} 
    > 
      {children} 
    </header> 
  ); 
} 
 
function NavbarLeft({ className, ...props }: HTMLAttributes<HTMLDivElement>) { 
  return ( 
    <div className={cn('flex items-center gap-3', className)} {...props} /> 
  ); 
} 
 
function NavbarCenter({ className, ...props }: HTMLAttributes<HTMLDivElement>) 
{ 
  return ( 
    <div className={cn('hidden md:flex items-center gap-6', className)} 
{...props} /> 
  ); 
} 
 
function NavbarRight({ className, ...props }: HTMLAttributes<HTMLDivElement>) { 
  return ( 
    <div className={cn('ml-auto flex items-center gap-3', className)} 
{...props} /> 
  ); 
} 
 
export const Navbar = Object.assign(NavbarRoot, { 
  Left: NavbarLeft, 
  Center: NavbarCenter, 
  Right: NavbarRight, 
}); 
