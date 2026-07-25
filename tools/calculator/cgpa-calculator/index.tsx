"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { track, EVENTS } from "@/lib/analytics/track";

type System =
  | "germany"
  | "usa"
  | "bangladesh"
  | "india"
  | "uk"
  | "canada"
  | "australia"
  | "custom";

interface Subject {
  id: number;
  grade: number;
  credit: number;
}

interface Semester {
  id: number;
  subjects: Subject[];
}

const SYSTEMS = [
  { value: "germany", label: "🇩🇪 Germany (1.0–5.0)" },
  { value: "usa", label: "🇺🇸 USA (4.0 GPA)" },
  { value: "bangladesh", label: "🇧🇩 Bangladesh (4.0)" },
  { value: "india", label: "🇮🇳 India (10.0)" },
  { value: "uk", label: "🇬🇧 United Kingdom" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "australia", label: "🇦🇺 Australia" },
  { value: "custom", label: "🌍 Custom Scale" },
] as const;

const SCALE = {
  germany: {
    min: 1,
    max: 5,
    best: 1,
  },

  usa: {
    min: 0,
    max: 4,
    best: 4,
  },

  bangladesh: {
    min: 0,
    max: 4,
    best: 4,
  },

  india: {
    min: 0,
    max: 10,
    best: 10,
  },

  uk: {
    min: 0,
    max: 100,
    best: 100,
  },

  canada: {
    min: 0,
    max: 4.33,
    best: 4.33,
  },

  australia: {
    min: 0,
    max: 7,
    best: 7,
  },

  custom: {
    min: 0,
    max: 100,
    best: 100,
  },
};

const createSubject = (): Subject => ({
  id: Date.now() + Math.random(),
  grade: 0,
  credit: 3,
});

const createSemester = (): Semester => ({
  id: Date.now() + Math.random(),
  subjects: [createSubject()],
});

export default function CgpaCalculator() {
  const [system, setSystem] = useState<System>("germany");

  const [customScale, setCustomScale] = useState(100);

  const [semesters, setSemesters] = useState<Semester[]>([
  createSemester(),
]);

  const current =
    system === "custom"
      ? {
          min: 0,
          max: customScale,
          best: customScale,
        }
      : SCALE[system];
        //---------------------------------------------------
  // Subject Operations
  //---------------------------------------------------

  const updateSubject = (
    semesterId: number,
    subjectId: number,
    field: "grade" | "credit",
    value: number
  ) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id !== semesterId
          ? semester
          : {
              ...semester,
              subjects: semester.subjects.map((subject) =>
                subject.id !== subjectId
                  ? subject
                  : {
                      ...subject,
                      [field]: value,
                    }
              ),
            }
      )
    );
  };

  const addSubject = (semesterId: number) => {
    setSemesters((prev) =>
      prev.map((semester) =>
        semester.id !== semesterId
          ? semester
          : {
              ...semester,
              subjects: [
                ...semester.subjects,
                createSubject(),
              ],
            }
      )
    );
  };

  const removeSubject = (
    semesterId: number,
    subjectId: number
  ) => {
    setSemesters((prev) =>
      prev.map((semester) => {
        if (semester.id !== semesterId) return semester;

        if (semester.subjects.length === 1) return semester;

        return {
          ...semester,
          subjects: semester.subjects.filter(
            (s) => s.id !== subjectId
          ),
        };
      })
    );
  };

  //---------------------------------------------------
  // Semester Operations
  //---------------------------------------------------

  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      createSemester(),
    ]);

    track(EVENTS.TOOL_STARTED, {
      tool: "cgpa-calculator",
      action: "add-semester",
    });
  };

  const removeSemester = (semesterId: number) => {
    if (semesters.length === 1) return;

    setSemesters((prev) =>
      prev.filter((s) => s.id !== semesterId)
    );
  };

  const reset = () => {
    setSystem("germany");
    setCustomScale(100);
    setSemesters([createSemester()]);
  };

  //---------------------------------------------------
  // Calculator
  //---------------------------------------------------

  const totalCredits = semesters.reduce(
    (creditSum, semester) =>
      creditSum +
      semester.subjects.reduce(
        (sum, subject) => sum + subject.credit,
        0
      ),
    0
  );

  const weightedTotal = semesters.reduce(
    (semesterSum, semester) =>
      semesterSum +
      semester.subjects.reduce(
        (sum, subject) =>
          sum + subject.grade * subject.credit,
        0
      ),
    0
  );

  const cgpa =
    totalCredits === 0
      ? 0
      : weightedTotal / totalCredits;

  //---------------------------------------------------
  // German note
  //---------------------------------------------------

  const resultText =
    system === "germany"
      ? "Lower is Better"
      : "Higher is Better";
        return (
    <div className="space-y-6">

      {/* Header */}

      <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--mg-brand-bg)]">

            <GraduationCap className="h-6 w-6 text-[var(--mg-brand-t)]" />

          </div>

          <div>

            <h2 className="text-xl font-bold text-[var(--mg-ink)]">

              CGPA Calculator

            </h2>

            <p className="text-sm text-[var(--mg-ink-4)]">

              Supports Germany, USA, Bangladesh, India and more.

            </p>

          </div>

        </div>

      </div>



      {/* Country */}

      <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-5">

        <label className="mb-2 block text-sm font-semibold">

          Grading System

        </label>

        <select

          value={system}

          onChange={(e) => setSystem(e.target.value as System)}

          className="w-full rounded-xl border border-[var(--mg-border)] bg-white px-4 py-3"

        >

          {SYSTEMS.map((item) => (

            <option

              key={item.value}

              value={item.value}

            >

              {item.label}

            </option>

          ))}

        </select>



        {system === "custom" && (

          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium">

              Maximum Grade

            </label>

            <input

              type="number"

              value={customScale}

              min={1}

              onChange={(e) =>

                setCustomScale(Number(e.target.value))

              }

              className="w-full rounded-xl border border-[var(--mg-border)] px-4 py-3"

            />

          </div>

        )}

      </div>



      {/* Semesters */}

      <div className="space-y-6">

        {semesters.map((semester, semesterIndex) => (

          <div

            key={semester.id}

            className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-5"

          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-lg font-semibold">

                Semester {semesterIndex + 1}

              </h3>

              {semesters.length > 1 && (

                <Button

                  variant="ghost"

                  onClick={() => removeSemester(semester.id)}

                >

                  <Trash2 className="h-4 w-4" />

                </Button>

              )}

            </div>



            <div className="space-y-4">

              {semester.subjects.map((subject, subjectIndex) => (

                <div

                  key={subject.id}

                  className="grid grid-cols-12 gap-3 items-end"

                >

                  <div className="col-span-5">

                    <label className="mb-1 block text-xs font-medium">

                      Subject {subjectIndex + 1}

                    </label>

                    <input

                      type="number"

                      min={current.min}

                      max={current.max}

                      step="0.01"

                      value={subject.grade}

                      onChange={(e) =>

                        updateSubject(

                          semester.id,

                          subject.id,

                          "grade",

                          Number(e.target.value)

                        )

                      }

                      className="w-full rounded-xl border border-[var(--mg-border)] px-3 py-2"

                    />

                  </div>



                  <div className="col-span-4">

                    <label className="mb-1 block text-xs font-medium">

                      Credits

                    </label>

                    <input

                      type="number"

                      min={1}

                      value={subject.credit}

                      onChange={(e) =>

                        updateSubject(

                          semester.id,

                          subject.id,

                          "credit",

                          Number(e.target.value)

                        )

                      }

                      className="w-full rounded-xl border border-[var(--mg-border)] px-3 py-2"

                    />

                  </div>



                  <div className="col-span-3">

                    {semester.subjects.length > 1 && (

                      <Button

                        variant="ghost"

                        onClick={() =>

                          removeSubject(

                            semester.id,

                            subject.id

                          )

                        }

                      >

                        <Trash2 className="h-4 w-4" />

                      </Button>

                    )}

                  </div>

                </div>

              ))}
                            <div className="flex gap-2 pt-2">

                <Button
                  variant="secondary"
                  onClick={() => addSubject(semester.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Add Semester */}

      <Button
        variant="primary"
        onClick={addSemester}
      >
        <Plus className="h-4 w-4" />
        Add Semester
      </Button>

      {/* Result */}

      <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

        <h3 className="mb-5 text-xl font-bold">

          Result

        </h3>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-[var(--mg-brand-bg)] p-5">

            <p className="text-sm text-[var(--mg-brand-t)]">

              CGPA

            </p>

            <h2 className="mt-2 text-4xl font-bold text-[var(--mg-brand-t)]">

              {cgpa.toFixed(2)}

            </h2>

          </div>

          <div className="rounded-xl border border-[var(--mg-border)] p-5">

            <p className="text-sm text-[var(--mg-ink-4)]">

              Total Credits

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              {totalCredits}

            </h2>

          </div>

          <div className="rounded-xl border border-[var(--mg-border)] p-5">

            <p className="text-sm text-[var(--mg-ink-4)]">

              Scale

            </p>

            <h2 className="mt-2 text-2xl font-bold">

              {current.min} - {current.max}

            </h2>

          </div>

        </div>

        <div className="mt-6 rounded-xl bg-[var(--mg-brand-bg)] p-4">

          <p className="text-sm font-semibold text-[var(--mg-brand-t)]">

            {resultText}

          </p>

          <p className="mt-2 text-sm text-[var(--mg-brand-t)]">

            {system === "germany"
              ? "German universities use a reverse grading system where 1.0 is the best possible grade and 5.0 means fail."
              : "Most grading systems consider higher GPA or CGPA as better academic performance."}

          </p>

        </div>

      </div>

      {/* Actions */}

      <div className="flex flex-wrap gap-3">

        <Button
          variant="ghost"
          onClick={reset}
        >
          <RotateCcw className="h-4 w-4" />
          Reset Calculator
        </Button>

      </div>
            {/* Information */}

      <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

        <h3 className="mb-4 text-lg font-bold">

          How CGPA is Calculated

        </h3>

        <div className="space-y-3 text-sm text-[var(--mg-ink-3)]">

          {system === "germany" ? (
            <>
              <p>
                German universities calculate the final grade using a weighted
                average based on course credits.
              </p>

              <div className="rounded-xl bg-[var(--mg-brand-bg)] p-4 font-mono text-[var(--mg-brand-t)]">
                Final Grade =
                Σ(Grade × Credits)
                ÷
                Σ(Credits)
              </div>

              <p>
                Unlike most countries, <strong>1.0 is the best grade</strong>
                while <strong>5.0 means failed.</strong>
              </p>
            </>
          ) : (
            <>
              <p>
                Your CGPA is calculated by multiplying every subject GPA by its
                credit hours, adding all weighted grades together, then dividing
                by the total credits.
              </p>

              <div className="rounded-xl bg-[var(--mg-brand-bg)] p-4 font-mono text-[var(--mg-brand-t)]">
                CGPA =
                Σ(GPA × Credits)
                ÷
                Σ(Credits)
              </div>

              <p>
                Courses with more credit hours contribute more to your final
                CGPA.
              </p>
            </>
          )}

        </div>

      </div>

      {/* SEO Section */}

      <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

        <h3 className="mb-4 text-lg font-bold">

          About this CGPA Calculator

        </h3>

        <p className="text-sm leading-7 text-[var(--mg-ink-3)]">

          This free online CGPA Calculator supports multiple grading systems
          including Germany, USA, Bangladesh, India, UK, Canada and Australia.
          Simply enter your grades and credits for each subject to calculate
          your cumulative GPA instantly. All calculations are performed locally
          in your browser, so your academic information never leaves your
          device.

        </p>

      </div>

    </div>

  );

}