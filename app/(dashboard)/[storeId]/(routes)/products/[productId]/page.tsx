import ProductForm from "@/components/product-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { productId: string; storeId: string };
}

async function SingleProductPage({ params }: Props) {
  const { storeId, productId } = params;

  const product = await prismadb.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  const categories = await prismadb.category.findMany({
    where: { storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId },
  });

  const colors = await prismadb.color.findMany({
    where: { storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default SingleProductPage;
