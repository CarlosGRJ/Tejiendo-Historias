'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type Conference = {
  title: string;
  date: string;
  location?: string;
  image: string;
};

const CONFERENCES: Conference[] = [
  {
    title: 'Conferencia “Violencia de Género”',
    date: '6 de marzo de 2025',
    location: 'Universidad Intercontinental',
    image: '/images/conferences/violencia-genero.webp',
  },
  {
    title: 'Taller “Juntas somos más fuertes”',
    date: '7 de marzo de 2025',
    location: 'Agencia publicitaria Pixetl',
    image: '/images/conferences/juntos-mas-fuertes.webp',
  },
  {
    title:
      'Congreso Siglo XXI: Desafíos y oportunidades del psicoanálisis contemporáneo',
    date: '7 de octubre de 2024',
    location: 'Facultad de Psicología y Educación de la UAQ, Querétaro, México con la ponencia: “Espacios de escucha con la comunidad trans y no binario: De Freud y Lacan a Preciado y Butler”.',
    image: '/images/conferences/siglo-XXI.webp',
  },
];

export default function ConferencesSection() {
  return (
    <section
      id='conferences'
      className='py-24 bg-background'
      aria-labelledby='conferences-title'>
      <div className='container mx-auto px-4'>
        <h2
          id='conferences-title'
          className='text-3xl md:text-4xl font-bold text-primary mb-12 text-center'>
          Conferencias
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
          {CONFERENCES.map((conf, index) => (
            <Card
              key={index}
              className='h-full flex flex-col pt-0 overflow-hidden rounded-2xl shadow-md'
              aria-label={`Conferencia: ${conf.title}`}>
              <div className='relative w-full aspect-[16/9]'>
                <Image
                  src={conf.image}
                  alt={`Imagen de la conferencia ${conf.title}`}
                  fill
                  className='object-cover object-center rounded-t-2xl'
                  sizes='(max-width: 768px) 100vw, 33vw'
                  priority={index === 0}
                />
              </div>

              <CardHeader>
                <CardTitle className='text-lg font-semibold text-foreground'>
                  {conf.title}
                </CardTitle>
              </CardHeader>

              <CardContent className='text-sm text-muted-foreground space-y-1'>
                <p>
                  <strong>Fecha:</strong> {conf.date}
                </p>
                {conf.location && (
                  <p>
                    <strong>Lugar:</strong> {conf.location}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
