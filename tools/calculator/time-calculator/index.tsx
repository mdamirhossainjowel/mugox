"use client";

import { useMemo, useState } from "react";
import {
  Clock3,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { track, EVENTS } from "@/lib/analytics/track";

type Mode =
  | "difference"
  | "add"
  | "convert";

const pad = (n: number) =>
  String(n).padStart(2, "0");

function minutesBetween(
  start: string,
  end: string
) {
  const [sh, sm] = start
    .split(":")
    .map(Number);

  const [eh, em] = end
    .split(":")
    .map(Number);

  let startMinutes =
    sh * 60 + sm;

  let endMinutes =
    eh * 60 + em;

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

function formatMinutes(
  total: number
) {
  const days = Math.floor(
    total / 1440
  );

  total %= 1440;

  const hours = Math.floor(
    total / 60
  );

  const minutes = total % 60;

  return {
    days,
    hours,
    minutes,
  };
}

function addTime(
  time: string,
  hours: number,
  minutes: number
) {
  const [h, m] = time
    .split(":")
    .map(Number);

  let total =
    h * 60 +
    m +
    hours * 60 +
    minutes;

  total =
    ((total % 1440) + 1440) %
    1440;

  return {
    hour: Math.floor(total / 60),
    minute: total % 60,
  };
}

export default function TimeCalculator() {
  const [mode, setMode] =
    useState<Mode>(
      "difference"
    );

  //--------------------------
  // Difference
  //--------------------------

  const [start, setStart] =
    useState("09:00");

  const [end, setEnd] =
    useState("17:30");

  //--------------------------
  // Add / Subtract
  //--------------------------

  const [time, setTime] =
    useState("08:00");

  const [hours, setHours] =
    useState(2);

  const [mins, setMins] =
    useState(30);

  const [operation, setOperation] =
    useState<"add" | "subtract">(
      "add"
    );

  //--------------------------
  // Convert
  //--------------------------

  const [totalHours, setTotalHours] =
    useState(100);

  //--------------------------
  // Results
  //--------------------------

  const difference =
    useMemo(() => {
      const mins =
        minutesBetween(
          start,
          end
        );

      return formatMinutes(mins);
    }, [start, end]);

  const result =
    useMemo(() => {
      const sign =
        operation === "add"
          ? 1
          : -1;

      return addTime(
        time,
        sign * hours,
        sign * mins
      );
    }, [
      time,
      hours,
      mins,
      operation,
    ]);

  const converted =
    useMemo(() => {
      const days =
        Math.floor(
          totalHours / 24
        );

      const hours =
        totalHours % 24;

      return {
        days,
        hours,
      };
    }, [totalHours]);

  const reset = () => {
    setMode("difference");

    setStart("09:00");

    setEnd("17:30");

    setTime("08:00");

    setHours(2);

    setMins(30);

    setOperation("add");

    setTotalHours(100);

    track(EVENTS.TOOL_STARTED, {
      tool: "time-calculator",
      action: "reset",
    });
  };
    return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h2 className="flex items-center gap-2 text-2xl font-bold">

          <Clock3 className="h-6 w-6 text-[var(--mg-brand)]" />

          Time Calculator

        </h2>

        <p className="mt-2 text-sm text-[var(--mg-ink-4)]">

          Calculate time differences, add or subtract hours and minutes,
          or convert total hours into days.

        </p>

      </div>

      {/* Mode */}

      <div className="grid gap-3 sm:grid-cols-3">

        <button
          onClick={() => setMode("difference")}
          className={`rounded-xl border p-4 text-left transition ${
            mode === "difference"
              ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
              : "border-[var(--mg-border)]"
          }`}
        >
          <h3 className="font-semibold">

            Time Difference

          </h3>

          <p className="mt-1 text-xs text-[var(--mg-ink-4)]">

            Find the duration between two times.

          </p>

        </button>

        <button
          onClick={() => setMode("add")}
          className={`rounded-xl border p-4 text-left transition ${
            mode === "add"
              ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
              : "border-[var(--mg-border)]"
          }`}
        >
          <h3 className="font-semibold">

            Add / Subtract

          </h3>

          <p className="mt-1 text-xs text-[var(--mg-ink-4)]">

            Add or subtract hours and minutes.

          </p>

        </button>

        <button
          onClick={() => setMode("convert")}
          className={`rounded-xl border p-4 text-left transition ${
            mode === "convert"
              ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
              : "border-[var(--mg-border)]"
          }`}
        >
          <h3 className="font-semibold">

            Convert Hours

          </h3>

          <p className="mt-1 text-xs text-[var(--mg-ink-4)]">

            Convert hours into days and hours.

          </p>

        </button>

      </div>

      {/* -------------------------------- */}

      {/* TIME DIFFERENCE */}

      {/* -------------------------------- */}

      {mode === "difference" && (

        <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">

                Start Time

              </label>

              <input
                type="time"
                value={start}
                onChange={(e) =>
                  setStart(e.target.value)
                }
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">

                End Time

              </label>

              <input
                type="time"
                value={end}
                onChange={(e) =>
                  setEnd(e.target.value)
                }
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              />

            </div>

          </div>

          <div className="mt-8 rounded-xl bg-[var(--mg-brand-bg)] p-5">

            <p className="text-sm text-[var(--mg-brand-t)]">

              Duration

            </p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--mg-brand-t)]">

              {difference.days > 0 &&
                `${difference.days} Day${difference.days > 1 ? "s" : ""} `}

              {difference.hours} Hour{difference.hours !== 1 && "s"}{" "}

              {difference.minutes} Minute{difference.minutes !== 1 && "s"}

            </h2>

          </div>

        </div>

      )}
            {/* ------------------------------- */}
      {/* ADD / SUBTRACT TIME */}
      {/* ------------------------------- */}

      {mode === "add" && (
        <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Operation
              </label>

              <select
                value={operation}
                onChange={(e) =>
                  setOperation(e.target.value as "add" | "subtract")
                }
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>
            </div>

          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">

                Hours

              </label>

              <input
                type="number"
                min={0}
                value={hours}
                onChange={(e) =>
                  setHours(Number(e.target.value))
                }
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">

                Minutes

              </label>

              <input
                type="number"
                min={0}
                max={59}
                value={mins}
                onChange={(e) =>
                  setMins(Number(e.target.value))
                }
                className="w-full rounded-xl border border-[var(--mg-border)] p-3"
              />

            </div>

          </div>

          <div className="mt-8 rounded-xl bg-[var(--mg-brand-bg)] p-5">

            <p className="text-sm text-[var(--mg-brand-t)]">

              Result

            </p>

            <h2 className="mt-2 text-4xl font-bold text-[var(--mg-brand-t)]">

              {pad(result.hour)}:{pad(result.minute)}

            </h2>

          </div>

        </div>

      )}

      {/* ------------------------------- */}
      {/* CONVERT HOURS */}
      {/* ------------------------------- */}

      {mode === "convert" && (

        <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

          <label className="mb-2 block text-sm font-medium">

            Total Hours

          </label>

          <input
            type="number"
            min={0}
            value={totalHours}
            onChange={(e) =>
              setTotalHours(Number(e.target.value))
            }
            className="w-full rounded-xl border border-[var(--mg-border)] p-3"
          />

          <div className="mt-8 rounded-xl bg-[var(--mg-brand-bg)] p-5">

            <p className="text-sm text-[var(--mg-brand-t)]">

              Converted Time

            </p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--mg-brand-t)]">

              {converted.days} Day{converted.days !== 1 && "s"}{" "}
              {converted.hours} Hour{converted.hours !== 1 && "s"}

            </h2>

          </div>

        </div>

      )}

      <div className="flex gap-3">

        <Button
          variant="ghost"
          onClick={reset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

      </div>

    </div>

  );

}
