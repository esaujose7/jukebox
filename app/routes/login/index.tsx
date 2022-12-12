import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { fetchSpotifyUserData } from "~/services/spotify";
import { getSession } from "~/sessions";

function generateRandomString(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function action() {
  const scope = "streaming \
               user-read-email \
               user-read-private"

  const authQueryParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID as string,
    scope,
    redirect_uri: "http://localhost:3000/login/callback",
    state: generateRandomString(16),
  })

  return redirect(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`, 302);
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("accessToken")) {
    return { authenticated: false, userData: null }
  }

  return { authenticated: true, userData: await fetchSpotifyUserData(session.get("accessToken"))}
}

export default function Login() {
  const { authenticated, userData } = useLoaderData<typeof loader>();

  if (!authenticated) {
    return (
      <Form method="post" action="/login?index">
        <button type="submit">Authenticate with spotify</button>
      </Form>
    )
  }

  return (
    <div>
      {JSON.stringify(userData, null, 2)}
    </div>
  );
}
