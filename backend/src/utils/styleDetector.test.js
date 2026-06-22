/**
 * ============================================================
 * src/utils/styleDetector.test.js
 * ============================================================
 *
 * Simple test suite for the style detector
 * Run with: node backend/src/utils/styleDetector.test.js
 */

const { detectStyle, extractElements } = require('./styleDetector');

// ANSI color codes for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';

function assert(condition, testName) {
  if (condition) {
    console.log(`${GREEN}✓${RESET} ${testName}`);
    return true;
  } else {
    console.log(`${RED}✗${RESET} ${testName}`);
    return false;
  }
}

console.log(`\n${CYAN}=== Style Detector Tests ===${RESET}\n`);

let passed = 0;
let failed = 0;

// Test 1: Japanese style detection
const test1 = detectStyle('dragon-koi-tattoo.jpg');
if (assert(test1.style === 'Japanese', 'Detects Japanese style from "dragon-koi-tattoo.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Japanese, Got: ${test1.style}`);
}

// Test 2: Blackwork style detection
const test2 = detectStyle('lion-wolf-skull.png');
if (assert(test2.style === 'Blackwork', 'Detects Blackwork style from "lion-wolf-skull.png"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Blackwork, Got: ${test2.style}`);
}

// Test 3: Watercolor style detection
const test3 = detectStyle('flower-rose-blossom.webp');
if (assert(test3.style === 'Watercolor', 'Detects Watercolor style from "flower-rose-blossom.webp"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Watercolor, Got: ${test3.style}`);
}

// Test 4: Geometric style detection
const test4 = detectStyle('mandala-sacred-geometry.jpg');
if (assert(test4.style === 'Geometric', 'Detects Geometric style from "mandala-sacred-geometry.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Geometric, Got: ${test4.style}`);
}

// Test 5: Tribal style detection
const test5 = detectStyle('polynesian-tribal-design.png');
if (assert(test5.style === 'Tribal', 'Detects Tribal style from "polynesian-tribal-design.png"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Tribal, Got: ${test5.style}`);
}

// Test 6: Default to Minimalist when no keywords match
const test6 = detectStyle('IMG_1234.jpg');
if (assert(test6.style === 'Minimalist', 'Defaults to Minimalist for "IMG_1234.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Minimalist, Got: ${test6.style}`);
}

// Test 7: Case-insensitive matching
const test7 = detectStyle('DRAGON-KOI-TATTOO.JPG');
if (assert(test7.style === 'Japanese', 'Case-insensitive: "DRAGON-KOI-TATTOO.JPG"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Japanese, Got: ${test7.style}`);
}

// Test 8: Confidence score is between 0 and 1
const test8 = detectStyle('dragon-koi-samurai-oni.jpg');
if (assert(test8.confidence >= 0 && test8.confidence <= 1, 'Confidence score is between 0 and 1')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: 0-1, Got: ${test8.confidence}`);
}

// Test 9: Returns matched keywords
const test9 = detectStyle('dragon-koi.jpg');
if (assert(test9.matchedKeywords.length > 0, 'Returns matched keywords')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: array with keywords, Got: ${JSON.stringify(test9.matchedKeywords)}`);
}

// Test 10: Handles null filename gracefully
const test10 = detectStyle(null);
if (assert(test10.style === 'Minimalist', 'Handles null filename gracefully')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Minimalist, Got: ${test10.style}`);
}

// Test 11: Handles empty filename gracefully
const test11 = detectStyle('');
if (assert(test11.style === 'Minimalist', 'Handles empty filename gracefully')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Minimalist, Got: ${test11.style}`);
}

// Test 12: Style with most matches wins
const test12 = detectStyle('dragon-lion-wolf.jpg'); // 1 Japanese, 2 Blackwork
if (assert(test12.style === 'Blackwork', 'Selects style with most keyword matches')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: Blackwork, Got: ${test12.style}`);
}

console.log(`\n${CYAN}=== Element Extraction Tests ===${RESET}\n`);

// Test 13: Extract single animal element
const test13 = extractElements('eagle.jpg');
if (assert(test13.includes('eagle'), 'Extracts "eagle" from "eagle.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["eagle"], Got: ${JSON.stringify(test13)}`);
}

// Test 14: Extract wolf element
const test14 = extractElements('wolf.jpg');
if (assert(test14.includes('wolf'), 'Extracts "wolf" from "wolf.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["wolf"], Got: ${JSON.stringify(test14)}`);
}

// Test 15: Extract multiple elements
const test15 = extractElements('dragon-koi.jpg');
if (assert(test15.includes('dragon') && test15.includes('koi'), 'Extracts "dragon" and "koi" from "dragon-koi.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["dragon", "koi"], Got: ${JSON.stringify(test15)}`);
}

// Test 16: Extract element with style keyword
const test16 = extractElements('lion-geometric.jpg');
if (assert(test16.includes('lion'), 'Extracts "lion" from "lion-geometric.jpg"')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: includes "lion", Got: ${JSON.stringify(test16)}`);
}

// Test 17: Returns elements in detectStyle result
const test17 = detectStyle('eagle-wolf.jpg');
if (assert(test17.elements && test17.elements.length > 0, 'detectStyle returns elements array')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: elements array, Got: ${JSON.stringify(test17.elements)}`);
}

// Test 18: No duplicate elements
const test18 = extractElements('wolf-wolf-wolf.jpg');
if (assert(test18.length === 1 && test18[0] === 'wolf', 'No duplicate elements extracted')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["wolf"], Got: ${JSON.stringify(test18)}`);
}

// Test 19: Case-insensitive element extraction
const test19 = extractElements('EAGLE.JPG');
if (assert(test19.includes('eagle'), 'Case-insensitive element extraction')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["eagle"], Got: ${JSON.stringify(test19)}`);
}

// Test 20: Extract nature elements
const test20 = extractElements('rose-lotus.jpg');
if (assert(test20.includes('rose') && test20.includes('lotus'), 'Extracts nature elements')) {
  passed++;
} else {
  failed++;
  console.log(`  Expected: ["rose", "lotus"], Got: ${JSON.stringify(test20)}`);
}

console.log(`\n${CYAN}=== Test Summary ===${RESET}`);
console.log(`${GREEN}Passed: ${passed}${RESET}`);
console.log(`${failed > 0 ? RED : GREEN}Failed: ${failed}${RESET}\n`);

process.exit(failed > 0 ? 1 : 0);
