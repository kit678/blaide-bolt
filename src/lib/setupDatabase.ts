import { supabase } from './supabase';

export async function setupDatabase() {
  // Optional: Just check if the blog_posts table exists by querying it.
  // If it doesn’t exist (error code '42P01'), log a warning or handle it as desired.
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.warn(
          'Warning: blog_posts table not found. Make sure to run your Supabase migrations.'
        );
      } else {
        console.error('Error checking blog_posts table:', error.message);
      }
    } else {
      console.log('blog_posts table is present. Database setup is fine.');
    }
  } catch (err: unknown) {
    console.error('Database setup error:', (err as Error).message);
  }
}
