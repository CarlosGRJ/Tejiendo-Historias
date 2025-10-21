import Image from 'next/image';

export default function ServicesIntro() {
  return (
    <section
      id='services-intro'
      className='bg-background text-foreground py-20 px-6 md:px-10 lg:px-20'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        <div>
          <h2 className='text-3xl md:text-4xl font-bold text-[#F4A896] mb-6 leading-snug'>
            La caja
          </h2>

          <blockquote className='text-muted-foreground italic border-l-4 pl-4 mb-8'>
            &quot;Llevarla arrastrando de una habitación a otra. Ver cómo se
            amontona el serrín en las esquinas. Barrer -aquí también, qué
            extraño-. O quién sabe si el agua, formando sólido. Mejor barrer. O
            bien irse. Arrastrando la caja. No es fácil ofrecer cobijo cuando se
            lleva a rastras una caja vacía. &quot;
            <br />
            <span className='not-italic font-medium block mt-2'>
              — Chantal Maillard
            </span>
          </blockquote>

          <div className='space-y-4 text-base text-muted-foreground leading-relaxed'>
            <p>
              Construir tu espacio terapéutico es algo que requiere valentía,
              escucha, compromiso y cierto arrojo. Arrojarse a la incertidumbre
              de lo desconocido, del laberinto.
            </p>
            <p>
              ¿Te has sentido con más preguntas que respuestas? <br />
              ¿Has sentido que arrastras cajas que te generan una sensación de
              vacío?
            </p>
            <p>
              Todo el tiempo parece que buscamos respuestas rápidas, algo que
              cure o quite los dolores que llevamos dentro, en el cuerpo, en la
              memoria, pero ¿cómo acercarnos a ellos?
            </p>
            <p>
              El espacio de escucha en un trabajo continúo entre la persona que
              escucha y la persona que suelta ese dolor -en el medio silencio,
              vacío, interpretaciones, preguntas, miradas, acaso palabras que
              remueven- como si se tratara de escombros o una supuesta
              arqueología.
            </p>
            <p>
              ¿Has sentido que tu cuerpo tiene muchas cosas qué decir?
              <br />
              ¿Te ha pasado que repites patrones o comportamientos que pensabas
              que ya habías superado?
            </p>
            <p>
              Nuestra historia nos acompaña pero podemos hacer el viaje para re
              - transitarla.
            </p>
            <p>¿Qué viaje te gustaría emprender?</p>
          </div>
        </div>

        {/* Imagen ilustrativa o emocional */}
        <div className='w-full'>
          {/* Imagen para móvil y tablet */}
          <div className='block lg:hidden mb-10'>
            <Image
              src='/images/services/quote.webp'
              alt='Ilustración terapéutica emocional'
              width={400}
              height={400}
              className='rounded-xl shadow-md w-full h-auto'
              priority
            />
          </div>

          {/* Imagen para desktop */}
          <div className='hidden lg:block'>
            <Image
              src='/images/services/quote.webp'
              alt='Ilustración terapéutica emocional'
              width={500}
              height={500}
              className='rounded-2xl shadow-xl w-full h-auto'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
