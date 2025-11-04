import React from "react";

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-8 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A2540]">⚙️ Account Settings</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center p-6">
        <div className="bg-white shadow-md rounded-xl w-full max-w-3xl p-8 space-y-10 border border-gray-100">
          {/* Account Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-[#0A2540] text-white px-6 py-2 rounded-md hover:bg-blue-900 transition">
                Update Info
              </button>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Security Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🔒 Password & Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-[#0A2540] text-white px-6 py-2 rounded-md hover:bg-blue-900 transition">
                Change Password
              </button>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Contact Info Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📞 Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 555-555-5555"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Email Address</label>
                <input
                  type="email"
                  placeholder="Enter new email address"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="bg-[#0A2540] text-white px-6 py-2 rounded-md hover:bg-blue-900 transition">
                Update Contact
              </button>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Save All */}
          <div className="flex justify-end">
            <button className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition">
              Save All Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;