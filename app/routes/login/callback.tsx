import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node"
import { getSession, commitSession } from "~/sessions";
import { fetchSpotifyToken } from "~/services/spotify";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.flash("error", "Something went wrong authenticating with spotify.");
  console.log(url)

  if (!code) return redirect("/login");

  const spotifyTokenResponse = await fetchSpotifyToken(code);
  console.log(spotifyTokenResponse)

  // TODO: Find a better way to manage session data.
  session.set("accessToken", spotifyTokenResponse.access_token);
  session.set("refreshToken", spotifyTokenResponse.refresh_token);
  session.set("expiresIn", spotifyTokenResponse.expires_in);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
