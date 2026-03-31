const API_BASE = import.meta.env.VITE_API_URL || '';

export const generateTopics = async (subject: string) => {
  try {
    console.log('Calling generate topics function...');
    console.log('API_BASE:', API_BASE);
    console.log('Full URL:', `${API_BASE}/.netlify/functions/generate-topics`);
    
    const response = await fetch(`${API_BASE}/.netlify/functions/generate-topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data.topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    // Always return fallback topics
    return `1. The Impact of ${subject} on Modern Society\n2. Emerging Trends in ${subject} Research\n3. Critical Analysis of ${subject} Methodologies\n4. Future Directions in ${subject} Studies\n5. Interdisciplinary Approaches to ${subject}`;
  }
};

export const generateAbstract = async (title: string, description: string) => {
  try {
    const response = await fetch(`${API_BASE}/.netlify/functions/generate-abstract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate abstract');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error generating abstract:', error);
    // Fallback abstract
    return `This research explores ${title.toLowerCase()} within the broader context of contemporary academic discourse. The study employs comprehensive methodology to investigate key aspects and implications of this critical topic. Through rigorous analysis and empirical evidence, this paper addresses current challenges and proposes innovative solutions that advance our understanding of the field. The findings contribute significantly to existing literature and provide valuable insights for future research directions. This work demonstrates the importance of systematic inquiry and evidence-based conclusions in advancing knowledge and practical applications.`;
  }
};

export const checkPlagiarism = async (text: string) => {
  try {
    const response = await fetch(`${API_BASE}/.netlify/functions/check-plagiarism`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    
    // Even if the response has an error status, check if it contains a result
    if (data.result) {
      return data.result;
    }
    
    // If no result but there's an error message, throw with more details
    if (data.error) {
      throw new Error(data.error);
    }
    
    // If response is not ok and no result, throw with status
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    return data.result || 'Analysis completed but no result was returned.';
  } catch (error) {
    console.error('Error checking plagiarism:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Plagiarism check failed: ${error.message}`);
    }
    throw new Error('Plagiarism check failed due to network error');
  }
};
