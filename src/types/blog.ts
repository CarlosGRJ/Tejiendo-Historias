export interface Post {
  readonly id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  readonly created_at: string;
  updated_at: string;
  user_id: string;
}

export type PostUpdate = Partial<Omit<Post, 'id' | 'created_at' | 'slug'>>;
