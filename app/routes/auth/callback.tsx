import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

type SpotifyTokenResponse = {
   "access_token": string,
   "token_type":string,
   "expires_in":number,
   "refresh_token":string,
   "scope":string
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) return json({ msg: 'bad' }, 400)

  const spotifyTokenRequest = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },    
    body: new URLSearchParams({
      code,
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: 'authorization_code'
    })
  });

  const responseJson = await spotifyTokenRequest.json() as SpotifyTokenResponse;
  console.log(responseJson);
  const token = responseJson.access_token

  // Create cookie/session/whatever that sets the token for the user in the cookies

  return json({
    token
  });
}
