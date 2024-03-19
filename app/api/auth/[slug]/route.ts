import {getRouteHandlers} from "@propelauth/nextjs/server/app-router";

// postLoginRedirectPathFn is optional, but if you want to redirect the user to a different page after login, you can do so here.
const routeHandlers = getRouteHandlers({
  postLoginRedirectPathFn: (req) => {
    return "/dash";
  }
});

export const GET = routeHandlers.getRouteHandler;
export const POST = routeHandlers.postRouteHandler;

/*
 This enables requests made to /api/auth/* to be handled by propelauth and set up/refresh/invalidate user information for you.
*/