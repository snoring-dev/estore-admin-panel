"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ImageUploader from "@/components/ui/image-uploader";

interface Props {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(3),
  imageUrl: z.string().min(3),
  textColor: z.string().min(4).regex(/^#/, "Please enter a valid HEX color"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

function BillboardForm({ initialData }: Props) {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    title: initialData ? "Edit billboard" : "Create billboard",
    description: initialData
      ? "Edit an existing billboard"
      : "Create a brand new billboard",
    toastMessage: initialData
      ? "Your billboard has been updated"
      : "A new Billboard has been created successfully",
    action: initialData ? "Save changes" : "Create",
  };

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
      textColor: "#000000",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setIsLoading(true);
      const route = `/api/${params.storeId}/billboards`;

      if (initialData) {
        await axios.patch(`${route}/${params.billboardId}`, data);
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      toast.success("Billboard removed");
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (e) {
      toast.error("Make sure you removed all related categories first.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text color</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className={`border border-gray-300 bg-transparent w-[44px] h-[39px]`}
                        style={{
                          backgroundColor: field.value,
                          borderRadius: "100px",
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit" className="ml-auto">
            {labels.action}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default BillboardForm;
