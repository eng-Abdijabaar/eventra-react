import { AuthenticateWithRedirectCallback } from "@clerk/react";

const SsoCallback = () => {
  console.log("🔥 CALLBACK PAGE LOADED");

  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    />
  );
};

export default SsoCallback;