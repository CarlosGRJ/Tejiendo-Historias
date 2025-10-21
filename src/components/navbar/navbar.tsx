'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { NavMenu } from './nav-menu';
import { NavigationSheet } from './navigation-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthProvider';

const NavbarPage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className='fixed top-0 z-50 w-full h-24 bg-background border-b opacity-90'
      role='navigation'
      aria-label='Barra de navegación principal'>
      <div className='h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Logo />

        {/* Menú de navegación principal en desktop */}
        <NavMenu className='hidden md:block' />

        <div className='flex items-center gap-3'>
          {!isAuthenticated ? (
            <Button
              asChild
              aria-label='Ir a la página de inicio de sesión de admin'>
              <Link href='/login'>Admin</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className='cursor-pointer'
                  aria-label='Menú del usuario administrador'>
                  <AvatarImage
                    src='/avatar-placeholder.png'
                    alt='Avatar del usuario'
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() ?? 'A'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                aria-label='Opciones del usuario'>
                <DropdownMenuItem asChild>
                  <Link href='/admin/posts/new'>Nuevo Post</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Link href='/admin/appointments-dashboard'>Citas</Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer'
                  aria-label='Cerrar sesión del administrador'>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Menú móvil */}
          <div className='md:hidden'>
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPage;
