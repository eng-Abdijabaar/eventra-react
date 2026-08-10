import { useSignIn } from "@clerk/react";
import logo from "../assets/logo.png";
import heroImage from "../assets/hero.png";


const LoginPage = () => {
  const { signIn } = useSignIn();

  const signInWithGoogle = async () => {
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-fb-bg gap-1">
      {/* Top Section (90%) */}
      <div className="flex h-[90%] gap-1">
        {/* Left */}
        <div className="w-[25%] bg-white flex items-baseline-last justify-center p-4">
          <button
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={signInWithGoogle}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            Continue with Google
          </button>
        </div>

        {/* Right */}
        <div className="w-[75%] bg-white">
          <div className=" flex h-full">
            <div className="flex flex-col h-full justify-between px-4 pt-4 pb-9">
              {/* Logo */}
              <img
                src={logo}
                alt="Company Logo"
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Bottom Text */}
              <h1 className="text-5xl font-bold text-gray-800 max-w-54">
                Explore the things <span className="text-blue-500">you love.</span>
              </h1>
            </div>

            <div className="flex flex-1 h-full items-center justify-center px-3 mr-4 mb-2">
              {/* Hero Image */}
              <img
                src={heroImage}
                alt="Hero"
                className="w-145 h-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section (10%) */}
      <div className="h-[10%] bg-white">
        {/* Footer */}
      </div>
    </div>
  );
};

export default LoginPage;

// this is my page right now what is your rating