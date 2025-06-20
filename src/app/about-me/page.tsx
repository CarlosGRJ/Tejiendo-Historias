'use client';

import AboutMeHeroSection from '@/components/sections/AboutMeHeroSection';
import ContactSection from '@/components/sections/ContactSection';
import { CheckCircle } from 'lucide-react';

export default function AboutMe() {
  return (
    <>
      <AboutMeHeroSection />

      <section id='about' className='py-24 bg-background'>
        <div className='container mx-auto px-4 space-y-16'>
          {/* Educación */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-primary'>Educación</h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Licenciatura en Psicología — Universidad Nacional
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Maestría en Terapia Familiar — Universidad de la Salud
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Diplomado en Terapia Cognitivo-Conductual (TCC)
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Certificación en Terapia de Pareja
                </span>
              </li>
            </ul>
          </div>

          {/* Trayectoria Laboral */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-primary'>
              Trayectoria Laboral
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Psicóloga Clínica - Hospital Santa María (2015 - 2018)
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Consulta Privada — Consultorio Tejiendo Historias (2018 -
                  Actualidad)
                </span>
              </li>
            </ul>
          </div>

          {/* Conferencias y Talleres */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-primary'>
              Conferencias y Talleres
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  “Salud Mental en el Entorno Laboral” — Congreso Nacional de
                  Psicología 2022
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <CheckCircle className='text-primary mt-1' />
                <span className='text-muted-foreground'>
                  Taller de Comunicación Emocional para Empresas — 2023
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
