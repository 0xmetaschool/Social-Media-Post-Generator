import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptForPlatform = (
  platform: string, 
  description: string, 
  makeThread: boolean, 
  wordLimit: number,
  tone: string,
  includeHashtags: boolean,
  includeEmoji: boolean
) => {
  const basePrompt = `Write a ${platform} post about: ${description}

Key guidelines:
- Write in a ${tone.toLowerCase()} tone
- Aim for approximately ${wordLimit} words
- Write in a natural, conversational style
- Use simple, everyday language
${includeEmoji ? '- Include relevant emojis where appropriate' : '- Do not use any emojis'}
${includeHashtags ? '- Add relevant hashtags at the end' : '- Do not include any hashtags'}`;

  switch (platform) {
    case 'instagram':
      return `${basePrompt}
Additional notes:
- Focus on visual storytelling
- Keep the tone engaging and authentic
${includeHashtags ? '- Add 3-5 relevant hashtags at the end' : ''}`;
    
    case 'facebook':
      return `${basePrompt}
Additional notes:
- Write in a personal, engaging style
- Share insights or experiences naturally
- Add a subtle call-to-action if relevant
${includeHashtags ? '- Add 1-2 relevant hashtags if needed' : ''}`;
    
    case 'twitter':
      return makeThread 
        ? `${basePrompt}
Additional notes:
- Break this into 3-5 connected tweets
- Each tweet should flow naturally into the next
- Keep each tweet under 280 characters
- Number each tweet
- Focus on telling a coherent story across the thread`
        : `${basePrompt}
Additional notes:
- Keep it under 280 characters
- Make it engaging and shareable
${includeHashtags ? '- Add 1-2 relevant hashtags' : ''}`;
    
    case 'linkedin':
      return `${basePrompt}
Additional notes:
- Maintain a professional tone
- Include industry insights if relevant
- Focus on value and expertise
- Keep paragraphs short and scannable
${includeHashtags ? '- Add 2-3 relevant professional hashtags' : ''}`;
    
    default:
      return basePrompt;
  }
};

export async function POST(req: Request) {
  try {
    const { 
      platform, 
      description, 
      makeThread, 
      wordLimit,
      tone,
      includeHashtags,
      includeEmoji,
    } = await req.json();

    const prompt = getPromptForPlatform(
      platform, 
      description, 
      makeThread, 
      wordLimit,
      tone,
      includeHashtags,
      includeEmoji
    );

    const systemPrompt = `You are a skilled social media writer who creates ${tone.toLowerCase()} content that resonates with the audience. Your writing should:

- Maintain a consistent ${tone.toLowerCase()} tone throughout
- Use natural, conversational language
- Be concise and impactful
${includeEmoji ? '- Use emojis thoughtfully and sparingly' : '- Avoid using emojis'}
${includeHashtags ? '- Include relevant hashtags that add value' : '- Exclude hashtags'}
- Express emotions and enthusiasm through well-crafted words
- Focus on creating genuine connections with the audience

${platform === 'linkedin' 
  ? 'For LinkedIn, maintain professionalism while being approachable and authentic.' 
  : platform === 'twitter' && makeThread 
    ? 'For Twitter threads, maintain a natural flow between tweets while keeping each one engaging.' 
    : ''}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    return NextResponse.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
