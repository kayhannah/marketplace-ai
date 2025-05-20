const OpenAI = require('openai');

class ListingGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeImage(imageUrl) {
    try {
      // TODO: Implement image analysis using OpenAI's Vision API
      // This will detect objects, colors, brands, etc.
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and provide details about the item including: object type, brand, color, size, condition, and estimated value. Format the response as JSON." },
              { type: "image_url", image_url: imageUrl }
            ]
          }
        ],
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateListing(analysis) {
    try {
      // Generate a compelling listing description based on the analysis
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert marketplace listing writer. Create compelling, detailed, and professional listings that highlight the item's best features and value."
          },
          {
            role: "user",
            content: `Create a marketplace listing based on this analysis: ${JSON.stringify(analysis)}`
          }
        ],
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating listing:', error);
      throw new Error('Failed to generate listing');
    }
  }

  async suggestPrice(analysis) {
    try {
      // Generate price suggestions based on the analysis
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in marketplace pricing. Provide realistic price suggestions based on item condition, brand, and market value."
          },
          {
            role: "user",
            content: `Suggest a price range for this item based on this analysis: ${JSON.stringify(analysis)}`
          }
        ],
        max_tokens: 200
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error suggesting price:', error);
      throw new Error('Failed to suggest price');
    }
  }
}

module.exports = new ListingGenerator(); 