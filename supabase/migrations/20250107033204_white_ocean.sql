/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `excerpt` (text)
      - `content` (text)
      - `author` (text)
      - `date` (timestamptz)
      - `read_time` (integer)
      - `image` (text)
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for:
      - Public read access
      - Authenticated users can manage posts
*/

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  read_time integer NOT NULL DEFAULT 5,
  image text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public to read blog posts
CREATE POLICY "Allow public to read blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage blog posts
CREATE POLICY "Allow authenticated users to manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, date, read_time, image, tags)
VALUES
  (
    'The Future of AI in Investigative Journalism',
    'How AI is revolutionizing the way we uncover and verify news stories.',
    'Artificial Intelligence is transforming investigative journalism in unprecedented ways. At Xposition, we''re leveraging cutting-edge AI technologies to enhance our investigative capabilities and ensure the highest standards of journalistic integrity.

Our AI systems can analyze vast amounts of data, identify patterns, and flag potential leads that human journalists might miss. This doesn''t replace traditional journalism – instead, it augments our team''s capabilities and allows them to focus on what they do best: telling compelling stories that matter.

We''re also using AI to verify sources, cross-reference facts, and detect potential misinformation. This combination of human expertise and AI capabilities is helping us set new standards in investigative journalism.',
    'Sarah Chen',
    '2024-03-15',
    5,
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['AI', 'Journalism', 'Technology', 'Innovation']
  ),
  (
    'Predictive Analytics: Reshaping Financial Markets',
    'How Blaide Research is using AI to transform financial forecasting.',
    'The financial markets are becoming increasingly complex, with countless variables affecting market movements. Traditional analysis methods are struggling to keep up, but AI-powered predictive analytics is changing the game.

At Blaide Research, we''ve developed sophisticated AI models that can process massive amounts of market data in real-time, identifying trends and patterns that would be impossible to spot manually. Our systems analyze everything from market indicators to social media sentiment, providing a comprehensive view of market dynamics.

This technology isn''t just about making predictions – it''s about understanding the interconnected nature of global markets and making informed decisions based on data-driven insights.',
    'Michael Torres',
    '2024-03-12',
    7,
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Finance', 'AI', 'Predictive Analytics', 'Markets']
  ),
  (
    'Building the Next Generation of AI Startups',
    'Inside Blaide Foundry: How we are nurturing AI-driven innovation.',
    'The startup ecosystem is evolving rapidly, and AI is at the forefront of this transformation. At Blaide Foundry, we''re not just investing in startups – we''re building a comprehensive support system for the next generation of AI innovators.

Our incubation program provides more than just funding. We offer technical expertise, market insights, and access to our network of industry leaders. We believe that successful AI startups need a combination of cutting-edge technology, business acumen, and ethical considerations.

Through our program, we''re helping entrepreneurs turn their AI-driven ideas into successful, sustainable businesses that can make a real impact on the world.',
    'Lisa Wong',
    '2024-03-10',
    6,
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Startups', 'Innovation', 'AI', 'Entrepreneurship']
  );