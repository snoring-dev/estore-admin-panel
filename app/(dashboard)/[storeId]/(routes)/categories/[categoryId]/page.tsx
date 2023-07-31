import CategoryForm from "@/components/category-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { categoryId: string; storeId: string };
}

async function SingleCategoryPage({ params }: Props) {
  const category = await prismadb.category.findUnique({
    where: { id: params.categoryId },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
}

export default SingleCategoryPage;