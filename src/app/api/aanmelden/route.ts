import { handleSignup } from "../../../../lib/signup-mail";

/**
 * The single signup endpoint. Which services the visitor chose, and therefore
 * which answers to expect, comes from the body — see lib/signup-fields.ts.
 */
export async function POST(request: Request) {
    return handleSignup(request);
}
