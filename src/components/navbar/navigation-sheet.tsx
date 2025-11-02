'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Home, Menu, Phone, Heart, User, BookOpen } from 'lucide-react';
import { Logo } from './logo';
import Link from 'next/link';
import { useState } from 'react';

export const NavigationSheet = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon'>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className='flex justify-center'>
            <Logo width='200' height='200' />
          </SheetTitle>
        </SheetHeader>

        <nav
          className='mt-10 flex flex-col space-y-6 px-4'
          aria-label='Menú de navegación principal'>
          <Link
            href='/'
            onClick={handleClose}
            className='flex items-center gap-3 text-lg text-gray-900 hover:text-indigo-600 transition pl-2'>
            <Home className='w-5 h-5' /> Inicio
          </Link>

          <Link
            href='/#services'
            onClick={handleClose}
            className='flex items-center gap-3 text-lg text-gray-900 hover:text-indigo-600 transition pl-2'>
            <Heart className='w-5 h-5' /> Servicios
          </Link>

          <Link
            href='/about-me'
            onClick={handleClose}
            className='flex items-center gap-3 text-lg text-gray-900 hover:text-indigo-600 transition pl-2'>
            <User className='w-5 h-5' /> Sobre Mí
          </Link>

          <Link
            href='/blog'
            onClick={handleClose}
            className='flex items-center gap-3 text-lg text-gray-900 hover:text-indigo-600 transition pl-2'>
            <BookOpen className='w-5 h-5' /> Blog
          </Link>

          <Link
            href='#contact'
            onClick={handleClose}
            className='flex items-center gap-3 text-lg text-gray-900 hover:text-indigo-600 transition pl-2'>
            <Phone className='w-5 h-5' /> Contacto
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
