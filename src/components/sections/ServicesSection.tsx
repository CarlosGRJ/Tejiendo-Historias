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
import { SERVICES } from '@/constants';

export default function ServicesSection() {
  return (
    <section className='mb-14' id='services'>
      <h2 className='text-3xl md:text-4xl font-bold text-center text-[#F4A896] mb-16'>
        Servicios
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        {SERVICES.map((service) => (
          <Dialog key={service.id}>
            <DialogTrigger asChild>
              <Card className='group h-full flex flex-col pt-0 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.01] cursor-pointer'>
                <div className='w-full'>
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={300}
                    className='object-cover object-center max-h-48'
                  />
                </div>

                <CardHeader>
                  <h3 className='text-lg font-semibold md:text-xl mb-1 text-balance'>
                    {service.title}
                  </h3>
                  <div className='text-lg font-bold text-primary tracking-tight'>
                    {service.price}
                  </div>
                </CardHeader>

                <CardContent className='text-muted-foreground'>
                  <p>{service.description}</p>
                </CardContent>

                <CardFooter className='mt-auto'>
                  <span className='flex items-center text-sm text-primary font-medium group-hover:underline'>
                    Ver más <ArrowRight className='ml-2 size-4' />
                  </span>
                </CardFooter>
              </Card>
            </DialogTrigger>

            <DialogContent className='max-w-xl sm:max-w-xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='text-primary font-bold text-xl mb-2'>
                  {service.title}
                </DialogTitle>

                <div className='text-lg font-semibold text-primary bg-[#F4A896]/10 border border-[#F4A896] px-4 py-2 rounded-xl inline-block mb-4'>
                  {service.price}
                </div>

                <DialogDescription className='text-muted-foreground space-y-6'>
                  {service.sections ? (
                    service.sections.map((section, idx) => (
                      <article key={idx}>
                        <h4 className='text-base font-semibold text-foreground mb-1'>
                          {section.title}
                        </h4>
                        <p className='text-sm leading-relaxed whitespace-pre-line text-muted-foreground'>
                          {section.content}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className='whitespace-pre-line leading-relaxed text-sm'>
                      {service.fullDescription}
                    </p>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className='mt-6'>
                <a href='#contact'>
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
