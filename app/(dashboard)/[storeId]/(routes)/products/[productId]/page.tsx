import ProductForm from "@/components/product-form";
import prismadb from "@/lib/prisma.db";

interface Props {
  params: { productId: string; storeId: string };
}

async function SingleProductPage({ params }: Props) {
  const { storeId, productId } = params;

  const product = await prismadb.product.findUnique({
    where: { id: productId },
    include: { images: true, sizes: true, colors: true },
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
          initialData={{
            categoryId: product?.categoryId ?? "",
            descriptionFile: product?.descriptionFile ?? "",
            id: product?.id ?? "",
            images: product?.images ?? [],
            sizes: product?.sizes ?? [],
            colors: product?.colors ?? [],
            inventory: product?.inventory ?? 0,
            isArchived: product?.isArchived ?? false,
            isFeatured: product?.isFeatured ?? false,
            name: product?.name ?? "",
            price: Number(product?.price ?? 0),
            shortDescription: product?.shortDescription ?? "",
            storeId: product?.storeId ?? "",
          }}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default SingleProductPage;
