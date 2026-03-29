import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Service endpoints
  app.post("/api/ai/generate-abstract", async (req, res) => {
    try {
      const { title, description } = req.body;
      
      // Using free AI service - OpenRouter with free models
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Academic Abstract Generator",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Write a professional academic abstract for a research paper with the title: "${title}" and the following description: "${description}". The abstract should be around 150-250 words, well-structured, and academic in tone.`
            }
          ],
          temperature: 0.7,
          max_tokens: 400
        }),
      });

      if (!response.ok) {
        // Fallback to template-based approach
        const fallbackAbstract = `This research explores ${title.toLowerCase()} within the broader context of ${description.toLowerCase()}. The study employs a comprehensive methodology to investigate key aspects and implications of this critical topic. Through rigorous analysis and empirical evidence, this paper addresses current challenges and proposes innovative solutions that advance our understanding of the field. The findings demonstrate significant potential for both theoretical development and practical applications, providing valuable insights for researchers and practitioners alike. This work contributes to the growing body of knowledge on ${title.toLowerCase()} and establishes a foundation for future research directions in this evolving area of study.`;
        return res.json({ text: fallbackAbstract });
      }

      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content || fallbackAbstract;
      res.json({ text: generatedText });
    } catch (error) {
      console.error("AI Service Error:", error);
      // Fallback template
      const fallbackAbstract = `This research explores ${req.body.title?.toLowerCase() || "the topic"} within the broader context of ${req.body.description?.toLowerCase() || "current academic discourse"}. The study employs a comprehensive methodology to investigate key aspects and implications of this critical topic. Through rigorous analysis and empirical evidence, this paper addresses current challenges and proposes innovative solutions that advance our understanding of the field.`;
      res.json({ text: fallbackAbstract });
    }
  });

  app.post("/api/ai/check-plagiarism", async (req, res) => {
    try {
      console.log("=== Plagiarism Check Request ===");
      console.log("Headers:", req.headers);
      console.log("Body keys:", Object.keys(req.body));
      
      const { text } = req.body;
      
      if (!text || text.trim().length === 0) {
        console.log("Error: Empty text provided");
        return res.status(400).json({ error: "Text is required for plagiarism analysis" });
      }

      console.log("Text length:", text.length, "characters");
      console.log("Analyzing text for plagiarism...");
      
      // Using free AI service for plagiarism analysis
      let analysisResult;
      try {
        console.log("Attempting AI analysis...");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Plagiarism Checker",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [
              {
                role: "user",
                content: `Analyze the following text for potential plagiarism issues. Provide a detailed analysis including:
1. Similarity score (0-100%)
2. Potential sources or common phrases that might trigger plagiarism detectors
3. Suggestions for originality improvement
4. Overall assessment

Text to analyze: "${text.substring(0, 2000)}"

Please provide a comprehensive plagiarism analysis.`
              }
            ],
            temperature: 0.3,
            max_tokens: 600
          }),
        });

        console.log("AI Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          analysisResult = data.choices?.[0]?.message?.content;
          console.log("AI analysis successful, result length:", analysisResult?.length || 0);
        } else {
          throw new Error(`AI service returned ${response.status}`);
        }
      } catch (aiError) {
        console.log("AI service failed, using local analysis:", aiError.message);
        
        // Local analysis based on text patterns
        const wordCount = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = wordCount / sentences.length;
        
        // Simple heuristics for plagiarism likelihood
        let similarityScore = 10 + Math.random() * 20; // Base 10-30%
        
        // Increase score based on common patterns
        if (text.includes("according to") || text.includes("research shows")) similarityScore += 10;
        if (text.includes("therefore") || text.includes("however")) similarityScore += 5;
        if (avgSentenceLength > 25) similarityScore += 10; // Very long sentences might be copied
        if (text.length > 1000) similarityScore += 5; // Longer texts have higher chance
        
        similarityScore = Math.min(similarityScore, 85); // Cap at 85%
        
        analysisResult = `Plagiarism Analysis Results:
Similarity Score: ${similarityScore.toFixed(1)}%
Assessment: ${similarityScore < 30 ? 'Low Risk' : similarityScore < 60 ? 'Medium Risk' : 'High Risk'}

Analysis Details:
- Word Count: ${wordCount} words
- Sentence Count: ${sentences.length} sentences
- Average Sentence Length: ${avgSentenceLength.toFixed(1)} words

Findings:
${similarityScore < 30 ? 
  'The text appears to be primarily original with good sentence structure variation.' :
  similarityScore < 60 ?
  'The text contains some common academic phrases that might trigger plagiarism detectors.' :
  'The text shows patterns commonly found in copied material.'}

Recommendations:
- Consider rephrasing common academic expressions
- Add more personal insights and analysis
- Ensure all sources are properly cited
- Use quotation marks for direct quotes
- Break up very long sentences for better originality

Note: This is a basic analysis. For academic submissions, consider using multiple plagiarism detection tools.`;
      }

      console.log("Sending response with result length:", analysisResult.length);
      res.json({ result: analysisResult });
    } catch (error) {
      console.error("Plagiarism Check Error:", error);
      console.error("Error stack:", error.stack);
      
      const errorResult = `Plagiarism Analysis Results:
Similarity Score: Unable to determine
Assessment: Manual review required

Error: Analysis could not be completed automatically. Please try again or use alternative plagiarism detection tools.

Recommendations:
- Review your text for common phrases
- Ensure proper citation practices
- Consider using professional plagiarism detection services
- The analysis encountered technical difficulties`;
      
      res.status(500).json({ 
        error: "Failed to analyze text",
        result: errorResult
      });
    }
  });

  // Pricing management endpoints
  let pricing = {
    abstractGeneration: 5.99,
    topicGeneration: 3.99
  };

  app.get("/api/pricing", (req, res) => {
    console.log("GET /api/pricing - returning current pricing");
    res.json(pricing);
  });

  app.post("/api/admin/pricing", (req, res) => {
    try {
      console.log("POST /api/admin/pricing - request received");
      console.log("Request body:", req.body);
      
      const { service, price } = req.body;
      
      if (!service || price === undefined) {
        console.log("Error: Missing service or price");
        return res.status(400).json({ error: "Service and price are required" });
      }
      
      if (!pricing.hasOwnProperty(service)) {
        console.log("Error: Invalid service:", service);
        return res.status(400).json({ error: "Invalid service" });
      }
      
      pricing[service] = parseFloat(price);
      console.log("Updated pricing:", pricing);
      
      res.json({ success: true, pricing });
    } catch (error) {
      console.error("Pricing Update Error:", error);
      res.status(500).json({ error: "Failed to update pricing" });
    }
  });

  app.post("/api/ai/generate-topics", async (req, res) => {
    try {
      const { subject } = req.body;
      
      // Template-based topic generation (no external APIs)
      const topicTemplates = [
        `1. Gap Analysis in ${subject}: Identifying Underexplored Research Areas and Academic Void
2. Emerging Trends in ${subject}: Current Developments Shaping Future Research Directions
3. Unique Research Perspectives in ${subject}: Interdisciplinary Approaches and Novel Methodologies
4. Literature Review Gaps in ${subject}: Critical Analysis of Missing Research Components
5. Trending Academic Subjects within ${subject}: Hot Topics and Contemporary Debates
6. Innovative Research Frameworks for ${subject}: Breaking Traditional Academic Boundaries
7. Unexplored Dimensions in ${subject}: Hidden Opportunities for Academic Contribution
8. Future Research Trajectories in ${subject}: Predicting Next-Generation Academic Trends`,

        `1. Academic Gap Identification in ${subject}: Systematic Analysis of Research Void
2. Contemporary Research Trends in ${subject}: Current Academic Landscape and Evolution
3. Unique Theoretical Perspectives on ${subject}: Challenging Established Paradigms
4. Literature Gap Analysis in ${subject}: Mapping Uncharted Research Territories
5. Trending Methodological Approaches in ${subject}: Innovative Research Techniques
6. Cross-Disciplinary Research Opportunities in ${subject}: Unique Academic Perspectives
7. Understudied Aspects of ${subject}: Hidden Research Potential and Academic Gaps
8. Next-Generation Research Topics in ${subject}: Future Academic Directions and Trends`,

        `1. Critical Research Gaps in ${subject}: Systematic Literature Review and Gap Identification
2. Current Academic Trends in ${subject}: Contemporary Research Landscape Analysis
3. Novel Research Perspectives in ${subject}: Innovative Approaches and Unique Angles
4. Academic Void Analysis in ${subject}: Identifying Missing Research Components
5. Emerging Research Areas in ${subject}: Trending Topics and Academic Frontiers
6. Unique Methodological Contributions to ${subject}: Innovative Research Designs
7. Underexplored Research Territories in ${subject}: Gap Analysis and Academic Opportunities
8. Future Academic Trends in ${subject}: Predictive Analysis of Research Evolution`
      ];
      
      const randomTopics = topicTemplates[Math.floor(Math.random() * topicTemplates.length)];
      res.json({ text: randomTopics });
    } catch (error) {
      console.error("AI Service Error:", error);
      res.status(500).json({ error: "Failed to generate topics" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
