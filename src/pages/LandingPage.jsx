import { Show, SignInButton, UserButton } from "@clerk/react";
import { Search } from "lucide-react";
import logo from "../assets/logo.png";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";


const LandingPage = () => {
    return (
        <div className="min-h-screen text-gray-900">
            {/* Navbar */}
            <header className="bg-white shadow-sm h-14 flex items-center justify-between px-10 sticky top-0 z-50">

                {/* Left: Logo & Search */}
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 w-64">
                        <Search className="w-4 h-4 mr-2" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none" />
                    </div>
                </div>

                {/* Right: Auth Controls */}
                <div className="flex items-center gap-4">
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-semibold hover:bg-blue-600 transition">
                                Log In
                            </button>
                        </SignInButton>
                    </Show>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto pt-4 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full h-full">
                    {/* Left Column: Navigation */}
                    <div className="lg:col-span-1">
                        <LeftSidebar />
                    </div>

                    {/* Middle Column: Feed (Create Post + Post List) */}
                    <div className="lg:col-span-2 pt-6 px-4 md:px-12 max-w-2xl mx-auto w-full">

                        {/* "What's on your mind?" Placeholder Box */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                            <div className="flex gap-2 border-b pb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-full flex-1 flex items-center px-4 text-gray-500">
                                    What's on your mind?
                                </div>
                            </div>
                            <div className="flex justify-between pt-3 px-2">
                                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
                                    🎥 Live Video
                                </div>
                                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
                                    🖼️ Photo/video
                                </div>
                                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
                                    😊 Feeling/activity
                                </div>
                            </div>
                        </div>

                        {/* Dummy Post Placeholder */}
                        <div className="bg-white rounded-xl shadow-sm h-64 flex items-center justify-center text-gray-400">
                            Post feed will go here...
                        </div>

                    </div>

                    {/* Right Column: Contacts */}
                    <div className="lg:col-span-1">
                        <RightSidebar />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default LandingPage;