import { env } from "../config/env.js";

export function getGithubAuthUrl(state: string): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", env.githubClientId);
  url.searchParams.set("redirect_uri", env.githubRedirectUri);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  return url.toString();
}

interface GithubProfile {
  id: number;
  email: string;
  name: string;
}

export async function exchangeGithubCode(code: string): Promise<GithubProfile> {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      redirect_uri: env.githubRedirectUri,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed: ${await tokenRes.text()}`);
  }

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    throw new Error(`GitHub token exchange failed: ${tokenData.error}`);
  }

  const headers = {
    Authorization: `Bearer ${tokenData.access_token}`,
    Accept: "application/vnd.github+json",
  };

  const userRes = await fetch("https://api.github.com/user", { headers });
  if (!userRes.ok) {
    throw new Error(`GitHub profile fetch failed: ${await userRes.text()}`);
  }
  const user = (await userRes.json()) as {
    id: number;
    name: string | null;
    login: string;
    email: string | null;
  };

  // GitHub only includes `email` on /user if the user has made it public.
  // Otherwise, fetch it separately (requires the user:email scope).
  let email = user.email;
  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers,
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>;
      email = emails.find((e) => e.primary && e.verified)?.email ?? null;
    }
  }

  if (!email) {
    throw new Error(
      "GitHub account has no verified email available. Make an email public or verify one on GitHub, then try again."
    );
  }

  return { id: user.id, email, name: user.name ?? user.login };
}
