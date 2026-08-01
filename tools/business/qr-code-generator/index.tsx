"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

import {
  Download,
  RotateCcw,
  QrCode,
  Link2,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { track, EVENTS } from "@/lib/analytics/track";

const TYPES = [
  {
    id: "url",
    label: "URL",
    icon: Link2,
  },
  {
    id: "text",
    label: "Text",
    icon: QrCode,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
  },
  {
    id: "phone",
    label: "Phone",
    icon: Phone,
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquare,
  },
  {
    id: "wifi",
    label: "WiFi",
    icon: Wifi,
  },
];

export default function QrGeneratorTool() {
  const [type, setType] = useState("url");

  const [value, setValue] = useState("");

  const [qr, setQr] = useState("");

  const [size, setSize] = useState(320);

  const [foreground, setForeground] = useState("#000000");

  const [background, setBackground] = useState("#ffffff");

  useEffect(() => {
    generate();
  }, [
    value,
    size,
    foreground,
    background,
  ]);

  async function generate() {
    if (!value.trim()) {
      setQr("");
      return;
    }

    try {
      const image = await QRCode.toDataURL(value, {
        width: size,
        margin: 2,
        color: {
          dark: foreground,
          light: background,
        },
      });

      setQr(image);

      track(EVENTS.TOOL_STARTED, {
        tool: "qr-code-generator",
      });

    } catch {}
  }
    function formatValue() {
    switch (type) {
      case "url":
        return value;

      case "email":
        return `mailto:${value}`;

      case "phone":
        return `tel:${value}`;

      case "sms":
        return `sms:${value}`;

      case "wifi":
        return value;

      default:
        return value;
    }
  }

  async function regenerate() {
    if (!value.trim()) {
      setQr("");
      return;
    }

    try {
      const image = await QRCode.toDataURL(formatValue(), {
        width: size,
        margin: 2,
        color: {
          dark: foreground,
          light: background,
        },
      });

      setQr(image);

      track(EVENTS.QR_GENERATED, {
        tool: "qr-code-generator",
        qrType: type,
      });
    } catch {}
  }

  useEffect(() => {
    regenerate();
  }, [value, type, size, foreground, background]);

  function downloadQR() {
    if (!qr) return;

    const a = document.createElement("a");

    a.href = qr;

    a.download = "mugox-qr-code.png";

    a.click();

    track(EVENTS.TOOL_DOWNLOADED, {
      tool: "qr-code-generator",
    });
  }

  function reset() {
    setValue("");

    setType("url");

    setSize(320);

    setForeground("#000000");

    setBackground("#ffffff");
  }

  return (
    <div className="space-y-6">

      <div className="grid gap-3 sm:grid-cols-3">

        {TYPES.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.id}
              onClick={() => setType(item.id)}
              className={`rounded-2xl border p-4 transition ${
                type === item.id
                  ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)]"
                  : "border-[var(--mg-border)] hover:border-[var(--mg-brand)]"
              }`}
            >
              <Icon className="mx-auto h-6 w-6 mb-2" />

              <p className="text-sm font-semibold">
                {item.label}
              </p>

            </button>

          );

        })}

      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${type}`}
        className="w-full rounded-xl border border-[var(--mg-border)] bg-[var(--mg-bg)] px-4 py-3 outline-none"
      />

      <div className="grid gap-5 md:grid-cols-2">

        <div className="rounded-2xl border border-[var(--mg-border)] p-5">

          <label className="text-sm font-semibold">
            QR Size
          </label>

          <input
            type="range"
            min={150}
            max={600}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-3 w-full"
          />

          <p className="mt-2 text-sm">
            {size}px
          </p>

        </div>

        <div className="rounded-2xl border border-[var(--mg-border)] p-5">

          <label className="text-sm font-semibold">
            Foreground Color
          </label>

          <input
            type="color"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            className="mt-3 h-12 w-full"
          />

        </div>

      </div>
            <div className="rounded-2xl border border-[var(--mg-border)] p-5">

        <label className="text-sm font-semibold">
          Background Color
        </label>

        <input
          type="color"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="mt-3 h-12 w-full"
        />

      </div>

      <div className="rounded-3xl border border-[var(--mg-border)] bg-[var(--mg-bg)] p-8">

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-lg font-bold flex items-center gap-2">

            <QrCode className="w-5 h-5" />

            Live Preview

          </h3>

          {qr && (
            <span className="rounded-full bg-[var(--mg-brand-bg)] px-3 py-1 text-xs font-medium text-[var(--mg-brand)]">
              Ready
            </span>
          )}

        </div>

        <div className="flex justify-center rounded-2xl border border-dashed border-[var(--mg-border)] bg-white p-8 min-h-[360px] items-center">

          {qr ? (
            <img
              src={qr}
              alt="Generated QR Code"
              className="max-w-full rounded-lg"
            />
          ) : (
            <div className="text-center">

              <QrCode className="mx-auto h-16 w-16 text-[var(--mg-ink-4)]" />

              <p className="mt-4 text-sm text-[var(--mg-ink-4)]">
                Enter your content to generate a QR Code.
              </p>

            </div>
          )}

        </div>

      </div>

      <div className="flex flex-wrap gap-3">

        <Button
          variant="primary"
          onClick={downloadQR}
          disabled={!qr}
        >
          <Download className="h-4 w-4" />
          Download PNG
        </Button>

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