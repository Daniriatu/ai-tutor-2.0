import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 初始化 Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. 检查参数是否完整
    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    // 2. 检查用户是否已存在
    // 我们在 Redis 中使用键名 "user:邮箱" 来存储
    const userKey = `user:${email}`;
    const existingUser = await redis.get(userKey);

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    // 3. 密码加密 (不要明文存入数据库)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 存入 Redis (存储为一个对象)
    await redis.set(userKey, {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "注册成功" }, { status: 201 });

  } catch (error) {
    console.error("注册系统错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}