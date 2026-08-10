import { create } from 'zustand';
import api from '../api/axios';

export const useUserStore = create((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: false,
  error: null,


  getUser: async (token) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set({ user: res.data.data });

    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getUserProfile: async (id, token) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get(`/users/profile-details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ userProfile: res.data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCover: async (token, formData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.patch("/users/profile/cover", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: 'Content-Type' is intentionally omitted here 
          // so the browser can automatically set the boundary string!
        },
      });

      set((state) => ({
        userProfile: {
          ...state.userProfile,
          author: {
            ...state.userProfile.author,
            coverImg: {
              url: res.data.data.coverImg
            }
          },
        },
      }));

    } catch (error) {
      // Safely catch backend errors (like "File too large") instead of generic network errors
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateprofile: async (token, formData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.patch("/users/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        userProfile: {
          ...state.userProfile,
          author: {
            ...state.userProfile.author,
            profileImg: {
              url: res.data.data.profileImg
            }
          },
        },
      }));

    } catch (error) {
      // Safely catch backend errors (like "File too large") instead of generic network errors
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));