"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Plus } from "lucide-react";

const gradePoints: Record<string, number> = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  D: 1,
  F: 0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState([
    { grade: "A", credit: 3 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { grade: "A", credit: 3 }]);
  };

  const updateCourse = (
    index: number,
    field: "grade" | "credit",
    value: string | number
  ) => {
    const updated = [...courses];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setCourses(updated);
  };

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((c) => {
      totalPoints += gradePoints[c.grade] * Number(c.credit);
      totalCredits += Number(c.credit);
    });

    if (totalCredits === 0) return 0;

    return totalPoints / totalCredits;
  }, [courses]);

  return (
    <div className="space-y-5">

      {courses.map((course, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3"
        >
          <select
            value={course.grade}
            onChange={(e) =>
              updateCourse(index, "grade", e.target.value)
            }
            className="rounded-xl border px-3 py-2"
          >
            {Object.keys(gradePoints).map((grade) => (
              <option key={grade}>{grade}</option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={course.credit}
            onChange={(e) =>
              updateCourse(index, "credit", Number(e.target.value))
            }
            className="rounded-xl border px-3 py-2"
            placeholder="Credits"
          />
        </div>
      ))}

      <Button variant="ghost" onClick={addCourse}>
        <Plus className="w-4 h-4" />
        Add Course
      </Button>

      <div className="rounded-xl border p-5">
        <p className="text-lg font-semibold">
          GPA: {gpa.toFixed(2)}
        </p>
      </div>

      <Button
        variant="ghost"
        onClick={() =>
          setCourses([{ grade: "A", credit: 3 }])
        }
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

    </div>
  );
}