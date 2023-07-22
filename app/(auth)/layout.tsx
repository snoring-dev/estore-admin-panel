import React from "react";

interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props) {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
