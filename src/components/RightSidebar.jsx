import { useState, useRef, useEffect } from "react";
import {
  Video,
  Image as ImageIcon,
  Smile,
  Search,
  MoreHorizontal,
  X,
  Send,
  Loader2,
  Plus,
  AlertCircle
} from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";
import { useAuth } from "@clerk/react";

const MAX_IMAGES = 5;

export default function RightSidebar({user}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createPost = usePostStore((state) => state.createPost);
  const isLoading = usePostStore((state) => state.isLoading);
  const storeError = usePostStore((state) => state.error);

  const { getToken } = useAuth();
  const fileInputRef = useRef(null);

  const contacts = [
    { name: "Jane Doe", online: true, img: "https://i.pravatar.cc/150?img=11" },
    { name: "John Smith", online: true, img: "https://i.pravatar.cc/150?img=12" },
    { name: "Alice Johnson", online: false, img: "https://i.pravatar.cc/150?img=13" },
  ];

  // Revoke object URLs on component unmount
  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  useEffect(() => {
    console.log('user data: ', user);
    
  }, [user]);

  // Handle multiple file selection (enforcing 1-5 limits)
  const handleImageChange = (e) => {
    setErrorMessage("");
    const incomingFiles = Array.from(e.target.files || []);
    if (!incomingFiles.length) return;

    const availableSlots = MAX_IMAGES - selectedFiles.length;

    if (availableSlots <= 0) {
      setErrorMessage(`You can only upload up to ${MAX_IMAGES} images.`);
      e.target.value = "";
      return;
    }

    const filesToAdd = incomingFiles.slice(0, availableSlots);
    if (incomingFiles.length > availableSlots) {
      setErrorMessage(`Only the first ${availableSlots} images were added (max ${MAX_IMAGES}).`);
    }

    const newPreviews = filesToAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // Remove a single image from the preview list
  const handleRemoveSingleImage = (indexToRemove) => {
    setErrorMessage("");
    const itemToRemove = previews[indexToRemove];
    if (itemToRemove?.url) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Discard all previews and reset state
  const handleDiscardAll = () => {
    previews.forEach((item) => URL.revokeObjectURL(item.url));
    setSelectedFiles([]);
    setPreviews([]);
    setCaption("");
    setErrorMessage("");
  };

  // Handle post submission
  const handlePost = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      
      // Append each file separately for multipart form processing
      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });
      
      formData.append("content", caption);

      const token = await getToken();
      await createPost(token, formData);

      handleDiscardAll();
    } catch (err) {
      console.error("Failed to publish post:", err);
      setErrorMessage("Failed to create post. Please try again.");
    }
  };

  // Helper to determine the preview layout
  const renderPreviewGrid = () => {
    const count = previews.length;

    // 1 Image: 1080x1350 (4:5 Portrait Aspect Ratio)
    if (count === 1) {
      return (
        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/5] w-full border border-gray-100">
          <img
            src={previews[0].url}
            alt="Preview 1"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => handleRemoveSingleImage(0)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition cursor-pointer"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      );
    }

    // 2 Images: 2-column side-by-side
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1.5 rounded-lg overflow-hidden">
          {previews.map((item, idx) => (
            <div key={item.id} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img src={item.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveSingleImage(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    // 3 Images: 3-column row
    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
          {previews.map((item, idx) => (
            <div key={item.id} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img src={item.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveSingleImage(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    // 4 Images: 2x2 grid
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-1.5 rounded-lg overflow-hidden">
          {previews.map((item, idx) => (
            <div key={item.id} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img src={item.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveSingleImage(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    // 5 Images: 2 top, 3 bottom
    return (
      <div className="grid grid-cols-6 gap-1 rounded-lg overflow-hidden">
        {previews.slice(0, 2).map((item, idx) => (
          <div key={item.id} className="col-span-3 relative h-28 bg-gray-100 rounded-md overflow-hidden">
            <img src={item.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveSingleImage(idx)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {previews.slice(2, 5).map((item, idx) => (
          <div key={item.id} className="col-span-2 relative h-20 bg-gray-100 rounded-md overflow-hidden">
            <img src={item.url} alt={`Preview ${idx + 3}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveSingleImage(idx + 2)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition cursor-pointer"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (!user.profileImg) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-10 h-10 " color='blue' /> </div>;
  }

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-2 pl-4 py-4 hidden lg:block w-80 space-y-4 select-none">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Global Store Error Display */}
      {storeError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{storeError}</span>
        </div>
      )}

      {/* 1. Quick Post Trigger Box */}
      <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-100 space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
            <img
              src={user.profileImg.url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200/80 transition cursor-pointer rounded-full flex-1 flex items-center px-4 py-2 text-sm text-gray-500 text-left"
          >
            What's on your mind?
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center text-xs font-semibold text-gray-600 px-1">
          <button
            type="button"
            className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1.5 rounded-lg cursor-pointer transition"
          >
            <Video size={18} className="text-red-500" />
            <span>Live</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1.5 rounded-lg cursor-pointer transition"
          >
            <ImageIcon size={18} className="text-green-500" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1.5 rounded-lg cursor-pointer transition"
          >
            <Smile size={18} className="text-amber-500" />
            <span>Feeling</span>
          </button>
        </div>
      </div>

      {/* 2. Multi-Image Preview Card */}
      {previews.length > 0 && (
        <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-100 space-y-3 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Preview ({previews.length}/{MAX_IMAGES})
            </span>

            <div className="flex items-center gap-1">
              {previews.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                >
                  <Plus size={13} />
                  <span>Add More</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDiscardAll}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                title="Discard all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {errorMessage}
            </p>
          )}

          {renderPreviewGrid()}

          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            disabled={isLoading}
            className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleDiscardAll}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePost}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              <span>{isLoading ? "Posting..." : `Post (${previews.length})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Contacts Section */}
      <div>
        <div className="flex items-center justify-between px-2 mb-2 text-gray-500">
          <h3 className="font-semibold text-sm">Contacts</h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 hover:bg-gray-200/70 rounded-full transition text-gray-600 cursor-pointer"
              aria-label="Search contacts"
            >
              <Search size={16} />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-gray-200/70 rounded-full transition text-gray-600 cursor-pointer"
              aria-label="Contact options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-0.5">
          {contacts.map((contact, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 cursor-pointer transition text-left"
            >
              <div className="relative shrink-0">
                <img
                  src={contact.img || `https://i.pravatar.cc/150?img=${idx + 10}`}
                  alt={contact.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className="font-medium text-[15px] text-gray-900 truncate">
                {contact.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}