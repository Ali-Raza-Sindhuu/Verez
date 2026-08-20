import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "./token.js";

interface OAuthStatePayload {
  role: UserRole;
}

// Short-lived signed token used as the OAuth `state` param. Verifying the
// signature on callback is what prevents CSRF — an attacker can't forge a
// valid state without the secret, so a crafted callback request is rejected.
export function signOAuthState(role: UserRole): string {
  return jwt.sign({ role } as OAuthStatePayload, env.jwtResetSecret, {
    expiresIn: "10m",
  });
}

export function verifyOAuthState(state: string): OAuthStatePayload {
  return jwt.verify(state, env.jwtResetSecret) as OAuthStatePayload;
}
