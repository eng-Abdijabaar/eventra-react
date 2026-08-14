import { Link, useLocation } from "react-router";
import { Bookmark, Heart, Images, Loader2, User, AlertCircle } from "lucide-react";

export default function LeftSidebar({user, isLoading, error}) {
  const location = useLocation();
  

  const links = [
    { name: `Followers (${user?.followersCount ?? 0})`, icon: <User size={24} strokeWidth={1.5} />, path: "/followers", },
    { name: `Following (${user?.followingCount ?? 0})`, icon: <User size={24} strokeWidth={1.5} />, path: "/following", },
    { name: `Posts (${user?.postsCount ?? 0})`, icon: <Images size={24} strokeWidth={1.5} />, path: "/posts" },
    { name: `Likes`, icon: <Heart size={24} strokeWidth={1.5} />, path: "/likes" },
    { name: `Favorites`, icon: <Bookmark size={24} strokeWidth={1.5} />, path: "/favorites" },
  ];


  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-10 h-10 " color='blue' /> </div>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 my-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-slide-in-top">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" strokeWidth={2} />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800">
            Something went wrong
          </h3>
          <p className="text-sm text-red-600 mt-0.5">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-10 h-10 " color='blue' /> </div>;
  }

   if (user) {
    console.log('user data: ', user);
    
  }

  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pl-2 pr-4 py-4 hidden lg:block">
      {/* User Profile Link */}
      <Link to={`/profile/${user?._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200 transition mb-2">
        <img
          src={user.profileImg.url}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="font-semibold text-[15px]">{user?.fullName}</span>
      </Link>  {/*when ever the user clicks on this link i want it to take the user to the profile page and pass the user _id */}

      {/* Navigation Links */}
      <div className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 p-2 rounded-xl transition ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
            >
              <div className={`${isActive ? "text-fb-blue" : "text-gray-700"}`}>
                {link.icon}
              </div>
              <span className={`text-[15px] ${isActive ? "text-fb-blue font-semibold" : "text-gray-900 font-medium"}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}