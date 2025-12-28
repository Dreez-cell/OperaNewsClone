import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update trending scores for recent posts
    const { error: updateError } = await supabase.rpc('update_trending_scores');
    if (updateError) throw updateError;

    // Get top hashtags
    const { data: topHashtags, error: hashtagError } = await supabase
      .from('hashtags')
      .select('*')
      .order('use_count', { ascending: false })
      .limit(20);

    if (hashtagError) throw hashtagError;

    // Get trending posts
    const { data: trendingPosts, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        user_profiles!posts_user_id_fkey(id, username, email),
        communities(id, name, display_name, icon_url)
      `)
      .order('trending_score', { ascending: false })
      .limit(10);

    if (postsError) throw postsError;

    // Use AI to analyze trending topics
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
            content: 'You are a trending topics analyzer. Given hashtags and post titles, identify emerging trends and topics. Return JSON: {trends: [{topic: string, description: string, relevance: number}]}',
          },
          {
            role: 'user',
            content: `Hashtags: ${topHashtags.map((h: any) => h.tag).join(', ')}\n\nTop Posts: ${trendingPosts.map((p: any) => p.title).join('\n')}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    return new Response(
      JSON.stringify({
        hashtags: topHashtags,
        posts: trendingPosts,
        aiAnalysis: analysis,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
