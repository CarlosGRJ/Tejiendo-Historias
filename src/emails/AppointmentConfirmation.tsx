import {
  Html,
  Text,
  Heading,
  Section,
  Container,
  Tailwind,
  Link,
} from '@react-email/components';

type Props = {
  name: string;
  date: string;
  time: string;
  service: string;
  calendarUrl?: string;
};

export default function AppointmentConfirmationEmail({
  name,
  date,
  time,
  service,
  calendarUrl,
}: Props) {
  return (
    <Html lang='es'>
      <Tailwind>
        <Section className='bg-[#faf9f6] py-10 px-4'>
          <Container className='bg-white rounded-xl shadow-md mx-auto max-w-md px-6 py-8 border border-[#e5e5e5]'>
            <Heading className='text-[#c95b9f] text-2xl font-bold mb-4 text-center'>
              Confirmación de cita
            </Heading>

            <Text className='text-[#333333] text-base mb-2'>
              Hola <strong>{name}</strong>, tu cita ha sido agendada con éxito.
            </Text>

            <Text className='text-[#333333] text-base mb-2'>
              📅 <strong>Fecha:</strong> {date}
              <br />
              🕒 <strong>Hora:</strong> {time}
              <br />
              💼 <strong>Servicio:</strong> {service}
            </Text>

            {calendarUrl && (
              <Text className='text-[#333333] text-base mt-4'>
                👉{' '}
                <Link
                  href={calendarUrl}
                  className='text-[#c95b9f] underline'
                  target='_blank'>
                  Agregar al Google Calendar
                </Link>
              </Text>
            )}

            <Text className='text-[#999999] text-sm text-center mt-6'>
              También se adjunta un archivo .ics por si deseas importarlo a otro
              calendario.
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
