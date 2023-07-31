import SizeForm from "@/components/size-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { sizeId: string };
}

async function SingleBillboardPage({ params }: Props) {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export default SingleBillboardPage;