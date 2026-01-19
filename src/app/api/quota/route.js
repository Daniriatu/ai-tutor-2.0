import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(15, "24 h"),
});

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "未登录" }, { status: 401 });

    const userEmail = session.user.email;

    // getRemaining 会返回该用户当前的剩余次数，且不会消耗次数
    const { remaining } = await ratelimit.getRemaining(userEmail);

    return NextResponse.json({ remaining });
}
