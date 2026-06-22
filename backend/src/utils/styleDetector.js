/**
 * ============================================================
 * src/utils/styleDetector.js
 * ============================================================
 *
 * Local keyword-based style detection for tattoo images.
 * Analyzes filename to detect tattoo style and extract elements.
 */

const STYLE_KEYWORDS = {
  Japanese: ['dragon', 'koi', 'samurai', 'oni', 'sakura', 'chrysanthemum', 'wave', 'geisha', 'tiger', 'snake', 'phoenix'],
  Blackwork: ['lion', 'wolf', 'raven', 'skull', 'crow', 'panther', 'black', 'dark', 'gothic', 'tribal'],
  Watercolor: ['flower', 'rose', 'blossom', 'petal', 'bloom', 'floral', 'watercolor', 'splash', 'color'],
  Geometric: ['mandala', 'geometric', 'sacred', 'pattern', 'symmetry', 'hexagon', 'triangle', 'circle'],
  Tribal: ['tribal', 'polynesian', 'maori', 'celtic', 'indigenous'],
  Anime: ['anime', 'manga', 'cartoon', 'character'],
  Traditional: ['traditional', 'classic', 'vintage', 'old-school', 'sailor'],
  Realism: ['realistic', 'portrait', 'photo', 'real', 'detailed'],
  Minimalist: ['minimal', 'simple', 'line', 'small', 'tiny', 'delicate'],
};

// Element keywords for extracting tattoo elements from filenames
const ELEMENT_KEYWORDS = {
  // Animals
  animals: {
    eagle: ['eagle', 'bird'],
    wolf: ['wolf', 'animal'],
    lion: ['lion', 'animal'],
    tiger: ['tiger', 'animal'],
    dragon: ['dragon'],
    koi: ['koi', 'fish'],
    snake: ['snake', 'serpent'],
    raven: ['raven', 'crow', 'bird'],
    phoenix: ['phoenix', 'bird'],
    panther: ['panther', 'animal'],
    owl: ['owl', 'bird'],
    bear: ['bear', 'animal'],
    deer: ['deer', 'animal'],
    butterfly: ['butterfly', 'insect'],
    spider: ['spider', 'insect'],
  },
  // Nature
  nature: {
    flower: ['flower', 'floral'],
    rose: ['rose'],
    lotus: ['lotus'],
    sakura: ['sakura', 'cherry'],
    blossom: ['blossom', 'bloom'],
    leaf: ['leaf', 'leaves'],
    tree: ['tree'],
    mountain: ['mountain', 'mountains'],
    wave: ['wave', 'waves', 'ocean'],
    sun: ['sun', 'solar'],
    moon: ['moon', 'lunar'],
    star: ['star', 'stars'],
  },
  // Objects & Symbols
  symbols: {
    skull: ['skull'],
    heart: ['heart'],
    dagger: ['dagger', 'knife'],
    sword: ['sword', 'blade'],
    anchor: ['anchor'],
    compass: ['compass'],
    hourglass: ['hourglass', 'time'],
    key: ['key'],
    lock: ['lock'],
    cross: ['cross'],
    arrow: ['arrow', 'arrows'],
    feather: ['feather'],
  },
  // People & Characters
  people: {
    samurai: ['samurai', 'warrior'],
    geisha: ['geisha'],
    angel: ['angel'],
    demon: ['demon', 'devil'],
    oni: ['oni'],
    viking: ['viking'],
    pirate: ['pirate'],
    skull: ['skull', 'skeleton'],
  },
  // Abstract & Patterns
  abstract: {
    mandala: ['mandala'],
    geometric: ['geometric', 'geometry'],
    tribal: ['tribal'],
    celtic: ['celtic'],
    ornamental: ['ornamental', 'ornament'],
    pattern: ['pattern'],
    symmetry: ['symmetry', 'symmetric'],
  },
};

/**
 * Extract tattoo elements from filename
 * @param {string} filename - The original filename
 * @returns {Array<string>} - Array of detected element names
 */
function extractElements(filename) {
  if (!filename || typeof filename !== 'string') {
    return [];
  }

  const normalized = filename.toLowerCase();
  const detectedElements = [];
  const elementSet = new Set(); // Use Set to avoid duplicates

  // Check all element categories
  for (const category of Object.values(ELEMENT_KEYWORDS)) {
    for (const [elementName, keywords] of Object.entries(category)) {
      // Check if any keyword matches in the filename
      for (const keyword of keywords) {
        if (normalized.includes(keyword.toLowerCase())) {
          elementSet.add(elementName);
          break; // Found match for this element, move to next
        }
      }
    }
  }

  return Array.from(elementSet);
}

/**
 * Detect tattoo style from filename using keyword matching
 * @param {string} filename - The original filename of the uploaded image
 * @returns {Object} - Object containing style, confidence, matched keywords, and elements
 */
function detectStyle(filename) {
  if (!filename || typeof filename !== 'string') {
    return {
      style: 'Minimalist',
      confidence: 0.3,
      matchedKeywords: [],
      elements: [],
    };
  }

  // Normalize filename to lowercase for case-insensitive matching
  const normalized = filename.toLowerCase();

  // Count keyword matches per style
  const styleCounts = {};
  const matchedKeywordsByStyle = {};

  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    let count = 0;
    const matched = [];

    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        count++;
        matched.push(keyword);
      }
    }

    if (count > 0) {
      styleCounts[style] = count;
      matchedKeywordsByStyle[style] = matched;
    }
  }

  // If no keywords matched, default to Minimalist
  if (Object.keys(styleCounts).length === 0) {
    return {
      style: 'Minimalist',
      confidence: 0.3,
      matchedKeywords: [],
      elements: extractElements(filename),
    };
  }

  // Select style with highest match count
  let detectedStyle = null;
  let maxCount = 0;

  for (const [style, count] of Object.entries(styleCounts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedStyle = style;
    }
  }

  // Calculate confidence score based on match strength
  // More matches = higher confidence, capped at 1.0
  const totalPossibleKeywords = STYLE_KEYWORDS[detectedStyle].length;
  const baseConfidence = Math.min(maxCount / totalPossibleKeywords, 1.0);
  
  // Boost confidence if multiple keywords matched
  const confidence = Math.min(baseConfidence + (maxCount > 1 ? 0.2 : 0), 1.0);

  // Extract elements from filename
  const elements = extractElements(filename);

  return {
    style: detectedStyle,
    confidence: Math.round(confidence * 100) / 100, // round to 2 decimals
    matchedKeywords: matchedKeywordsByStyle[detectedStyle],
    elements,
  };
}

module.exports = { detectStyle, extractElements, STYLE_KEYWORDS, ELEMENT_KEYWORDS };
