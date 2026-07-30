export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ADMIN_URL: string;
  ALLOWED_LOGIN: string;
}

const githubAuthorizeUrl = "https://github.com/login/oauth/authorize";
const githubTokenUrl = "https://github.com/login/oauth/access_token";
const githubUserUrl = "https://api.github.com/user";

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseCookies(request: Request) {
  const header = request.headers.get("Cookie") ?? "";
  return Object.fromEntries(
    header
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

function redirect(location: string, headers: Record<string, string> = {}) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "no-store", ...headers },
  });
}

function errorRedirect(env: Env, message: string) {
  const url = new URL(env.ADMIN_URL);
  url.hash = new URLSearchParams({ oauth_error: message }).toString();
  return redirect(url.toString());
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "swust-github-oauth" });
    }

    if (url.pathname === "/login") {
      const state = randomState();
      const authorize = new URL(githubAuthorizeUrl);
      authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
      authorize.searchParams.set("scope", "public_repo read:user");
      authorize.searchParams.set("state", state);

      return redirect(authorize.toString(), {
        "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      });
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const expectedState = parseCookies(request).oauth_state;

      if (!code || !state || !expectedState || state !== expectedState) {
        return errorRedirect(env, "OAuth state 验证失败，请重新登录");
      }

      const tokenResponse = await fetch(githubTokenUrl, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });

      const tokenResult = await tokenResponse.json<{ access_token?: string; error_description?: string }>();
      if (!tokenResponse.ok || !tokenResult.access_token) {
        return errorRedirect(env, tokenResult.error_description ?? "GitHub 授权失败");
      }

      const userResponse = await fetch(githubUserUrl, {
        headers: {
          Authorization: `Bearer ${tokenResult.access_token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "SWUST-Robot-Team-CMS",
        },
      });
      const user = await userResponse.json<{ login?: string }>();

      if (!userResponse.ok || !user.login) {
        return errorRedirect(env, "无法读取 GitHub 用户信息");
      }

      if (user.login.toLowerCase() !== env.ALLOWED_LOGIN.toLowerCase()) {
        return errorRedirect(env, `账号 ${user.login} 没有后台管理权限`);
      }

      const adminUrl = new URL(env.ADMIN_URL);
      adminUrl.hash = new URLSearchParams({
        access_token: tokenResult.access_token,
        login: user.login,
      }).toString();

      return redirect(adminUrl.toString(), {
        "Set-Cookie": "oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
