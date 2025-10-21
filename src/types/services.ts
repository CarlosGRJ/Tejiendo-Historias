interface ServiceSection {
  title: string;
  content: string;
}

export interface Service {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  fullDescription?: string;
  sections?: ServiceSection[]; // para talleres
}
