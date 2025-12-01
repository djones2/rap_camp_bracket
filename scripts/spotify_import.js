// scripts/spotify_import.js
import fetch from "node-fetch"; // use installed node-fetch
import fs from "fs";

const clientId = "ad87acc320654742836f402e1e0534e3";
const clientSecret = "a7f0cfaa9a5c49fda17a9b107c22c7c1";
const playlistId = "20VB6dYzK5OGJNy8H39elt";

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

async function getPlaylistTracks(token) {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  const tracks = data.items.map((item) => item.track.name);
  return tracks.slice(0, 64); // only take first 64 tracks
}

async function main() {
  try {
    const token = await getAccessToken();
    const tracks = await getPlaylistTracks(token);
    fs.writeFileSync("src/tracks.json", JSON.stringify(tracks, null, 2));
    console.log("Saved tracks.json with", tracks.length, "tracks!");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
