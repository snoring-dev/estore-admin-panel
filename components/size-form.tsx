"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Size } from "@prisma/client";
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

interface Props {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

function SizeForm({ initialData }: Props) {
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    title: initialData ? "Edit size" : "Create size",
    description: initialData
      ? "Edit an existing size"
      : "Create a band new size",
    toastMessage: initialData
      ? "Your size has been updated"
      : "A new Size has been created successfully",
    action: initialData ? "Save changes" : "Create",
  };

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setIsLoading(true);
      const route = `/api/${params.storeId}/sizes`;

      if (initialData) {
        await axios.patch(`${route}/${params.sizeId}`, data);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      toast.success("Size removed");
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
    } catch (e) {
      toast.error("Make sure you removed all related products first.");
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size value"
                      {...field}
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
        </form>
      </Form>
    </>
  );
}

export default SizeForm;
