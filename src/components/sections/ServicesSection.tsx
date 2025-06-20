'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  fullDescription: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Terapia Individual',
    description: 'Atención personalizada enfocada en tu bienestar emocional.',
    fullDescription:
      'La terapia individual te permite trabajar tus emociones, pensamientos y comportamientos de forma personalizada, con herramientas adaptadas a tus necesidades y ritmo de avance.',
    image:
      'https://cdn.pixabay.com/photo/2020/04/27/21/01/mental-health-5104378_1280.jpg',
  },
  {
    id: 2,
    title: 'Terapia de Pareja',
    description:
      'Fortalece la comunicación y vínculos afectivos con tu pareja.',
    fullDescription:
      'Mejoramos el diálogo, la empatía y las herramientas para afrontar los desafíos de la vida en pareja, generando acuerdos sanos para ambos.',
    image:
      'https://cdn.pixabay.com/photo/2020/10/01/19/16/couple-5618697_1280.jpg',
  },
  {
    id: 3,
    title: 'Orientación Familiar',
    description: 'Mejora la dinámica familiar y la convivencia en casa.',
    fullDescription:
      'Trabajamos la comunicación familiar, el establecimiento de límites, la crianza y la resolución de conflictos para fortalecer los lazos familiares.',
    image:
      'https://cdn.pixabay.com/photo/2016/01/19/15/05/family-1149640_1280.jpg',
  },
  {
    id: 4,
    title: 'Consulta Online',
    description: 'Sesiones cómodas desde cualquier lugar, sin perder calidad.',
    fullDescription:
      'Sesiones por videollamada que mantienen la misma calidez, seguridad y profesionalismo desde cualquier parte del mundo.',
    image:
      'https://cdn.pixabay.com/photo/2021/09/01/13/14/online-consultation-6590711_1280.jpg',
  },
];

export default function ServicesSection() {
  return (
    <section className='py-20' id='services'>
      <h2 className='text-3xl md:text-4xl font-bold text-center text-[#F4A896] mb-16'>
        Servicios
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        {services.map((service) => (
          <Dialog key={service.id}>
            <DialogTrigger asChild>
              <Card className='pt-0 overflow-hidden rounded-3xl cursor-pointer transition-transform duration-300 hover:scale-105'>
                <div className='aspect-[16/9] w-full'>
                  <Image
                    src='https://i.pinimg.com/736x/d0/44/78/d04478b7cd581a1233d7f71a27f62fda.jpg'
                    alt={service.title}
                    width={200}
                    height={200}
                    className='h-full w-full object-cover object-center'
                  />
                </div>

                <CardHeader className='text-lg font-semibold'>
                  <h3 className='text-lg font-semibold md:text-xl'>
                    {service.title}
                  </h3>
                </CardHeader>

                <CardContent>
                  <p className='text-muted-foreground'>{service.description}</p>
                </CardContent>

                <CardFooter>
                  <span className='flex items-center text-foreground hover:underline'>
                    Ver más <ArrowRight className='ml-2 size-4' />
                  </span>
                </CardFooter>
              </Card>
            </DialogTrigger>

            <DialogContent className='max-w-lg'>
              <DialogHeader>
                <DialogTitle className='text-primary font-bold'>{service.title}</DialogTitle>
                <DialogDescription>{service.fullDescription}</DialogDescription>
              </DialogHeader>

              <Image
                src='https://i.pinimg.com/736x/d0/44/78/d04478b7cd581a1233d7f71a27f62fda.jpg'
                alt={service.title}
                width={600}
                height={400}
                className='rounded-xl object-cover mt-4'
              />

              <div className='mt-6 flex justify-center'>
                <a href='#contact' className='w-full'>
                  <Button className='w-full bg-primary text-white shadow-md'>
                    Agendar Consulta
                  </Button>
                </a>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
