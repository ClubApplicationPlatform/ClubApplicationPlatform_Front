export default function MyPage() {
    return (
        <div
            style={{ backgroundImage: "url('/assets/JoinUs_Background.png')" }}
            className="w-full min-h-[100vh] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start relative pt-8">

            {/* 헤더 */}
            <header className="w-full max-w-screen-lg bg-white/90 backdrop-blur-sm flex items-center justify-between p-4 shadow rounded-xl mx-auto px-6">
                <div className="flex items-center gap-2">
                    <img src="/assets/JoinUs_Logo.png" alt="JoinUs Logo" className="h-8" />
                    <span className="font-bold text-lg">JoinUs</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-gray-200"></button>
            </header>

            {/* 프로필 섹션 */}
            <section className="w-full max-w-screen-lg bg-[#003EA6] h-65 text-white p-6 flex items-center justify-between rounded-xl mx-auto px-12 shadow">
                <div className="flex items-center gap-4">
                    <div className="w-42 h-42 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col items-start justify-start">
                        <h2 className="font-bold text-lg p-1">김연암 ✍</h2>
                        <p className="text-sm p-1">22560001</p>
                        <p className="text-sm p-1">스마트소프트웨어학과</p>
                    </div>
                </div>

                <div className="bg-[#002666] p-16 rounded-lg text-sm shadow  ">
                    <h2 className="font-bold text-lg items-start" >동아리 정보</h2>
                    <p>전공 동아리 : <span className="font-bold">Digital Playground</span></p>
                    <p>일반 동아리 : (없음)</p>
                </div>
            </section>

            {/* 찜 목록 섹션 */}
            <section className="w-full max-w-screen-lg bg-white/90 backdrop-blur-sm flex items-center justify-between p-8 shadow rounded-xl mx-auto px-6 min-h-[120px]">
                <h1>찜 목록</h1>
                <div>

                </div>
            </section>
        </div>
    )
}
