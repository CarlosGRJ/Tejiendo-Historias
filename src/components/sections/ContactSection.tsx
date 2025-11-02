'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Mail, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { FaWhatsapp } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SERVICES } from '@/constants';
import { useState } from 'react';
import { sendContactEmail } from '@/actions/emails/send-contact-email';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'),
  service: z.string().nonempty('Selecciona un servicio'),
  message: z.string().min(10, 'El mensaje es muy corto'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const email = 'tejiendohistorias.aag@gmail.com';
  const phone = '+525561800189';
  const whatsappNumber = '525561800189';

  const [cooldown, setCooldown] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      service: '',
      message: '',
    },
  });

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(email);
    toast.success('Correo copiado al portapapeles');
  };

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      await sendContactEmail(data);
      form.reset();
      toast.success('¡Mensaje enviado con éxito!');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id='contact'
      className='py-20 bg-secondary text-foreground scroll-mt-20'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-primary mb-12'>
          Contáctame
        </h2>

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Teléfono</h3>
              <a
                href={`tel:${phone}`}
                className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'>
                <Phone className='w-4 h-4' />
                {phone}
              </a>
            </div>

            <div>
              <h3 className='text-xl font-semibold mb-2'>Correo</h3>
              <div className='flex items-center gap-2'>
                <a
                  href={`mailto:${email}`}
                  className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'>
                  <Mail className='w-4 h-4' />
                  {email}
                </a>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={handleCopyEmail}
                  className='hover:bg-muted'>
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </div>

            <div>
              <h3 className='text-xl font-semibold mb-2'>WhatsApp</h3>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'>
                <FaWhatsapp className='w-4 h-4' />
                Enviar mensaje
              </a>
            </div>
          </div>

          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle>Escríbeme</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='contact-name'>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            id='contact-name'
                            placeholder='Nombre completo'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='contact-email'>
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            id='contact-email'
                            placeholder='correo@ejemplo.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='service'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='service'>Servicio</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <SelectTrigger id='service' className='w-full'>
                              <SelectValue placeholder='Selecciona un servicio' />
                            </SelectTrigger>
                            <SelectContent>
                              {SERVICES.map((service, index) => (
                                <SelectItem key={index} value={service.title}>
                                  {service.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='contact-message'>
                          Motivo de consulta
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id='contact-message'
                            rows={4}
                            placeholder='Cuéntame brevemente tu motivo de consulta...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='submit'
                    disabled={
                      form.formState.isSubmitting || loading || cooldown
                    }
                    className='w-full'>
                    <Send className='w-4 h-4 mr-2' />
                    {loading
                      ? 'Enviando...'
                      : cooldown
                        ? 'Mensaje enviado. Espera un momento...'
                        : 'Enviar mensaje'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
