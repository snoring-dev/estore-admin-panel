import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <span className="font-bold text-6xl">Hello Admin</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
