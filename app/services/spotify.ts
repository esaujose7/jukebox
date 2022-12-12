type SpotifyUserDataResponse = {
  "country": string,
  "display_name": string,
  "email": string,
  "explicit_content": {
    "filter_enabled": boolean,
    "filter_locked": boolean
  },
  "external_urls": {
    "spotify": string
  },
  "followers": {
    "href": string,
    "total": number
  },
  "href": string,
  "id": string,
  "images": {
    "url": string,
    "height": number,
    "width": number
  }[],
  "product": string,
  "type": string,
  "uri": string
}

export async function fetchSpotifyUserData(authToken: string) {
  const e = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      'Content-Type': 'Content-Type: application/json',
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (!e.ok) {
    console.log(e);
    throw new Error("Bad request")
  }

  return e.json() as Promise<SpotifyUserDataResponse>;
}


type SpotifyTokenResponse = {
   "access_token": string,
   "token_type": string,
   "expires_in": number,
   "refresh_token": string,
   "scope": string
};

export async function fetchSpotifyToken(code: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },    
    body: new URLSearchParams({
      code,
      redirect_uri: "http://localhost:3000/login/callback",
      grant_type: 'authorization_code'
    })
  })

  const responseJson = await response.json() as SpotifyTokenResponse;

  return responseJson;
}
