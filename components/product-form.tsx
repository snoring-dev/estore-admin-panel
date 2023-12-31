"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Category, Image, Product } from "@prisma/client";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Editor from "react-simple-wysiwyg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ImageUploader from "@/components/ui/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import ReactSelect from "react-select";

type OptionItem = {
  label: string;
  value: string;
};

interface Props {
  categories: Category[];
  sizes: OptionItem[];
  colors: OptionItem[];
  initialData:
    | (Omit<
        Product,
        "price" | "createdAt" | "updatedAt" | "sizes" | "colors"
      > & {
        images: Image[];
        colors: OptionItem[];
        price: number;
        sizes: OptionItem[];
      })
    | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({ url: z.string().min(1), isMain: z.boolean().default(false) })
    .array(),
  price: z.coerce.number().min(1),
  shortDescription: z.string().default("").optional(),
  categoryId: z.string().min(1),
  sizes: z.object({ label: z.string(), value: z.string() }).array(),
  colors: z.object({ label: z.string(), value: z.string() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  inventory: z.coerce.number().default(0),
});

type ProductFormValues = z.infer<typeof formSchema>;

function ProductForm({ initialData, categories, sizes, colors }: Props) {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    title: initialData ? "Edit product" : "Create product",
    description: initialData
      ? "Edit an existing product"
      : "Create a brand new product",
    toastMessage: initialData
      ? "Your product has been updated"
      : "A new Product has been created successfully",
    action: initialData ? "Save changes" : "Create",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          name: "",
          shortDescription: "",
          images: [],
          price: 0,
          categoryId: "",
          sizes: [],
          colors: [],
          isFeatured: false,
          isArchived: false,
          inventory: 0,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log("DATA =>", data);
    try {
      setIsLoading(true);
      const route = `/api/${params.storeId}/products`;

      if (initialData) {
        await axios.patch(`${route}/${params.productId}`, data);
      } else {
        await axios.post(route, data);
      }

      router.refresh();
      toast.success(labels.toastMessage);
      router.push(route.replace("/api", ""));
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("Product removed");
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (e) {
      toast.error("Make sure you removed all related categories first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        loading={isLoading}
        onConfirm={onDelete}
      />

      <div className="flex items-center justify-between">
        <Heading title={labels.title} description={labels.description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="icon"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value.map((img) => img.url)}
                    disabled={isLoading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url, isMain: false }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((img) => img.url !== url),
                      ])
                    }
                    onImageSelected={(url) => {
                      const images = [...field.value].map((im) => {
                        if (im.url === url) {
                          return { ...im, isMain: true };
                        }
                        return { ...im, isMain: false };
                      });
                      field.onChange(images);
                    }}
                    selectedImageUrl={field.value.find((im) => im.isMain)?.url}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="10.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inventory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory (items in stock)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="select category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <ReactSelect
                    styles={{
                      control: (base, _state) => ({
                        ...base,
                        borderColor: "rgb(226, 232, 240)",
                        padding: "2px",
                        borderRadius: "6px",
                      }),
                    }}
                    defaultValue={field.value}
                    options={sizes}
                    onChange={(v) => {
                      field.onChange(v.filter((i) => i.label !== ""));
                    }}
                    isMulti
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <ReactSelect
                    name="colors"
                    styles={{
                      control: (base, _state) => ({
                        ...base,
                        borderColor: "rgb(226, 232, 240)",
                        padding: "2px",
                        borderRadius: "6px",
                      }),
                    }}
                    defaultValue={field.value}
                    options={colors}
                    onChange={(v) => {
                      field.onChange(v.filter((i) => i.label !== ""));
                    }}
                    isMulti
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product should appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere on the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Editor
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" className="ml-auto">
            {labels.action}
          </Button>
          <Button
            variant="secondary"
            className="ml-3"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ProductForm;
