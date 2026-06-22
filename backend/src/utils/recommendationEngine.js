/**
 * ============================================================
 * src/utils/recommendationEngine.js
 * ============================================================
 *
 * Recommendation engine that queries MongoDB for matching tattoos
 * and artists based on detected style.
 */

const Tattoo = require('../models/Tattoo');
const Artist = require('../models/Artist');

/**
 * Get tattoo and artist recommendations based on detected style
 * @param {string} detectedStyle - The detected tattoo style
 * @param {Array<string>} matchedKeywords - Keywords that were matched
 * @returns {Object} - Object containing recommended tattoos and artists
 */
async function getRecommendations(detectedStyle, matchedKeywords = []) {
  try {
    // Query tattoos matching the detected style
    let tattoos = await Tattoo.find({ style: detectedStyle })
      .populate('artist', 'id name')
      .select('title description imageUrl style price artist tags')
      .limit(6)
      .lean();

    // If fewer than 6 tattoos found, try finding by tags
    if (tattoos.length < 6 && matchedKeywords.length > 0) {
      const additionalTattoos = await Tattoo.find({
        style: { $ne: detectedStyle },
        tags: { $in: matchedKeywords },
      })
        .populate('artist', 'id name')
        .select('title description imageUrl style price artist tags')
        .limit(6 - tattoos.length)
        .lean();

      tattoos = [...tattoos, ...additionalTattoos];
    }

    // If still not enough, get random tattoos
    if (tattoos.length < 6) {
      const randomTattoos = await Tattoo.find({
        _id: { $nin: tattoos.map(t => t._id) },
      })
        .populate('artist', 'id name')
        .select('title description imageUrl style price artist tags')
        .limit(6 - tattoos.length)
        .lean();

      tattoos = [...tattoos, ...randomTattoos];
    }

    // Query artists with matching specialty
    let artists = await Artist.find({
      specialties: { $in: [detectedStyle] },
    })
      .select('name bio photoUrl location rating specialties experienceYears')
      .limit(3)
      .lean();

    // If no artists found with exact specialty, get top-rated artists
    if (artists.length === 0) {
      artists = await Artist.find()
        .select('name bio photoUrl location rating specialties experienceYears')
        .sort({ rating: -1 })
        .limit(3)
        .lean();
    }

    // Transform MongoDB documents for frontend compatibility
    const transformedTattoos = tattoos.map(tattoo => ({
      ...tattoo,
      id: tattoo._id.toString(),
      artist: tattoo.artist ? {
        ...tattoo.artist,
        id: tattoo.artist._id?.toString() || tattoo.artist.id,
      } : null,
    }));

    const transformedArtists = artists.map(artist => ({
      ...artist,
      id: artist._id.toString(),
    }));

    return {
      tattoos: transformedTattoos,
      artists: transformedArtists,
    };
  } catch (error) {
    console.error('Recommendation engine error:', error);
    throw error;
  }
}

module.exports = { getRecommendations };
