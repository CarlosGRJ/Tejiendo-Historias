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
import { useEffect, useState } from 'react';

const NavbarPage = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`px-26 h-20 bg-background border-b ${isSticky ? 'sticky' : ''}`}
      role='navigation'
      aria-label='Barra de navegación principal'>
      <div className='h-full flex items-center justify-between max-w-screen-2xl mx-auto px-4'>
        <div className='flex items-center gap-10'>
          <Logo width='65' />
        </div>

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
                  className='cursor-pointer w-12 h-12'
                  aria-label='Menú del usuario administrador'>
                  <AvatarImage
                    src='/images/avatar.webp'
                    alt='Avatar del usuario'
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() ?? 'A'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                aria-labelledby='admin-menu-label'>
                <DropdownMenuItem id='admin-menu-label' asChild>
                  <Link href='/admin/posts/new'>Nuevo Post</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
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
