import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfoSidebar: React.FC = () => {
  return (
    <div className="w-1/3 bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Get in Touch
      </h2>

      <p className="text-gray-600">
        We'd love to hear from you! Fill out the form or reach us via the
        details below.
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Mail className="text-blue-600" />
        <p>support@example.com</p>
      </div>

      <div className="flex items-center gap-3">
        <Phone className="text-blue-600" />
        <p>+1 (234) 567-890</p>
      </div>

      <div className="flex items-center gap-3">
        <MapPin className="text-blue-600" />
        <p>123 Main St, San Francisco, CA</p>
      </div>

      <div className="mt-6">
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086715151723!2d-122.4194156846814!3d37.77492977975933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e48f0f7e3%3A0xe8c3aaf7aef0e7ea!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1616440147376!5m2!1sen!2sus"
          width="100%"
          height="200"
          loading="lazy"
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactInfoSidebar;
