import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prisma.db";
import { ThemeToggle } from "./ui/theme-toggle";

async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
