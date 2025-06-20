import ContactSection from '@/components/sections/ContactSection';
import React from 'react';

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <ContactSection />
    </div>
  );
}
