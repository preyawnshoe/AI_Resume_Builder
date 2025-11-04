import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_AZURE_API_KEY || "6e2456dc18064c1299fc946b3d1e146f",
  baseURL: "https://nirmaanai.openai.azure.com/openai/deployments/gpt4",
  defaultQuery: { 'api-version': '2023-05-15' },
  defaultHeaders: {
    'api-key': process.env.NEXT_PUBLIC_AZURE_API_KEY || "6e2456dc18064c1299fc946b3d1e146f",
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { formData } = req.body;

      const prompt = `
Based on the following user input data, generate AI suggestions for individual fields that need enhancement. Follow these important rules:

1. **PRESERVE PERSONAL DETAILS**: Do NOT change or modify the user's name, email, phone, linkedin, or portfolio. These should remain unchanged.

2. **GENERATE FIELD SUGGESTIONS**: For each non-empty field that could benefit from AI enhancement, provide 3 different professional variations.

3. **FIELDS TO ENHANCE**:
   - summary: Create 3 different professional summary variations
   - technicalSkills: Create 3 different ways to present technical skills
   - softSkills: Create 3 different ways to present soft skills
   - achievements: Create 3 different ways to present achievements
   - hobbies: Create 3 different ways to present hobbies
   - certifications: Create 3 different ways to present certifications
   - experiences[].details: For each experience, create 3 different professional descriptions of responsibilities and achievements
   - projects[].details: For each project, create 3 different professional descriptions of the project scope and contributions
   - educations[].details: For each education entry, create 3 different professional descriptions highlighting academic achievements, GPA, honors, relevant coursework, or extracurricular activities

4. **PRESERVE EMPTY FIELDS**: If a field is empty in the user input, do not generate suggestions for it.

5. **STRUCTURE**: Return a JSON object with field-specific suggestions:

{
  "fieldSuggestions": {
    "summary": ["suggestion1", "suggestion2", "suggestion3"],
    "technicalSkills": ["suggestion1", "suggestion2", "suggestion3"],
    "softSkills": ["suggestion1", "suggestion2", "suggestion3"],
    "achievements": ["suggestion1", "suggestion2", "suggestion3"],
    "hobbies": ["suggestion1", "suggestion2", "suggestion3"],
    "certifications": ["suggestion1", "suggestion2", "suggestion3"],
    "experiences": [
      {
        "index": 0,
        "details": ["suggestion1", "suggestion2", "suggestion3"]
      }
    ],
    "projects": [
      {
        "index": 0,
        "details": ["suggestion1", "suggestion2", "suggestion3"]
      }
    ],
    "educations": [
      {
        "index": 0,
        "details": ["suggestion1", "suggestion2", "suggestion3"]
      }
    ]
  }
}

User input data:
${JSON.stringify(formData, null, 2)}

Output only the JSON object, no additional text.
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4', // This should match your Azure deployment name
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });

      console.log('OpenAI Response:', response);
      console.log('Response choices:', response.choices);
      console.log('Response content:', response.choices[0]?.message?.content);

      const content = response.choices[0].message.content.trim();
      console.log('Trimmed content:', content);
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const result = JSON.parse(cleanedContent);

      // Return the field suggestions
      res.status(200).json(result.fieldSuggestions || {});
    } catch (error) {
      console.error('Resume generation error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to generate resume', 
        details: error.message,
        type: error.constructor.name 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}