/**
 * ============================================================
 * src/seed/seed.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * A ONE-TIME script that fills our MongoDB database with
 * realistic-looking Artists and Tattoos, so we have real data
 * to test our APIs against.
 *
 * HOW TO RUN IT:
 *   node src/seed/seed.js
 *
 * WHAT HAPPENS WHEN YOU RUN IT:
 * 1. Connects to MongoDB (using the same MONGO_URI from .env)
 * 2. DELETES all existing Artists and Tattoos (so re-running this
 *    script doesn't create duplicates every time)
 * 3. Inserts a fresh batch of Artists
 * 4. Inserts a fresh batch of Tattoos, each linked to one Artist
 * 5. Disconnects
 *
 * WARNING: Step 2 deletes existing data. Don't run this against
 * a database with real user data you want to keep.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Artist = require('../models/Artist');
const Tattoo = require('../models/Tattoo');

// ── Artist data ────────────────────────────────────────────────
// Plain JavaScript objects - not yet saved to the database.
const artistsData = [
  {
    name: 'Nova Sinclair',
    bio: 'Specializes in bold Japanese-inspired blackwork with clean linework.',
    photoUrl: '/artists/nova-sinclair.jpg',
    location: 'Lisbon, PT',
    rating: 4.7,
    specialties: ['Japanese', 'Blackwork'],
    experienceYears: 9,
  },
  {
    name: 'Dax Holloway',
    bio: 'Tribal and geometric specialist with a decade of studio experience.',
    photoUrl: '/artists/dax-holloway.jpg',
    location: 'London, UK',
    rating: 4.6,
    specialties: ['Tribal', 'Geometric'],
    experienceYears: 7,
  },
  {
    name: 'Kira Voss',
    bio: 'Known for bold linework and nature-inspired pieces.',
    photoUrl: '/artists/kira-voss.jpg',
    location: 'Berlin, DE',
    rating: 4.8,
    specialties: ['Blackwork', 'Minimalist'],
    experienceYears: 11,
  },
  {
    name: 'Mateo Cruz',
    bio: 'Soft shading and watercolor techniques, classically trained.',
    photoUrl: '/artists/mateo-cruz.jpg',
    location: 'Barcelona, ES',
    rating: 4.5,
    specialties: ['Watercolor', 'Realism'],
    experienceYears: 6,
  },
  {
    name: 'Yuki Tanaka',
    bio: 'High-contrast traditional Japanese tattooing, third-generation artist.',
    photoUrl: '/artists/yuki-tanaka.jpg',
    location: 'Tokyo, JP',
    rating: 4.9,
    specialties: ['Japanese', 'Traditional'],
    experienceYears: 14,
  },
  {
    name: 'Selene Marsh',
    bio: 'Fine line and minimalist designs for first-time clients.',
    photoUrl: '/artists/selene-marsh.jpg',
    location: 'New York, US',
    rating: 4.6,
    specialties: ['Minimalist', 'Traditional'],
    experienceYears: 5,
  },
];

// ── Tattoo data ────────────────────────────────────────────────
// NOTE: the 'artist' field here is just an INDEX (0, 1, 2...)
// pointing into artistsData above. After we save the artists,
// we'll convert these indexes into real MongoDB ObjectIds.
const tattoosData = [
  {
    title: 'Crimson Dragon',
    description: 'A fierce dragon coiled in bold red and black ink.',
    imageUrl: '/tattoos/crimson-dragon.jpg',
    style: 'Traditional',
    price: 180,
    artistIndex: 4,
    tags: ['dragon', 'bold-linework', 'asian-inspired'],
  },
  {
    title: 'Lunar Koi',
    description: 'A koi fish swimming beneath a crescent moon.',
    imageUrl: '/tattoos/lunar-koi.jpg',
    style: 'Japanese',
    price: 220,
    artistIndex: 4,
    tags: ['koi', 'moon', 'fine-line'],
  },
  {
    title: 'Iron Chrysanthemum',
    description: 'A high-contrast chrysanthemum bloom in heavy blackwork.',
    imageUrl: '/tattoos/iron-chrysanthemum.jpg',
    style: 'Blackwork',
    price: 200,
    artistIndex: 0,
    tags: ['flower', 'high-contrast', 'blackwork'],
  },
  {
    title: 'Wandering Wolf',
    description: 'A lone wolf rendered in delicate fine-line style.',
    imageUrl: '/tattoos/wandering-wolf.jpg',
    style: 'Minimalist',
    price: 140,
    artistIndex: 5,
    tags: ['wolf', 'fine-line', 'animal'],
  },
  {
    title: 'Voidwalker',
    description: 'An abstract tribal pattern inspired by celestial voids.',
    imageUrl: '/tattoos/voidwalker.jpg',
    style: 'Tribal',
    price: 160,
    artistIndex: 1,
    tags: ['tribal', 'abstract', 'pattern'],
  },
  {
    title: 'Geometric Lion',
    description: "A lion's face built entirely from clean geometric shapes.",
    imageUrl: '/tattoos/geometric-lion.jpg',
    style: 'Geometric',
    price: 190,
    artistIndex: 1,
    tags: ['lion', 'geometric', 'animal'],
  },
  {
    title: 'Whispering Forest',
    description: 'A dense forest scene done in bold blackwork linework.',
    imageUrl: '/tattoos/whispering-forest.jpg',
    style: 'Blackwork',
    price: 210,
    artistIndex: 2,
    tags: ['nature', 'forest', 'bold-linework'],
  },
  {
    title: 'Cosmic Whale',
    description: 'A whale swimming through a starfield, softly shaded.',
    imageUrl: '/tattoos/cosmic-whale.jpg',
    style: 'Watercolor',
    price: 230,
    artistIndex: 3,
    tags: ['whale', 'space', 'soft-shading'],
  },
  {
    title: 'Sakura Spirit',
    description: 'Cherry blossoms cascading down in soft pastel watercolor.',
    imageUrl: '/tattoos/sakura-spirit.jpg',
    style: 'Watercolor',
    price: 175,
    artistIndex: 3,
    tags: ['flowers', 'sakura', 'pastel'],
  },
  {
    title: 'Black Sun',
    description: 'A minimalist sun motif in heavy blackwork.',
    imageUrl: '/tattoos/black-sun.jpg',
    style: 'Minimalist',
    price: 120,
    artistIndex: 5,
    tags: ['sun', 'minimalist', 'symbol'],
  },
  {
    title: 'Neon Phoenix',
    description: 'A phoenix in high-contrast realism, rising from flame.',
    imageUrl: '/tattoos/neon-phoenix.jpg',
    style: 'Realism',
    price: 260,
    artistIndex: 3,
    tags: ['phoenix', 'realism', 'fire'],
  },
  {
    title: 'Ouroboros',
    description: 'A serpent eating its own tail, classic blackwork style.',
    imageUrl: '/tattoos/ouroboros.jpg',
    style: 'Blackwork',
    price: 195,
    artistIndex: 2,
    tags: ['snake', 'symbol', 'circular'],
  },
];

async function seedDatabase() {
  try {
    // Step 1: Connect to MongoDB using the same URI our server uses
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...\n');

    // Step 2: Clear existing data
    // deleteMany({}) with an empty filter means "delete everything in this collection"
    await Artist.deleteMany({});
    await Tattoo.deleteMany({});
    console.log('Cleared existing Artists and Tattoos.\n');

    // Step 3: Insert all artists at once
    // insertMany() is faster than calling .create() in a loop
    const createdArtists = await Artist.insertMany(artistsData);
    console.log(`Inserted ${createdArtists.length} artists.`);

    // Step 4: Build the final tattoo list, replacing artistIndex
    // with the REAL MongoDB _id of the corresponding artist.
    const finalTattoos = tattoosData.map((tattoo) => {
      const { artistIndex, ...rest } = tattoo; // separate artistIndex from the rest
      return {
        ...rest,
        artist: createdArtists[artistIndex]._id, // the real ObjectId reference
      };
    });

    const createdTattoos = await Tattoo.insertMany(finalTattoos);
    console.log(`Inserted ${createdTattoos.length} tattoos.\n`);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    // Step 5: Always disconnect, whether it succeeded or failed
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();
