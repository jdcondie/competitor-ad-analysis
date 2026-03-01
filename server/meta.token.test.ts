/**
 * meta.token.test.ts
 * Verifies that META_ACCESS_TOKEN is set in the server environment
 * and that it can authenticate against the Meta Graph API.
 */

import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("META_ACCESS_TOKEN server-side configuration", () => {
  it("should have META_ACCESS_TOKEN set in ENV", () => {
    expect(ENV.metaAccessToken).toBeTruthy();
    expect(ENV.metaAccessToken.length).toBeGreaterThan(10);
  });

  it("should be a valid Meta token (lightweight /me API check)", async () => {
    const res = await fetch(
      `https://graph.facebook.com/v25.0/me?access_token=${encodeURIComponent(ENV.metaAccessToken)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    const json = await res.json() as any;
    // A valid token returns { id, name } — an invalid one returns { error: {...} }
    expect(json.error).toBeUndefined();
    expect(json.id).toBeTruthy();
  }, 15000);
});
