const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let tokenExpiry = 0;

const getToken = async () => {
  if (Date.now() < tokenExpiry) return;
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
  tokenExpiry = Date.now() + (data.body['expires_in'] - 60) * 1000;
  console.log('🎵 Spotify token refreshed');
};

module.exports = { spotifyApi, getToken };