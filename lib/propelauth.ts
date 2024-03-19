import { initBaseAuth} from "@propelauth/node";

if(!process.env.NEXT_PUBLIC_AUTH_URL){
    throw new Error("NEXT_PUBLIC_AUTH_URL is not defined");
};

if(!process.env.PROPELAUTH_API_KEY){
    throw new Error("PROPELAUTH_API_KEY is not defined");
}

if(!process.env.PROPELAUTH_VERIFIER_KEY){
    throw new Error("PROPELAUTH_VERIFIER_KEY is not defined");
}

export const propelauth = initBaseAuth({
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    apiKey: process.env.PROPELAUTH_API_KEY,
    manualTokenVerificationMetadata: {
        verifierKey: process.env.PROPELAUTH_VERIFIER_KEY,
        issuer: process.env.NEXT_PUBLIC_AUTH_URL,
    }
});