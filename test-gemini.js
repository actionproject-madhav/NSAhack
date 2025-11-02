// Simple Gemini API Test
// Run with: node test-gemini.js

// Get API key from environment variable
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const MODEL = 'gemini-2.5-flash';

async function testGeminiAPI() {
  console.log(' Testing Gemini API...');
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  console.log('Model:', MODEL);
  console.log('');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello! Please respond with just 'API is working!' if you can see this message."
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      })
    });

    console.log('📡 Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success! Full Response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('🤖 AI Response:', aiResponse);
      console.log('🎉 Gemini API is working perfectly!');
    } else {
      console.log('⚠️ Unexpected response format');
    }

  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

// Run the test
testGeminiAPI();
