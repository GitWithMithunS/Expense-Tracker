import React from "react";

const ContactUsForm = ({
  user,
  loading,
  priority,
  setPriority,
  handleSupportFormSubmit,
  setShowSupport,
}) => {
  return (
    <form className="space-y-4" onSubmit={handleSupportFormSubmit}>
      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">Your Name</label>
        <input
          type="text"
          name="name"
          defaultValue={user?.name || ""}
          className="w-full mt-1 px-3 py-2  border border-gray-300 rounded-lg bg-gray-50 focus:ring focus:ring-purple-300"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={user?.email || ""}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring focus:ring-purple-300"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Phone Number (optional)
        </label>
        <input
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring focus:ring-purple-300"
        />
      </div>

      {/* Issue Type + Priority Row */}
      <div className="flex justify-between w-full">
        {/* Issue Type */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Issue Type</label>
          <select
            name="issueType"
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring focus:ring-purple-300"
          >
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex-1 flex flex-col items-end">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <div className="flex flex-wrap gap-2 mt-1 justify-end">
            {["Low", "Medium", "High"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  priority === p
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          rows="4"
          placeholder="Describe your issue..."
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-purple-300"
        ></textarea>
      </div>


      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowSupport(false)}
          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
