"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { adminUploadImage, AdminApiError } from "@/lib/adminApi";
import { useToast } from "./Toast";

interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  hint?: string;
}

/**
 * Image input shared by every admin form: upload to the existing storage
 * endpoint or paste a URL, with a preview.
 */
export default function ImageField({ id, label, value, onChange, required, hint }: ImageFieldProps) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [value]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      onChange(await adminUploadImage(file));
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof AdminApiError ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
        {!required && <span className="ml-1 font-normal text-ink-400">(optional)</span>}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-ink-200 bg-ink-50 sm:w-36">
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" onError={() => setBroken(true)} className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-ink-400">
              <ImageOff className="h-5 w-5" aria-hidden="true" />
              {broken && <span className="text-[10px] font-medium">Can’t load image</span>}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-label="Uploading" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <label className={`btn-icon cursor-pointer ${uploading ? "pointer-events-none opacity-60" : ""}`}>
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Upload image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploading}
                onChange={handleFile}
              />
            </label>
            {value && !required && (
              <button type="button" onClick={() => onChange("")} className="btn-icon">
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
          <input
            id={id}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field"
            placeholder="…or paste an image URL"
          />
          <p className="text-xs text-ink-500">{hint ?? "JPG, PNG, WebP or GIF, up to 5 MB."}</p>
        </div>
      </div>
    </div>
  );
}
