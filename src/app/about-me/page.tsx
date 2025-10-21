'use client';

import AboutMeHeroSection from '@/components/sections/AboutMeHeroSection';
import AboutMeSection from '@/components/sections/AboutMeSection';
import ConferencesSection from '@/components/sections/conferencesSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';

export default function AboutMe() {
  return (
    <>
      <AboutMeHeroSection />
      <AboutMeSection />

      <ExperienceSection />

      <ConferencesSection />

      <ContactSection />
    </>
  );
}
