import React from "react";
import ReactMarkdown from "react-markdown";

const ResponseField = ({ commentFromAi }) => {
    return (
        <div className="w-full lg:w-[450px] shrink-0 border border-gray-200 p-4 md:p-6 rounded-xl overflow-y-auto bg-white shadow-sm hover:shadow-md transition-shadow duration-300 max-h-[85vh]">
            {/* 标题栏：保持置顶 */}
            <div className="sticky top-0 bg-white pb-3 z-10 border-b border-gray-50">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                    <svg
                        className="w-5 h-5 mr-2 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    批改结果
                </h2>
            </div>

            {/* Markdown 内容区 */}
            <div className="mt-4 overflow-x-hidden">
                {commentFromAi ? (
                    <div
                        className="prose prose-indigo prose-sm md:prose-base max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-p:text-gray-700 prose-p:leading-relaxed
                        prose-li:text-gray-700
                        prose-strong:text-indigo-700"
                    >
                        <ReactMarkdown>{commentFromAi}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <svg
                            className="w-16 h-16 mb-4 opacity-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-sm tracking-widest uppercase">
                            等待提交作文
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseField;
