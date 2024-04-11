import React, { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import { Html } from "react-konva-utils";

interface InputParams {
  x: number;
  y: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function EditableTextInput({
  x = 0,
  y = 0,
  value,
  onChange,
  onKeyDown,
}: InputParams) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        textareaRef.current.value.length;
    }
  }, []);

  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        className="w-full h-9 -mt-1 outline-none overflow-hidden font-normal resize-none text-blue-600 bg-transparent text-3xl"
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Html>
  );
}
