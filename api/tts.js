// /api/tts.js
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = new TextToSpeechClient({
      credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    });

    const { text } = req.body;

    const request = {
      input: { text },
      voice: { languageCode: 'ko-KR', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    // 音頻轉換為 base64 並返回
    res.status(200).json({ audioContent: audioContent.toString('base64') });
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}
