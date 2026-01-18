export default function Contact() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          Contact Us
        </h1>
        <p className="text-gray-600">
          We'd love to hear from you.
        </p>
      </header>

      <section className="space-y-4 text-gray-700">
        <p>
          If you have questions, feedback or partnership inquiries, feel free to reach out to us.
        </p>

        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span>{' '}
            support@brandingsite.com
          </p>
          <p>
            <span className="font-medium">Location:</span>{' '}
            India
          </p>
        </div>

        <p className="text-sm text-gray-500">
          A contact form and email integration will be added later.
        </p>
      </section>
    </div>
  );
}
