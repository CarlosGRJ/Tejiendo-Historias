import { Service } from './types/services';

export const TIME_SLOTS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] as const;

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Proceso terapéutico individual',
    price: '$500/sesión',
    description:
      'Explora y construye caminos para darle forma a aquello que habita de manera latente en diferentes áreas de tu vida.',
    fullDescription:
      'En conjunto se construirá un transitar entre aquellos síntomas que se manifiesten en el proceso, habrá indagaciones, construcciones y como una entrada a un laberinto se podrá entretejer diversos caminos para darle forma, palabras, relación y construcción a lo que lleve tiempo de manera latente en diferentes esferas sociales, económicas, de pareja, de familia y en el autoconcepto.',
    image: '/images/services/terapeutico-individual.webp',
  },
  {
    id: 2,
    title: 'Proceso terapéutico de pareja',
    price: '$650/sesión',
    description:
      'Entreteje desde dos individualidades un proceso conjunto para abordar las diferencias y construir un lenguaje común.',
    fullDescription:
      'Cada pareja construye su proceso lenguaje y desde esas dos soledades que se unen se comienzan a entretejer diversos síntomas que también aparecen a partir de las diferencias, discusiones, roces, aquello que no termina por nombrarse y puede que comience a actuarse en las dinámicas de pareja.',
    image: '/images/services/terapeutico-pareja.webp',
  },
  {
    id: 3,
    title: 'Proceso terapéutico grupal',
    price: '$350/sesión',
    description:
      'Construye un espacio donde la diversidad de participantes permite apalabrar efectos e interpretaciones colectivas.',
    fullDescription:
      'Construir grupo requiere también de la presencia de sus participantes, los temas que se escuchan transforman la dinámica y construyen un discurso y un entretejido, aquella madeja de síntomas es escuchada por todxs y sobre todo actuada, manifestada, representada en los diferentes roles que cada persona del grupo ocupa, acompañar estos espacios permite que se puedan apalabrar cuáles son los efectos e interpretaciones que se producen en este encuentro entre diversidades.',
    image: '/images/services/terapeutico-grupal.webp',
  },
  {
    id: 4,
    title: 'Talleres',
    price: '$1,000 completo / $250 por sesión',
    description:
      'Escritura terapéutica, memorias corporales y acompañamiento en violencias a través de teatro y literatura.',
    sections: [
      {
        title: 'La escritura como espacio de escucha de lo inconsciente.',
        content: `Por medio de diferentes ejercicios de escritura podremos acercarnos a diferentes heridas, resignificarlas, construir baúles para alojar aquello habita en el inconsciente, acompañando las sesiones con autorxs de poesía, literatura y cómo es que han convertido la escritura en el utensilio para acercarse al dolor y la catarsis.`,
      },
      {
        title: 'Las memorias del cuerpo.',
        content: `Por medio de diferentes ejercicios tomados desde teatro playback y teatro espontáneo se podrá construir los puentes para transitar aquellas memorias que pueden estar dentro del cuerpo y representadas por medio de síntomas.`,
      },
      {
        title:
          'Identificación, detección, acompañamiento y escucha de las violencias.',
        content: `A partir de referentes teóricos, visuales y con ejercicios de teatro playback y teatro espontáneo podremos acceder a comprender cómo acompañar diferentes espacios de violencia en la familia, pareja, trabajo, escuela, entre otros.`,
      },
    ],
    image: '/images/services/talleres.webp',
  },
];
