import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Redis } from "@upstash/redis";
import bcrypt from "bcryptjs";

// 1. 初始化 Redis 连接
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const authOptions = {
    // 配置登录方式
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "邮箱", type: "text" },
                password: { label: "密码", type: "password" },
            },
            async authorize(credentials) {
                // A. 检查输入是否完整
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码");
                }

                // B. 从 Redis 获取用户信息
                const user = await redis.get(`user:${credentials.email}`);

                if (!user) {
                    throw new Error("该邮箱未注册");
                }

                // C. 验证密码是否匹配 (使用 bcrypt 对比密文)
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );

                if (!isPasswordCorrect) {
                    throw new Error("密码错误");
                }

                // D. 验证通过，返回用户信息（会被存入 Session）
                return {
                    id: credentials.email,
                    email: user.email,
                    name: user.email.split("@")[0], // 暂时用邮箱前缀当昵称
                };
            },
        }),
    ],
    // 自定义配置
    session: {
        strategy: "jwt", // 使用 JSON Web Token 存储会话
    },
    pages: {
        signIn: "/login", // 如果未登录跳转到我们的自定义登录页
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Next.js App Router 要求导出 GET 和 POST
export { handler as GET, handler as POST };
