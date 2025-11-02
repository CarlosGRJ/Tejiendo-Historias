import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function AboutMeSection() {
  return (
    <section
      id='about'
      className='py-24 bg-gradient-to-b from-[#FEE5C7]/60 to-background'>
      <div className='container mx-auto px-4 flex flex-col md:flex-row items-start gap-16'>
        {/* Left - Image */}
        <div className='w-full md:w-1/2 relative overflow-hidden rounded-3xl shadow-lg group'>
          <Image
            src='/images/avatar.webp'
            alt='Andrea Armenta García - Psicóloga con enfoque psicoanalítico'
            width={600}
            height={600}
            className='w-full object-cover object-center rounded-3xl transition-transform duration-700 group-hover:scale-105'
            priority
          />
          <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700 rounded-3xl'></div>
        </div>

        {/* Right - Content */}
        <div className='w-full md:w-1/2 space-y-6 animate-fade-in text-muted-foreground text-base leading-relaxed'>
          <h1 className='text-3xl md:text-4xl font-bold text-primary'>
            Sobre mí
          </h1>

          <p>
            Hola, soy <strong>Andrea Armenta García</strong>, psicóloga con
            enfoque psicoanalítico, feminista y trabajo desde una perspectiva de
            género.
          </p>

          <p>
            Me formé en Psicología en la Universidad Autónoma Metropolitana,
            Unidad Xochimilco, y tengo una maestría en Teoría Crítica y Estudios
            Estructurales en el Colegio Michel Foucault, donde profundicé en
            clínica psicoanalítica, subjetividad y problemáticas contemporáneas.
          </p>

          <p>
            Mi trabajo se basa en la escucha. No busco dar respuestas rápidas ni
            ofrecer soluciones universales. Acompaño a cada persona desde la
            pregunta singular, desde ese malestar que a veces no tiene palabras,
            pero sí historia, cuerpo o repetición.
          </p>

          <p>
            Me interesa crear espacios terapéuticos éticos, donde podamos hablar
            de lo que duele, de lo que se oculta, de lo que se repite sin
            entender por qué. Trabajo con personas que atraviesan crisis,
            ansiedad, relaciones difíciles, duelos, conflictos con el cuerpo, la
            identidad, el deseo… o simplemente con quienes <b>intuyen que algo no
            está bien y quieren empezar a escucharse</b>.
          </p>

          <p>
            Desde mi formación y mi práctica, creo que la terapia es una forma
            de cuidarse, de construir autonomía y de abrir posibilidades. No hay
            respuestas rápidas, ni diagnósticos, sino un espacio abierto a la
            escucha.
          </p>

          <Separator className='my-8' />

          <h2 className='text-2xl font-semibold text-foreground'>
            Tejiendo Historias
          </h2>

          <p>
            <strong>Tejiendo Historias</strong> nace de una búsqueda por
            construir espacios de acompañamiento en dónde los nudos que no han
            podido apalabrarse puedan encontrar un espacio para traer a la
            memoria aquellos trazos que en algún momento no pudieron transitar.
          </p>
        </div>
      </div>
    </section>
  );
}
