'use client';

import { Separator } from '@/components/ui/separator';
import { Mail, Instagram, Linkedin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { Logo } from '../navbar/logo';

const footerLinks = [
  { title: 'Inicio', href: '/' },
  { title: 'Servicios', href: '/#services' },
  { title: 'Sobre mí', href: '/about-me' },
  { title: 'Contacto', href: '/#contact' },
];

const email = 'tejiendohistorias.aag@gmail.com';
const whatsappNumber = '525561800189';

export default function Footer() {
  return (
    <footer className='bg-background text-muted' role='contentinfo'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Top */}
        <div className='py-10 flex flex-col items-center text-sm'>
          <div className='mb-4'>
            <Logo />
          </div>

          <nav aria-label='Footer main navigation'>
            <ul className='flex flex-wrap justify-center gap-4'>
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className='hover:text-primary transition-colors font-medium'>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator />

        {/* Bottom */}
        <div className='py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground'>
          {/* Copyright */}
          <p className='text-center text-muted-foreground'>
            &copy; {new Date().getFullYear()} Tejiendo Historias. Todos los
            derechos reservados. Desarrollado por{' '}
            <Link
              href='https://www.carlosrojasj.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary font-medium hover:underline'>
              Carlos Rojas
            </Link>
          </p>

          {/* Socials */}
          <div className='flex gap-4' aria-label='Redes sociales'>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='WhatsApp'>
              <FaWhatsapp className='w-5 h-5 hover:text-primary transition-colors' />
            </a>
            <a href={`mailto:${email}`} aria-label='Email'>
              <Mail className='w-5 h-5 hover:text-primary transition-colors' />
            </a>
            <Link
              href='https://www.instagram.com/tejiendohistorias22?igsh=MTRsNXNiN2s0eG9zMA%3D%3D&utm_source=qr'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'>
              <Instagram className='w-5 h-5 hover:text-primary transition-colors' />
            </Link>
            <Link
              href='http://linkedin.com/in/andrea-armenta-garcía-488629233'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'>
              <Linkedin className='w-5 h-5 hover:text-primary transition-colors' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
