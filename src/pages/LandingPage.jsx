// // import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
// // import { Search } from "lucide-react";
// // import logo from "../assets/logo.png";
// // import LeftSidebar from "../components/LeftSidebar";
// // import RightSidebar from "../components/RightSidebar";
// // import { useUserStore } from "../store/useUserStore";
// // import { useEffect } from "react";
// // import { usePostStore } from "../store/usePostStore";
// // import { formatDistanceToNow } from "date-fns"
// // import { Link } from "react-router";


// // const LandingPage = () => {
// //     const { user, getUser, isLoading, error } = useUserStore();
// //     const { posts, getFeeds, pIsLoading, pError } = usePostStore();
// //     const { getToken } = useAuth();

// //     useEffect(() => {
// //         const fetchUser = async () => {
// //             const token = await getToken();
// //             if (token) {
// //                 await getUser(token);
// //             }
// //         };

// //         const fetchPosts = async () => {
// //             const token = await getToken();
// //             if (token) {
// //                 await getFeeds(token);
// //             }
// //         };

// //         fetchPosts();
// //         fetchUser();
// //     }, [getToken, getUser, getFeeds]);

// //     useEffect(() => {
// //         console.log('posts data: ', posts);
// //     }, [posts])


// //     return (
// //         <div className="min-h-screen text-gray-900">
// //             {/* Navbar */}
// //             <header className="bg-white shadow-sm h-14 flex items-center justify-between px-10 sticky top-0 z-50">

// //                 {/* Left: Logo & Search */}
// //                 <div className="flex items-center gap-2">
// //                     <img
// //                         src={logo}
// //                         alt="Company Logo"
// //                         className="w-10 h-10 rounded-full object-cover"
// //                     />
// //                     <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 w-64">
// //                         <Search className="w-4 h-4 mr-2" />
// //                         <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none" />
// //                     </div>
// //                 </div>

// //                 {/* Right: Auth Controls */}
// //                 <div className="flex items-center gap-4">
// //                     <Show when="signed-in">
// //                         <UserButton />
// //                     </Show>
// //                     <Show when="signed-out">
// //                         <SignInButton mode="modal">
// //                             <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-semibold hover:bg-blue-600 transition">
// //                                 Log In
// //                             </button>
// //                         </SignInButton>
// //                     </Show>
// //                 </div>
// //             </header>

// //             {/* Main Content Area */}
// //             <main className="max-w-7xl mx-auto pt-4 px-4">
// //                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full h-full">
// //                     {/* Left Column: Navigation */}
// //                     {user ? (
// //                         <div className="lg:col-span-1">
// //                             <LeftSidebar user={user} isLoading={isLoading} error={error} />
// //                         </div>
// //                     ) : (
// //                         <div className="lg:col-span-1">
// //                         </div>
// //                     )}

// //                     {/* Middle Column: Feed (Create Post + Post List) */}
// //                     <div className="lg:col-span-2 pt-6 px-4 md:px-12 max-w-2xl mx-auto w-full">

// //                         {/* "What's on your mind?" Placeholder Box */}
// //                         <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
// //                             <div className="flex gap-2 border-b pb-3">
// //                                 <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
// //                                 <div className="bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-full flex-1 flex items-center px-4 text-gray-500">
// //                                     What's on your mind?
// //                                 </div>
// //                             </div>
// //                             <div className="flex justify-between pt-3 px-2">
// //                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
// //                                     🎥 Live Video
// //                                 </div>
// //                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
// //                                     🖼️ Photo/video
// //                                 </div>
// //                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
// //                                     😊 Feeling/activity
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Posts */}
// //                         <div className="space-y-5">

// //                             {posts.length > 0 ? (

// //                                 posts.map((post) => (

// //                                     <article
// //                                         key={post._id}
// //                                         className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
// //                                     >

// //                                         {/* Post Header */}
// //                                         <div className="flex items-center justify-between p-4">

// //                                             <div className="flex items-center gap-3">

// //                                                 {/* Author Avatar */}
// //                                                 <Link to={`/profile/${post.authorId._id}`} className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0">
// //                                                     <img src={post.authorId.profileImg.url} alt="user profile" />
// //                                                 </Link>

// //                                                 <Link to={`/profile/${post.authorId._id}`}>
// //                                                     <h3 className="font-semibold text-gray-900 text-sm">
// //                                                         {post.authorId.username}
// //                                                     </h3>

// //                                                     <p className="text-xs text-gray-400 mt-0.5">
// //                                                         {formatDistanceToNow(new Date(post.createdAt), {
// //                                                             addSuffix: true,
// //                                                         })}
// //                                                     </p>
// //                                                 </Link>

// //                                             </div>

// //                                             <button
// //                                                 type="button"
// //                                                 className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
// //                                             >
// //                                                 ⋯
// //                                             </button>

// //                                         </div>


// //                                         {/* Post Content */}
// //                                         {post.content && (
// //                                             <div className="px-4 pb-4">
// //                                                 <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
// //                                                     {post.content}
// //                                                 </p>
// //                                             </div>
// //                                         )}


// //                                         {/* Media */}
// //                                         {post.media?.length > 0 && (
// //                                             <div className={`w-full overflow-hidden ${post.media.length === 1 ? "" : "grid grid-cols-2 gap-1" }`}>

// //                                                 {post.media.map((media, index) => (

// //                                                     <div key={`${post._id}-${index}`} className={`relative overflow-hidden bg-gray-100 ${post.media.length === 1
// //                                                                 ? "max-h-[600px]"
// //                                                                 : "aspect-square"
// //                                                             }
// //                                     `}
// //                                                     >

// //                                                         {media.type === "VIDEO" ? (
// //                                                             <video
// //                                                                 src={media.url}
// //                                                                 controls
// //                                                                 className="w-full h-full object-cover"
// //                                                             />
// //                                                         ) : (
// //                                                             <img
// //                                                                 src={media.url}
// //                                                                 alt="Post"
// //                                                                 className="w-full h-full object-cover"
// //                                                                 loading="lazy"
// //                                                             />
// //                                                         )}

// //                                                     </div>

// //                                                 ))}

// //                                             </div>
// //                                         )}


// //                                         {/* Post Actions */}
// //                                         <div className="px-4">

// //                                             {/* Like / Comment / Share */}
// //                                             <div className="flex items-center justify-between py-3 border-b border-gray-100">

// //                                                 <button
// //                                                     type="button"
// //                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
// //                                                 >
// //                                                     <span className="text-lg">♡</span>
// //                                                     <span>Like</span>
// //                                                 </button>

// //                                                 <button
// //                                                     type="button"
// //                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
// //                                                 >
// //                                                     <span className="text-lg">💬</span>
// //                                                     <span>Comment</span>
// //                                                 </button>

// //                                                 <button
// //                                                     type="button"
// //                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
// //                                                 >
// //                                                     <span className="text-lg">↗</span>
// //                                                     <span>Share</span>
// //                                                 </button>

// //                                             </div>

// //                                         </div>

// //                                     </article>

// //                                 ))

// //                             ) : (

// //                                 /* Empty State */
// //                                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center">

// //                                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
// //                                         📝
// //                                     </div>

// //                                     <h2 className="text-lg font-semibold text-gray-800">
// //                                         No posts yet
// //                                     </h2>

// //                                     <p className="text-sm text-gray-500 mt-1">
// //                                         Be the first to share something with your friends.
// //                                     </p>

// //                                 </div>

// //                             )}

// //                         </div>



// //                     </div>

// //                     {/* Right Column: Contacts */}
// //                     {user ? (
// //                         <div className="lg:col-span-1">
// //                             <RightSidebar user={user} />
// //                         </div>
// //                     ) : (
// //                         <div className="lg:col-span-1">
// //                         </div>
// //                     )}

// //                 </div>
// //             </main>
// //         </div>
// //     );
// // };

// // export default LandingPage;

// import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
// import { Search, Loader2, Images, MessageCircleMore, Heart, Bookmark } from "lucide-react"; // Added Loader2 for loading state
// import logo from "../assets/logo.png";
// import LeftSidebar from "../components/LeftSidebar";
// import RightSidebar from "../components/RightSidebar";
// import { useUserStore } from "../store/useUserStore";
// import { useEffect } from "react";
// import { usePostStore } from "../store/usePostStore";
// import { formatDistanceToNow } from "date-fns";
// import { Link } from "react-router";

// const LandingPage = () => {
//     const { user, getUser, isLoading: uIsLoading, error: uError } = useUserStore();
    
//     // 1. Destructure togglePostLike from your Zustand store
//     const { posts, getFeeds, pIsLoading, pError, togglePostLike } = usePostStore();
//     const { getToken } = useAuth();

//     useEffect(() => {
//         const fetchUser = async () => {
//             const token = await getToken();
//             if (token) {
//                 await getUser(token);
//             }
//         };

//         const fetchPosts = async () => {
//             const token = await getToken();
//             if (token) {
//                 await getFeeds(token);
//             }
//         };

//         fetchPosts();
//         fetchUser();
//     }, [getToken, getUser, getFeeds]);

//     // 2. Create the handler to toggle likes
//     const handleLike = async (postId) => {
//         const token = await getToken();
//         await togglePostLike(token, postId);
//     };

//     return (
//         <div className="min-h-screen text-gray-900">
//             {/* Navbar */}
//             <header className="bg-white shadow-sm h-14 flex items-center justify-between px-10 sticky top-0 z-50">
//                 {/* Left: Logo & Search */}
//                 <div className="flex items-center gap-2">
//                     <img
//                         src={logo}
//                         alt="Company Logo"
//                         className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 w-64">
//                         <Search className="w-4 h-4 mr-2" />
//                         <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none" />
//                     </div>
//                 </div>

//                 {/* Right: Auth Controls */}
//                 <div className="flex items-center gap-4">
//                     <Show when="signed-in">
//                         <UserButton />
//                     </Show>
//                     <Show when="signed-out">
//                         <SignInButton mode="modal">
//                             <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-semibold hover:bg-blue-600 transition">
//                                 Log In
//                             </button>
//                         </SignInButton>
//                     </Show>
//                 </div>
//             </header>

//             {/* Main Content Area */}
//             <main className="max-w-7xl mx-auto pt-4 px-4">
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full h-full">
                    
//                     {/* Left Column: Navigation */}
//                     <div className="lg:col-span-1">
//                         {user && <LeftSidebar user={user} isLoading={uIsLoading} error={uError} />}
//                     </div>

//                     {/* Middle Column: Feed (Create Post + Post List) */}
//                     <div className="lg:col-span-2 pt-6 px-4 md:px-12 max-w-2xl mx-auto w-full">

//                         {/* "What's on your mind?" Placeholder Box */}
//                         <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
//                             <div className="flex gap-2 border-b pb-3">
//                                 <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
//                                     {user?.profileImg?.url && <img src={user.profileImg.url} alt="Profile" className="w-full h-full object-cover" />}
//                                 </div>
//                                 <div className="bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-full flex-1 flex items-center px-4 text-gray-500">
//                                     What's on your mind?
//                                 </div>
//                             </div>
//                             <div className="flex justify-between pt-3 px-2">
//                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
//                                     🎥 Live Video
//                                 </div>
//                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
//                                     🖼️ Photo/video
//                                 </div>
//                                 <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-sm">
//                                     😊 Feeling/activity
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Posts Feed */}
//                         <div className="space-y-5">
//                             {/* 3. Handle Loading State safely */}
//                             {pIsLoading && posts.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center py-10 text-gray-400">
//                                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
//                                     <p>Loading your feed...</p>
//                                 </div>
//                             ) : pError ? (
//                                 <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center border border-red-100">
//                                     {pError}
//                                 </div>
//                             ) : posts.length > 0 ? (
//                                 posts.map((post) => (
//                                     <article
//                                         key={post._id}
//                                         className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
//                                     >
//                                         {/* Post Header */}
//                                         <div className="flex items-center justify-between p-4">
//                                             <div className="flex items-center gap-3">
//                                                 <Link to={`/profile/${post.authorId._id}`} className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0">
//                                                     <img src={post.authorId.profileImg?.url} alt="user profile" className="w-full h-full object-cover" />
//                                                 </Link>
//                                                 <Link to={`/profile/${post.authorId._id}`}>
//                                                     <h3 className="font-semibold text-gray-900 text-sm hover:underline">
//                                                         {post.authorId.username}
//                                                     </h3>
//                                                     <p className="text-xs text-gray-400 mt-0.5 hover:underline">
//                                                         {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//                                                     </p>
//                                                 </Link>
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
//                                             >
//                                                 ⋯
//                                             </button>
//                                         </div>

//                                         {/* Post Content */}
//                                         {post.content && (
//                                             <div className="px-4 pb-4">
//                                                 <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
//                                                     {post.content}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* Media */}
//                                         {post.media?.length > 0 && (
//                                             <div className={`w-full overflow-hidden ${post.media.length === 1 ? "" : "grid grid-cols-2 gap-1"}`}>
//                                                 {post.media.map((media, index) => (
//                                                     <div key={`${post._id}-${index}`} className={`relative overflow-hidden bg-gray-100 ${post.media.length === 1 ? "max-h-[600px]" : "aspect-square"}`}>
//                                                         {media.type === "VIDEO" ? (
//                                                             <video src={media.url} controls className="w-full h-full object-cover" />
//                                                         ) : (
//                                                             <img src={media.url} alt="Post" className="w-full h-full object-cover" loading="lazy" />
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Post Actions */}
//                                         <div className="px-4">
//                                             {/* Like / Comment / Share */}
//                                             <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                
//                                                 {/* 4. Update the Like Button to trigger state changes */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => handleLike(post._id)}
//                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center"
//                                                 >
//                                                     <span className="text-lg">
//                                                         <Heart />
//                                                     </span>
//                                                     <span>{post.likesCount > 0 ? post.likesCount : ""} Like</span>
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center"
//                                                 >
//                                                     <span className="text-lg">
//                                                         <MessageCircleMore />
//                                                     </span>
//                                                     <span>Comment</span>
//                                                 </button>

//                                                 <button
//                                                     type="button"
//                                                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center"
//                                                 >
//                                                     <span className="text-lg">
//                                                         <Bookmark />
//                                                     </span>
//                                                     <span>Favorite</span>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </article>
//                                 ))
//                             ) : (
//                                 /* Empty State */
//                                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center">
//                                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
//                                         <Images />
//                                     </div>
//                                     <h2 className="text-lg font-semibold text-gray-800">
//                                         No posts yet
//                                     </h2>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         Be the first to share something with your friends.
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right Column: Contacts */}
//                     <div className="lg:col-span-1">
//                         {user && <RightSidebar user={user} />}
//                     </div>

//                 </div>
//             </main>
//         </div>
//     );
// };

// export default LandingPage;


import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
import { Search, Loader2, MessageCircleMore, Heart, Share2 } from "lucide-react";
import logo from "../assets/logo.png";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router";

const LandingPage = () => {
  const { user, getUser, isLoading: uIsLoading, error: uError } = useUserStore();
  const { posts, getFeeds, pIsLoading, pError, togglePostLike } = usePostStore();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();
      if (token) {
        await getUser(token);
      }
    };

    const fetchPosts = async () => {
      const token = await getToken();
      if (token) {
        await getFeeds(token);
      }
    };

    fetchPosts();
    fetchUser();
  }, [getToken, getUser, getFeeds]);

  // Handle toggling likes
  const handleLike = async (postId) => {
    const token = await getToken();
    if (token) {
      await togglePostLike(token, postId);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm h-14 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 w-64">
            <Search className="w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md font-semibold hover:bg-blue-700 transition">
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
            {user && (
              <LeftSidebar
                user={user}
                isLoading={uIsLoading}
                error={uError}
              />
            )}
          </div>

          {/* Middle Column: Feed (Create Post + Post List) */}
          <div className="lg:col-span-2 pt-2 px-2 md:px-8 max-w-2xl mx-auto w-full">
            {/* "What's on your mind?" Box */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
              <div className="flex gap-3 border-b pb-3 items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  {user?.profileImg?.url && (
                    <img
                      src={user.profileImg.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded-full flex-1 flex items-center px-4 py-2 text-gray-500 text-sm">
                  What's on your mind?
                </div>
              </div>
              <div className="flex justify-between pt-3 px-2">
                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-xs md:text-sm">
                  🎥 Live Video
                </div>
                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-xs md:text-sm">
                  🖼️ Photo/video
                </div>
                <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition text-gray-500 font-semibold text-xs md:text-sm">
                  😊 Feeling/activity
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-5">
              {pIsLoading && posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
                  <p className="text-sm">Loading your feed...</p>
                </div>
              ) : pError ? (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center border border-red-100 text-sm">
                  {pError}
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const isLiked =
                    post.isLiked || post.likes?.includes(user?._id);

                  return (
                    <article
                      key={post._id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/profile/${post.authorId._id}`}
                            className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0"
                          >
                            <img
                              src={post.authorId.profileImg?.url}
                              alt="user profile"
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <div>
                            <Link to={`/profile/${post.authorId._id}`}>
                              <h3 className="font-semibold text-gray-900 text-sm hover:underline">
                                {post.authorId.username}
                              </h3>
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        >
                          ⋯
                        </button>
                      </div>

                      {/* Post Content */}
                      {post.content && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </p>
                        </div>
                      )}

                      {/* Media */}
                      {post.media?.length > 0 && (
                        <div
                          className={`w-full overflow-hidden ${
                            post.media.length === 1
                              ? ""
                              : "grid grid-cols-2 gap-1"
                          }`}
                        >
                          {post.media.map((media, index) => (
                            <div
                              key={`${post._id}-${index}`}
                              className={`relative overflow-hidden bg-gray-100 ${
                                post.media.length === 1
                                  ? "max-h-150"
                                  : "aspect-square"
                              }`}
                            >
                              {media.type === "VIDEO" ? (
                                <video
                                  src={media.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={media.url}
                                  alt="Post"
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="px-4 py-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          {/* Like Button */}
                          <button
                            type="button"
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center transition-colors ${
                              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isLiked ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                            <span>
                              {post.likesCount > 0 ? post.likesCount : ""}{" "}
                              {isLiked ? "Liked" : "Like"}
                            </span>
                          </button>

                          {/* Comment Button */}
                          <Link
                            to={`/post/${post._id}`}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center"
                          >
                            <MessageCircleMore className="w-5 h-5" />
                            <span>
                              {post.commentsCount > 0
                                ? post.commentsCount
                                : ""}{" "}
                              Comment
                            </span>
                          </Link>

                          {/* Share Button */}
                          <button
                            type="button"
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center"
                          >
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    📝
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    No posts yet
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Be the first to share something with your friends.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contacts */}
          <div className="lg:col-span-1">
            {user && <RightSidebar user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;