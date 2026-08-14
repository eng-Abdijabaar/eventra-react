import coverImg from "../assets/cover.png";
import profileImg from "../assets/logo.png";
import { Camera, ChevronDown, Edit2, Grid, Plus, X, Check, Loader2, AlertCircle } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useAuth } from "@clerk/react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import CoverUpdateModel from "../components/CoverUpdate";
import ProfileUpdateModel from "../components/ProfileUpdate";

const ProfilePage = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const userProfile = useUserStore((state) => state.userProfile);
    const getUserProfile = useUserStore((state) => state.getUserProfile);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = await getToken();
            await getUserProfile(id, token)
        };

        fetchUserProfile()
    }, [getToken, getUserProfile]);

    useEffect(()=>{
        console.log('userProfile data: ', userProfile);
        
    },[userProfile])


    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageType, setImageType] = useState(null);

    const coverInputRef = useRef(null);
    const profileInputRef = useRef(null);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setSelectedFile(file);
            setImageType("cover");
        }

        e.target.value = null;
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setSelectedFile(file);
            setImageType("profile");
        }

        e.target.value = null;
    };

    const closePreview = () => {
        setImagePreview(null);
        setSelectedFile(null);
    };

    if (imagePreview && selectedFile && imageType === "cover") {
        return (
            <CoverUpdateModel
                previewImg={imagePreview}
                file={selectedFile}
                onCancel={closePreview}
            />
        );
    }

    if (imagePreview && selectedFile && imageType === "profile") {
        return (
            <ProfileUpdateModel
                previewImg={imagePreview}
                file={selectedFile}
                onCancel={closePreview}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-fb-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-fb-blue animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-fb-bg p-8">
                <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 my-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-slide-in-top">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2} />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800">Something went wrong</h3>
                        <p className="text-sm text-red-600 mt-0.5">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-fb-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-fb-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fb-bg">
            {/* 1. Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto w-full">

                    {/* Cover Photo */}
                    <div className="relative h-64 md:h-100 bg-gray-200 rounded-b-xl overflow-hidden">
                        <img
                            src={userProfile.author.coverImg.url}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            className="hidden"
                            ref={coverInputRef}
                            onChange={handleCoverImageChange}
                        />

                        {/* Button triggers hidden input */}
                        {userProfile.isOwner && (
                            <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-sm hover:bg-gray-100 transition cursor-pointer"
                            >
                                <Camera size={18} />
                                <span className="hidden sm:inline">Edit cover photo</span>
                            </button>
                        )}
                    </div>

                    {/* Profile Details Container */}
                    <div className="px-4 sm:px-8 pb-4 md:pb-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-20 md:-mt-8 mb-4 relative z-10">

                            {/* Avatar & Name */}
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                                <div className="relative cursor-pointer">
                                    <div className="w-40 h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                                        <img
                                            src={userProfile.author.profileImg.url}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        className="hidden"
                                        ref={profileInputRef}
                                        onChange={handleProfileImageChange}
                                    />
                                    {userProfile.isOwner && (
                                        <button
                                            type="button"
                                            onClick={() => profileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full border border-gray-300 hover:bg-gray-300 transition"
                                        >
                                            <Camera size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="text-center md:text-left md:pb-4 mt-2 md:mt-0">
                                    <h1 className="text-3xl font-bold text-gray-900">{userProfile.author.fullName}</h1>
                                    <p className="text-gray-500 font-semibold">{userProfile.author.followersCount} followers &bull; {userProfile.author.followingCount} following</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {userProfile.isOwner ? (

                                <div className="flex flex-wrap gap-2 justify-center mt-6 md:mt-0 md:pb-4">
                                    <button className="bg-fb-blue text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition">
                                        <Plus size={18} /> Add to Story
                                    </button>
                                    <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition">
                                        <Edit2 size={18} /> Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <button className="bg-fb-blue text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition">
                                    <Plus size={18} /> Follow
                                </button>
                            )
                            }
                        </div>

                        <div className="border-t border-gray-200 mt-4"></div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center justify-center gap-1 mt-1 text-[15px] font-semibold text-gray-500 overflow-x-auto no-scrollbar">
                            <button className="text-fb-blue border-b-[3px] border-fb-blue px-4 py-4">Posts</button>
                            <button className="px-4 py-4 hover:bg-gray-100 rounded-lg transition">Likes</button>
                            <button className="px-4 py-4 hover:bg-gray-100 rounded-lg transition">Favorites</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Posts Grid */}
            <div className="text-black max-w-5xl mx-auto w-full border-x border-gray-100">
                <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                    {userProfile.posts.length > 0 ? (
                        userProfile.posts.map((post, idx) => (
                            <div key={idx} className="aspect-3/4 bg-gray-900 relative group cursor-pointer">
                                <img src={post.media[0]?.url} alt="Post" className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <div key={num} className="aspect-3/4 bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <Grid size={24} opacity={0.5} />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;