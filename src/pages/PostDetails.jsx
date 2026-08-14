import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router"; // or "react-router-dom" depending on your setup
import { useAuth } from "@clerk/react";
import { ArrowLeft, Heart, MessageCircleMore, Share2, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";

const PostDetails = () => {
   const { postId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user, getUser} = useUserStore();
  
  // Assuming your store has these methods. If not, you will need to add them to usePostStore.js
  const { currentPost, comments, getPostById, createComment, getPostComments, togglePostLike, pIsLoading, pError } = usePostStore();
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const token = await getToken();
      if (token && postId) {
        await getPostById(token, postId);
      }
    };

    const fetchPostComments = async () => {
      if (postId) {
        await getPostComments(postId);
      }
    };

    fetchPostComments();
    fetchPost();
  }, [getToken, postId, getPostById, getPostComments]);

  const handleLike = async () => {
    const token = await getToken();
    if (token && currentPost) {
      await togglePostLike(token, currentPost._id);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    const token = await getToken();
    if (token) {
      await createComment(token, postId, commentText);
      setCommentText(""); // Clear input after successful post
    }
    setIsSubmitting(false);
  };

  if (pIsLoading || !currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Loading post...</p>
      </div>
    );
  }

  if (pError) {
    return <div><h1>{pError}</h1></div>
  }

  const isLiked = currentPost.isLiked || currentPost.likes?.includes(user?._id);

  return (
    <div className="min-h-screen bg-gray-50 md:py-8 flex justify-center">
      {/* 
        Main Container: 
        On mobile, takes full height. On desktop, looks like a centered card.
      */}
      <div className="w-full max-w-2xl bg-white md:rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[100dvh] md:h-[85vh] overflow-hidden">
        
        {/* Top Navigation Bar */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-4 py-3 flex items-center gap-4 shrink-0">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-gray-800 text-lg">Post</h1>
        </div>

        {/* Scrollable Content Area (Header, Media, Text, and Comments) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* 1. Post Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${currentPost.authorId._id}`} className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img
                  src={currentPost.authorId.profileImg?.url}
                  alt="user profile"
                  className="w-full h-full object-cover"
                />
              </Link>
              <div>
                <Link to={`/profile/${currentPost.authorId._id}`}>
                  <h3 className="font-semibold text-gray-900 text-sm hover:underline">
                    {currentPost.authorId.username}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋯</button>
          </div>

          {/* 2. Post Text (if any) */}
          {currentPost.content && (
            <div className="px-4 pb-3">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {currentPost.content}
              </p>
            </div>
          )}

          {/* 3. Post Picture/Media */}
          {currentPost.media?.length > 0 && (
            <div className="w-full bg-gray-100">
              {currentPost.media[0].type === "VIDEO" ? (
                <video src={currentPost.media[0].url} controls className="w-full max-h-[500px] object-contain bg-black" />
              ) : (
                <img 
                  src={currentPost.media[0].url} 
                  alt="Post content" 
                  className="w-full max-h-[500px] object-contain bg-black"
                />
              )}
            </div>
          )}

          {/* 4. Action Buttons (Like / Comment / Share) */}
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{currentPost.likesCount || 0} Liked</span>
              </button>
              <button className="flex items-center gap-2 text-blue-600 text-sm font-medium py-2 px-4 rounded-md bg-blue-50 flex-1 justify-center">
                <MessageCircleMore className="w-5 h-5" />
                <span>{currentPost.commentsCount || 0} Comments</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* 5. Comments Section with Scroll */}
          <div className="p-4 space-y-5">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Link to={`/profile/${comment.author._id}`} className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                    <img
                      src={comment.author.profileImg?.url}
                      alt="commenter"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-100 px-4 py-2.5 rounded-2xl inline-block max-w-[90%]">
                      <Link to={`/profile/${comment.author._id}`}>
                        <span className="font-semibold text-sm text-gray-900 hover:underline block mb-0.5">
                          {comment.author.username}
                        </span>
                      </Link>
                      <p className="text-sm text-gray-800 break-words">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 px-2 text-xs text-gray-500">
                      <button className="hover:text-gray-800 font-medium font-semibold">Like</button>
                      <button className="hover:text-gray-800 font-medium font-semibold">Reply</button>
                      <span>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>

        {/* 6. Create Comment Row (Sticky at the bottom) */}
        <div className="bg-white border-t border-gray-200 p-3 shrink-0">
          <form onSubmit={handlePostComment} className="flex items-end gap-3 max-w-full">
            {/* Current User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 mb-1">
              {user?.profileImg?.url && (
                <img
                  src={user.profileImg.url}
                  alt="Your profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Input Field */}
            <div className="flex-1 relative bg-gray-100 rounded-2xl flex items-center min-h-[40px]">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a new comment..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm px-4 py-2.5 max-h-[100px] text-gray-800 placeholder-gray-500 custom-scrollbar outline-none rounded-2xl"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = (e.target.scrollHeight) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment(e);
                  }
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors mb-1"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PostDetails;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router";
// import { useAuth } from "@clerk/react";
// import { ArrowLeft, Heart, MessageCircleMore, Share2, Send, Loader2 } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useUserStore } from "../store/useUserStore";
// import { usePostStore } from "../store/usePostStore";

// const PostDetails = () => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const { getToken } = useAuth();
//   const { user, getUser} = useUserStore();
  
//   // Assuming your store has these methods. If not, you will need to add them to usePostStore.js
//   const { currentPost, comments, getPostById, createComment, getPostComments, togglePostLike, pIsLoading, pError } = usePostStore();
  
//   const [commentText, setCommentText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchPost = async () => {
//       const token = await getToken();
//       if (token && postId) {
//         await getPostById(token, postId);
//       }
//     };

//     const fetchPostComments = async () => {
//       if (postId) {
//         await getPostComments(postId);
//       }
//     };

//     fetchPostComments();
//     fetchPost();
//   }, [getToken, postId, getPostById, getPostComments]);

//   const handleLike = async () => {
//     const token = await getToken();
//     if (token && currentPost) {
//       await togglePostLike(token, currentPost._id);
//     }
//   };

//   const handlePostComment = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim()) return;
    
//     setIsSubmitting(true);
//     const token = await getToken();
//     if (token) {
//       await createComment(token, postId, commentText);
//       setCommentText(""); // Clear input after successful post
//     }
//     setIsSubmitting(false);
//   };

//   if (pIsLoading || !currentPost) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-400">
//         <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
//         <p>Loading post...</p>
//       </div>
//     );
//   }

//   if (pError) {
//     return <div><h1>{pError}</h1></div>
//   }

//   const isLiked = currentPost.isLiked || currentPost.likes?.includes(user?._id);

//   return (
//     <div className="min-h-screen bg-gray-50 md:py-8 flex justify-center">
//       {/* 
//         Main Container: 
//         On mobile, takes full height. On desktop, looks like a centered card.
//       */}
//       <div className="w-full max-w-2xl bg-white md:rounded-2xl shadow-sm border border-gray-100 flex flex-col h-dvh md:h-[85vh] overflow-hidden">
        
//         {/* Top Navigation Bar (Fixed) */}
//         <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-4 py-3 flex items-center gap-4 shrink-0">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="font-semibold text-gray-800 text-lg">Post</h1>
//         </div>

//         {/* 1. Post Header (Fixed) */}
//         <div className="flex items-center justify-between p-4 shrink-0">
//           <div className="flex items-center gap-3">
//             <Link to={`/profile/${currentPost.authorId._id}`} className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden shrink-0">
//               <img
//                 src={currentPost.authorId.profileImg?.url}
//                 alt="user profile"
//                 className="w-full h-full object-cover"
//               />
//             </Link>
//             <div>
//               <Link to={`/profile/${currentPost.authorId._id}`}>
//                 <h3 className="font-semibold text-gray-900 text-sm hover:underline">
//                   {currentPost.authorId.username}
//                 </h3>
//               </Link>
//               <p className="text-xs text-gray-400 mt-0.5">
//                 {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
//               </p>
//             </div>
//           </div>
//           <button className="text-gray-400 hover:text-gray-600">⋯</button>
//         </div>

//         {/* 2. Post Text (Fixed) */}
//         {currentPost.content && (
//           <div className="px-4 pb-3 shrink-0">
//             <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
//               {currentPost.content}
//             </p>
//           </div>
//         )}

//         {/* 3. Post Picture/Media (Fixed - Height adjusted so comments stay visible) */}
//         {currentPost.media?.length > 0 && (
//           <div className="w-full bg-gray-100 shrink-0">
//             {currentPost.media[0].type === "VIDEO" ? (
//               <video src={currentPost.media[0].url} controls className="w-full max-h-[35vh] object-contain bg-black" />
//             ) : (
//               <img 
//                 src={currentPost.media[0].url} 
//                 alt="Post content" 
//                 className="w-full max-h-[35vh] object-contain bg-black"
//               />
//             )}
//           </div>
//         )}

//         {/* 4. Action Buttons (Fixed) */}
//         <div className="px-4 py-2 border-b border-gray-100 shrink-0">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={handleLike}
//               className={`flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center transition-colors ${
//                 isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
//               }`}
//             >
//               <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
//               <span>{currentPost.likesCount || 0} Liked</span>
//             </button>
//             <button className="flex items-center gap-2 text-blue-600 text-sm font-medium py-2 px-4 rounded-md bg-blue-50 flex-1 justify-center">
//               <MessageCircleMore className="w-5 h-5" />
//               <span>{currentPost.commentsCount || 0} Comments</span>
//             </button>
//             <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-50 flex-1 justify-center">
//               <Share2 className="w-5 h-5" />
//               <span>Share</span>
//             </button>
//           </div>
//         </div>

//         {/* 5. Comments Section (SCROLLABLE) */}
//         <div className="p-4 space-y-5 flex-1 overflow-y-auto custom-scrollbar min-h-0">
//           {comments.length > 0 ? (
//             comments.map((comment) => (
//               <div key={comment._id} className="flex gap-3">
//                 <Link to={`/profile/${comment.author._id}`} className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
//                   <img
//                     src={comment.author.profileImg?.url}
//                     alt="commenter"
//                     className="w-full h-full object-cover"
//                   />
//                 </Link>
//                 <div className="flex-1">
//                   <div className="bg-gray-100 px-4 py-2.5 rounded-2xl inline-block max-w-[90%]">
//                     <Link to={`/profile/${comment.author._id}`}>
//                       <span className="font-semibold text-sm text-gray-900 hover:underline block mb-0.5">
//                         {comment.author.username}
//                       </span>
//                     </Link>
//                     <p className="text-sm text-gray-800 break-words">
//                       {comment.content}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4 mt-1 px-2 text-xs text-gray-500">
//                     <button className="hover:text-gray-800 font-medium font-semibold">Like</button>
//                     <button className="hover:text-gray-800 font-medium font-semibold">Reply</button>
//                     <span>
//                       {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-400 text-sm">
//               No comments yet. Be the first to share your thoughts!
//             </div>
//           )}
//         </div>

//         {/* 6. Create Comment Row (Fixed at the bottom) */}
//         <div className="bg-white border-t border-gray-200 p-3 shrink-0">
//           <form onSubmit={handlePostComment} className="flex items-end gap-3 max-w-full">
//             {/* Current User Avatar */}
//             <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 mb-1">
//               {user?.profileImg?.url && (
//                 <img
//                   src={user.profileImg.url}
//                   alt="Your profile"
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
            
//             {/* Input Field */}
//             <div className="flex-1 relative bg-gray-100 rounded-2xl flex items-center min-h-[40px]">
//               <textarea
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Add a new comment..."
//                 className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm px-4 py-2.5 max-h-[100px] text-gray-800 placeholder-gray-500 custom-scrollbar outline-none rounded-2xl"
//                 rows="1"
//                 onInput={(e) => {
//                   e.target.style.height = 'auto';
//                   e.target.style.height = (e.target.scrollHeight) + 'px';
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handlePostComment(e);
//                   }
//                 }}
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={!commentText.trim() || isSubmitting}
//               className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors mb-1"
//             >
//               {isSubmitting ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Send className="w-4 h-4 ml-0.5" />
//               )}
//             </button>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PostDetails;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router";
// import { useAuth } from "@clerk/react";
// import {
//   ArrowLeft,
//   Heart,
//   MessageCircleMore,
//   Share2,
//   Send,
//   Loader2,
//   Bookmark,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useUserStore } from "../store/useUserStore";
// import { usePostStore } from "../store/usePostStore";

// const PostDetails = () => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const { getToken } = useAuth();

//   const { user, getUser } = useUserStore();

//   const {
//     currentPost,
//     comments,
//     getPostById,
//     createComment,
//     getPostComments,
//     togglePostLike,
//     pIsLoading,
//     pError,
//   } = usePostStore();

//   const [commentText, setCommentText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // --------------------------------------------------
//   // FETCH POST + COMMENTS
//   // --------------------------------------------------

//   useEffect(() => {
//     const fetchPost = async () => {
//       const token = await getToken();

//       if (token && postId) {
//         await getPostById(token, postId);
//       }
//     };

//     const fetchPostComments = async () => {
//       if (postId) {
//         await getPostComments(postId);
//       }
//     };

//     fetchPost();
//     fetchPostComments();
//   }, [getToken, postId, getPostById, getPostComments]);

//   // --------------------------------------------------
//   // LIKE
//   // --------------------------------------------------

//   const handleLike = async () => {
//     const token = await getToken();

//     if (token && currentPost) {
//       await togglePostLike(token, currentPost._id);
//     }
//   };

//   // --------------------------------------------------
//   // COMMENT
//   // --------------------------------------------------

//   const handlePostComment = async (e) => {
//     e.preventDefault();

//     if (!commentText.trim() || isSubmitting) return;

//     setIsSubmitting(true);

//     try {
//       const token = await getToken();

//       if (token && postId) {
//         await createComment(token, postId, commentText.trim());

//         setCommentText("");

//         // Refresh comments after creating one
//         await getPostComments(postId);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // LOADING
//   // --------------------------------------------------

//   if (pIsLoading || !currentPost) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-400">
//         <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />

//         <p className="text-sm font-medium">Loading post...</p>
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // ERROR
//   // --------------------------------------------------

//   if (pError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
//         <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full">
//           <p className="text-red-500 font-medium mb-5">{pError}</p>

//           <button
//             onClick={() => navigate(-1)}
//             className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // DATA
//   // --------------------------------------------------

//   const isLiked =
//     currentPost.isLiked || currentPost.likes?.includes(user?._id);

//   const author = currentPost.authorId;

//   const likeCount =
//     currentPost.likesCount ?? currentPost.likes?.length ?? 0;

//   // --------------------------------------------------
//   // RENDER
//   // --------------------------------------------------

//   return (
//     <div className="min-h-screen bg-neutral-100">
//       <div className="mx-auto flex min-h-screen max-w-[1500px] bg-white shadow-sm">

//         {/* =====================================================
//             LEFT SIDE
//         ====================================================== */}

//         <main className="flex w-full flex-col lg:w-[62%] xl:w-[60%]">

//           {/* ================= POST HEADER ================= */}

//           <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">

//             <div className="flex min-w-0 items-center gap-3">

//               {/* Back */}
//               <button
//                 onClick={() => navigate(-1)}
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition"
//                 aria-label="Go back"
//               >
//                 <ArrowLeft className="h-5 w-5 text-gray-800" />
//               </button>

//               {/* Avatar */}
//               <Link
//                 to={`/profile/${author?._id}`}
//                 className="shrink-0"
//               >
//                 <img
//                   src={
//                     author?.profileImg?.url ||
//                     "/default-avatar.png"
//                   }
//                   alt={author?.username || "User"}
//                   className="h-10 w-10 rounded-full object-cover border border-gray-200"
//                 />
//               </Link>

//               {/* User info */}
//               <div className="min-w-0">
//                 <Link
//                   to={`/profile/${author?._id}`}
//                   className="block truncate text-sm font-semibold text-gray-900 hover:underline"
//                 >
//                   {author?.username}
//                 </Link>

//                 {currentPost.createdAt && (
//                   <p className="text-xs text-gray-500">
//                     {formatDistanceToNow(
//                       new Date(currentPost.createdAt),
//                       {
//                         addSuffix: true,
//                       }
//                     )}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* More button */}
//             <button
//               className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
//               aria-label="More options"
//             >
//               <span className="text-xl tracking-widest leading-none">
//                 ···
//               </span>
//             </button>
//           </header>

//           {/* ================= MEDIA ================= */}

//           <section className="flex items-center justify-center bg-black">

//             <div
//               className="
//                 relative
//                 w-full
//                 max-w-[1080px]
//                 aspect-[1080/1350]
//                 overflow-hidden
//               "
//             >
//               {currentPost.media?.[0]?.type === "VIDEO" ? (
//                 <video
//                   src={currentPost.media[0].url}
//                   controls
//                   className="h-full w-full object-contain"
//                 />
//               ) : (
//                 <img
//                   src={currentPost.media?.[0]?.url}
//                   alt={currentPost.content || "Post image"}
//                   className="h-full w-full object-contain"
//                 />
//               )}
//             </div>
//           </section>

//           {/* ================= ACTION BAR ================= */}

//           <section className="border-b border-gray-200 bg-white px-4 py-4 md:px-6">

//             <div className="flex items-center justify-between">

//               {/* Main actions */}
//               <div className="flex items-center gap-2">

//                 {/* LIKE */}
//                 <button
//                   onClick={handleLike}
//                   className="
//                     group
//                     flex
//                     items-center
//                     gap-2
//                     rounded-full
//                     px-3
//                     py-2
//                     transition
//                     hover:bg-gray-100
//                   "
//                   aria-label="Like post"
//                 >
//                   <Heart
//                     className={`h-6 w-6 transition ${
//                       isLiked
//                         ? "fill-red-500 text-red-500"
//                         : "text-gray-800 group-hover:text-red-500"
//                     }`}
//                   />

//                   <span className="text-sm font-medium text-gray-700">
//                     {likeCount}
//                   </span>
//                 </button>

//                 {/* COMMENT */}
//                 <button
//                   onClick={() => {
//                     document
//                       .getElementById("comment-input")
//                       ?.focus();
//                   }}
//                   className="
//                     flex
//                     items-center
//                     gap-2
//                     rounded-full
//                     px-3
//                     py-2
//                     hover:bg-gray-100
//                     transition
//                   "
//                   aria-label="Comment"
//                 >
//                   <MessageCircleMore className="h-6 w-6 text-gray-800" />

//                   <span className="text-sm font-medium text-gray-700">
//                     {comments?.length ?? 0}
//                   </span>
//                 </button>

//                 {/* SHARE */}
//                 <button
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     items-center
//                     justify-center
//                     rounded-full
//                     hover:bg-gray-100
//                     transition
//                   "
//                   aria-label="Share post"
//                 >
//                   <Share2 className="h-5 w-5 text-gray-800" />
//                 </button>
//               </div>

//               {/* FAVORITE */}
//               <button
//                 onClick={() => setIsFavorite((prev) => !prev)}
//                 className="
//                   flex
//                   h-10
//                   w-10
//                   items-center
//                   justify-center
//                   rounded-full
//                   hover:bg-gray-100
//                   transition
//                 "
//                 aria-label="Favorite post"
//               >
//                 <Bookmark
//                   className={`h-6 w-6 ${
//                     isFavorite
//                       ? "fill-gray-900 text-gray-900"
//                       : "text-gray-800"
//                   }`}
//                 />
//               </button>
//             </div>

//             {/* Post caption */}
//             {currentPost.content && (
//               <div className="mt-3">
//                 <p className="text-sm leading-6 text-gray-800">
//                   <Link
//                     to={`/profile/${author?._id}`}
//                     className="mr-1 font-semibold text-gray-900"
//                   >
//                     {author?.username}
//                   </Link>

//                   {currentPost.content}
//                 </p>
//               </div>
//             )}

//             {/* Hashtags */}
//             {currentPost.hashtags?.length > 0 && (
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {currentPost.hashtags.map((tag, index) => (
//                   <span
//                     key={`${tag}-${index}`}
//                     className="text-sm text-blue-600"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </section>
//         </main>

//         {/* =====================================================
//             RIGHT SIDE — COMMENTS
//         ====================================================== */}

//         <aside
//           className="
//             hidden
//             lg:flex
//             lg:w-[38%]
//             xl:w-[40%]
//             lg:flex-col
//             border-l
//             border-gray-200
//             bg-white
//           "
//         >

//           {/* ================= COMMENTS HEADER ================= */}

//           <div className="flex h-[72px] shrink-0 items-center border-b border-gray-200 px-6">
//             <div>
//               <h2 className="text-base font-semibold text-gray-900">
//                 Comments
//               </h2>

//               <p className="text-xs text-gray-500 mt-0.5">
//                 {comments?.length ?? 0}{" "}
//                 {comments?.length === 1 ? "comment" : "comments"}
//               </p>
//             </div>
//           </div>

//           {/* ================= SCROLLABLE COMMENTS ================= */}

//           <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
//             {!comments || comments.length === 0 ? (
//               <div className="flex h-full items-center justify-center">
//                 <div className="text-center max-w-xs">
//                   <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//                     <MessageCircleMore className="h-6 w-6 text-gray-500" />
//                   </div>

//                   <h3 className="font-semibold text-gray-900">
//                     No comments yet
//                   </h3>

//                   <p className="mt-1 text-sm text-gray-500">
//                     Be the first person to comment on this post.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {comments.map((comment) => {

//                   const commentAuthor =
//                     comment.authorId || comment.userId;

//                   return (
//                     <article
//                       key={comment._id}
//                       className="flex gap-3"
//                     >
//                       {/* Avatar */}
//                       <Link
//                         to={`/profile/${commentAuthor?._id}`}
//                         className="shrink-0"
//                       >
//                         <img
//                           src={
//                             commentAuthor?.profileImg?.url ||
//                             "/default-avatar.png"
//                           }
//                           alt={
//                             commentAuthor?.username ||
//                             "User"
//                           }
//                           className="h-9 w-9 rounded-full object-cover"
//                         />
//                       </Link>

//                       {/* Comment body */}
//                       <div className="min-w-0 flex-1">

//                         <div className="flex flex-wrap items-baseline gap-2">
//                           <Link
//                             to={`/profile/${commentAuthor?._id}`}
//                             className="text-sm font-semibold text-gray-900"
//                           >
//                             {commentAuthor?.username}
//                           </Link>

//                           {comment.createdAt && (
//                             <span className="text-xs text-gray-400">
//                               {formatDistanceToNow(
//                                 new Date(comment.createdAt),
//                                 {
//                                   addSuffix: true,
//                                 }
//                               )}
//                             </span>
//                           )}
//                         </div>

//                         <p className="mt-1 text-sm leading-5 text-gray-700 break-words">
//                           {comment.text ||
//                             comment.content}
//                         </p>

//                         {/* Comment actions */}
//                         <div className="mt-2 flex items-center gap-4">
//                           <button className="text-xs font-medium text-gray-400 hover:text-gray-700">
//                             Like
//                           </button>

//                           <button className="text-xs font-medium text-gray-400 hover:text-gray-700">
//                             Reply
//                           </button>
//                         </div>
//                       </div>
//                     </article>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ================= CREATE COMMENT ================= */}

//           <div className="shrink-0 border-t border-gray-200 bg-white p-4">

//             <form
//               onSubmit={handlePostComment}
//               className="flex items-center gap-3"
//             >

//               {/* Current user avatar */}
//               <img
//                 src={
//                   user?.profileImg?.url ||
//                   "/default-avatar.png"
//                 }
//                 alt={user?.username || "You"}
//                 className="h-10 w-10 shrink-0 rounded-full object-cover"
//               />

//               {/* Input */}
//               <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-300 bg-gray-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white">

//                 <input
//                   id="comment-input"
//                   type="text"
//                   value={commentText}
//                   onChange={(e) =>
//                     setCommentText(e.target.value)
//                   }
//                   placeholder="Post new comment"
//                   className="
//                     min-w-0
//                     flex-1
//                     border-none
//                     bg-transparent
//                     py-3
//                     text-sm
//                     text-gray-900
//                     outline-none
//                     placeholder:text-gray-400
//                   "
//                   maxLength={500}
//                   disabled={isSubmitting}
//                 />

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={
//                     !commentText.trim() || isSubmitting
//                   }
//                   className="
//                     ml-2
//                     flex
//                     h-9
//                     w-9
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-blue-600
//                     text-white
//                     transition
//                     hover:bg-blue-700
//                     disabled:cursor-not-allowed
//                     disabled:bg-gray-300
//                   "
//                   aria-label="Post comment"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Send className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default PostDetails;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router";
// import { useAuth } from "@clerk/react";
// import {
//   ArrowLeft,
//   Heart,
//   MessageCircleMore,
//   Share2,
//   Send,
//   Loader2,
//   Bookmark,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useUserStore } from "../store/useUserStore";
// import { usePostStore } from "../store/usePostStore";

// const PostDetails = () => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const { getToken } = useAuth();

//   const { user } = useUserStore();

//   const {
//     currentPost,
//     comments,
//     getPostById,
//     createComment,
//     getPostComments,
//     togglePostLike,
//     pIsLoading,
//     pError,
//   } = usePostStore();

//   const [commentText, setCommentText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   useEffect(() => {
//     const fetchPost = async () => {
//       const token = await getToken();

//       if (token && postId) {
//         await getPostById(token, postId);
//       }
//     };

//     const fetchComments = async () => {
//       if (postId) {
//         await getPostComments(postId);
//       }
//     };

//     fetchPost();
//     fetchComments();
//   }, [getToken, postId, getPostById, getPostComments]);

//   const handleLike = async () => {
//     const token = await getToken();

//     if (token && currentPost) {
//       await togglePostLike(token, currentPost._id);
//     }
//   };

//   const handlePostComment = async (e) => {
//     e.preventDefault();

//     if (!commentText.trim() || isSubmitting) return;

//     setIsSubmitting(true);

//     try {
//       const token = await getToken();

//       if (token && postId) {
//         await createComment(token, postId, commentText.trim());

//         setCommentText("");

//         // Refresh comments
//         await getPostComments(postId);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (pIsLoading || !currentPost) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-400">
//         <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
//         <p>Loading post...</p>
//       </div>
//     );
//   }

//   if (pError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{pError}</p>

//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 rounded-lg bg-gray-900 text-white"
//           >
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isLiked =
//     currentPost.isLiked ||
//     currentPost.likes?.includes(user?._id);

//   return (
//     <div className="min-h-screen bg-gray-50 md:py-8 flex justify-center">

//       {/* Main Post Card */}
//       <div
//         className="
//           w-full
//           max-w-2xl
//           bg-white
//           md:rounded-2xl
//           border
//           border-gray-100
//           shadow-sm
//           flex
//           flex-col
//           h-[100dvh]
//           md:h-[90vh]
//           overflow-hidden
//         "
//       >

//         {/* =====================================================
//             TOP NAVIGATION
//         ====================================================== */}

//         <div
//           className="
//             flex
//             items-center
//             gap-4
//             h-14
//             px-4
//             border-b
//             border-gray-100
//             bg-white
//             shrink-0
//             z-20
//           "
//         >
//           <button
//             onClick={() => navigate(-1)}
//             className="
//               w-9
//               h-9
//               flex
//               items-center
//               justify-center
//               rounded-full
//               hover:bg-gray-100
//               transition
//             "
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-700" />
//           </button>

//           <h1 className="text-base font-semibold text-gray-900">
//             Post
//           </h1>
//         </div>


//         {/* =====================================================
//             POST HEADER
//         ====================================================== */}

//         <div className="flex items-center justify-between px-4 py-3 shrink-0">

//           <div className="flex items-center gap-3">

//             <Link
//               to={`/profile/${currentPost.authorId._id}`}
//               className="
//                 w-10
//                 h-10
//                 rounded-full
//                 overflow-hidden
//                 bg-gray-200
//                 shrink-0
//               "
//             >
//               <img
//                 src={currentPost.authorId.profileImg?.url}
//                 alt={currentPost.authorId.username}
//                 className="w-full h-full object-cover"
//               />
//             </Link>

//             <div>
//               <Link to={`/profile/${currentPost.authorId._id}`}>
//                 <h3 className="text-sm font-semibold text-gray-900 hover:underline">
//                   {currentPost.authorId.username}
//                 </h3>
//               </Link>

//               <p className="text-xs text-gray-400 mt-0.5">
//                 {formatDistanceToNow(
//                   new Date(currentPost.createdAt),
//                   {
//                     addSuffix: true,
//                   }
//                 )}
//               </p>
//             </div>

//           </div>

//           <button
//             className="
//               w-9
//               h-9
//               flex
//               items-center
//               justify-center
//               rounded-full
//               text-gray-400
//               hover:bg-gray-100
//               hover:text-gray-700
//               transition
//             "
//           >
//             <span className="text-xl leading-none">⋯</span>
//           </button>
//         </div>


//         {/* =====================================================
//             POST CONTENT
//         ====================================================== */}

//         {currentPost.content && (
//           <div className="px-4 pb-3 shrink-0">
//             <p className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
//               {currentPost.content}
//             </p>
//           </div>
//         )}


//         {/* =====================================================
//             POST MEDIA
//         ====================================================== */}

//         {currentPost.media?.length > 0 && (
//           <div className="w-full bg-black shrink-0">

//             <div className="w-full aspect-[4/5]">

//               {currentPost.media[0].type === "VIDEO" ? (
//                 <video
//                   src={currentPost.media[0].url}
//                   controls
//                   className="w-full h-full object-contain"
//                 />
//               ) : (
//                 <img
//                   src={currentPost.media[0].url}
//                   alt="Post content"
//                   className="w-full h-full object-contain"
//                 />
//               )}

//             </div>

//           </div>
//         )}


//         {/* =====================================================
//             ACTIONS
//         ====================================================== */}

//         <div
//           className="
//             px-3
//             py-2
//             border-b
//             border-gray-100
//             shrink-0
//             bg-white
//           "
//         >

//           <div className="flex items-center">

//             {/* Like */}
//             <button
//               onClick={handleLike}
//               className={`
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 flex-1
//                 py-2.5
//                 rounded-lg
//                 text-sm
//                 font-medium
//                 transition
//                 ${
//                   isLiked
//                     ? "text-red-500 hover:bg-red-50"
//                     : "text-gray-500 hover:bg-gray-50 hover:text-red-500"
//                 }
//               `}
//             >
//               <Heart
//                 className={`
//                   w-5
//                   h-5
//                   ${
//                     isLiked
//                       ? "fill-red-500 text-red-500"
//                       : ""
//                   }
//                 `}
//               />

//               <span>
//                 {currentPost.likesCount || 0}
//               </span>
//             </button>


//             {/* Comment */}
//             <button
//               onClick={() =>
//                 document
//                   .getElementById("comment-input")
//                   ?.focus()
//               }
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 flex-1
//                 py-2.5
//                 rounded-lg
//                 text-sm
//                 font-medium
//                 text-blue-600
//                 bg-blue-50
//               "
//             >
//               <MessageCircleMore className="w-5 h-5" />

//               <span>
//                 {currentPost.commentsCount || 0}
//               </span>
//             </button>


//             {/* Share */}
//             <button
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 gap-2
//                 flex-1
//                 py-2.5
//                 rounded-lg
//                 text-sm
//                 font-medium
//                 text-gray-500
//                 hover:bg-gray-50
//                 hover:text-blue-600
//                 transition
//               "
//             >
//               <Share2 className="w-5 h-5" />

//               <span className="hidden sm:block">
//                 Share
//               </span>
//             </button>


//             {/* Favorite */}
//             <button
//               onClick={() =>
//                 setIsFavorite((prev) => !prev)
//               }
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 w-12
//                 h-10
//                 rounded-lg
//                 text-gray-500
//                 hover:bg-gray-50
//                 transition
//               "
//             >
//               <Bookmark
//                 className={`
//                   w-5
//                   h-5
//                   ${
//                     isFavorite
//                       ? "fill-gray-900 text-gray-900"
//                       : ""
//                   }
//                 `}
//               />
//             </button>

//           </div>
//         </div>


//         {/* =====================================================
//             COMMENTS - SCROLLABLE
//         ====================================================== */}

//         <div
//           className="
//             flex-1
//             min-h-0
//             overflow-y-auto
//             px-4
//             py-5
//             space-y-5
//             custom-scrollbar
//           "
//         >

//           {comments?.length > 0 ? (

//             comments.map((comment) => (

//               <div
//                 key={comment._id}
//                 className="flex gap-3"
//               >

//                 {/* Avatar */}
//                 <Link
//                   to={`/profile/${comment.author._id}`}
//                   className="
//                     w-9
//                     h-9
//                     rounded-full
//                     overflow-hidden
//                     bg-gray-200
//                     shrink-0
//                     mt-1
//                   "
//                 >
//                   <img
//                     src={comment.author.profileImg?.url}
//                     alt={comment.author.username}
//                     className="w-full h-full object-cover"
//                   />
//                 </Link>


//                 {/* Comment */}
//                 <div className="flex-1 min-w-0">

//                   <div
//                     className="
//                       bg-gray-100
//                       rounded-2xl
//                       px-4
//                       py-2.5
//                       inline-block
//                       max-w-[92%]
//                     "
//                   >

//                     <Link
//                       to={`/profile/${comment.author._id}`}
//                     >
//                       <span className="block text-sm font-semibold text-gray-900 hover:underline">
//                         {comment.author.username}
//                       </span>
//                     </Link>

//                     <p className="text-sm text-gray-800 break-words leading-relaxed">
//                       {comment.content}
//                     </p>

//                   </div>


//                   {/* Comment metadata */}
//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                       mt-1
//                       px-2
//                       text-xs
//                       text-gray-400
//                     "
//                   >
//                     <button className="font-semibold hover:text-gray-800">
//                       Like
//                     </button>

//                     <button className="font-semibold hover:text-gray-800">
//                       Reply
//                     </button>

//                     <span>
//                       {formatDistanceToNow(
//                         new Date(comment.createdAt),
//                         {
//                           addSuffix: true,
//                         }
//                       )}
//                     </span>
//                   </div>

//                 </div>
//               </div>

//             ))

//           ) : (

//             <div className="flex items-center justify-center h-full">

//               <div className="text-center max-w-xs">

//                 <MessageCircleMore className="w-10 h-10 mx-auto text-gray-300 mb-3" />

//                 <p className="font-medium text-gray-700">
//                   No comments yet
//                 </p>

//                 <p className="text-sm text-gray-400 mt-1">
//                   Be the first to share your thoughts!
//                 </p>

//               </div>

//             </div>

//           )}

//         </div>


//         {/* =====================================================
//             CREATE COMMENT
//         ====================================================== */}

//         <div
//           className="
//             bg-white
//             border-t
//             border-gray-200
//             px-3
//             py-3
//             shrink-0
//           "
//         >

//           <form
//             onSubmit={handlePostComment}
//             className="flex items-end gap-3"
//           >

//             {/* User avatar */}
//             <div
//               className="
//                 w-9
//                 h-9
//                 rounded-full
//                 overflow-hidden
//                 bg-gray-200
//                 shrink-0
//                 mb-1
//               "
//             >
//               {user?.profileImg?.url && (
//                 <img
//                   src={user.profileImg.url}
//                   alt="Your profile"
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>


//             {/* Input */}
//             <div
//               className="
//                 flex-1
//                 bg-gray-100
//                 rounded-2xl
//                 flex
//                 items-center
//                 min-h-[42px]
//                 focus-within:ring-1
//                 focus-within:ring-blue-500
//                 transition
//               "
//             >
//               <textarea
//                 id="comment-input"
//                 value={commentText}
//                 onChange={(e) =>
//                   setCommentText(e.target.value)
//                 }
//                 placeholder="Post new comment"
//                 rows={1}
//                 disabled={isSubmitting}
//                 className="
//                   w-full
//                   bg-transparent
//                   border-none
//                   outline-none
//                   resize-none
//                   text-sm
//                   text-gray-800
//                   placeholder:text-gray-400
//                   px-4
//                   py-2.5
//                   max-h-[100px]
//                   custom-scrollbar
//                 "
//                 onInput={(e) => {
//                   e.target.style.height = "auto";
//                   e.target.style.height =
//                     `${Math.min(e.target.scrollHeight, 100)}px`;
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handlePostComment(e);
//                   }
//                 }}
//               />
//             </div>


//             {/* Send */}
//             <button
//               type="submit"
//               disabled={
//                 !commentText.trim() || isSubmitting
//               }
//               className="
//                 w-9
//                 h-9
//                 shrink-0
//                 mb-1
//                 rounded-full
//                 flex
//                 items-center
//                 justify-center
//                 bg-blue-600
//                 text-white
//                 hover:bg-blue-700
//                 disabled:bg-gray-300
//                 disabled:cursor-not-allowed
//                 transition
//               "
//             >
//               {isSubmitting ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Send className="w-4 h-4" />
//               )}
//             </button>

//           </form>

//         </div>

//       </div>
//     </div>
//   );
// };

// export default PostDetails;