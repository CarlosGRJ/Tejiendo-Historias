import { Metadata } from 'next';
import { getPostBySlug } from '@/actions/blog/posts';
import BlogPostClient from '@/components/blog-post-client/BlogPostClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | Tejiendo Historias',
      description: 'Este artículo no está disponible o ha sido eliminado.',
    };
  }

  const title = `${post.title} | Tejiendo Historias`;
  const description = `${post.summary}. Lectura para tu desarrollo emocional y autoconocimiento desde la mirada terapéutica.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.tejiendohistoriaas.com.mx/blog/${post.slug}`,
      siteName: 'Tejiendo Historias',
      images: [
        {
          url: post.image_url,
          alt: `Imagen destacada del artículo: ${post.title}`,
        },
      ],
      locale: 'es_MX',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image_url],
    },
  };
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
