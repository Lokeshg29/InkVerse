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
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    location: 'Lisbon, PT',
    rating: 4.7,
    specialties: ['Japanese', 'Blackwork'],
    experienceYears: 9,
  },
  {
    name: 'Dax Holloway',
    bio: 'Tribal and geometric specialist with a decade of studio experience.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00d5a4ee9a3b?w=400',
    location: 'London, UK',
    rating: 4.6,
    specialties: ['Tribal', 'Geometric'],
    experienceYears: 7,
  },
  {
    name: 'Kira Voss',
    bio: 'Known for bold linework and nature-inspired pieces.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    location: 'Berlin, DE',
    rating: 4.8,
    specialties: ['Blackwork', 'Minimalist'],
    experienceYears: 11,
  },
  {
    name: 'Mateo Cruz',
    bio: 'Soft shading and watercolor techniques, classically trained.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'Barcelona, ES',
    rating: 4.5,
    specialties: ['Watercolor', 'Realism'],
    experienceYears: 6,
  },
  {
    name: 'Yuki Tanaka',
    bio: 'High-contrast traditional Japanese tattooing, third-generation artist.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    location: 'Tokyo, JP',
    rating: 4.9,
    specialties: ['Japanese', 'Traditional'],
    experienceYears: 14,
  },
  {
    name: 'Selene Marsh',
    bio: 'Fine line and minimalist designs for first-time clients.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
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
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9c5c0ce8a6f8?w=500',
    style: 'Traditional',
    price: 180,
    artistIndex: 4,
    tags: ['dragon', 'bold-linework', 'asian-inspired'],
  },
  {
    title: 'Lunar Koi',
    description: 'A koi fish swimming beneath a crescent moon.',
    imageUrl: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=500',
    style: 'Japanese',
    price: 220,
    artistIndex: 4,
    tags: ['koi', 'moon', 'fine-line'],
  },
  {
    title: 'Iron Chrysanthemum',
    description: 'A high-contrast chrysanthemum bloom in heavy blackwork.',
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=500',
    style: 'Blackwork',
    price: 200,
    artistIndex: 0,
    tags: ['flower', 'high-contrast', 'blackwork'],
  },
  {
    title: 'Wandering Wolf',
    description: 'A lone wolf rendered in delicate fine-line style.',
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500',
    style: 'Minimalist',
    price: 140,
    artistIndex: 5,
    tags: ['wolf', 'fine-line', 'animal'],
  },
  {
    title: 'Voidwalker',
    description: 'An abstract tribal pattern inspired by celestial voids.',
    imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=500',
    style: 'Tribal',
    price: 160,
    artistIndex: 1,
    tags: ['tribal', 'abstract', 'pattern'],
  },
  {
    title: 'Geometric Lion',
    description: "A lion's face built entirely from clean geometric shapes.",
    imageUrl: 'https://images.unsplash.com/photo-1551491931-43c5a87d23b1?w=500',
    style: 'Geometric',
    price: 190,
    artistIndex: 1,
    tags: ['lion', 'geometric', 'animal'],
  },
  {
    title: 'Whispering Forest',
    description: 'A dense forest scene done in bold blackwork linework.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500',
    style: 'Blackwork',
    price: 210,
    artistIndex: 2,
    tags: ['nature', 'forest', 'bold-linework'],
  },
  {
    title: 'Cosmic Whale',
    description: 'A whale swimming through a starfield, softly shaded.',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=500',
    style: 'Watercolor',
    price: 230,
    artistIndex: 3,
    tags: ['whale', 'space', 'soft-shading'],
  },
  {
    title: 'Sakura Spirit',
    description: 'Cherry blossoms cascading down in soft pastel watercolor.',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500',
    style: 'Watercolor',
    price: 175,
    artistIndex: 3,
    tags: ['flowers', 'sakura', 'pastel'],
  },
  {
    title: 'Black Sun',
    description: 'A minimalist sun motif in heavy blackwork.',
    imageUrl: 'https://images.unsplash.com/photo-1601225998544-12f4dd4cb6b7?w=500',
    style: 'Minimalist',
    price: 120,
    artistIndex: 5,
    tags: ['sun', 'minimalist', 'symbol'],
  },
  {
    title: 'Neon Phoenix',
    description: 'A phoenix in high-contrast realism, rising from flame.',
    imageUrl: 'https://images.unsplash.com/photo-1583500178690-f7fd8f0aa1e1?w=500',
    style: 'Realism',
    price: 260,
    artistIndex: 3,
    tags: ['phoenix', 'realism', 'fire'],
  },
  {
    title: 'Ouroboros',
    description: 'A serpent eating its own tail, classic blackwork style.',
    imageUrl: 'https://images.unsplash.com/photo-1542556398-95fb5b9c6164?w=500',
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
