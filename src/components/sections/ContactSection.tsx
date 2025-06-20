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

const services = [
  'Terapia Individual',
  'Terapia de Pareja',
  'Orientación Familiar',
  'Consulta Online',
];

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'),
  service: z.string().nonempty('Selecciona un servicio'),
  message: z.string().min(10, 'El mensaje es muy corto'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const email = 'andrea@tejiendohistorias.com';
  const phone = '+525561800189';
  const whatsappNumber = '525561800189';

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

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
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
          {/* Contact Info */}
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

          {/* Contact Form */}
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
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder='Nombre completo' {...field} />
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
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
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
                        <FormLabel>Servicio</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Selecciona un servicio' />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service, index) => (
                                <SelectItem key={index} value={service}>
                                  {service}
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
                        <FormLabel>Motivo de consulta</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder='Cuéntame brevemente tu motivo de consulta...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type='submit' className='w-full'>
                    <Send className='w-4 h-4 mr-2' />
                    Enviar mensaje
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
