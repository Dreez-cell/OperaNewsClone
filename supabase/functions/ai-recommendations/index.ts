import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  userId?: string;
  limit?: number;
  context?: 'home' | 'trending' | 'personalized';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, limit = 20, context = 'home' }: RecommendationRequest = await req.json();

    let posts;

    if (context === 'trending') {
      // Get trending posts based on algorithm
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles!posts_user_id_fkey(id, username, email),
          communities(id, name, display_name, icon_url),
          post_votes!left(vote_type)
        `)
        .order('trending_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      posts = data;
    } else if (context === 'personalized' && userId) {
      // Get personalized recommendations using AI
      const { data: userPosts, error: userError } = await supabase
        .from('posts')
        .select('title, content')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (userError) throw userError;

      // Use AI to analyze user preferences and recommend similar content
      const aiResponse = await fetch(`${Deno.env.get('ONSPACE_AI_BASE_URL')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('ONSPACE_AI_API_KEY')}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a content recommendation AI. Analyze user post history and suggest relevant topics, keywords, and hashtags they might be interested in. Return only a JSON array of keywords.',
            },
            {
              role: 'user',
              content: `User post history: ${JSON.stringify(userPosts)}. Suggest 10 relevant keywords for content recommendations.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const aiData = await aiResponse.json();
      const keywords = JSON.parse(aiData.choices[0].message.content);

      // Search posts matching AI-suggested keywords
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles!posts_user_id_fkey(id, username, email),
          communities(id, name, display_name, icon_url),
          post_votes!left(vote_type)
        `)
        .textSearch('title', keywords.join(' | '))
        .neq('user_id', userId)
        .order('trending_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      posts = data;
    } else {
      // Default: Get recent posts ordered by trending score
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles!posts_user_id_fkey(id, username, email),
          communities(id, name, display_name, icon_url),
          post_votes!left(vote_type)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      posts = data;
    }

    return new Response(JSON.stringify({ posts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
