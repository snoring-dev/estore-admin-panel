import ColorForm from "@/components/color-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { colorId: string };
}

async function SingleBillboardPage({ params }: Props) {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default SingleBillboardPage;
