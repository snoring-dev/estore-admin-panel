"use client";

import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import Image from "next/image";

interface Props {
  value: string[];
  disabled?: boolean;
  onChange: (src: string) => void;
  onRemove: (src: string) => void;
}

function ImageUploader({ value, disabled, onRemove, onChange }: Props) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div className="flex flex-col items-start">
      <div className="mb-4 flex flex-row items-start gap-4">
        {value.map((url, index) => {
          if (url) {
            return (
              <div
                key={index}
                className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
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
                  className="object-cover"
                  alt="billboard-image"
                  src={url}
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
