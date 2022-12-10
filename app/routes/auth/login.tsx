import { redirect } from "@remix-run/node";

function generateRandomString(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function loader() {
  const scope = "streaming \
               user-read-email \
               user-read-private"
  console.log(process.env.SPOTIFY_CLIENT_ID)

  const authQueryParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID as string,
    scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: generateRandomString(16),
  })

  return redirect(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`, 302);
}
