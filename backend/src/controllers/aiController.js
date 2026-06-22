const Tattoo = require('../models/Tattoo');
const Artist = require('../models/Artist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

function extractJsonFromResponseContent(content) {
  if (!Array.isArray(content)) return null;

  let text = '';
  for (const item of content) {
    if (typeof item.text === 'string') {
      text += item.text;
    }
    if (Array.isArray(item.content)) {
      const nested = extractJsonFromResponseContent(item.content);
      if (nested) text += nested;
    }
  }

  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

function normalizeStyle(style) {
  if (!style || typeof style !== 'string') return '';
  const normalized = style.trim();
  const styles = [
    'Traditional',
    'Anime',
    'Japanese',
    'Realism',
    'Tribal',
    'Geometric',
    'Minimalist',
    'Blackwork',
    'Watercolor',
    'Neo-traditional',
  ];
  const found = styles.find((item) => item.toLowerCase() === normalized.toLowerCase());
  return found || normalized;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.matchTattoo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Image file is required', 400));
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    return next(new AppError('OpenAI API key is not configured', 500));
  }

  const mimeType = req.file.mimetype;
  const imageBase64 = req.file.buffer.toString('base64');
  const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

  const prompt = `You are an expert tattoo stylist and visual analyst. Analyze the uploaded tattoo image and return only valid JSON with keys: style, complexity, colorType, elements.\n- style should be one of Traditional, Anime, Japanese, Realism, Tribal, Geometric, Minimalist, Blackwork, Watercolor, Neo-traditional.\n- complexity should be one of low, medium, high.\n- colorType should be one of monochrome, muted, vibrant, full-color.\n- elements should be an array of short descriptive terms.\nReturn only a JSON object and nothing else.`;

  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: imageDataUrl },
          ],
        },
      ],
    }),
  });

  const responseBody = await openAiResponse.json();
  if (!openAiResponse.ok) {
    const errorMessage = responseBody.error?.message || 'OpenAI image analysis failed.';
    return next(new AppError(errorMessage, 502));
  }

  const output = responseBody.output?.[0]?.content;
  const rawText = extractJsonFromResponseContent(output);
  let analysis = {
    style: '',
    complexity: '',
    colorType: '',
    elements: [],
  };

  if (rawText) {
    try {
      const parsed = JSON.parse(rawText);
      analysis = {
        style: normalizeStyle(parsed.style),
        complexity: typeof parsed.complexity === 'string' ? parsed.complexity.trim().toLowerCase() : '',
        colorType: typeof parsed.colorType === 'string' ? parsed.colorType.trim().toLowerCase() : '',
        elements: Array.isArray(parsed.elements)
          ? parsed.elements.map((item) => String(item).trim()).filter(Boolean)
          : [],
      };
    } catch (err) {
      return next(new AppError('Unable to parse AI analysis result.', 502));
    }
  }

  const styleFilter = analysis.style ? { style: new RegExp(`^${escapeRegExp(analysis.style)}$`, 'i') } : {};
  const specialtyFilter = analysis.style
    ? { specialties: { $regex: new RegExp(escapeRegExp(analysis.style), 'i') } }
    : {};

  let recommendedTattoos = await Tattoo.find(styleFilter)
    .select('title imageUrl style price')
    .limit(6);

  if (recommendedTattoos.length === 0) {
    recommendedTattoos = await Tattoo.find().select('title imageUrl style price').limit(6);
  }

  let recommendedArtists = await Artist.find(specialtyFilter)
    .select('name specialties photoUrl location rating')
    .limit(6);

  if (recommendedArtists.length === 0) {
    recommendedArtists = await Artist.find().select('name specialties photoUrl location rating').limit(6);
  }

  res.status(200).json({
    success: true,
    data: {
      style: analysis.style || 'Unknown',
      complexity: analysis.complexity || 'unknown',
      colorType: analysis.colorType || 'unknown',
      elements: analysis.elements,
      recommendedTattoos,
      recommendedArtists,
    },
  });
});
