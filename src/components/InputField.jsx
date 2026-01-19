"use client"; // 确保在 Next.js 中这是客户端组件
import React, { useState } from "react";

const InputField = ({ GetComment }) => {
    const [isLoading, setIsLoading] = useState(false);

    const clearAll = (event) => {
        event.preventDefault();
        GetComment(""); // 清空父组件显示的评价
        document.getElementById("title").value = "";
        document.getElementById("article").value = "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const title = formData.get("title");
        const article = formData.get("article");

        if (!title || !article) {
            alert("请填写标题和作文内容");
            return;
        }

        setIsLoading(true);

        try {
            // --- 核心修改：请求我们自己的后端 API ---
            const response = await fetch("/api/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, article }),
            });

            const result = await response.json();

            if (response.ok) {
                // 成功：把 AI 内容和剩余次数传给父组件
                // 注意：我们在父组件 page.js 定义的 recieveComment 接收两个参数
                GetComment(result.content, result.remaining);
            } else {
                // 失败：显示后端返回的错误信息（如：额度已用完）
                alert(result.error || "请求失败，请稍后再试");
            }
        } catch (error) {
            console.error("提交出错:", error);
            alert("网络连接失败，请检查网络");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <label htmlFor="title" className="font-medium text-gray-700">
                    标题:
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="请输入作文标题..."
                    className="border-2 border-gray-300 rounded-lg p-2 focus:border-gray-600 outline-none transition-all"
                    disabled={isLoading}
                />

                <label
                    htmlFor="article"
                    className="mt-4 font-medium text-gray-700"
                >
                    作文:
                </label>
                <textarea
                    id="article"
                    name="article"
                    className="border-2 border-gray-300 rounded-lg p-3 h-64 md:h-96 lg:h-[500px] focus:border-gray-600 outline-none transition-all resize-none"
                    placeholder="在此输入作文内容..."
                    disabled={isLoading}
                ></textarea>

                <div className="flex flex-row-reverse items-center gap-3 pt-4">
                    <button
                        type="submit"
                        className={`bg-gray-600 rounded-md px-8 py-2.5 text-white font-bold flex items-center justify-center min-w-[100px] hover:bg-gray-700 transition-colors shadow-sm ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>批改中...</span>
                            </div>
                        ) : (
                            "开始批改"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={clearAll}
                        className={`border-2 border-gray-300 text-gray-600 rounded-md px-6 py-2 font-medium hover:bg-gray-100 transition-colors ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                    >
                        清空内容
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputField;
