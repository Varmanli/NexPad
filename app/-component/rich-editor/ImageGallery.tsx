"use client";
import { FC, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { removeImage, uploadFile } from "@/app/actions/file";
import { useImages } from "../context/ImageProvider";
import GalleryImage from "../GalleryImage";

interface Props {
  visible: boolean;
  onClose(state: boolean): void;
  onSelect?(src: string): void;
}

const ImageGallery: FC<Props> = ({ visible, onSelect, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const image = useImages();
  const images = image?.images;
  const updateImages = image?.updateImages;
  const removeOldImage = image?.removeOldImage;

  const handleClose = () => onClose(!visible);

  const handleSelection = (src: string) => {
    onSelect?.(src);
    handleClose();
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f);
        const res = await uploadFile(formData);
        if (res && updateImages) {
          updateImages([res.secure_url]);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsUploading(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) await uploadFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) await uploadFiles(files);
  };

  if (!visible) return null;

  return (
    <div
      tabIndex={-1}
      onKeyDown={({ key }) => { if (key === "Escape") handleClose(); }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-text">
            کتابخانه تصاویر
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-soft hover:text-text hover:bg-surface-hover transition-all"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Upload zone */}
        <div className="px-6 pt-5 shrink-0">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-4 py-6 transition-all ${
              isDragging
                ? "border-primary bg-primary-soft"
                : "border-border hover:border-primary hover:bg-surface-hover"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">در حال آپلود...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center">
                  <svg className="w-5 h-5 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {isDragging ? "رها کنید..." : "برای آپلود کلیک کنید"}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">
                    PNG، JPG، JPEG، WEBP
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* Gallery grid */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!images?.length ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-soft flex items-center justify-center">
                <svg className="w-7 h-7 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-text-soft">
                هنوز تصویری آپلود نشده
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {isUploading && (
                <div className="aspect-square rounded-xl bg-surface-hover animate-pulse" />
              )}
              {images.map((item) => (
                <GalleryImage
                  key={item}
                  onSelectClick={() => handleSelection(item)}
                  onDeleteClick={async () => {
                    if (confirm("آیا از حذف این تصویر مطمئن هستید؟")) {
                      await removeImage(item);
                      removeOldImage?.(item);
                    }
                  }}
                  src={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
