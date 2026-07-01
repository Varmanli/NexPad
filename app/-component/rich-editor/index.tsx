"use client";

import {
  FC,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { FloatingMenu } from "@tiptap/extension-floating-menu";
import {
  BiBold,
  BiCode,
  BiCodeCurly,
  BiImageAlt,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from "react-icons/bi";
import { TbBlockquote } from "react-icons/tb";
import Tools from "./Tools";
import ImageGallery from "./ImageGallery";
import type { Editor } from "@tiptap/react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  value?: string;
  onChange?: (val: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini button used inside BubbleMenu pill
// ─────────────────────────────────────────────────────────────────────────────

const BubbleBtn: FC<{
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
  title?: string;
}> = ({ children, active, onClick, title }) => (
  <button
    type="button"
    title={title}
    // onMouseDown + preventDefault keeps editor focused when clicking menu
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-1.5 rounded-lg transition-all leading-none ${
      active
        ? "bg-white/25 text-white"
        : "text-gray-300 hover:bg-white/15 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const BubbleSep = () => (
  <div className="w-px h-4 bg-white/20 mx-0.5 self-center shrink-0" />
);

// ─────────────────────────────────────────────────────────────────────────────
// Mini button used inside FloatingMenu
// ─────────────────────────────────────────────────────────────────────────────

const FloatBtn: FC<{
  children: ReactNode;
  onClick: () => void;
  title?: string;
  label?: string;
}> = ({ children, onClick, title, label }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-text-soft hover:bg-surface-hover hover:text-text transition-all"
  >
    {children}
    {label && (
      <span className="text-[9px] font-medium leading-none">{label}</span>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// BubbleMenuContent — rendered via portal into the extension's DOM element
// ─────────────────────────────────────────────────────────────────────────────

const BubbleMenuContent: FC<{
  editor: Editor;
  onImageInsert: () => void;
}> = ({ editor, onImageInsert }) => (
  <div
    className="
      flex items-center gap-0.5
      bg-gray-900 dark:bg-[#111827] text-white
      rounded-xl px-2 py-1.5
      shadow-2xl shadow-black/30
      border border-white/10
    "
    onMouseDown={(e) => e.preventDefault()}
  >
    {/* ── Inline marks ── */}
    <BubbleBtn
      title="Bold (Ctrl+B)"
      active={editor.isActive("bold")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <BiBold size={15} />
    </BubbleBtn>
    <BubbleBtn
      title="Italic (Ctrl+I)"
      active={editor.isActive("italic")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <BiItalic size={15} />
    </BubbleBtn>
    <BubbleBtn
      title="Underline (Ctrl+U)"
      active={editor.isActive("underline")}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    >
      <BiUnderline size={15} />
    </BubbleBtn>
    <BubbleBtn
      title="Strikethrough"
      active={editor.isActive("strike")}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <BiStrikethrough size={15} />
    </BubbleBtn>
    <BubbleBtn
      title="Inline code"
      active={editor.isActive("code")}
      onClick={() => editor.chain().focus().toggleCode().run()}
    >
      <BiCode size={15} />
    </BubbleBtn>

    <BubbleSep />

    {/* ── Block type ── */}
    <BubbleBtn
      title="Heading 1"
      active={editor.isActive("heading", { level: 1 })}
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      }
    >
      <span className="text-[11px] font-bold leading-none px-0.5">H1</span>
    </BubbleBtn>
    <BubbleBtn
      title="Heading 2"
      active={editor.isActive("heading", { level: 2 })}
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
    >
      <span className="text-[11px] font-bold leading-none px-0.5">H2</span>
    </BubbleBtn>
    <BubbleBtn
      title="Heading 3"
      active={editor.isActive("heading", { level: 3 })}
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: 3 }).run()
      }
    >
      <span className="text-[11px] font-bold leading-none px-0.5">H3</span>
    </BubbleBtn>

    <BubbleSep />

    {/* ── Block formatting ── */}
    <BubbleBtn
      title="Blockquote"
      active={editor.isActive("blockquote")}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <TbBlockquote size={15} />
    </BubbleBtn>
    <BubbleBtn
      title="Code block"
      active={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <BiCodeCurly size={15} />
    </BubbleBtn>

    <BubbleSep />

    {/* ── Insert ── */}
    <BubbleBtn title="Insert image" onClick={onImageInsert}>
      <BiImageAlt size={15} />
    </BubbleBtn>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FloatingMenuContent — rendered via portal into the extension's DOM element
// ─────────────────────────────────────────────────────────────────────────────

const FloatingMenuContent: FC<{
  editor: Editor;
  onImageInsert: () => void;
}> = ({ editor, onImageInsert }) => (
  <div
    className="
      flex items-center gap-0.5
      bg-surface
      rounded-xl px-1.5 py-1
      shadow-lg shadow-black/10
      border border-border
    "
    onMouseDown={(e) => e.preventDefault()}
  >
    <FloatBtn onClick={onImageInsert} title="تصویر" label="تصویر">
      <BiImageAlt size={16} />
    </FloatBtn>
    <FloatBtn
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      }
      title="تیتر ۱"
      label="H1"
    >
      <span className="text-sm font-bold leading-none">H1</span>
    </FloatBtn>
    <FloatBtn
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
      title="تیتر ۲"
      label="H2"
    >
      <span className="text-sm font-bold leading-none">H2</span>
    </FloatBtn>
    <FloatBtn
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      title="لیست"
      label="لیست"
    >
      <BiListUl size={16} />
    </FloatBtn>
    <FloatBtn
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      title="لیست عددی"
      label="عددی"
    >
      <BiListOl size={16} />
    </FloatBtn>
    <FloatBtn
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      title="نقل‌قول"
      label="نقل"
    >
      <TbBlockquote size={16} />
    </FloatBtn>
    <FloatBtn
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      title="کدبلاک"
      label="کد"
    >
      <BiCodeCurly size={16} />
    </FloatBtn>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main RichEditor
// ─────────────────────────────────────────────────────────────────────────────

const RichEditor: FC<Props> = ({ value = "", onChange }) => {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Create DOM elements for BubbleMenu and FloatingMenu extensions.
  // These are imperatively created so they exist before useEditor runs.
  const bubbleMenuEl = useMemo(
    () => (typeof document !== "undefined" ? document.createElement("div") : null),
    []
  );
  const floatingMenuEl = useMemo(
    () => (typeof document !== "undefined" ? document.createElement("div") : null),
    []
  );

  // Extensions array — stable reference, includes the menu extensions
  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        HTMLAttributes: { target: "" },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: { class: "w-[80%] mx-auto rounded-lg shadow-md" },
      }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Placeholder.configure({
        placeholder: "داستان خود را اینجا شروع کنید...",
      }),
      // BubbleMenu extension — controls visibility + position of bubbleMenuEl
      ...(bubbleMenuEl
        ? [
            BubbleMenu.configure({
              element: bubbleMenuEl,
              options: {
                placement: "top",
                offset: 8,
              },
            }),
          ]
        : []),
      // FloatingMenu extension — shown when cursor is on an empty block
      ...(floatingMenuEl
        ? [
            FloatingMenu.configure({
              element: floatingMenuEl,
              options: {
                placement: "left-start",
                offset: 8,
              },
              shouldShow: ({ state }) => {
                const { selection } = state;
                const { $anchor, empty } = selection;
                if (!empty) return false;
                const isRootDepth = $anchor.depth === 1;
                const isEmptyTextBlock =
                  $anchor.parent.isTextblock &&
                  !$anchor.parent.type.spec.code &&
                  !$anchor.parent.textContent;
                return isRootDepth && isEmptyTextBlock;
              },
            }),
          ]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // py-6 creates clear visual gap between the sticky toolbar and the
        // first content line — zero overlap by design.
        class:
          "outline-none min-h-[520px] px-8 py-6 " +
          "text-text " +
          "prose prose-base max-w-none w-full " +
          "prose-headings:font-bold prose-headings:text-text " +
          "prose-headings:mt-6 prose-headings:mb-2 " +
          "prose-p:leading-[1.8] prose-p:text-text-muted prose-p:my-1 " +
          "prose-a:text-primary prose-a:underline " +
          "prose-blockquote:border-l-4 prose-blockquote:border-primary " +
          "prose-blockquote:pl-5 " +
          "prose-blockquote:py-1 prose-blockquote:text-text-soft " +
          "prose-blockquote:not-italic " +
          "prose-code:bg-surface-soft " +
          "prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 " +
          "prose-code:text-sm prose-code:font-mono " +
          "prose-code:text-danger " +
          "prose-code:before:content-none prose-code:after:content-none " +
          "prose-pre:rounded-xl " +
          "prose-pre:p-5 prose-pre:my-4 prose-pre:overflow-x-auto " +
          "prose-ul:pl-6 prose-ol:pl-6 prose-li:my-0.5 " +
          "prose-hr:border-border " +
          "prose-img:rounded-xl prose-img:shadow-md prose-img:my-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync controlled value into editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Track client-side mount for portals
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageSelect = (image: string) => {
    editor?.chain().focus().setImage({ src: image, alt: "تصویر" }).run();
  };

  return (
    <>
      {/*
       * Layout: flex-col column.
       *
       * KEY LAYOUT RULES:
       * 1. The toolbar is `sticky top-[60px]` — 60px matches the PostForm
       *    sticky header height. The toolbar docks right below that header.
       * 2. The EditorContent is in normal flow BELOW the toolbar.
       *    Sticky does NOT remove elements from flow, so no overlap occurs.
       * 3. This wrapper must NOT have `overflow-hidden` — that would create
       *    a new containing block and silently break sticky positioning.
       */}
      <div className="flex flex-col bg-surface rounded-2xl">
        {/* ── Sticky toolbar ──────────────────────────────────────── */}
        <div
          className="
            sticky top-[60px] z-20
            bg-surface
            border-b border-border
            px-3 py-2
            rounded-t-2xl
            overflow-x-auto
          "
        >
          <Tools
            editor={editor}
            onImageSelection={() => setShowImageGallery(true)}
          />
        </div>

        {/* ── Editor body ─────────────────────────────────────────── */}
        {/*
         * EditorContent renders the ProseMirror contenteditable.
         * It is naturally BELOW the toolbar in the flex column.
         * The `py-6` in editorProps.attributes ensures a 24px breathing
         * gap between the toolbar border and the first line of text.
         */}
        <EditorContent editor={editor} className="w-full" />
      </div>

      {/* ── BubbleMenu portal ────────────────────────────────────── */}
      {/*
       * The BubbleMenu extension controls bubbleMenuEl (shows/hides/
       * positions it). We render our React UI into that element via portal.
       * The menu is absolutely positioned by the extension (tippy.js).
       */}
      {mounted &&
        bubbleMenuEl &&
        editor &&
        createPortal(
          <BubbleMenuContent
            editor={editor}
            onImageInsert={() => setShowImageGallery(true)}
          />,
          bubbleMenuEl
        )}

      {/* ── FloatingMenu portal ──────────────────────────────────── */}
      {/*
       * The FloatingMenu extension shows floatingMenuEl when the cursor
       * is on an empty paragraph (Notion-style insert prompt).
       */}
      {mounted &&
        floatingMenuEl &&
        editor &&
        createPortal(
          <FloatingMenuContent
            editor={editor}
            onImageInsert={() => setShowImageGallery(true)}
          />,
          floatingMenuEl
        )}

      {/* Image Gallery Modal */}
      <ImageGallery
        onSelect={handleImageSelect}
        visible={showImageGallery}
        onClose={setShowImageGallery}
      />
    </>
  );
};

export default RichEditor;
