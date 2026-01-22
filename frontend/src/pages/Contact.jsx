import { useRef, useState } from 'react';
import emailjs from 'emailjs';

export default function Contact() {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setSuccessMsg('Your message has been sent successfully.');
      formRef.current.reset();
    } catch {
      setErrorMsg('Unable to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact Us</h1>
        <p className="text-gray-600">
          We'd love to hear from you. Send us a message and we'll get back to
          you.
        </p>
      </header>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border rounded-lg p-6"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="user_name"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="text"
            name="user_email"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Message</label>
          <textarea
            name="message"
            rows="4"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        {successMsg && (
          <p className="text-sm text-green-600">{successMsg}</p>
        )}

        {errorMsg && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}
      </form>

      <section className="space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">Email:</span> support@brandingsite.com
        </p>

        <p>
          <span className="font-medium">Location:</span> India
        </p>

      </section>
    </div>
  );
}
