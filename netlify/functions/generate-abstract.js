const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const { title, description } = JSON.parse(event.body);
    
    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Title and description are required" })
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "Abstract Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Write a professional academic abstract for a research paper titled "${title}" with the following description: "${description}". The abstract should be 150-250 words, well-structured, and academic in tone.`
          }
        ],
        temperature: 0.5,
        max_tokens: 400
      }),
    });

    if (!response.ok) {
      // Fallback abstract
      const fallbackAbstract = `This research explores ${title.toLowerCase()} within the broader context of contemporary academic discourse. The study employs comprehensive methodology to investigate key aspects and implications of this critical topic. Through rigorous analysis and empirical evidence, this paper addresses current challenges and proposes innovative solutions that advance our understanding of the field. The findings contribute significantly to existing literature and provide valuable insights for future research directions. This work demonstrates the importance of systematic inquiry and evidence-based conclusions in advancing knowledge and practical applications.`;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ text: fallbackAbstract })
      };
    }

    const data = await response.json();
    const abstract = data.choices?.[0]?.message?.content || `This research explores ${title.toLowerCase()} within the broader context of contemporary academic discourse.`;

    return {
      statusCode: 200,
      body: JSON.stringify({ text: abstract })
    };

  } catch (error) {
    console.error("Abstract Generation Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate abstract",
        text: "This research explores the topic within the broader context of contemporary academic discourse."
      })
    };
  }
};
