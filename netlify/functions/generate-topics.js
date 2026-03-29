const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { subject } = JSON.parse(event.body);
    
    if (!subject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Subject is required" })
      };
    }

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

    if (!response.ok) {
      // Fallback topics
      const fallbackTopics = `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ topics: fallbackTopics })
      };
    }

    const data = await response.json();
    const topics = data.choices?.[0]?.message?.content || `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ topics })
    };

  } catch (error) {
    console.error("Topic Generation Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate topics",
        topics: "1. Research Topic 1\n2. Research Topic 2\n3. Research Topic 3\n4. Research Topic 4\n5. Research Topic 5"
      })
    };
  }
};
