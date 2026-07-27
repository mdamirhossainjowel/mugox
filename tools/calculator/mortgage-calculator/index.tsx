"use client";

import { useMemo, useState } from "react";
import {
  RotateCcw,
  DollarSign,
  Percent,
  CalendarDays,
  Wallet,
  Landmark,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function MortgageCalculator() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const result = useMemo(() => {
    const P = Number(amount);
    const annual = Number(interest);
    const Y = Number(years);

    if (
      isNaN(P) ||
      isNaN(annual) ||
      isNaN(Y) ||
      P <= 0 ||
      annual <= 0 ||
      Y <= 0
    ) {
      return null;
    }

    const r = annual / 12 / 100;
    const n = Y * 12;

    const payment =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = payment * n;
    const totalInterest = totalPayment - P;

    return {
      payment,
      totalPayment,
      totalInterest,
    };
  }, [amount, interest, years]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-2xl">

      {/* Background Effects */}

      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 p-8 md:p-10">

        {/* Header */}

        <div className="mb-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">

            <Landmark className="h-4 w-4" />

            Mortgage Calculator

          </div>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900">

            Estimate Your Monthly Mortgage

          </h2>

          <p className="mt-3 max-w-2xl text-slate-600 leading-7">

            Instantly calculate your estimated monthly payment,
            total interest, and total repayment using our
            professional mortgage calculator.

          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT PANEL */}

          <div className="space-y-6">
                        {/* Mortgage Amount */}

            <div className="group">

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Wallet className="h-4 w-4 text-blue-600" />
                Mortgage Amount
              </label>

              <div className="relative">

                <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" />

                <input
                  type="number"
                  placeholder="350000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  pl-12
                  pr-4
                  text-lg
                  font-semibold
                  text-slate-900
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-300
                  outline-none
                  placeholder:text-slate-400
                  hover:border-blue-300
                  hover:shadow-md
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                />

              </div>

            </div>

            {/* Interest */}

            <div className="group">

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Percent className="h-4 w-4 text-blue-600" />
                Annual Interest Rate
              </label>

              <div className="relative">

                <input
                  type="number"
                  placeholder="5.25"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  px-5
                  text-lg
                  font-semibold
                  text-slate-900
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-300
                  outline-none
                  placeholder:text-slate-400
                  hover:border-blue-300
                  hover:shadow-md
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  %
                </span>

              </div>

            </div>

            {/* Loan Term */}

            <div className="group">

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                Loan Term
              </label>

              <div className="relative">

                <input
                  type="number"
                  placeholder="30"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  px-5
                  text-lg
                  font-semibold
                  text-slate-900
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-300
                  outline-none
                  placeholder:text-slate-400
                  hover:border-blue-300
                  hover:shadow-md
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  Years
                </span>

              </div>

            </div>

            {/* Quick Stats */}

            <div className="grid grid-cols-3 gap-4">

              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  APR
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {interest || "0"}%
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Term
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {years || "0"}Y
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Amount
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900 truncate">
                  {amount
                    ? formatCurrency(Number(amount))
                    : "$0"}
                </p>
              </div>

            </div>
            </div>
                      {/* RIGHT PANEL */}

          <div>

            {result ? (

              <div className="space-y-6">

                {/* Hero Card */}

                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-8 text-white shadow-2xl">

                  <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                    Monthly Payment
                  </p>

                  <h3 className="mt-4 break-words text-4xl font-black md:text-5xl">
                    {formatCurrency(result.payment)}
                  </h3>

                  <p className="mt-4 text-blue-100">
                    Estimated monthly mortgage payment based on the
                    values you entered.
                  </p>

                </div>

                {/* Summary Cards */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <p className="text-sm font-medium text-slate-500">
                      Total Interest
                    </p>

                    <h4 className="mt-3 text-2xl font-bold text-slate-900">
                      {formatCurrency(result.totalInterest)}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      Interest paid during the loan.
                    </p>

                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <p className="text-sm font-medium text-slate-500">
                      Total Repayment
                    </p>

                    <h4 className="mt-3 text-2xl font-bold text-slate-900">
                      {formatCurrency(result.totalPayment)}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      Principal + total interest.
                    </p>

                  </div>

                </div>

                {/* Principal vs Interest */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="font-semibold text-slate-700">
                      Loan Breakdown
                    </span>

                    <span className="text-sm text-slate-500">
                      Principal vs Interest
                    </span>

                  </div>

                  <div className="flex h-4 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="bg-blue-600 transition-all duration-700"
                      style={{
                        width: `${
                          (Number(amount) / result.totalPayment) * 100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-cyan-400 transition-all duration-700"
                      style={{
                        width: `${
                          (result.totalInterest / result.totalPayment) * 100
                        }%`,
                      }}
                    />

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>

                      <div className="mb-2 flex items-center gap-2">

                        <div className="h-3 w-3 rounded-full bg-blue-600" />

                        <span className="text-sm text-slate-600">
                          Principal
                        </span>

                      </div>

                      <p className="font-bold text-slate-900">
                        {formatCurrency(Number(amount))}
                      </p>

                    </div>

                    <div>

                      <div className="mb-2 flex items-center gap-2">

                        <div className="h-3 w-3 rounded-full bg-cyan-400" />

                        <span className="text-sm text-slate-600">
                          Interest
                        </span>

                      </div>

                      <p className="font-bold text-slate-900">
                        {formatCurrency(result.totalInterest)}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex h-full min-h-[520px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10">

                <div className="max-w-sm text-center">

                  <Landmark className="mx-auto mb-5 h-14 w-14 text-blue-500" />

                  <h3 className="text-2xl font-bold text-slate-900">
                    Ready to Calculate?
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    Enter the mortgage amount, annual interest rate,
                    and loan term to instantly view your payment
                    summary.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>
                {/* Bottom Actions */}

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 md:flex-row">

          <Button
            variant="ghost"
            onClick={() => {
              setAmount("");
              setInterest("");
              setYears("");
            }}
            className="
              group
              h-12
              rounded-xl
              border
              border-slate-200
              bg-white
              px-6
              font-semibold
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-500
              hover:bg-blue-50
              hover:shadow-lg
            "
          >
            <RotateCcw className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
            Reset Calculator
          </Button>

          <p className="max-w-xl text-center text-sm leading-6 text-slate-500 md:text-right">
            This calculator provides an estimated monthly mortgage payment.
            Actual payments may vary depending on taxes, insurance,
            lender fees, PMI, and other financing conditions.
          </p>

        </div>

      </div>

      {/* Decorative Bottom Glow */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-500/5 to-transparent" />

    </section>
  );
}