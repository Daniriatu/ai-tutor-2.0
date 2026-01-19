import React from "react";
import Image from "next/image";

const Header = () => {
    return (
        // container: 居中对齐；px: 左右内边距随屏幕变化；text-center: 文字居中
        <div className="container mx-auto px-4 py-6 flex flex-col items-center text-center">
            {/* Logo 容器：控制图片在不同设备的大小 */}
            <div className="mb-4">
                <Image
                    src="/aitutor.png"
                    alt="logo"
                    width={256} // 这里的数值代表逻辑像素，Next.js 会根据它自动缩放
                    height={100} // 根据你图片的比例填写
                    className="w-32 md:w-48 lg:w-64 h-auto object-contain"
                    priority // 加上这个属性，会让 Logo 加载得更快
                />
            </div>

            {/* 文本内容：控制字体大小在不同设备上的表现 */}
            <p className="text-sm md:text-base lg:text-lg text-gray-500 max-w-md md:max-w-2xl">
                请在此处完成你的大作，我可以给你评分并提修改建议哦~
            </p>
        </div>
    );
};

export default Header;
