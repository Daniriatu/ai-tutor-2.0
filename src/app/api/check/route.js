import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(15, "24 h"),
});

// 在后端环境初始化，配置更简洁
const openai = new OpenAI({
    baseURL: "https://api-inference.modelscope.cn/v1",
    apiKey: process.env.MODELSCOPE_API_KEY, // 必须用 process.env
});

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "请先登录后再试" },
                { status: 401 },
            );
        }

        const userEmail = session.user.email;
        const { success, remaining } = await ratelimit.limit(userEmail);

        if (!success) {
            return NextResponse.json(
                { error: "今日 10 次额度已用完，请明天再来吧！" },
                { status: 429 },
            );
        }

        const { title, article } = await req.json();

        // 请求 AI
        const aiResponse = await openai.chat.completions.create({
            model: "Qwen/Qwen3-Next-80B-A3B-Instruct",
            messages: [
                {
                    role: "system",
                    content: `你是一个非常有经验的西班牙语老师, 现在有学生给你提交了一篇作文, 现在请用中文给予学生约150字的反馈, 给学生打分, 指出并更正文章中的错误之处, 并给出修改润色后的文章. 回答里不要显示回答的字数，如果学生输入的内容和西班牙语不相关，请不要给分，并直接指出`,
                },
                {
                    role: "user",
                    content: `作文的题目是${title}, 文章内容为${article}`,
                },
            ],
            stream: false,
        });

        // 注意：OpenAI SDK 会在响应异常时直接抛出错误，进入下面的 catch
        // 结果直接从 aiResponse 获取，不需要 .json()
        const aiContent = aiResponse.choices[0].message.content;

        return NextResponse.json({
            content: aiContent,
            remaining: remaining,
        });
    } catch (err) {
        console.error("后端 API 详细错误:", err);
        // 如果是 OpenAI 的错误，可以打印 err.message 看到具体原因
        return NextResponse.json(
            { error: err.message || "服务器繁忙，请稍后再试" },
            { status: 500 },
        );
    }
}
