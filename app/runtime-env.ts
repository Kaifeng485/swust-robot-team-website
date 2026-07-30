type RuntimeEnv = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

declare global {
  var __SITES_RUNTIME_ENV__: RuntimeEnv | undefined;
}

export function getRuntimeEnv(): RuntimeEnv {
  const runtimeEnv = globalThis.__SITES_RUNTIME_ENV__;
  if (!runtimeEnv) throw new Error("Site storage is unavailable");
  return runtimeEnv;
}
