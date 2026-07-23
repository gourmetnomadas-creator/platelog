'use client';

import { useRef } from 'react';

interface MealPhotoInputProps {
  photoPreview: string | null;
  onPhotoCapture: (base64: string) => void;
  onClear: () => void;
}

export default function MealPhotoInput({
  photoPreview,
  onPhotoCapture,
  onClear,
}: MealPhotoInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ponytail: Chrome can't decode iPhone HEIC files; on iOS the browser
    // hands us a JPEG automatically, so this only hits desktop file picks.
    if (/\.heic$|\.heif$/i.test(file.name)) {
      alert(
        'This photo is in iPhone HEIC format, which this browser cannot display. Use a JPG/PNG here, or add the photo from your phone.'
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64 = result.split(',')[1];
      onPhotoCapture(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {photoPreview ? (
        <div className="relative">
          <img
            src={photoPreview}
            alt="Meal preview"
            className="h-48 w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700 backdrop-blur"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCapture}
          className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100"
        >
          <span className="text-3xl">📷</span>
          <span className="mt-2 text-sm text-slate-500">Take photo or choose from gallery</span>
        </button>
      )}
    </div>
  );
}
