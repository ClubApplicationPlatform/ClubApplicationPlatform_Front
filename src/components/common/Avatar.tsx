import React from "react";

export default function Avatar({ src, alt, size = 64 }: { src?: string | null; alt?: string; size?: number }) {
  return (
    <div
      className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} alt={alt ?? "avatar"} className="object-cover w-full h-full" /> : <span className="text-xl font-bold text-gray-600">김</span>}
    </div>
  );
}
