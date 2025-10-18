import React from "react";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onClear,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
    >
      <div>
        <label className="block font-medium text-gray-700">Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          placeholder="Your Name"
          className="w-full border rounded-lg p-2 mt-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@example.com"
          className="w-full border rounded-lg p-2 mt-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Subject</label>
        <input
          name="subject"
          type="text"
          value={formData.subject}
          onChange={onChange}
          placeholder="Subject"
          className="w-full border rounded-lg p-2 mt-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          rows={5}
          value={formData.message}
          onChange={onChange}
          placeholder="Your message..."
          className="w-full border rounded-lg p-2 mt-1"
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
