"use client";

import { FC, useRef, useState } from "react";
import ToolButton from "./ToolButton";
import { BiLink, BiCheck, BiX } from "react-icons/bi";

interface Props {
  onSubmit(link: string): void;
}

const LinkForm: FC<Props> = ({ onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [link, setLink] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    setShowForm(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const close = () => {
    setShowForm(false);
    setLink("");
  };

  const handleSubmit = () => {
    onSubmit(link.trim());
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div className="relative">
      <ToolButton title="Insert link" onClick={open} active={showForm}>
        <BiLink size={18} />
      </ToolButton>

      {showForm && (
        <>
          {/* Click-outside overlay */}
          <div className="fixed inset-0 z-40" onMouseDown={close} />

          {/* Popover */}
          <div
            className="absolute top-full left-0 mt-2 z-50 flex items-center gap-1.5 bg-surface border border-border rounded-xl shadow-xl px-3 py-2 min-w-[260px]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <BiLink size={15} className="text-text-soft shrink-0" />
            <input
              ref={inputRef}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={handleKeyDown}
              type="url"
              placeholder="https://example.com"
              className="flex-1 text-sm outline-none bg-transparent text-text placeholder:text-text-soft"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="p-1 rounded-lg bg-primary text-black hover:opacity-90 transition-all"
                title="Apply link"
              >
                <BiCheck size={15} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  close();
                }}
                className="p-1 rounded-lg text-text-soft hover:bg-surface-hover hover:text-text-muted transition-all"
                title="Cancel"
              >
                <BiX size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LinkForm;
