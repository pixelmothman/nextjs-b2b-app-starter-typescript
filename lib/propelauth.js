import { initBaseAuth} from "@propelauth/node";

export const propelauth = initBaseAuth({
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    apiKey: process.env.PROPELAUTH_API_KEY,
    manualTokenVerificationMetadata: {
        verifierKey: process.env.PROPELAUTH_VERIFIER_KEY,
        issuer: process.env.NEXT_PUBLIC_AUTH_URL,
    }
});