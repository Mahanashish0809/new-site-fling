import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, CheckCircle, Zap, Twitter, Linkedin, Github, X } from "lucide-react";
import { useModal } from '../contexts/ModalContext';

// 1. Define an interface for the form's state
interface FormDataState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactModal: React.FC = () => {
  const { isContactModalOpen, closeContactModal } = useModal(); 
  
  // 2. Define the initial state and type it
  const initialState: FormDataState = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  
  const [formData, setFormData] = useState<FormDataState>(initialState);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        closeContactModal();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [showSuccess, closeContactModal]);

  // 3. Type the event for input/textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Type the event for form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    setShowSuccess(true);
    setFormData(initialState);
  };

  const handleClear = () => {
    setFormData(initialState);
  };

  if (!isContactModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      
      {/* Background glowing spheres */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-7xl bg-slate-800/50 backdrop-blur-lg border border-slate-700 shadow-2xl rounded-3xl p-12 flex flex-col gap-10 z-10 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={closeContactModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
          aria-label="Close contact form"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-400 mt-3 text-lg">
            We’d love to hear from you. Let’s connect!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          <div className="w-full md:w-2/5 flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-white">Get in Touch</h2>
            <p className="text-gray-400 leading-relaxed">
              Fill out the form or reach us directly. Our team is ready to assist with any questions you may have.
            </p>
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4 text-gray-300">
                <Mail className="text-orange-500 w-6 h-6 flex-shrink-0" />
                <p>support@joltq.com</p>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <Phone className="text-orange-500 w-6 h-6 flex-shrink-0" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <MapPin className="text-orange-500 w-6 h-6 flex-shrink-0" />
                <p>123 Innovation Drive, Tech City</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086715151723!2d-122.4194156846814!3d37.77492977975933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e4f0f7e3%3A0xe8c3aaf7aef0e7ea!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1616440147376!5m2!1sen!2sus"
                width="100%"
                height="200"
                loading="lazy"
                className="filter invert(1) hue-rotate(180deg) contrast(0.9)"
              ></iframe>
            </div>
          </div>

          {/* Right panel container */}
          <div className="flex-1 bg-slate-800/60 border border-slate-700 rounded-2xl p-8 flex gap-8 relative">
             <div className={`absolute inset-0 bg-slate-800/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 rounded-2xl ${showSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
                    <h3 className="mt-4 text-2xl font-medium text-white">Message Sent!</h3>
                    <p className="mt-2 text-gray-300">Thank you for reaching out.</p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit} // Type checked!
                className="flex-grow flex flex-col gap-5"
            >
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your Name"
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" required />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" required />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input name="subject" type="text" value={formData.subject} onChange={handleChange} placeholder="How can we help?"
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" required />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Your message..."
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none" required />
                </div>
                <div className="flex justify-end gap-4 mt-auto pt-4">
                <button type="button" onClick={handleClear}
                    className="px-6 py-3 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors duration-200 font-semibold" > Clear </button>
                <button type="submit"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-orange-500/20" > Send Message </button>
                </div>
            </form>

            <div className="flex flex-col items-center justify-center gap-8 border-l border-slate-700 pl-8">
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter className="w-6 h-6" /></a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin className="w-6 h-6" /></a>
                <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-orange-500 transition-colors"><Github className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;