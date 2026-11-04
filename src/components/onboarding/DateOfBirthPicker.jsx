"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWithinRange(day, min, max) {
  const t = startOfDay(day).getTime();
  return t >= startOfDay(min).getTime() && t <= startOfDay(max).getTime();
}

export default function DateOfBirthPicker({
  name = "dateOfBirth",
  required = true,
  minAgeYears = 10,
}) {
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - minAgeYears);
    return startOfDay(d);
  }, [minAgeYears]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120);
    return startOfDay(d);
  }, []);

  const [open, setOpen] = useState(false);
  const [panelView, setPanelView] = useState("days");
  const [selected, setSelected] = useState(null);
  const [viewDate, setViewDate] = useState(
    () => new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  );
  const containerRef = useRef(null);

  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = maxYear; y >= minYear; y--) years.push(y);
    return years;
  }, [minYear, maxYear]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setPanelView("days");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [viewDate]);

  const canGoNextMonth = useMemo(() => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    return next <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  }, [viewDate, maxDate]);

  const canGoPrevMonth = useMemo(() => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    return prev >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  }, [viewDate, minDate]);

  const displayLabel = selected
    ? selected.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Select date of birth";

  const handleSelect = (day) => {
    if (!isWithinRange(day, minDate, maxDate)) return;
    setSelected(startOfDay(day));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="hidden"
        name={name}
        value={selected ? toIsoDate(selected) : ""}
        required={required}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setOpen((o) => !o);
          if (open) setPanelView("days");
        }}
        className={cn(
          "w-full justify-start gap-3 px-3 text-left font-normal h-9",
          !selected && "text-muted-foreground"
        )}
      >
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{displayLabel}</span>
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] rounded-xl border border-border bg-card p-3 shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="mb-3 flex items-center justify-between gap-1">
            {panelView === "days" ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={!canGoPrevMonth}
                  onClick={() =>
                    setViewDate(
                      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => setPanelView("years")}
                  className="flex-1 rounded-md px-2 py-1 text-sm font-semibold hover:bg-[#ff6500]/10 hover:text-[#ff6500] transition-colors"
                >
                  {MONTHS[viewDate.getMonth()]}{" "}
                  <span className="underline decoration-[#ff6500]/40 underline-offset-2">
                    {viewDate.getFullYear()}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={!canGoNextMonth}
                  onClick={() =>
                    setViewDate(
                      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setPanelView("days")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center text-sm font-semibold">
                  Select year
                </span>
                <div className="h-8 w-8 shrink-0" aria-hidden />
              </>
            )}
          </div>

          {panelView === "years" ? (
            <div className="max-h-52 overflow-y-auto scrollbar-hide pr-1">
              <div className="grid grid-cols-4 gap-1.5">
                {yearOptions.map((year) => {
                  const isActive = viewDate.getFullYear() === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setViewDate(
                          (d) => new Date(year, d.getMonth(), 1)
                        );
                        setPanelView("days");
                      }}
                      className={cn(
                        "rounded-lg py-2 text-sm transition-colors",
                        isActive
                          ? "bg-[#ff6500] text-white"
                          : "hover:bg-[#ff6500]/15"
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-1 font-medium">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }
              const enabled = isWithinRange(day, minDate, maxDate);
              const isSelected = selected && isSameDay(day, selected);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={toIsoDate(day)}
                  type="button"
                  disabled={!enabled}
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "h-9 w-full rounded-lg text-sm transition-colors",
                    enabled
                      ? "hover:bg-[#ff6500]/15 hover:text-foreground"
                      : "text-muted-foreground/40 cursor-not-allowed",
                    isSelected &&
                      "bg-[#ff6500] text-white hover:bg-[#ff6500] hover:text-white",
                    !isSelected &&
                      isToday &&
                      enabled &&
                      "ring-1 ring-[#ff6500]/50 font-medium"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            You must be at least {minAgeYears} years old
          </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
