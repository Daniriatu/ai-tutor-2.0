"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false); // 切换登录/注册状态
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isRegister) {
            // --- 注册逻辑 ---
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                alert("注册成功，请直接登录！");
                setIsRegister(false);
            } else {
                alert(data.error);
            }
        } else {
            // --- 登录逻辑 ---
            const res = await signIn("credentials", {
                redirect: false, // 登录不跳转，由我们逻辑控制
                email,
                password,
            });

            if (res.error) {
                alert("登录失败：账号或密码错误");
            } else {
                router.push("/"); // 登录成功跳转到首页
                router.refresh(); // 刷新页面状态
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center flex-col">
                    <Image
                        src="/aitutor.png"
                        alt="logo"
                        width={256} // 这里的数值代表逻辑像素，Next.js 会根据它自动缩放
                        height={100} // 根据你图片的比例填写
                        className="w-32 md:w-48 lg:w-64 h-auto object-contain"
                        priority // 加上这个属性，会让 Logo 加载得更快
                    />
                    <h2 className="text-3xl font-bold text-center text-black-600 mb-8">
                        {isRegister ? "创建账号" : "欢迎使用西语写作助手"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            邮箱地址
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            密码
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg disabled:bg-gray-400 cursor-pointer"
                    >
                        {loading
                            ? "处理中..."
                            : isRegister
                              ? "立即注册"
                              : "登录"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-gray-600 text-sm font-semibold hover:underline cursor-pointer"
                    >
                        {isRegister
                            ? "已经有账号？去登录"
                            : "没有账号？免费注册"}
                    </button>
                </div>
            </div>
        </div>
    );
}
