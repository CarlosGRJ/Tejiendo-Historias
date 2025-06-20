'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HeroHome() {
  return (
    <section
      id='home'
      className='relative w-full min-h-[100vh] flex items-center justify-center bg-background'>
      {/* Full background image */}
      <Image
        src='/images/HeroHome.webp'
        alt='Consultorio de terapia psicológica'
        fill
        priority
        unoptimized
        className='object-cover object-center z-0'
      />

      {/* Global overlay for better contrast */}
      <div className='container mx-auto relative z-20 px-8 flex flex-col md:flex-row items-center justify-between min-h-[100vh]'>
        {/* Text Content */}
        <div className='w-full md:w-1/2 max-w-[600px] h-fit backdrop-blur-xs bg-[#FEE5C7]/65 rounded-2xl p-10 shadow-xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight '>
            Tejiendo Historias
          </h1>
          <p className='text-lg text-[#333333] mb-4 drop-shadow-lg'>
            Atención psicológica profesional, personalizada y segura. Agenda tus
            cita y accede a contenidos para tu bienestar emocional.
          </p>
          <ul className='list-disc list-inside text-[#555555] text-sm mb-8 leading-relaxed'>
            <li>Sesiones presenciales y virtuales</li>
            <li>Blog de recursos y reflexiones</li>
            <li>Filosofía de trabajo enfocada en tu bienestar</li>
          </ul>
          <div className='flex flex-col md:flex-row gap-4'>
            <Button
              asChild
              size='lg'
              className='bg-primary text-white shadow-lg px-8 py-5'>
              <a href='#agendar'>Agendar Cita</a>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='text-muted border-muted shadow-lg px-8 py-5'>
              <a href='#contact'>Contacto</a>
            </Button>
          </div>
        </div>

        {/* Spacer */}
        <div className='hidden md:block md:w-1/2'></div>
      </div>
    </section>
  );
}
