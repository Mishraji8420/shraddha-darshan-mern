import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Allow request to continue
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};