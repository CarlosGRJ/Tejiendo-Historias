import {
  Html,
  Text,
  Heading,
  Section,
  Container,
  Tailwind,
  Img,
} from '@react-email/components';

type Props = {
  name: string;
  email: string;
  service: string;
  message: string;
};

export default function ContactFormNotificationEmail({
  name,
  email,
  service,
  message,
}: Props) {
  return (
    <Html lang='es'>
      <Tailwind>
        <Section className='bg-[#faf9f6] py-10 px-4'>
          <Container className='bg-white rounded-xl shadow-md mx-auto max-w-md px-6 py-8 border border-[#e5e5e5]'>
            <div className='flex justify-center mb-6'>
              <Img
                src='https://dmrlsifttwszmipgmtun.supabase.co/storage/v1/object/public/images/logo/logo.webp'
                alt='Logo Tejiendo Historias'
                width={120}
                height={120}
              />
            </div>

            <Heading className='text-[#c95b9f] text-2xl font-bold mb-4 text-center'>
              📩 Nuevo mensaje desde la página web
            </Heading>

            <Text className='text-[#333333] text-base mb-2'>
              Has recibido un nuevo mensaje de contacto:
            </Text>

            <Text className='text-[#333333] text-base mb-4 leading-relaxed'>
              👤 <strong>Nombre:</strong> {name}
              <br />
              📧 <strong>Correo:</strong> {email}
              <br />
              💼 <strong>Servicio de interés:</strong> {service}
              <br />
              📝 <strong>Mensaje:</strong>
              <br />
              {message}
            </Text>

            <Text className='text-[#999999] text-sm text-center mt-6'>
              Este correo es una notificación automática del sitio web.
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
