"use client";

import React, { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const storeFormSchema = z.object({
  name: z.string().min(3),
});

function StoreModal() {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof storeFormSchema>) => {
    setLoading(true);
    try {
      const resp = await axios.post("/api/stores", values);
      window.location.assign(`/${resp.data.id}`);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Give your store a name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end">
              <Button variant="outline" onClick={storeModal.onClose}>
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}

export default StoreModal;
