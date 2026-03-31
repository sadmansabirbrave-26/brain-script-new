const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('generate-topics function called');
  console.log('Environment variables:', {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
    SITE_URL: process.env.SITE_URL
  });

  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const { subject } = JSON.parse(event.body);
    console.log('Subject received:', subject);
    
    if (!subject) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: "Subject is required" })
      };
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.log('No OpenRouter API key found, returning fallback');
      const fallbackTopics = `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ topics: fallbackTopics })
      };
    }

    console.log('Making API call to OpenRouter...');
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "Topic Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Generate 5 unique research topics about "${subject}". Make them specific, academic, and interesting. Format as a numbered list.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      console.log('OpenRouter API failed, using fallback');
      const fallbackTopics = `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ topics: fallbackTopics })
      };
    }

    const data = await response.json();
    const topics = data.choices?.[0]?.message?.content || `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;

    console.log('Topics generated successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ topics })
    };

  } catch (error) {
    console.error("Topic Generation Error:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: "Failed to generate topics",
        topics: "1. Research Topic 1\n2. Research Topic 2\n3. Research Topic 3\n4. Research Topic 4\n5. Research Topic 5"
      })
    };
  }
};
