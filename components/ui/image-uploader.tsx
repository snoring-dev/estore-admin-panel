"use client";

import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  value: string[];
  disabled?: boolean;
  selectedImageUrl?: string;
  onChange: (src: string) => void;
  onRemove: (src: string) => void;
  onImageSelected?: (url: string) => void;
}

function ImageUploader({
  value,
  disabled,
  onRemove,
  onChange,
  selectedImageUrl = "",
  onImageSelected = () => {},
}: Props) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div className="flex flex-col items-start">
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {value.map((url, index) => {
          if (url) {
            return (
              <div
                key={index}
                className={cn(
                  "relative w-[200px] h-[200px] rounded-md overflow-hidden",
                  selectedImageUrl === url
                    ? "border-2 border-white outline outline-black"
                    : ""
                )}
              >
                <div className="absolute z-10 top-2 right-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => onRemove(url)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <Image
                  fill
                  className="object-cover cursor-pointer"
                  alt="billboard-image"
                  src={url}
                  onClick={() => onImageSelected(url)}
                />
              </div>
            );
          }
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="yyvm4cmk">
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUploader;
