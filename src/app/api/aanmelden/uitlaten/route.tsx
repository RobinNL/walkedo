import { NextResponse } from "next/server";
import { handleSignup } from "../../../../../lib/signup-mail";

export async function POST(request: Request) {
    return handleSignup(request, "uitlaten");
}

export async function GET(): Promise<any> {
    return new NextResponse('ping');
}
