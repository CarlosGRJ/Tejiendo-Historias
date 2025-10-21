'use client';

import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const email = 'andrea@tejiendohistorias.com';
  const phone = '+5215512345678';
  const whatsappNumber = '5215512345678';

  return (
    <footer className='bg-accent text-accent-foreground border-t border-accent/30 mt-20'>
      <div className='container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm'>
        {/* Left: Branding & Description */}
        <section aria-labelledby='footer-brand'>
          <h2 id='footer-brand' className='text-lg font-bold mb-2'>
            Tejiendo Historias
          </h2>
          <p>
            Psicoterapia profesional enfocada en tu bienestar emocional. Un
            espacio seguro para sanar, reflexionar y crecer.
          </p>
        </section>

        {/* Middle: Contact Info */}
        <section aria-labelledby='footer-contact'>
          <h3 id='footer-contact' className='text-md font-semibold mb-2'>
            Contacto
          </h3>
          <nav aria-label='Información de contacto'>
            <ul className='space-y-2'>
              <li>
                <a
                  href={`tel:${phone}`}
                  className='inline-flex items-center gap-2 hover:text-primary transition-colors'>
                  <Phone className='w-4 h-4' />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className='inline-flex items-center gap-2 hover:text-primary transition-colors'>
                  <Mail className='w-4 h-4' />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 hover:text-primary transition-colors'>
                  <FaWhatsapp className='w-4 h-4' />
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </section>

        {/* Right: Social Media */}
        <section aria-labelledby='footer-social'>
          <h3 id='footer-social' className='text-md font-semibold mb-2'>
            Sígueme
          </h3>
          <nav aria-label='Redes sociales'>
            <ul className='flex gap-4'>
              <li>
                <Link
                  href='https://facebook.com'
                  target='_blank'
                  className='hover:text-primary transition-colors'
                  aria-label='Facebook'>
                  <Facebook className='w-5 h-5' />
                </Link>
              </li>
              <li>
                <Link
                  href='https://instagram.com'
                  target='_blank'
                  className='hover:text-primary transition-colors'
                  aria-label='Instagram'>
                  <Instagram className='w-5 h-5' />
                </Link>
              </li>
              <li>
                <Link
                  href='https://linkedin.com'
                  target='_blank'
                  className='hover:text-primary transition-colors'
                  aria-label='LinkedIn'>
                  <Linkedin className='w-5 h-5' />
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </div>

      {/* Copyright */}
      <div className='border-t border-accent/20 py-4 text-center text-xs'>
        © {new Date().getFullYear()} Tejiendo Historias · Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
