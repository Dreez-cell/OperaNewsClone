import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRequest {
  content: string;
  title?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { content, title }: ModerationRequest = await req.json();

    // Use AI to moderate content
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
            content: 'You are a content moderation AI. Analyze text for harmful content, spam, hate speech, or inappropriate material. Return JSON: {safe: boolean, reason: string, categories: string[]}',
          },
          {
            role: 'user',
            content: `Title: ${title || 'N/A'}\n\nContent: ${content}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const aiData = await aiResponse.json();
    const moderation = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(moderation), {
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
