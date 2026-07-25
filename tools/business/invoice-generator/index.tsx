"use client";

import { useMemo, useRef, useState Plus,
Trash2,
Package,} from "react";

import Image from "next/image";

import {
  Building2,
  User,
  Receipt,
  Calendar,
  Upload,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  track,
  EVENTS,
} from "@/lib/analytics/track";
type CompanyInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

type ClientInfo = {
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
};

type InvoiceInfo = {
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
};
type InvoiceItem = {
  id: number;
  name: string;
  description: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
};
const [company, setCompany] = useState<CompanyInfo>({
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
});

const [client, setClient] = useState<ClientInfo>({
  name: "",
  company: "",
  address: "",
  phone: "",
  email: "",
});

const [invoice, setInvoice] = useState<InvoiceInfo>({
  invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date().toISOString().split("T")[0],
});
const [logo, setLogo] = useState<string | null>(null);

const logoInputRef =
  useRef<HTMLInputElement>(null);
  const handleLogoUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setLogo(reader.result as string);

    track(EVENTS.TOOL_STARTED, {
      tool: "invoice-generator",
      action: "logo-upload",
    });
  };

  reader.readAsDataURL(file);
};
const reset = () => {
  setCompany({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  setClient({
    name: "",
    company: "",
    address: "",
    phone: "",
    email: "",
  });

  setInvoice({
    invoiceNo: `INV-${Date.now()
      .toString()
      .slice(-6)}`,
    issueDate:
      new Date()
        .toISOString()
        .split("T")[0],
    dueDate:
      new Date()
        .toISOString()
        .split("T")[0],
  });

  setLogo(null);

  track(EVENTS.TOOL_STARTED, {
    tool: "invoice-generator",
    action: "reset",
  });
};
const updateCompany = (
  field: keyof CompanyInfo,
  value: string
) => {
  setCompany((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const updateClient = (
  field: keyof ClientInfo,
  value: string
) => {
  setClient((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const updateInvoice = (
  field: keyof InvoiceInfo,
  value: string
) => {
  setInvoice((prev) => ({
    ...prev,
    [field]: value,
  }));
};
const [items, setItems] = useState<InvoiceItem[]>([
  {
    id: 1,
    name: "",
    description: "",
    qty: 1,
    price: 0,
    discount: 0,
    tax: 0,
  },
]);
const addItem = () => {
  setItems((prev) => [
    ...prev,
    {
      id: Date.now(),
      name: "",
      description: "",
      qty: 1,
      price: 0,
      discount: 0,
      tax: 0,
    },
  ]);
};

const removeItem = (id: number) => {
  if (items.length === 1) return;

  setItems((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

const updateItem = (
  id: number,
  field: keyof InvoiceItem,
  value: string | number
) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    )
  );
};
const subtotal = useMemo(() => {
  return items.reduce((sum, item) => {
    const total =
      item.qty * item.price;

    const discount =
      total * (item.discount / 100);

    const tax =
      (total - discount) *
      (item.tax / 100);

    return (
      sum +
      total -
      discount +
      tax
    );
  }, 0);
}, [items]);
const [shipping, setShipping] = useState(0);

const [extraDiscount, setExtraDiscount] = useState(0);

const [currency, setCurrency] = useState("USD");

const [notes, setNotes] = useState("");

const [terms, setTerms] = useState(
  "Payment is due within the due date."
);
const currencies = [
  "USD",
  "EUR",
  "GBP",
  "BDT",
  "CNY",
  "JPY",
  "INR",
  "AED",
];
const grandTotal = useMemo(() => {
  return subtotal + shipping - extraDiscount;
}, [
  subtotal,
  shipping,
  extraDiscount,
]);

return (

<div className="space-y-8">

{/* Header */}

<div className="flex flex-col gap-3">

<div className="flex items-center gap-3">

<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mg-brand-bg)]">

<Receipt className="h-7 w-7 text-[var(--mg-brand)]"/>

</div>

<div>

<h1 className="text-3xl font-bold">

Invoice Generator

</h1>

<p className="text-sm text-[var(--mg-ink-4)]">

Create professional invoices with your company branding.

</p>

</div>

</div>

</div>

{/* Logo */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<h2 className="mb-5 text-lg font-semibold">

Company Logo

</h2>

<div className="flex flex-col gap-5 md:flex-row md:items-center">

<div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--mg-border)] bg-white">

{logo ? (

<Image

src={logo}

alt="Company Logo"

width={140}

height={140}

className="object-contain"

/>

) : (

<span className="text-xs text-[var(--mg-ink-4)]">

No Logo

</span>

)}

</div>

<div className="space-y-3">

<input

type="file"

accept=".png,.jpg,.jpeg,.webp"

hidden

ref={logoInputRef}

onChange={handleLogoUpload}

/>

<Button

variant="primary"

onClick={()=>

logoInputRef.current?.click()

}

>

<Upload className="h-4 w-4"/>

Upload Logo

</Button>

<p className="text-xs text-[var(--mg-ink-4)]">

PNG, JPG or WEBP

</p>

</div>

</div>

</div>
<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<div className="mb-5 flex items-center gap-2">

<Calendar className="h-5 w-5 text-[var(--mg-brand)]"/>

<h2 className="text-lg font-semibold">

Invoice Information

</h2>

</div>

<div className="grid gap-5 md:grid-cols-3">

<div>

<label className="mb-2 block text-sm font-medium">

Invoice Number

</label>

<input

value={invoice.invoiceNo}

onChange={(e)=>

updateInvoice(

"invoiceNo",

e.target.value

)

}

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Issue Date

</label>

<input

type="date"

value={invoice.issueDate}

onChange={(e)=>

updateInvoice(

"issueDate",

e.target.value

)

}

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Due Date

</label>

<input

type="date"

value={invoice.dueDate}

onChange={(e)=>

updateInvoice(

"dueDate",

e.target.value

)

}

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

</div>

</div>
{/* Company + Client */}

<div className="grid gap-6 lg:grid-cols-2">

{/* Company */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<div className="mb-5 flex items-center gap-2">

<Building2 className="h-5 w-5 text-[var(--mg-brand)]"/>

<h2 className="text-lg font-semibold">

Company Information

</h2>

</div>

<div className="space-y-4">

<div>

<label className="mb-2 block text-sm font-medium">

Company Name

</label>

<input

value={company.name}

onChange={(e)=>

updateCompany(

"name",

e.target.value

)

}

placeholder="Your Company"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Address

</label>

<textarea

rows={3}

value={company.address}

onChange={(e)=>

updateCompany(

"address",

e.target.value

)

}

placeholder="Company Address"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Phone

</label>

<input

value={company.phone}

onChange={(e)=>

updateCompany(

"phone",

e.target.value

)

}

placeholder="+880..."

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Email

</label>

<input

type="email"

value={company.email}

onChange={(e)=>

updateCompany(

"email",

e.target.value

)

}

placeholder="company@email.com"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Website

</label>

<input

value={company.website}

onChange={(e)=>

updateCompany(

"website",

e.target.value

)

}

placeholder="https://example.com"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

</div>

</div>

{/* Client */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<div className="mb-5 flex items-center gap-2">

<User className="h-5 w-5 text-[var(--mg-brand)]"/>

<h2 className="text-lg font-semibold">

Bill To

</h2>

</div>

<div className="space-y-4">

<div>

<label className="mb-2 block text-sm font-medium">

Client Name

</label>

<input

value={client.name}

onChange={(e)=>

updateClient(

"name",

e.target.value

)

}

placeholder="Client Name"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Company

</label>

<input

value={client.company}

onChange={(e)=>

updateClient(

"company",

e.target.value

)

}

placeholder="Client Company"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Address

</label>

<textarea

rows={3}

value={client.address}

onChange={(e)=>

updateClient(

"address",

e.target.value

)

}

placeholder="Client Address"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Phone

</label>

<input

value={client.phone}

onChange={(e)=>

updateClient(

"phone",

e.target.value

)

}

placeholder="+880..."

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Email

</label>

<input

type="email"

value={client.email}

onChange={(e)=>

updateClient(

"email",

e.target.value

)

}

placeholder="client@email.com"

className="w-full rounded-xl border border-[var(--mg-border)] p-3"

/>

</div>

</div>

</div>

</div>
<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<div className="mb-5 flex items-center justify-between">

<div className="flex items-center gap-2">

<Package className="h-5 w-5 text-[var(--mg-brand)]"/>

<h2 className="text-lg font-semibold">

Products / Services

</h2>

</div>

<Button
variant="primary"
onClick={addItem}
>

<Plus className="h-4 w-4"/>

Add Item

</Button>

</div>
{/* Actions */}

<div className="flex flex-wrap gap-3">

  <Button
    variant="ghost"
    onClick={reset}
  >
    <RotateCcw className="h-4 w-4" />
    Reset
  </Button>

  <Button
    variant="primary"
    onClick={() => {
      track(EVENTS.TOOL_STARTED, {
        tool: "invoice-generator",
        action: "generate",
      });

      alert(
        "Invoice Preview will be available in Part 4."
      );
    }}
  >
    <Receipt className="h-4 w-4" />
    Generate Invoice
  </Button>
  <div className="space-y-6">

{items.map((item) => (

<div
key={item.id}
className="rounded-xl border border-[var(--mg-border)] p-5"
>

<div className="grid gap-4 lg:grid-cols-2">
  {/* Summary */}

<div className="mt-8 flex justify-end">

  <div className="w-full max-w-md rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-brand-bg)] p-6">

    <div className="flex items-center justify-between">

      <span className="text-sm font-medium">

        Items

      </span>

      <span className="font-semibold">

        {items.length}

      </span>

    </div>

    <div className="mt-4 flex items-center justify-between border-t border-[var(--mg-border)] pt-4">

      <span className="text-lg font-semibold">

        Subtotal

      </span>

      <span className="text-2xl font-bold text-[var(--mg-brand)]">

        ${subtotal.toFixed(2)}

      </span>

    </div>

    <p className="mt-3 text-xs text-[var(--mg-ink-4)]">

      Discount and tax are already included in the subtotal.

    </p>

  </div>

</div>

</div>

{/* Product Name */}

<div>

<label className="mb-2 block text-sm font-medium">

Product / Service

</label>

<input
value={item.name}
onChange={(e)=>
updateItem(
item.id,
"name",
e.target.value
)
}
placeholder="Product Name"
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>
<div className="grid gap-6 lg:grid-cols-2">

{/* Invoice Settings */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

<h2 className="mb-5 text-lg font-semibold">

Invoice Settings

</h2>

<div className="space-y-4">

<div>

<label className="mb-2 block text-sm font-medium">

Currency

</label>

<select
value={currency}
onChange={(e)=>
setCurrency(e.target.value)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
>

{currencies.map((c)=>(

<option
key={c}
value={c}
>

{c}

</option>

))}

</select>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Shipping

</label>

<input
type="number"
min={0}
value={shipping}
onChange={(e)=>
setShipping(
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

<div>

<label className="mb-2 block text-sm font-medium">

Extra Discount

</label>

<input
type="number"
min={0}
value={extraDiscount}
onChange={(e)=>
setExtraDiscount(
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

</div>

</div>
<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-brand-bg)] p-6">

<h2 className="mb-5 text-lg font-semibold">

Summary

</h2>

<div className="space-y-3">

<div className="flex justify-between">

<span>

Subtotal

</span>

<span>

{currency} {subtotal.toFixed(2)}

</span>

</div>

<div className="flex justify-between">

<span>

Shipping

</span>

<span>

{currency} {shipping.toFixed(2)}

</span>

</div>

<div className="flex justify-between">

<span>

Discount

</span>

<span>

- {currency} {extraDiscount.toFixed(2)}

</span>

</div>

<hr />

<div className="flex justify-between text-2xl font-bold">

<span>

Grand Total

</span>

<span>

{currency} {grandTotal.toFixed(2)}

</span>

</div>

</div>

</div>

</div>
{/* Quantity */}

<div>

<label className="mb-2 block text-sm font-medium">

Quantity

</label>

<input
type="number"
min={1}
value={item.qty}
onChange={(e)=>
updateItem(
item.id,
"qty",
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

{/* Description */}

<div className="lg:col-span-2">

<label className="mb-2 block text-sm font-medium">

Description

</label>

<textarea
rows={3}
value={item.description}
onChange={(e)=>
updateItem(
item.id,
"description",
e.target.value
)
}
placeholder="Product description..."
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

{/* Unit Price */}

<div>

<label className="mb-2 block text-sm font-medium">

Unit Price

</label>

<input
type="number"
min={0}
value={item.price}
onChange={(e)=>
updateItem(
item.id,
"price",
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

{/* Discount */}

<div>

<label className="mb-2 block text-sm font-medium">

Discount %

</label>

<input
type="number"
min={0}
max={100}
value={item.discount}
onChange={(e)=>
updateItem(
item.id,
"discount",
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

{/* Tax */}

<div>

<label className="mb-2 block text-sm font-medium">

Tax %

</label>

<input
type="number"
min={0}
max={100}
value={item.tax}
onChange={(e)=>
updateItem(
item.id,
"tax",
Number(e.target.value)
)
}
className="w-full rounded-xl border border-[var(--mg-border)] p-3"
/>

</div>

{/* Line Total */}

<div>

<label className="mb-2 block text-sm font-medium">

Line Total

</label>

<div className="rounded-xl bg-[var(--mg-brand-bg)] p-3 font-semibold text-[var(--mg-brand-t)]">

$
{(
item.qty * item.price *
(1 - item.discount / 100) *
(1 + item.tax / 100)
).toFixed(2)}

</div>

</div>

</div>

<div className="mt-5 flex justify-end">

<Button
variant="ghost"
onClick={()=>
removeItem(item.id)
}
>

<Trash2 className="h-4 w-4"/>

Remove

</Button>

</div>

</div>

))}

</div>

</div>

{/* Info */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-5">

  <h3 className="font-semibold">

    🚀 Coming in the next parts

  </h3>

  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--mg-ink-4)]">

    <li>Unlimited Products</li>

    <li>Automatic GST / VAT Calculation</li>

    <li>Shipping Charges</li>

    <li>Discount System</li>

    <li>Invoice Preview</li>

    <li>Professional PDF Download</li>

    <li>Print Invoice</li>

  </ul>

</div>

</div>
<div className="grid gap-6 lg:grid-cols-2">

  {/* Notes */}

  <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

    <h2 className="mb-5 text-lg font-semibold">

      Notes

    </h2>

    <textarea
      rows={8}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Thank you for your business..."
      className="w-full rounded-xl border border-[var(--mg-border)] p-4"
    />

  </div>

  {/* Payment Terms */}

  <div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

    <h2 className="mb-5 text-lg font-semibold">

      Payment Terms

    </h2>

    <textarea
      rows={8}
      value={terms}
      onChange={(e) => setTerms(e.target.value)}
      placeholder="Payment terms..."
      className="w-full rounded-xl border border-[var(--mg-border)] p-4"
    />

  </div>

</div>

{/* Payment Information */}

<div className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-bg-1)] p-6">

  <h2 className="mb-5 text-lg font-semibold">

    Payment Information

  </h2>

  <div className="grid gap-5 md:grid-cols-2">

    <div>

      <label className="mb-2 block text-sm font-medium">

        Payment Method

      </label>

      <select className="w-full rounded-xl border border-[var(--mg-border)] p-3">

        <option>Bank Transfer</option>

        <option>Cash</option>

        <option>PayPal</option>

        <option>Stripe</option>

        <option>Wise</option>

        <option>Credit Card</option>

      </select>

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">

        Account Name

      </label>

      <input
        placeholder="Company Account Name"
        className="w-full rounded-xl border border-[var(--mg-border)] p-3"
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">

        Account Number

      </label>

      <input
        placeholder="123456789"
        className="w-full rounded-xl border border-[var(--mg-border)] p-3"
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">

        SWIFT / IBAN

      </label>

      <input
        placeholder="SWIFT / IBAN"
        className="w-full rounded-xl border border-[var(--mg-border)] p-3"
      />

    </div>

  </div>

</div>
);
}
