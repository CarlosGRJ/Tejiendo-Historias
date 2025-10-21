'use client';

import Image from 'next/image';

export default function ExperienceSection() {
  return (
    <section id='experience' className='bg-background py-24'>
      <div className='container px-4 mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold text-primary mb-16 text-center'>
          Trayectoria Profesional
        </h2>

        <div className='space-y-16 text-muted-foreground text-base leading-relaxed'>
          {/* Experiencia */}
          {[
            {
              logo: '/images/experience/fiscalia.webp',
              alt: 'Logo Fiscalía CDMX',
              title:
                'Colaboré en la Fiscalía General de Justicia de la Ciudad de México en el Centro de Terapia de Apoyo a Víctimas de Delitos Sexuales (CTA)',
              description: `Escuchando y acompañando a mujeres que habían realizado su denuncia frente a las autoridades ministeriales a lo largo de todo su proceso (asistencial frente a la entrevista junto con ministerio público, audiencias y proceso terapéutico individual)`,
            },
            {
              logo: '/images/experience/la-salle.webp',
              alt: 'Logo La Salle',
              title:
                'Profesora en la Facultad Mexicana de Medicina de La Salle en la asignatura del Taller de Afrontamiento.',
              description: `Acompañando a los alumnos del segundo semestre de la carrera para poder apalabrar y transitar los diferentes momentos estresantes que se viven en la carrera y construyendo en conjunto herramientas para la gestión del tiempo, estrategias de estudio, reconocimiento de las emociones y pensamientos ansiosos.`,
            },
            {
              logo: '/images/experience/michel-foucault.webp',
              alt: 'Logo Colegio Michel Foucault',
              title:
                'Coordinación del Centro de Investigación y Desarrollo Educativo (CIDE) del Colegio Michel Foucault y Coordinación Clínica de Acompañamiento Psicológico y Proyectos Sociales del Colegio Michel Foucault (CAPPS).',
              description: `Generando la divulgación de textos y proponiendo la creación ensayos académicos en torno a la crítica de las ciencias sociales por parte del alumnado de las diferentes maestrías ofrecidas en el colegio. Además de impulsar la propuesta hacia una clínica de acompañamiento alternativa para el ofrecimiento de apoyo a las personas sobrevivientes de violencias.`,
              extra: `Acompañé en el proyecto llamado Red de Escucha en el Colegio Michel Foucault. Un proyecto lanzado durante el periodo de la pandemia que ofrecía espacios de escucha para personas en crisis y de recursos limitados para promover el acceso a los procesos terapéuticos con costos accesibles.`,
            },
            {
              logo: '/images/experience/sorece.webp',
              alt: 'Logo Sorece',
              title:
                'Psicóloga en Sorece: Asociación de Psicólogas feministas.',
              description: `Acompañando diferentes procesos a mujeres, hombres, adolescencias, personas de la comunidad LGBTQANB+, parejas con enfoque psicoanalítico desde la terapia feminista interseccional y con perspectiva de género.
              
              Clínica privada con mujeres, hombres, adolescentes, parejas, personas de la comunidad LGBTNBQA+ 
              Desde un enfoque psicoanalítico y a través de procesos largos he acompañado a diversas historias que han buscado darle palabras a sus heridas.`,
            },
          ].map(({ logo, alt, title, description, extra }) => (
            <article
              key={title}
              className='flex flex-col sm:flex-row items-center gap-6 border-l-4 border-primary pl-6'>
              <div className='w-28 h-28 min-w-[7rem] rounded-xl shadow-md bg-white flex items-center justify-center p-2 border'>
                <Image
                  src={logo}
                  alt={alt}
                  width={96}
                  height={96}
                  className='object-contain'
                />
              </div>

              <div className='text-left space-y-2'>
                <h3 className='text-xl font-semibold text-foreground'>
                  {title}
                </h3>
                <p>{description}</p>
                {extra && <p className='mt-1'>{extra}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
