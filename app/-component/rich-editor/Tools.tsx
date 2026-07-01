import { ChangeEventHandler, FC } from "react";
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiStrikethrough,
  BiCode,
  BiCodeCurly,
  BiListUl,
  BiListOl,
  BiImageAlt,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
} from "react-icons/bi";
import { TbBlockquote, TbSeparator } from "react-icons/tb";
import ToolButton from "./ToolButton";
import { ChainedCommands, Editor } from "@tiptap/react";
import LinkForm from "./LinkForm";

interface Props {
  editor: Editor | null;
  onImageSelection?(): void;
}

const chainMethods = (
  editor: Editor | null,
  command: (chain: ChainedCommands) => ChainedCommands
) => {
  if (!editor) return;
  command(editor.chain().focus()).run();
};

const Divider = () => (
  <div className="w-px h-5 bg-border mx-1 self-center" />
);

const Tools: FC<Props> = ({ editor, onImageSelection }) => {
  const handleHeadingSelection: ChangeEventHandler<HTMLSelectElement> = ({ target }) => {
    const value = target.value as "p" | "h1" | "h2" | "h3";
    switch (value) {
      case "p":
        return chainMethods(editor, (c) => c.setParagraph());
      case "h1":
        return chainMethods(editor, (c) => c.toggleHeading({ level: 1 }));
      case "h2":
        return chainMethods(editor, (c) => c.toggleHeading({ level: 2 }));
      case "h3":
        return chainMethods(editor, (c) => c.toggleHeading({ level: 3 }));
    }
  };

  const handleLinkSubmission = (href: string) => {
    if (href === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const getSelectedHeading = (): "p" | "h1" | "h2" | "h3" => {
    if (editor?.isActive("heading", { level: 1 })) return "h1";
    if (editor?.isActive("heading", { level: 2 })) return "h2";
    if (editor?.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  return (
    // relative: so LinkForm's absolute popover is anchored to the toolbar row
    <div className="relative flex items-center gap-0.5 min-w-max">
      {/* Text style select */}
      <select
        value={getSelectedHeading()}
        onChange={handleHeadingSelection}
        className="h-8 px-2 text-xs font-medium rounded-lg bg-surface-soft text-text-muted border border-border outline-none cursor-pointer hover:bg-surface-hover transition-colors mr-1"
      >
        <option value="p">متن</option>
        <option value="h1">تیتر ۱</option>
        <option value="h2">تیتر ۲</option>
        <option value="h3">تیتر ۳</option>
      </select>

      <Divider />

      {/* Text formatting */}
      <ToolButton
        title="Bold"
        active={editor?.isActive("bold")}
        onClick={() => chainMethods(editor, (c) => c.toggleBold())}
      >
        <BiBold size={18} />
      </ToolButton>
      <ToolButton
        title="Italic"
        active={editor?.isActive("italic")}
        onClick={() => chainMethods(editor, (c) => c.toggleItalic())}
      >
        <BiItalic size={18} />
      </ToolButton>
      <ToolButton
        title="Underline"
        active={editor?.isActive("underline")}
        onClick={() => chainMethods(editor, (c) => c.toggleUnderline())}
      >
        <BiUnderline size={18} />
      </ToolButton>
      <ToolButton
        title="Strikethrough"
        active={editor?.isActive("strike")}
        onClick={() => chainMethods(editor, (c) => c.toggleStrike())}
      >
        <BiStrikethrough size={18} />
      </ToolButton>
      <ToolButton
        title="Inline code"
        active={editor?.isActive("code")}
        onClick={() => chainMethods(editor, (c) => c.toggleCode())}
      >
        <BiCode size={18} />
      </ToolButton>

      <Divider />

      {/* Alignment */}
      <ToolButton
        title="Align left"
        active={editor?.isActive({ textAlign: "left" })}
        onClick={() => chainMethods(editor, (c) => c.setTextAlign("left"))}
      >
        <BiAlignLeft size={18} />
      </ToolButton>
      <ToolButton
        title="Align center"
        active={editor?.isActive({ textAlign: "center" })}
        onClick={() => chainMethods(editor, (c) => c.setTextAlign("center"))}
      >
        <BiAlignMiddle size={18} />
      </ToolButton>
      <ToolButton
        title="Align right"
        active={editor?.isActive({ textAlign: "right" })}
        onClick={() => chainMethods(editor, (c) => c.setTextAlign("right"))}
      >
        <BiAlignRight size={18} />
      </ToolButton>

      <Divider />

      {/* Lists */}
      <ToolButton
        title="Bullet list"
        active={editor?.isActive("bulletList")}
        onClick={() => chainMethods(editor, (c) => c.toggleBulletList())}
      >
        <BiListUl size={18} />
      </ToolButton>
      <ToolButton
        title="Ordered list"
        active={editor?.isActive("orderedList")}
        onClick={() => chainMethods(editor, (c) => c.toggleOrderedList())}
      >
        <BiListOl size={18} />
      </ToolButton>

      <Divider />

      {/* Blocks */}
      <ToolButton
        title="Blockquote"
        active={editor?.isActive("blockquote")}
        onClick={() => chainMethods(editor, (c) => c.toggleBlockquote())}
      >
        <TbBlockquote size={18} />
      </ToolButton>
      <ToolButton
        title="Code block"
        active={editor?.isActive("codeBlock")}
        onClick={() => chainMethods(editor, (c) => c.toggleCodeBlock())}
      >
        <BiCodeCurly size={18} />
      </ToolButton>
      <ToolButton
        title="Horizontal rule"
        onClick={() => chainMethods(editor, (c) => c.setHorizontalRule())}
      >
        <TbSeparator size={18} />
      </ToolButton>

      <Divider />

      {/* Link */}
      <LinkForm onSubmit={handleLinkSubmission} />

      {/* Image */}
      <ToolButton title="Insert image" onClick={onImageSelection}>
        <BiImageAlt size={18} />
      </ToolButton>
    </div>
  );
};

export default Tools;
