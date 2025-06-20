import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutMeHeroSection() {
  return (
    <section className='relative w-full min-h-[80vh] flex items-center justify-center bg-background'>
      {/* Full background image */}
      <Image
        src='/images/AboutMe-hero.webp'
        alt='Sobre mí - Psicóloga Andrea'
        fill
        priority
        unoptimized
        className='object-cover object-center z-0'
      />

      <div className='px-4 flex flex-col items-center justify-center text-center max-w-[600px] h-fit backdrop-blur-xs bg-[#FEE5C7]/65 rounded-2xl p-10 shadow-xl '>
        <h1 className='text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight drop-shadow-lg'>
          Sobre Mí
        </h1>
        <p className='text-lg text-[#333333] max-w-2xl drop-shadow-md mb-8'>
          Conoce mi formación, trayectoria y experiencia profesional en el
          acompañamiento psicológico.
        </p>

        <Button asChild size='lg' className='bg-primary text-white shadow-md'>
          <a href='#profile'>Ver mi trayectoria</a>
        </Button>
      </div>
    </section>
  );
}
