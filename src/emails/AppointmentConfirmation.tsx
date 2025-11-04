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
  date: string;
  time: string;
  service: string;
};

export default function AppointmentConfirmationEmail({
  name,
  date,
  time,
  service,
}: Props) {
  return (
    <Html lang='es'>
      <Tailwind>
        <Section className='bg-[#faf9f6] py-10 px-4'>
          <Container className='bg-white rounded-xl shadow-md mx-auto max-w-md px-6 py-8 border border-[#e5e5e5]'>
            <Section className='text-center mb-6'>
              <Img
                src='https://dmrlsifttwszmipgmtun.supabase.co/storage/v1/object/public/images/logo/logo.webp'
                alt='Logo Tejiendo Historias'
                width={120}
                height={120}
                className='mx-auto'
              />
            </Section>

            <Heading className='text-[#c95b9f] text-2xl font-bold mb-4 text-center'>
              Confirmación de cita
            </Heading>

            <Text className='text-[#333333] text-base mb-2'>
              Hola <strong>{name}</strong>, tu cita ha sido agendada con éxito.
            </Text>

            <Text className='text-[#333333] text-base mb-4'>
              📅 <strong>Fecha:</strong> {date}
              <br />
              🕒 <strong>Hora:</strong> {time}
              <br />
              💼 <strong>Servicio:</strong> {service}
            </Text>

            <Text className='text-[#333333] text-base mt-2'>
              En breve Andrea se pondrá en contacto contigo para enviarte la
              invitación a tu sesión en línea.
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
