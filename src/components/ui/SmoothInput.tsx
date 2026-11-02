import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PASSWORD_CHAR = typeof navigator !== "undefined" && navigator.userAgent.match(/firefox|fxios/i)
  ? "\u25CF"
  : "\u2022";

export interface SmoothInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  type?: "text" | "password";
  wrapperClassName?: string;
  caretColor?: string;
  leadingIcon?: React.ReactNode;
}

export const SmoothInput: React.FC<SmoothInputProps> = ({
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  type = "text",
  placeholder,
  style,
  caretColor = "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]",
  leadingIcon,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [caretX, setCaretX] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const isControlled = value !== undefined;
  const inputValue = isControlled ? String(value) : String(internalValue);

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return null;

    syncMeasureSpan();
    measureSpan.textContent = text;
    const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft) || 0;
    return text.length > 0 ? measureSpan.offsetWidth + paddingLeft : paddingLeft;
  };

  const updateCaretFromInput = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;
    const isSelecting = selectionStart !== selectionEnd;
    setHasSelection(isSelecting);

    const textBeforeCaret = target.type === "password"
      ? PASSWORD_CHAR.repeat(selectionStart)
      : target.value.slice(0, selectionStart);

    const absoluteWidth = measurePrefixWidth(textBeforeCaret);
    if (absoluteWidth === null) return;

    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const caretPosition = absoluteWidth - target.scrollLeft;
    const minX = paddingLeft;
    const maxX = target.clientWidth - paddingRight;

    setCaretX(Math.min(Math.max(caretPosition, minX), maxX));
  };

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [inputValue, type]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleSelect = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    document.addEventListener("selectionchange", handleSelect);
    return () => {
      document.removeEventListener("selectionchange", handleSelect);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-xl bg-black/50 border border-white/15 transition-all focus-within:border-lime-400 focus-within:ring-1 focus-within:ring-lime-400/40",
        wrapperClassName
      )}
    >
      {leadingIcon && (
        <div className="pl-3.5 flex items-center justify-center shrink-0 pointer-events-none text-slate-400">
          {leadingIcon}
        </div>
      )}
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 w-full p-0"
        style={{ caretColor: "transparent" }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2 w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-xs text-slate-100 placeholder-slate-400 outline-none",
            leadingIcon && "pl-2",
            className
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => updateCaretRef.current(e.target));
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
            updateCaretRef.current(e.target);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onKeyDown={(e) => {
            props.onKeyDown?.(e);
            requestAnimationFrame(() => {
              if (inputRef.current) updateCaretRef.current(inputRef.current);
            });
          }}
        />
        <span
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[1.15em] w-[2px] rounded-full self-center transition-transform duration-100 ease-out",
            caretColor,
            isFocused && !hasSelection ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform: `translateX(${caretX}px)`,
          }}
        />
      </div>
    </div>
  );
};
