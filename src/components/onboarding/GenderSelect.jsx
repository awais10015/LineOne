"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function GenderSelect({ name = "gender", required = true }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef(null);

  const selectedLabel =
    GENDER_OPTIONS.find((o) => o.value === value)?.label ?? "Select gender";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      <Button
        type="button"
        variant="outline"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full justify-between gap-2 px-3 text-left font-normal h-9",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95"
        >
          {GENDER_OPTIONS.map((option) => {
            const isSelected = value === option.value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors",
                    "hover:bg-[#ff6500]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6500]/40",
                    isSelected && "bg-[#ff6500] text-white hover:bg-[#ff6500]"
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
