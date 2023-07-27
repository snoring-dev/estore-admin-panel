import BillboardForm from "@/components/billboard-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { billboardId: string };
}

async function SingleBillboardPage({ params }: Props) {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm initialData={billboard} />
        </div>
    </div>
  );
}

export default SingleBillboardPage;
