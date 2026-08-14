import { create } from "zustand";
import api from "../api/axios.js";

export const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  comments: [], // Added to manage the active post's comments
  replies: [],  // Added to manage active comment's replies
  pIsLoading: false,
  pError: null,


  // ==========================================
  // Posts
  // ==========================================
  createPost: async (token, formData) => {
    try {
      set({ pIsLoading: true, pError: null });
      const res = await api.post("/posts/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optionally prepend the new post to the posts array
      set((state) => ({ posts: [res.data.post, ...state.posts] }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  getFeeds: async (token) => {
    set({ pIsLoading: true, pError: null });
    try {
      const res = await api.get('/posts/feeds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ posts: res.data.data });
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  getPostById: async (token, postId) => {
    set({ pIsLoading: true, pError: null });
    try {
      const res = await api.get(`/posts/feeds/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentPost: res.data.data });
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  // ==========================================
  // Comments
  // ==========================================
  createComment: async (token, postId, content) => {
    set({ pIsLoading: true, pError: null });
    try {
      const res = await api.post('/interActions/comment', { postId, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Prepend the new comment to the comments array
      set((state) => ({ comments: [res.data.comment, ...state.comments] }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });      
    } finally {
      set({ pIsLoading: false });
    }
  },

  getPostComments: async (postId) => {
    set({ pIsLoading: true, pError: null });
    try {
      // Public route, no token needed
      const res = await api.get(`/interActions/post/${postId}/comments`);
      set({ comments: res.data.comments });
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  deleteComment: async (token, commentId) => {
    try {
      await api.delete(`/interActions/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI state
      set((state) => ({
        comments: state.comments.filter(c => c._id !== commentId)
      }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

  // ==========================================
  // Replies
  // ==========================================
  createReply: async (token, commentId, content) => {
    set({ pIsLoading: true, pError: null });
    try {
      const res = await api.post('/interActions/reply', { commentId, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ replies: [res.data.reply, ...state.replies] }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  getCommentReplies: async (commentId) => {
    set({ pIsLoading: true, pError: null });
    try {
      // Public route, no token needed
      const res = await api.get(`/interActions/comment/${commentId}/replies`);
      set({ replies: res.data.replies });
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    } finally {
      set({ pIsLoading: false });
    }
  },

  deleteReply: async (token, replyId) => {
    try {
      await api.delete(`/interActions/reply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        replies: state.replies.filter(r => r._id !== replyId)
      }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

  // ==========================================
  // Toggles (Likes, Favorites, Follows)
  // ==========================================
  togglePostLike: async (token, postId) => {
    try {
      const res = await api.post(`/interActions/post/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the specific post's like count in the UI
      set((state) => ({
        posts: state.posts.map((post) => 
          post._id === postId 
            ? { ...post, likesCount: res.data.message === "Post liked" ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1) }
            : post
        )
      }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

  toggleCommentLike: async (token, commentId) => {
    try {
      const res = await api.post(`/interActions/comment/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the specific comment's like count in the UI
      set((state) => ({
        comments: state.comments.map((comment) => 
          comment._id === commentId 
            ? { ...comment, likesCount: res.data.message === "Comment liked" ? (comment.likesCount || 0) + 1 : Math.max(0, (comment.likesCount || 0) - 1) }
            : comment
        )
      }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

  toggleFavorite: async (token, postId) => {
    try {
      const res = await api.post(`/interActions/post/${postId}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the specific post's favorites count in the UI
      set((state) => ({
        posts: state.posts.map((post) => 
          post._id === postId 
            ? { ...post, favoritesCount: res.data.message === "Added to favorites" ? (post.favoritesCount || 0) + 1 : Math.max(0, (post.favoritesCount || 0) - 1) }
            : post
        )
      }));
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

  toggleFollow: async (token, targetUserId) => {
    try {
      await api.post(`/interActions/user/${targetUserId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Note: Depending on your UI, you might want to update the specific post's author 
      // follow status here if you are storing 'isFollowed' on the post object itself.
    } catch (error) {
      set({ pError: error.response?.data?.message || error.message });
    }
  },

}));