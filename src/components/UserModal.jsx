import { useState, useEffect } from "react";

const UserModal = ({ user, onClose, onSave, fields, labels }) => {
  const [form, setForm] = useState({});
  const [customFields, setCustomFields] = useState({});
  const [newFieldKey, setNewFieldKey] = useState("");

  useEffect(() => {
    if (user) {
      setForm(user);
      setCustomFields(user.customFields || {});
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (e) => {
    setCustomFields({ ...customFields, [e.target.name]: e.target.value });
  };

  const addCustomField = () => {
    const key = newFieldKey.trim();
    if (!key || customFields[key]) return;
    setCustomFields((prev) => ({ ...prev, [key]: "" }));
    setNewFieldKey("");
  };

  const removeCustomField = (key) => {
    const updated = { ...customFields };
    delete updated[key];
    setCustomFields(updated);
  };

  const handleSubmit = () => {
    const fullData = { ...form, customFields };
    onSave(fullData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold">{form?._id ? "Edit" : "Add"} Candidate</h2>

        {/* Standard Fields */}
        {fields.map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            value={form[field] || ""}
            onChange={handleChange}
            placeholder={labels?.[field] || field}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        ))}

        {/* Custom Fields */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Add custom field (e.g. LinkedIn)"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="button"
              onClick={addCustomField}
              className="px-3 py-2 bg-indigo-600 text-white rounded"
            >
              Add
            </button>
          </div>

          {Object.keys(customFields).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="text"
                name={key}
                value={customFields[key]}
                onChange={handleCustomChange}
                placeholder={key}
                className="w-full px-3 py-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeCustomField(key)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
