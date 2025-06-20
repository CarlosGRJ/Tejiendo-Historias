import ContactSection from '@/components/sections/ContactSection';
import HeroHome from '@/components/sections/HeroHome';
import ServicesSection from '@/components/sections/ServicesSection';

export default function Home() {
  return (
    <>
      <HeroHome />

      <div className='w-[90%] mx-auto rounded-4xl overflow-hidden'>
        <ServicesSection />
      </div>
      <ContactSection />
    </>
  );
}
