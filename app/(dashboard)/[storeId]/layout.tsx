import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  params: { storeId: string };
  children: React.ReactNode;
}

export default async function DashboardLayout({ children, params }: Props) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect('/');
  }
  
  return (
    <>
      <div>Navbar here</div>
      <div>{children}</div>
    </>
  );
}
