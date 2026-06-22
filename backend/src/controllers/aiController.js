const Tattoo = require('../models/Tattoo');
const Artist = require('../models/Artist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { detectStyle } = require('../utils/styleDetector');
const { getRecommendations } = require('../utils/recommendationEngine');

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

/**
 * Local AI Match - No external APIs
 * Analyzes filename and uses keyword matching to detect style
 */
exports.matchTattooLocal = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Image file is required', 400));
  }

  // Extract filename from uploaded file
  const filename = req.file.originalname;

  // Detect style using local keyword matching
  const { style: detectedStyle, confidence, matchedKeywords, elements } = detectStyle(filename);

  // Get recommendations from MongoDB
  const { tattoos, artists } = await getRecommendations(detectedStyle, matchedKeywords);

  // Determine complexity and color type based on keywords (simple heuristics)
  let complexity = 'medium';
  let colorType = 'unknown';

  if (matchedKeywords.some(k => ['minimal', 'simple', 'small', 'tiny'].includes(k.toLowerCase()))) {
    complexity = 'low';
  } else if (matchedKeywords.some(k => ['detailed', 'realistic', 'complex'].includes(k.toLowerCase()))) {
    complexity = 'high';
  }

  if (matchedKeywords.some(k => ['black', 'blackwork', 'dark'].includes(k.toLowerCase()))) {
    colorType = 'monochrome';
  } else if (matchedKeywords.some(k => ['watercolor', 'color', 'vibrant'].includes(k.toLowerCase()))) {
    colorType = 'vibrant';
  } else if (detectedStyle === 'Blackwork' || detectedStyle === 'Minimalist') {
    colorType = 'monochrome';
  } else {
    colorType = 'muted';
  }

  res.status(200).json({
    success: true,
    data: {
      detectedStyle,
      confidence,
      style: detectedStyle,
      complexity,
      colorType,
      elements: elements.length > 0 ? elements : matchedKeywords, // Use extracted elements, fallback to keywords
      recommendedTattoos: tattoos.map(t => ({
        _id: t._id || t.id,
        title: t.title,
        imageUrl: t.imageUrl,
        style: t.style,
        price: t.price,
      })),
      recommendedArtists: artists.map(a => ({
        _id: a._id || a.id,
        name: a.name,
        photoUrl: a.photoUrl,
        location: a.location,
        rating: a.rating,
        specialties: a.specialties,
      })),
    },
  });
});
