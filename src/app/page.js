"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import LoginPage from "./login/page";
import Header from "@/components/Header";
import InputField from "@/components/InputField";
import ResponseField from "@/components/ResponseField";

function App() {
    const { data: session, status } = useSession();
    const [commentFromAi, setCommentFromAi] = useState("");

    // 增加剩余次数状态，初始值可以设为 10 或 null
    const [leftCount, setLeftCount] = useState("-");

    useEffect(() => {
        const fetchQuota = async () => {
            if (status === "authenticated") {
                try {
                    const res = await fetch("/api/quota");
                    const data = await res.json();
                    if (data.remaining !== undefined) {
                        setLeftCount(data.remaining);
                    }
                } catch (e) {
                    console.error("同步额度失败", e);
                }
            }
        };
        fetchQuota();
    }, [status]); // 当登录状态改变时执行

    // 修改接收函数，接收内容和剩余次数
    const recieveComment = (comment, remaining) => {
        setCommentFromAi(comment);
        if (remaining !== undefined) {
            setLeftCount(remaining);
        }
    };

    if (status === "loading")
        return <div className="p-10 text-center">加载中...</div>;
    if (status === "unauthenticated") return <LoginPage />;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-7xl flex flex-col">
                <div className="flex justify-end gap-4 mb-5">
                    {/* 显眼的剩余次数展示 */}
                    <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-600">
                        <span className="text-black text-sm font-bold">
                            剩余额度：{leftCount} 次
                        </span>
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium hidden sm:block">
                            {session?.user?.email}
                        </span>
                        <button
                            onClick={() => signOut()}
                            className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                        >
                            退出
                        </button>
                    </div>
                </div>
                {/* 顶部状态栏 */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <Header />
                </div>

                <div className="flex flex-col lg:flex-row w-full gap-8 items-start">
                    <div className="w-full lg:flex-1">
                        {/* 确保把函数传给子组件 */}
                        <InputField GetComment={recieveComment} />
                    </div>
                    <ResponseField commentFromAi={commentFromAi} />
                </div>
            </div>
        </div>
    );
}

export default App;
