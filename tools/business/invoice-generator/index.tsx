  "use client";
  import { useState, useMemo, useRef, useEffect, useCallback } from "react";
  import html2canvas from "html2canvas"; 
  import QRCode from "qrcode";
  import { jsPDF } from "jspdf";
  import {
    Plus,
    Trash2,
    Copy,
    ArrowUp,
    ArrowDown,
    Download,
    Printer,
    Save,
    Upload,
    RotateCcw,
    AlertCircle,
    Loader2,
    Eraser,
    ImagePlus,
  } from "lucide-react";
  import { Button } from "@/components/ui/Button";
  import { Input, Textarea } from "@/components/ui/Input";
  import { track } from "@/lib/analytics/track";
  import { generateId } from "@/lib/utils/generateId";

  /* =====================================================================
    TYPES
  ===================================================================== */

  interface Currency {
    code: string;
    symbol: string;
    decimals: number;
    label: string;
  }

  type InvoiceStatus = "draft" | "paid" | "unpaid";
  type DiscountType = "percent" | "fixed";
  type TemplateId = "modern" | "minimal" | "corporate"

  interface ProductLine {
    id: string;
    name: string;
    description: string;
    qty: number;
    unitPrice: number;
    discountPercent: number;
    taxPercent: number;
    sku: string;
  }

  interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    regNumber: string;
    logoDataUrl: string;
  }

  interface ClientInfo {
    name: string;
    company: string;
    address: string;
    email: string;
    phone: string;
    taxNumber: string;
  }

  interface InvoiceData {
    company: CompanyInfo;
    client: ClientInfo;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    items: ProductLine[];
    currencyCode: string;
    taxLabel: string;
    taxCountry: string;
    discountType: DiscountType;
    discountValue: number;
    shipping: number;
    handling: number;
    otherCharges: number;
    notes: string;
    thankYouMessage: string;
    additionalMessage: string;
    companySignature: string;
    customerSignature: string;
    qrValue: string;
    template: TemplateId;
  }

  /* =====================================================================
    CONSTANTS
  ===================================================================== */

  const CURRENCIES: Currency[] = [
    { code: "USD", symbol: "$", decimals: 2, label: "US Dollar" },
    { code: "EUR", symbol: "€", decimals: 2, label: "Euro" },
    { code: "GBP", symbol: "£", decimals: 2, label: "British Pound" },
    { code: "BDT", symbol: "৳", decimals: 2, label: "Bangladeshi Taka" },
    { code: "INR", symbol: "₹", decimals: 2, label: "Indian Rupee" },
    { code: "CNY", symbol: "¥", decimals: 2, label: "Chinese Yuan" },
    { code: "JPY", symbol: "¥", decimals: 0, label: "Japanese Yen" },
    { code: "AED", symbol: "د.إ", decimals: 2, label: "UAE Dirham" },
    { code: "SAR", symbol: "﷼", decimals: 2, label: "Saudi Riyal" },
    { code: "QAR", symbol: "﷼", decimals: 2, label: "Qatari Riyal" },
    { code: "MYR", symbol: "RM", decimals: 2, label: "Malaysian Ringgit" },
    { code: "SGD", symbol: "S$", decimals: 2, label: "Singapore Dollar" },
    { code: "THB", symbol: "฿", decimals: 2, label: "Thai Baht" },
    { code: "CAD", symbol: "C$", decimals: 2, label: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", decimals: 2, label: "Australian Dollar" },
  ];

  interface TaxPreset {
    country: string;
    label: string;
    rate: number;
  }

  const TAX_PRESETS: TaxPreset[] = [
    { country: "Germany", label: "VAT", rate: 19 },
    { country: "United Kingdom", label: "VAT", rate: 20 },
    { country: "United States", label: "Sales Tax", rate: 0 },
    { country: "Bangladesh", label: "VAT", rate: 15 },
    { country: "India", label: "GST", rate: 18 },
    { country: "China", label: "VAT", rate: 13 },
    { country: "United Arab Emirates", label: "VAT", rate: 5 },
    { country: "Saudi Arabia", label: "VAT", rate: 15 },
    { country: "Custom", label: "Tax", rate: 0 },
  ];

  interface TemplateStyle {
    id: TemplateId;
    label: string;
    bg: string;
    ink: string;
    inkSoft: string;
    accent: string;
    accentSoft: string;
    border: string;
    font: string;
    headingWeight: string;
  }

  const TEMPLATES: Record<TemplateId, TemplateStyle> = {
    modern: {
      id: "modern",
      label: "Modern",
      bg: "#ffffff",
      ink: "#111827",
      inkSoft: "#6b7280",
      accent: "#5b5ef4",
      accentSoft: "#eeeeff",
      border: "#e5e7eb",
      font: "system-ui, -apple-system, sans-serif",
      headingWeight: "800",
    },
    minimal: {
      id: "minimal",
      label: "Minimal",
      bg: "#ffffff",
      ink: "#18181b",
      inkSoft: "#71717a",
      accent: "#18181b",
      accentSoft: "#f4f4f5",
      border: "#e4e4e7",
      font: "Georgia, 'Times New Roman', serif",
      headingWeight: "400",
    },
    corporate: {
      id: "corporate",
      label: "Corporate",
      bg: "#ffffff",
      ink: "#1e293b",
      inkSoft: "#64748b",
      accent: "#0f766e",
      accentSoft: "#ccfbf1",
      border: "#cbd5e1",
      font: "Georgia, 'Times New Roman', serif",
      headingWeight: "700",
    },
  };

  const STORAGE_KEY_COUNTER = "mugox_invoice_counter";
  /* ===========================================================
   PROFESSIONAL PAGINATION ENGINE
=========================================================== */

const PAGE_HEIGHT = 1123;

/*
Header + Company + Client
*/
const HEADER_HEIGHT = 250;

/*
Table Header
*/
const TABLE_HEADER_HEIGHT = 42;

/*
Summary Card
*/
const SUMMARY_HEIGHT = 210;

/*
Notes
*/
const NOTES_HEIGHT = 60;

/*
Signature
*/
const SIGNATURE_HEIGHT = 95;

/*
Footer
*/
const FOOTER_HEIGHT = 40;

function getLastSectionHeight(data: InvoiceData) {

    let height = SUMMARY_HEIGHT + FOOTER_HEIGHT;

    if (data.notes || data.additionalMessage) {
        height += NOTES_HEIGHT;
    }

    if (
        data.companySignature ||
        data.customerSignature
    ) {
        height += SIGNATURE_HEIGHT;
    }

    return height + 20;
}

function estimateItemHeight(item: ProductLine) {

    let height = 42;

    if (item.name) {
        height += 18;
    }

    if (item.description) {

        const charsPerLine = 65;
        const lines = Math.max(
            1,
            Math.ceil(item.description.length / charsPerLine)
        );

        height += lines * 16;
    }

    if (item.sku) {
        height += 14;
    }

    return height;
}

interface InvoicePage {
  items: {
    item: ProductLine;
    calc: ReturnType<typeof computeItem>;
  }[];

  isLast: boolean;
}

function paginateInvoice(
  lines: {
    item: ProductLine;
    calc: ReturnType<typeof computeItem>;
  }[],
  data: InvoiceData
): InvoicePage[] {

    const pages: InvoicePage[] = [];

    let current: typeof lines = [];

    let usedHeight =
        HEADER_HEIGHT +
        TABLE_HEADER_HEIGHT;

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        const itemHeight =
            estimateItemHeight(line.item);

        const isLast =
            i === lines.length - 1;

        /*
        Item fit?
        */

        if (
            usedHeight +
            itemHeight >
            PAGE_HEIGHT
        ) {

            pages.push({
                items: current,
                isLast: false,
            });

            current = [];

            usedHeight =
                HEADER_HEIGHT +
                TABLE_HEADER_HEIGHT;
        }

        current.push(line);

        usedHeight += itemHeight;

        /*
        শেষ Item হলে
        Summary + Signature + Footer
        Fit হচ্ছে?
        */

        if (isLast) {

            const remaining =
PAGE_HEIGHT-usedHeight;

const required =
getLastSectionHeight(data);

if (remaining < required) {

                current.pop();

                pages.push({
                    items: current,
                    isLast: false,
                });

                current = [line];

                usedHeight =
                    HEADER_HEIGHT +
                    TABLE_HEADER_HEIGHT +
                    itemHeight;
            }
        }
    }

    pages.push({
        items: current,
        isLast: true,
    });

    return pages;
}



  /* =====================================================================
    PURE HELPERS (calculation, formatting, id/number generation)
  ===================================================================== */

  function getCurrency(code: string): Currency {
    return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  }

  function formatMoney(amount: number, currency: Currency): string {
    const safe = Number.isFinite(amount) ? amount : 0;
    const n = safe.toLocaleString("en-US", {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });
    return `${currency.symbol}${n}`;
  }

  function computeItem(item: ProductLine) {
    const base = item.qty * item.unitPrice;
    const discountAmt = base * (item.discountPercent / 100);
    const taxable = base - discountAmt;
    const taxAmt = taxable * (item.taxPercent / 100);
    const total = taxable + taxAmt;
    return { base, discountAmt, taxable, taxAmt, total };
  }

  function computeInvoiceTotals(data: InvoiceData) {
    const lines = data.items.map((item) => ({ item, calc: computeItem(item) }));
    const subtotal = lines.reduce((s, l) => s + l.calc.base, 0);
    const itemDiscountTotal = lines.reduce((s, l) => s + l.calc.discountAmt, 0);
    const taxTotal = lines.reduce((s, l) => s + l.calc.taxAmt, 0);
    const afterItemDiscount = subtotal - itemDiscountTotal;
    const invoiceDiscountAmt =
      data.discountType === "percent" ? afterItemDiscount * (data.discountValue / 100) : data.discountValue;
    const grandTotal =
      afterItemDiscount - invoiceDiscountAmt + taxTotal + data.shipping + data.handling + data.otherCharges;
    return { lines, subtotal, itemDiscountTotal, taxTotal, invoiceDiscountAmt, grandTotal };
  }

  function nextInvoiceNumber(): string {
    const year = new Date().getFullYear();
    let seq = 1;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_COUNTER);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.year === year && typeof parsed.seq === "number") {
        seq = parsed.seq + 1;
      }
      window.localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify({ year, seq }));
    } catch {
      // localStorage unavailable — fall back to seq 1 without persistence.
    }
    return `INV-${year}-${String(seq).padStart(4, "0")}`;
  }

  function emptyItem(): ProductLine {
    return {
      id: generateId(),
      name: "",
      description: "",
      qty: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 0,
      sku: "",
    };
  }

  function defaultInvoice(): InvoiceData {
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);
    const toInputDate = (d: Date) => d.toISOString().slice(0, 10);

    return {
      company: { name: "", address: "", phone: "", email: "", website: "", taxId: "", regNumber: "", logoDataUrl: "" },
      client: { name: "", company: "", address: "", email: "", phone: "", taxNumber: "" },
      invoiceNumber: "",
      issueDate: toInputDate(today),
      dueDate: toInputDate(due),
      status: "draft",
      items: [emptyItem()],
      currencyCode: "USD",
      taxLabel: "Tax",
      taxCountry: "Custom",
      discountType: "percent",
      discountValue: 0,
      shipping: 0,
      handling: 0,
      otherCharges: 0,
      notes: "",
      thankYouMessage: "Thank you for your business!",
      additionalMessage: "",
      companySignature: "",
      customerSignature: "",
      qrValue: "",
      template: "modern",
    };
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* =====================================================================
    SMALL UI PIECES (kept in this file — no separate component files)
  ===================================================================== */

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="p-4 bg-[var(--mg-bg-1)] rounded-xl border border-[var(--mg-border)] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--mg-ink-3)]">{title}</h3>
        {children}
      </div>
    );
  }

  function FileToDataUrl({
    label,
    value,
    onChange,
    accept = "image/png,image/jpeg,image/webp",
  }: {
    label: string;
    value: string;
    onChange: (dataUrl: string) => void;
    accept?: string;
  }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | undefined) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result || ""));
      reader.readAsDataURL(file);
    };

    return (
      <div>
        <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">{label}</label>
        <div className="flex items-center gap-3">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={label} className="w-14 h-14 rounded-lg object-contain border border-[var(--mg-border)] bg-white" />
          ) : (
            <div className="w-14 h-14 rounded-lg border border-dashed border-[var(--mg-border-2)] flex items-center justify-center text-[var(--mg-ink-4)]">
              <ImagePlus className="w-5 h-5" />
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" /> Upload
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange("")}>
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>
    );
  }

  function SignaturePad({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (dataUrl: string) => void;
  }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

    const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      drawing.current = true;
      const ctx = getCtx();
      const { x, y } = pointerPos(e);
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      const ctx = getCtx();
      const { x, y } = pointerPos(e);
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#111827";
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      setHasDrawn(true);
    };

    const end = () => {
      drawing.current = false;
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) onChange(canvas.toDataURL("image/png"));
    };

    const clear = () => {
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      onChange("");
    };

    const handleUpload = (file: File | undefined) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result || ""));
      reader.readAsDataURL(file);
    };

    return (
      <div>
        <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">{label}</label>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-20 border border-[var(--mg-border)] rounded-lg bg-white" />
        ) : (
          <canvas
            ref={canvasRef}
            width={280}
            height={90}
            className="border border-[var(--mg-border)] rounded-lg bg-white touch-none cursor-crosshair"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            <Eraser className="w-3.5 h-3.5" /> Clear
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" /> Upload instead
          </Button>
        </div>
      </div>
    );
  }

  /* =====================================================================
    MAIN COMPONENT
  ===================================================================== */

  export default function InvoiceGeneratorTool() {
    const [data, setData] = useState<InvoiceData>(() => defaultInvoice());
    const [exporting, setExporting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const loadInputRef = useRef<HTMLInputElement>(null);

    // Assign the first auto invoice number on mount (client-only — avoids SSR/CSR mismatch).
    useEffect(() => {
      setData((d) => (d.invoiceNumber ? d : { ...d, invoiceNumber: nextInvoiceNumber() }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currency = useMemo(() => getCurrency(data.currencyCode), [data.currencyCode]);
    const totals = useMemo(() => computeInvoiceTotals(data), [data]);
    const template = TEMPLATES[data.template];
    const pages = useMemo(() => {
    return paginateInvoice(
        totals.lines,
        data
    );
}, [totals.lines, data]);

    const validate = useCallback((): string[] => {
      const errs: string[] = [];
      if (!data.company.name.trim()) errs.push("Company name is required.");
      if (!data.client.name.trim()) errs.push("Client name is required.");
      if (data.items.length === 0 || data.items.every((i) => !i.name.trim()))
        errs.push("Add at least one product or service.");
      if (data.company.email && !EMAIL_RE.test(data.company.email)) errs.push("Company email looks invalid.");
      if (data.client.email && !EMAIL_RE.test(data.client.email)) errs.push("Client email looks invalid.");
      if (data.dueDate && data.issueDate && data.dueDate < data.issueDate)
        errs.push("Due date is before the issue date.");
      return errs;
    }, [data]);

    /* ---------- field update helpers ---------- */

    const update = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
      setData((d) => ({ ...d, [key]: value }));

    const updateCompany = <K extends keyof CompanyInfo>(key: K, value: CompanyInfo[K]) =>
      setData((d) => ({ ...d, company: { ...d.company, [key]: value } }));

    const updateClient = <K extends keyof ClientInfo>(key: K, value: ClientInfo[K]) =>
      setData((d) => ({ ...d, client: { ...d.client, [key]: value } }));

    /* ---------- line items ---------- */

    const addItem = () => setData((d) => ({ ...d, items: [...d.items, emptyItem()] }));

    const removeItem = (id: string) =>
      setData((d) => ({ ...d, items: d.items.length > 1 ? d.items.filter((i) => i.id !== id) : d.items }));

    const duplicateItem = (id: string) =>
      setData((d) => {
        const idx = d.items.findIndex((i) => i.id === id);
        if (idx === -1) return d;
        const copy = { ...d.items[idx], id: generateId() };
        const items = [...d.items];
        items.splice(idx + 1, 0, copy);
        return { ...d, items };
      });

    const moveItem = (id: string, dir: -1 | 1) =>
      setData((d) => {
        const idx = d.items.findIndex((i) => i.id === id);
        const target = idx + dir;
        if (idx === -1 || target < 0 || target >= d.items.length) return d;
        const items = [...d.items];
        [items[idx], items[target]] = [items[target], items[idx]];
        return { ...d, items };
      });

    const updateItem = (id: string, patch: Partial<ProductLine>) =>
      setData((d) => ({
        ...d,
        items: d.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));

    /* ---------- tax preset ---------- */

    const applyTaxPreset = (country: string) => {
      const preset = TAX_PRESETS.find((p) => p.country === country) ?? TAX_PRESETS[TAX_PRESETS.length - 1];
      setData((d) => ({ ...d, taxCountry: preset.country, taxLabel: preset.label }));
    };

    /* ---------- export / print / save / load ---------- */

  const exportPdf = async () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    setExporting(true);
    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const node = pageRefs.current[i];
        if (!node) continue;

        const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");

        if (i > 0) pdf.addPage();

        pdf.setFillColor(template.bg);
        pdf.rect(0, 0, pageW, pageH, "F");

        const scaleX = (pageW - margin * 2) / canvas.width;
const scaleY = (pageH - margin * 2) / canvas.height;

const scale = Math.min(scaleX, scaleY);

const imgWidth = canvas.width * scale;
const imgHeight = canvas.height * scale;

const x = (pageW - imgWidth) / 2;
const y = (pageH - imgHeight) / 2;

pdf.addImage(
    imgData,
    "PNG",
    x,
    y,
    imgWidth,
    imgHeight
);
      }

      pdf.save(`${data.invoiceNumber || "invoice"}.pdf`);
      track("invoice_pdf_downloaded", { pages: pageRefs.current.length, template: data.template, currency: data.currencyCode });
    } catch {
      setErrors(["Couldn't generate the PDF. Try again, or use Print instead."]);
    } finally {
      setExporting(false);
    }
  };
    const handlePrint = () => {
      const errs = validate();
      setErrors(errs);
      if (errs.length > 0) return;
      track("invoice_printed", { template: data.template });
      window.print();
    };

    const handleSave = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoiceNumber || "invoice"}.json`;
      a.click();
      URL.revokeObjectURL(url);
      track("invoice_saved", { template: data.template });
    };

    const handleLoad = (file: File | undefined) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          // Merge over defaults so an older/partial JSON file doesn't crash the UI.
          setData({ ...defaultInvoice(), ...parsed });
          setErrors([]);
          track("invoice_loaded", {});
        } catch {
          setErrors(["That file isn't a valid saved invoice (.json)."]);
        }
      };
      reader.readAsText(file);
    };

    const startNew = () => {
      setData(defaultInvoice());
      setErrors([]);
    };

    const generatedOnce = useRef(false);
    useEffect(() => {
      if (!generatedOnce.current && data.company.name && data.client.name) {
        generatedOnce.current = true;
        track("invoice_generated", { template: data.template });
      }
    }, [data.company.name, data.client.name, data.template]);

    return (
      <div className="space-y-5">
        <style>{`
          @media print {
            .invoice-no-print { display: none !important; }
            .invoice-preview-wrapper { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
            body { background: white !important; }
          }
        `}</style>

        {errors.length > 0 && (
          <div className="invoice-no-print flex items-start gap-2 px-4 py-3 rounded-xl bg-[var(--mg-danger-bg)] text-[var(--mg-danger-t)] text-[13px]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <ul className="space-y-0.5">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_460px] gap-6 items-start">
          {/* ============ EDITOR (left) ============ */}
          <div className="invoice-no-print space-y-4">
            <Section title="Company Information">
              <FileToDataUrl label="Logo" value={data.company.logoDataUrl} onChange={(v) => updateCompany("logoDataUrl", v)} />
              <Input label="Company Name" value={data.company.name} onChange={(e) => updateCompany("name", e.target.value)} />
              <Textarea label="Address" value={data.company.address} onChange={(e) => updateCompany("address", e.target.value)} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Phone" value={data.company.phone} onChange={(e) => updateCompany("phone", e.target.value)} />
                <Input label="Email" type="email" value={data.company.email} onChange={(e) => updateCompany("email", e.target.value)} />
                <Input label="Website" value={data.company.website} onChange={(e) => updateCompany("website", e.target.value)} />
                <Input label="Tax ID" value={data.company.taxId} onChange={(e) => updateCompany("taxId", e.target.value)} />
                <Input label="Registration No." value={data.company.regNumber} onChange={(e) => updateCompany("regNumber", e.target.value)} />
              </div>
            </Section>

            <Section title="Client Information">
              <Input label="Client Name" value={data.client.name} onChange={(e) => updateClient("name", e.target.value)} />
              <Input label="Client Company" value={data.client.company} onChange={(e) => updateClient("company", e.target.value)} />
              <Textarea label="Address" value={data.client.address} onChange={(e) => updateClient("address", e.target.value)} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Email" type="email" value={data.client.email} onChange={(e) => updateClient("email", e.target.value)} />
                <Input label="Phone" value={data.client.phone} onChange={(e) => updateClient("phone", e.target.value)} />
                <Input label="Tax Number" value={data.client.taxNumber} onChange={(e) => updateClient("taxNumber", e.target.value)} />
              </div>
            </Section>

            <Section title="Invoice Information">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Invoice Number" value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} />
                <Input label="Issue Date" type="date" value={data.issueDate} onChange={(e) => update("issueDate", e.target.value)} />
                <Input label="Due Date" type="date" value={data.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
              </div>
            </Section>

            <Section title="Products & Services">
              <div className="space-y-3">
                {data.items.map((item, idx) => {
                  const calc = computeItem(item);
                  return (
                    <div key={item.id} className="p-3 rounded-lg border border-[var(--mg-border-2)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[var(--mg-ink-4)]">Item {idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} className="w-6 h-6 rounded flex items-center justify-center text-[var(--mg-ink-4)] hover:bg-[var(--mg-bg-2)] disabled:opacity-30" aria-label="Move up">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveItem(item.id, 1)} disabled={idx === data.items.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-[var(--mg-ink-4)] hover:bg-[var(--mg-bg-2)] disabled:opacity-30" aria-label="Move down">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => duplicateItem(item.id)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--mg-ink-4)] hover:bg-[var(--mg-bg-2)]" aria-label="Duplicate">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={data.items.length <= 1}
                            className="w-6 h-6 rounded flex items-center justify-center text-[var(--mg-ink-4)] hover:text-[var(--mg-danger)] hover:bg-[var(--mg-danger-bg)] disabled:opacity-30"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <Input placeholder="Product / service name" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                      <Textarea placeholder="Description (optional)" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} rows={2} />
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div>
                          <span className="text-[10px] text-[var(--mg-ink-4)]">Qty</span>
                          <input type="number" min={0} value={item.qty} onChange={(e) => updateItem(item.id, { qty: Math.max(0, Number(e.target.value) || 0) })} className="mg-input" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--mg-ink-4)]">Unit Price</span>
                          <input type="number" min={0} step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })} className="mg-input" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--mg-ink-4)]">Discount %</span>
                          <input type="number" min={0} max={100} value={item.discountPercent} onChange={(e) => updateItem(item.id, { discountPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })} className="mg-input" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--mg-ink-4)]">Tax %</span>
                          <input type="number" min={0} max={100} value={item.taxPercent} onChange={(e) => updateItem(item.id, { taxPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })} className="mg-input" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--mg-ink-4)]">SKU</span>
                          <input type="text" value={item.sku} onChange={(e) => updateItem(item.id, { sku: e.target.value })} className="mg-input" />
                        </div>
                      </div>
                      <p className="text-right text-[12px] font-mono text-[var(--mg-ink-3)]">
                        Line total: {formatMoney(calc.total, currency)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <Button variant="secondary" size="sm" onClick={addItem}>
                <Plus className="w-3.5 h-3.5" /> Add product
              </Button>
            </Section>

            <Section title="Currency & Tax">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">Currency</label>
                  <select
                    value={data.currencyCode}
                    onChange={(e) => {
                      update("currencyCode", e.target.value);
                      track("invoice_currency_changed", { currency: e.target.value });
                    }}
                    className="mg-input"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">Tax preset (country)</label>
                  <select value={data.taxCountry} onChange={(e) => applyTaxPreset(e.target.value)} className="mg-input">
                    {TAX_PRESETS.map((p) => (
                      <option key={p.country} value={p.country}>{p.country}</option>
                    ))}
                  </select>
                </div>
                <Input label="Tax label" value={data.taxLabel} onChange={(e) => update("taxLabel", e.target.value)} hint="Shown in the totals — e.g. VAT, GST, Sales Tax" />
              </div>
            </Section>

            <Section title="Discount & Charges">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--mg-ink-2)] mb-1.5">Discount type</label>
                  <select value={data.discountType} onChange={(e) => update("discountType", e.target.value as DiscountType)} className="mg-input">
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--mg-ink-4)]">Invoice discount</span>
                  <input type="number" min={0} value={data.discountValue} onChange={(e) => update("discountValue", Math.max(0, Number(e.target.value) || 0))} className="mg-input" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--mg-ink-4)]">Shipping</span>
                  <input type="number" min={0} value={data.shipping} onChange={(e) => update("shipping", Math.max(0, Number(e.target.value) || 0))} className="mg-input" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--mg-ink-4)]">Handling</span>
                  <input type="number" min={0} value={data.handling} onChange={(e) => update("handling", Math.max(0, Number(e.target.value) || 0))} className="mg-input" />
                </div>
                <div>
                  <span className="text-[10px] text-[var(--mg-ink-4)]">Other charges</span>
                  <input type="number" min={0} value={data.otherCharges} onChange={(e) => update("otherCharges", Math.max(0, Number(e.target.value) || 0))} className="mg-input" />
                </div>
              </div>
            </Section>

            <Section title="Notes">
              <Input label="Thank you message" value={data.thankYouMessage} onChange={(e) => update("thankYouMessage", e.target.value)} />
            </Section>

            <Section title="Template">
              <div className="flex gap-2 flex-wrap">
                {(Object.values(TEMPLATES)).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      update("template", t.id);
                      track("invoice_template_changed", { template: t.id });
                    }}
                    className={`px-3 py-2 rounded-lg text-[13px] font-medium border transition-all duration-[180ms] ${
                      data.template === t.id
                        ? "border-[var(--mg-brand)] bg-[var(--mg-brand-bg)] text-[var(--mg-brand-t)]"
                        : "border-[var(--mg-border-2)] text-[var(--mg-ink-3)] hover:bg-[var(--mg-bg-2)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Section>

            <div className="flex flex-wrap gap-2 sticky bottom-4">
              <Button variant="primary" onClick={() => exportPdf()} loading={exporting}>
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download PDF
              </Button>
      
              <Button variant="ghost" onClick={startNew}>
                <RotateCcw className="w-4 h-4" /> Start new
              </Button>
            </div>
          </div>

          {/* ============ PREVIEW (right) ============ */}
          <div className="invoice-preview-wrapper lg:sticky lg:top-4">
           {pages.map((page, pageIndex) => {

    const pageLines = page.items;

    const isLastPage = page.isLast;
    return (
      <div
        key={pageIndex}
        ref={(el) => { pageRefs.current[pageIndex] = el; }}
     style={{
    width: "794px",
    height: "1123px",

    background: template.bg,
    color: template.ink,
    fontFamily: template.font,

    border: `1px solid ${template.border}`,

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",

    position: "relative",
}}
        className="rounded-xl shadow-[var(--mg-shadow)] p-8 text-[13px] leading-relaxed mb-4"
      >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 mb-4" style={{ borderBottom: `2px solid ${template.accent}` }}>
                <div className="flex items-start gap-3">
                  {data.company.logoDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.company.logoDataUrl} alt="Logo" className="w-14 h-14 object-contain" />
                  )}
                  <div>
                    <p style={{ fontWeight: template.headingWeight as never, fontSize: 18 }}>{data.company.name || "Your Company"}</p>
                    <p style={{ color: template.inkSoft, whiteSpace: "pre-line" }}>{data.company.address}</p>
                    <p style={{ color: template.inkSoft }}>
                      {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join(" · ")}
                    </p>
                    {(data.company.taxId || data.company.regNumber) && (
                      <p style={{ color: template.inkSoft }}>
                        {data.company.taxId && `Tax ID: ${data.company.taxId}`}
                        {data.company.taxId && data.company.regNumber && " · "}
                        {data.company.regNumber && `Reg: ${data.company.regNumber}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ fontWeight: 800, fontSize: 22, color: template.accent }}>INVOICE</p>
                  <p style={{ color: template.inkSoft }}>{data.invoiceNumber}</p>
                </div>
              </div>

              {/* Client + dates */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p style={{ color: template.inkSoft, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Bill To</p>
                  <p style={{ fontWeight: 700 }}>{data.client.name || "Client name"}</p>
                  {data.client.company && <p>{data.client.company}</p>}
                  <p style={{ color: template.inkSoft, whiteSpace: "pre-line" }}>{data.client.address}</p>
                  <p style={{ color: template.inkSoft }}>{[data.client.email, data.client.phone].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="text-right">
                  <p><span style={{ color: template.inkSoft }}>Issue date: </span>{data.issueDate}</p>
                  <p><span style={{ color: template.inkSoft }}>Due date: </span>{data.dueDate}</p>
                </div>
              </div>
<div>
              {/* Line items table */}
             <table className="w-full mb-5" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
  <thead>
    <tr style={{ background: template.accentSoft }}>
      <th className="text-left p-2" style={{ fontSize: 11, width: "38%" }}>Item</th>
      <th className="text-right p-2" style={{ fontSize: 11, width: "8%" }}>Qty</th>
      <th className="text-right p-2" style={{ fontSize: 11, width: "16%" }}>Price</th>
      <th className="text-right p-2" style={{ fontSize: 11, width: "10%" }}>Disc.</th>
      <th className="text-right p-2" style={{ fontSize: 11, width: "10%" }}>Tax</th>
      <th className="text-right p-2" style={{ fontSize: 11, width: "18%" }}>Total</th>
    </tr>
  </thead>
                <tbody>
                  {pageLines.map(({ item, calc }) => (
                    
                    <tr
    key={item.id}
    style={{
        breakInside: "avoid",
        pageBreakInside: "avoid"
    }}
>
                      <td className="p-2">
                        <p style={{ fontWeight: 600 }}>{item.name || "—"}</p>
                        {item.description && <p style={{ color: template.inkSoft, fontSize: 11 }}>{item.description}</p>}
                        {item.sku && <p style={{ color: template.inkSoft, fontSize: 10 }}>SKU: {item.sku}</p>}
                      </td>
                      <td className="text-right p-2">{item.qty}</td>
                      <td className="text-right p-2">{formatMoney(item.unitPrice, currency)}</td>
                      <td className="text-right p-2">{item.discountPercent}%</td>
                      <td className="text-right p-2">{item.taxPercent}%</td>
                      <td className="text-right p-2" style={{ fontWeight: 600 }}>{formatMoney(calc.total, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          {/* Summary, notes, signatures, footer — শুধু isLastPage হলে দেখান */}
              {page.isLast && (
                <>
                {/* Summary */}
               <div
className="flex justify-end mb-6"
style={{
    breakInside: "avoid",
    pageBreakInside: "avoid",
    flexShrink: 0
}}
>
                <div
    className="w-72 space-y-2 rounded-xl p-5"
    style={{
        background: "#F8FAFC",
        border: "1px solid #E5E7EB"
    }}
>
                  <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Subtotal</span><span>{formatMoney(totals.subtotal, currency)}</span></div>
                  {totals.itemDiscountTotal > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Item discounts</span><span>-{formatMoney(totals.itemDiscountTotal, currency)}</span></div>
                  )}
                  {totals.invoiceDiscountAmt > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Discount</span><span>-{formatMoney(totals.invoiceDiscountAmt, currency)}</span></div>
                  )}
                  {totals.taxTotal > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>{data.taxLabel}</span><span>{formatMoney(totals.taxTotal, currency)}</span></div>
                  )}
                  {data.shipping > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Shipping</span><span>{formatMoney(data.shipping, currency)}</span></div>
                  )}
                  {data.handling > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Handling</span><span>{formatMoney(data.handling, currency)}</span></div>
                  )}
                  {data.otherCharges > 0 && (
                    <div className="flex justify-between"><span style={{ color: template.inkSoft }}>Other</span><span>{formatMoney(data.otherCharges, currency)}</span></div>
                  )}
                  <div className="flex justify-between pt-2 mt-1" style={{ borderTop: `2px solid ${template.accent}`, fontWeight: 800, fontSize: 15 }}>
                    <span>Total</span><span style={{ color: template.accent }}>{formatMoney(totals.grandTotal, currency)}</span>
                  </div>
                </div>
              </div>
              {/* Notes */}
                {(data.notes || data.additionalMessage) && (
                <div className="mb-4" style={{ fontSize: 12, color: template.inkSoft }}>
                  {data.notes && <p className="mb-1">{data.notes}</p>}
                  {data.additionalMessage && <p>{data.additionalMessage}</p>}
                </div>
                )}

              {/* Footer */}
          <div
className="text-center pt-4"
style={{
    marginTop:"auto",
    borderTop:`1px solid ${template.border}`,
    color:template.accent,
    fontWeight:600,
    flexShrink:0,
}}
>
                {data.thankYouMessage}
              </div>
                </>
              )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    );
  }