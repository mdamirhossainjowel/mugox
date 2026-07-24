export const metadata = {
  title: "Contact Us | MugoX",
  description:
    "Get in touch with the MugoX team for support, feedback, partnerships, or bug reports.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <p className="text-lg text-gray-600 mb-8">
        We&apos;d love to hear from you! Whether you have a question, found a bug,
        want to suggest a new tool, or simply want to say hello, We&apos;re here to
        help.
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            General Support
          </h2>

          <p className="text-gray-600">
            For technical issues, tool-related questions, or general inquiries,
            please contact us.
          </p>

          <p className="mt-3">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:mymugox@gmail.com"
              className="text-blue-600 hover:underline"
            >
              mymugox@gmail.com
            </a>
          </p>

          <p className="text-gray-600 mt-2">
            We usually respond within 24–48 hours.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Report a Problem
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>The tool name</li>
            <li>Your browser and device</li>
            <li>A short description of the issue</li>
            <li>Screenshots (if available)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Suggest a New Tool
          </h2>

          <p className="text-gray-600">
            Have an idea for a useful online tool? We&apos;d love to hear your
            suggestions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Business & Partnerships
          </h2>

          <p className="text-gray-600">
            For partnerships, collaborations, or business inquiries:
          </p>

          <p className="mt-3">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:mymugox@gmail.com"
              className="text-blue-600 hover:underline"
            >
              mymugox@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            About MugoX
          </h2>

          <p className="text-gray-600">
            MugoX is a privacy-first collection of free online tools that run
            directly in your browser. We provide PDF, image, text, calculator,
            and developer tools without requiring sign-up or unnecessary file
            uploads.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Response Time
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>General inquiries: 24–48 hours</li>
            <li>Bug reports: As soon as possible</li>
            <li>Business inquiries: 1–3 business days</li>
          </ul>
        </div>
      </section>
    </main>
  );
}