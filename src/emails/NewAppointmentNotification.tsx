import {
  Html,
  Text,
  Heading,
  Section,
  Container,
  Tailwind,
  Link,
  Img,
} from '@react-email/components';

type Props = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message?: string;
  calendarUrl?: string;
};

export default function NewAppointmentNotificationEmail({
  name,
  email,
  phone,
  date,
  time,
  service,
  message,
  calendarUrl,
}: Props) {
  return (
    <Html lang='es'>
      <Tailwind>
        <Section className='bg-[#faf9f6] py-10 px-4'>
          <Container className='bg-white rounded-xl shadow-md mx-auto max-w-md px-6 py-8 border border-[#e5e5e5]'>
            <Section className='text-center mb-4'>
              <Img
                src='https://dmrlsifttwszmipgmtun.supabase.co/storage/v1/object/public/images/logo/logo.webp'
                alt='Logo Tejiendo Historias'
                width={100}
                height={100}
                className='mx-auto'
              />
            </Section>

            <Heading className='text-[#c95b9f] text-2xl font-bold mb-4 text-center'>
              📥 Nueva cita agendada
            </Heading>

            <Text className='text-[#333333] text-base mb-2'>
              Se ha agendado una nueva cita a través del sitio web:
            </Text>

            <Text className='text-[#333333] text-base mb-2'>
              📌 <strong>Nombre:</strong> {name}
              <br />
              📧 <strong>Correo:</strong> {email}
              <br />
              📞 <strong>Teléfono:</strong> {phone}
              <br />
              📅 <strong>Fecha:</strong> {date}
              <br />
              🕒 <strong>Hora:</strong> {time}
              <br />
              💼 <strong>Servicio:</strong> {service}
              {message && (
                <>
                  <br />
                  📝 <strong>Motivo:</strong> {message}
                </>
              )}
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
              También se adjunta un archivo .ics con los detalles del evento.
              <br />
              Este correo es una notificación automática del sistema de
              reservas.
            </Text>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
