import Image from 'next/image';

export default function AboutMeSection() {
  return (
    <section id='about' className='py-24 bg-background'>
      <div className='container mx-auto px-4 flex flex-col md:flex-row items-center gap-16'>
        {/* Left - Image */}
        <div className='w-full md:w-1/2 relative overflow-hidden rounded-3xl shadow-lg group'>
          <Image
            src='/images/about-me.jpg' // replace with real image later
            alt='Andrea - Psicóloga'
            width={600}
            height={600}
            className='object-cover object-center rounded-3xl transition-transform duration-700 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700 rounded-3xl'></div>
        </div>

        {/* Right - Content */}
        <div className='w-full md:w-1/2 space-y-6 animate-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold text-primary'>
            Sobre Mí
          </h2>
          <p className='text-lg text-muted-foreground leading-relaxed'>
            Soy Andrea, psicóloga profesional especializada en el bienestar
            emocional y desarrollo personal. Con años de experiencia acompañando
            a pacientes en sus procesos, ofrezco un espacio seguro, empático y
            profesional.
          </p>
          <p className='text-lg text-muted-foreground leading-relaxed'>
            Mi enfoque combina herramientas basadas en evidencia con una visión
            humanista, adaptando cada sesión a las necesidades particulares de
            cada persona o pareja.
          </p>
          <p className='text-lg text-muted-foreground leading-relaxed'>
            • Certificada en Terapia Cognitivo-Conductual (TCC)
            <br />• Diplomado en Terapia de Pareja y Familia
            <br />• Miembro del Colegio Nacional de Psicología
          </p>
        </div>
      </div>
    </section>
  );
}
