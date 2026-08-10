import { useAuth } from "@clerk/react";
import { useUserStore } from "../store/useUserStore";
import { Check, Loader2, X } from "lucide-react";

const ProfileUpdateModel = ({ previewImg, file, onCancel }) => {
    const { isLoading, error, updateprofile } = useUserStore();
    const { getToken } = useAuth();

    const handleConfirmUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('profile', file);

            const token = await getToken();

            await updateprofile(token, formData);
            onCancel(); 

        } catch (err) {
            return <span className="text-red-500 text-sm font-semibold">Failed to upload</span>

        }
    };

    return (
        <div className="bg-white shadow-sm pb-6">
            <div className="max-w-5xl mx-auto w-full">

                {/* Header for the edit mode */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Update profile Photo</h2>
                    {error && <span className="text-red-500 text-sm font-semibold">Failed to upload</span>}
                </div>

                {/* profile Photo Preview */}
                <div className="relative h-64 md:h-100 bg-gray-200 rounded-b-xl overflow-hidden mt-4 shadow-inner">
                    <img
                        src={previewImg}
                        alt="Cover Preview"
                        className={`w-full h-full object-cover ${isLoading ? "opacity-50" : "opacity-100"}`}
                    />

                    {/* Action Buttons Overlay */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            <X size={18} />
                            <span>Cancel</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleConfirmUpdate}
                            disabled={isLoading}
                            className="bg-fb-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-sm hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileUpdateModel;