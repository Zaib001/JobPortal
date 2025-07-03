import { useState, useEffect } from "react";
import Table from "../../../components/Table";
import {
  FaEdit,
  FaDownload,
  FaFilePdf,
  FaTrash,
  FaPaperPlane,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchSalaries,
  updateSalary,
  addSalary,
  deleteSalary,
  exportCSV,
  exportPDF,
  sendSalarySlip,
} from "../../../api/adminSalary";
import API from "../../../api/api";

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    base: 0,
    bonus: 0,
    isBonusRecurring: false,
    bonusEndMonth: "",
    currency: "USD",
    month: "",
    remarks: "",
    mode: "month",
    customFields: {},
    payType: "fixed",
    payTypeEffectiveDate: "",
    fixedPhaseDuration: "",
    vendorBillRate: "",
    candidateShare: "",
    bonusAmount: "",
    bonusType: "one-time",
    bonusFrequency: "monthly",
    bonusStartDate: "",
    bonusEndDate: "",
    enablePTO: false,
    ptoType: "monthly",
    ptoDaysAllocated: "",
    previewMonth: "",
  });
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("add");

  useEffect(() => {
    loadSalaries();
  }, []);

  const loadSalaries = async () => {
    try {
      setLoading(true);
      const data = await fetchSalaries();
      setSalaries(data || []);
    } catch {
      toast.error("Failed to fetch salaries.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const openAddModal = async () => {
    setMode("add");
    setForm({
      userId: "",
      base: 0,
      bonus: 0,
      isBonusRecurring: false,
      bonusEndMonth: "",
      currency: "USD",
      month: "",
      remarks: "",
      mode: "month",
      customFields: {},
      payType: "fixed",
      payTypeEffectiveDate: "",
      fixedPhaseDuration: "",
      vendorBillRate: "",
      candidateShare: "",
      bonusAmount: "",
      bonusType: "one-time",
      bonusFrequency: "monthly",
      bonusStartDate: "",
      bonusEndDate: "",
      enablePTO: false,
      ptoType: "monthly",
      ptoDaysAllocated: "",
      previewMonth: "",
    });
    setNewField({ key: "", value: "" });
    await fetchUsers();
    setIsModalOpen(true);
  };

  const openEditModal = (salary) => {
    setMode("edit");
    setSelectedSalary(salary);
    setForm({
      userId: salary.userId?._id || "",
      base: salary.baseSalary,
      bonus: salary.bonus,
      isBonusRecurring: salary.isBonusRecurring,
      bonusEndMonth: salary.bonusEndMonth || "",
      currency: salary.currency,
      month: salary.month,
      remarks: salary.remarks || "",
      mode: "month",
      customFields: salary.customFields || {},
      payType: salary.payType || "fixed",
      payTypeEffectiveDate: salary.payTypeEffectiveDate || "",
      fixedPhaseDuration: salary.fixedPhaseDuration || "",
      vendorBillRate: salary.vendorBillRate || "",
      candidateShare: salary.candidateShare || "",
      bonusAmount: salary.bonusAmount || "",
      bonusType: salary.bonusType || "one-time",
      bonusFrequency: salary.bonusFrequency || "monthly",
      bonusStartDate: salary.bonusStartDate || "",
      bonusEndDate: salary.bonusEndDate || "",
      enablePTO: salary.enablePTO || false,
      ptoType: salary.ptoType || "monthly",
      ptoDaysAllocated: salary.ptoDaysAllocated || "",
      previewMonth: salary.previewMonth || "",
    });
    setNewField({ key: "", value: "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!form.userId) return toast.error("User is required.");
    if (!form.base || form.base < 1000) return toast.error("Base salary must be at least 1000.");
    if (!form.month) return toast.error("Month is required.");

    // Prepare payload
    const payload = {
      userId: form.userId,
      baseSalary: form.base,
      bonus: form.bonus,
      isBonusRecurring: form.isBonusRecurring,
      bonusEndMonth: form.bonusEndMonth,
      currency: form.currency,
      month: form.month,
      remarks: form.remarks,
      mode: form.mode,
      customFields: form.customFields,
      payType: form.payType,
      payTypeEffectiveDate: form.payTypeEffectiveDate,
      fixedPhaseDuration: form.fixedPhaseDuration,
      vendorBillRate: form.vendorBillRate,
      candidateShare: form.candidateShare,
      bonusAmount: form.bonusAmount,
      bonusType: form.bonusType,
      bonusFrequency: form.bonusFrequency,
      bonusStartDate: form.bonusStartDate,
      bonusEndDate: form.bonusEndDate,
      enablePTO: form.enablePTO,
      ptoType: form.ptoType,
      ptoDaysAllocated: form.ptoDaysAllocated,
      previewMonth: form.previewMonth,
    };

    try {
      if (mode === "edit") {
        await updateSalary(selectedSalary._id, payload);
        toast.success("Salary updated");
      } else {
        await addSalary(payload);
        toast.success("Salary added");
      }

      setIsModalOpen(false);
      loadSalaries();
    } catch (err) {
      console.log(err);
      toast.error(mode === "edit" ? "Update failed" : "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;
    try {
      await deleteSalary(id);
      toast.success("Salary deleted");
      loadSalaries();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSendSlip = async (id) => {
    try {
      await sendSalarySlip(id);
      toast.success("Salary slip sent");
    } catch {
      toast.error("Failed to send slip");
    }
  };

  const addCustomField = () => {
    if (!newField.key.trim()) return;
    setForm((prev) => ({
      ...prev,
      customFields: { ...prev.customFields, [newField.key]: newField.value }
    }));
    setNewField({ key: "", value: "" });
  };

  const filteredSalaries = salaries.filter((s) =>
    s.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const customKeys = Array.from(
    new Set(salaries.flatMap((s) => s.customFields ? Object.keys(s.customFields) : []))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Salary Configuration</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search recruiter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            <FaDownload /> CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            <FaFilePdf /> PDF
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            <FaPlus /> Add Salary
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          headers={[
            "Recruiter",
            "Email",
            "Base Salary",
            "Bonus",
            "Recurring Bonus",
            "Bonus End Month",
            "Unpaid Leaves",
            "Final Amount",
            "Month",
            "Currency",
            "Remarks",
            "Pay Type",
            "Effective From",
            "Fixed Phase Duration",
            "Vendor Bill Rate",
            "Candidate Share",
            "Bonus Amount",
            "Bonus Type",
            "Bonus Frequency",
            "Bonus Start Date",
            "Bonus End Date",
            "Enable PTO",
            "PTO Type",
            "PTO Days Allocated",
            "Preview Month",
            ...customKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1)), // Custom headers
            "Actions",
          ]}
          rows={filteredSalaries.map((s) => [
            s.userId?.name || "N/A",
            s.userId?.email || "N/A",
            `${s.currency} ${(s.baseSalary || 0).toFixed(2)}`,
            `${s.currency} ${(s.bonus || 0).toFixed(2)}`,
            s.isBonusRecurring ? "Yes" : "No",
            s.bonusEndMonth || "-",
            s.unpaidLeaveDays || 0,
            `${s.currency} ${(s.finalAmount || 0).toFixed(2)}`,
            s.month,
            s.currency,
            s.remarks,
            s.payType || "N/A",
            s.payTypeEffectiveDate || "N/A",
            s.fixedPhaseDuration || "N/A",
            s.vendorBillRate || "N/A",
            s.candidateShare || "N/A",
            s.bonusAmount || "N/A",
            s.bonusType || "N/A",
            s.bonusFrequency || "N/A",
            s.bonusStartDate || "N/A",
            s.bonusEndDate || "N/A",
            s.enablePTO ? "Yes" : "No",
            s.ptoType || "N/A",
            s.ptoDaysAllocated || "N/A",
            s.previewMonth || "N/A",
            ...customKeys.map((key) => s.customFields?.[key] || "-"), // Custom field values
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.05 }} className="text-indigo-600" onClick={() => openEditModal(s)} title="Edit">
                <FaEdit />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="text-green-600" onClick={() => handleSendSlip(s._id)} title="Send Slip">
                <FaPaperPlane />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="text-red-600" onClick={() => handleDelete(s._id)} title="Delete">
                <FaTrash />
              </motion.button>
            </div>,
          ])}
        />

      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{mode === "edit" ? "Edit Salary" : "Add Salary"}</h3>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Select User */}
              <div>
                <label className="block text-sm font-medium">Select User</label>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                >
                  <option value="">Select recruiter</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Salary */}
              <label className="block text-sm font-medium">Base Salary</label>
              <input
                type="number"
                placeholder="Base Salary"
                value={form.base || ""}
                onChange={(e) => setForm({ ...form, base: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Bonus */}
              <label className="block text-sm font-medium">Bonus</label>
              <input
                type="number"
                placeholder="Bonus"
                value={form.bonus || ""}
                onChange={(e) => setForm({ ...form, bonus: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Recurring Bonus */}
              <label className="block text-sm font-medium">Is Bonus Recurring</label>
              <input
                type="checkbox"
                checked={form.isBonusRecurring}
                onChange={(e) => setForm({ ...form, isBonusRecurring: e.target.checked })}
                className="mt-1"
              />

              {/* Bonus End Month */}
              <label className="block text-sm font-medium">Bonus End Month</label>
              <input
                type="month"
                value={form.bonusEndMonth || ""}
                onChange={(e) => setForm({ ...form, bonusEndMonth: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Currency */}
              <label className="block text-sm font-medium">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                {/* Add other currencies here */}
              </select>

              {/* Month */}
              <label className="block text-sm font-medium">Month</label>
              <input
                type="month"
                value={form.month || ""}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Remarks */}
              <label className="block text-sm font-medium">Remarks</label>
              <textarea
                value={form.remarks || ""}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Pay Type */}
              <label className="block text-sm font-medium">Pay Type</label>
              <div className="flex gap-4">
                <div>
                  <input
                    type="radio"
                    id="fixed"
                    name="payType"
                    value="fixed"
                    checked={form.payType === "fixed"}
                    onChange={(e) => setForm({ ...form, payType: e.target.value })}
                  />
                  <label htmlFor="fixed">Fixed</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="percentage"
                    name="payType"
                    value="percentage"
                    checked={form.payType === "percentage"}
                    onChange={(e) => setForm({ ...form, payType: e.target.value })}
                  />
                  <label htmlFor="percentage">Percentage</label>
                </div>
              </div>

              {/* Pay Type Effective Date */}
              {form.payType === "percentage" && (
                <>
                  <label className="block text-sm font-medium">Pay Type Effective Date</label>
                  <input
                    type="date"
                    value={form.payTypeEffectiveDate || ""}
                    onChange={(e) => setForm({ ...form, payTypeEffectiveDate: e.target.value })}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                  <label className="block text-sm font-medium">Fixed Phase Duration (Months)</label>
                  <input
                    type="number"
                    placeholder="Duration in months"
                    value={form.fixedPhaseDuration || ""}
                    onChange={(e) => setForm({ ...form, fixedPhaseDuration: e.target.value })}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </>
              )}

              {/* Vendor Bill Rate */}
              <label className="block text-sm font-medium">Vendor Bill Rate</label>
              <input
                type="number"
                placeholder="Vendor Bill Rate"
                value={form.vendorBillRate || ""}
                onChange={(e) => setForm({ ...form, vendorBillRate: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Candidate Share */}
              <label className="block text-sm font-medium">Candidate Share</label>
              <input
                type="number"
                placeholder="Candidate Share"
                value={form.candidateShare || ""}
                onChange={(e) => setForm({ ...form, candidateShare: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Bonus Amount */}
              <label className="block text-sm font-medium">Bonus Amount</label>
              <input
                type="number"
                placeholder="Bonus Amount"
                value={form.bonusAmount || ""}
                onChange={(e) => setForm({ ...form, bonusAmount: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Bonus Type */}
              <label className="block text-sm font-medium">Bonus Type</label>
              <select
                value={form.bonusType}
                onChange={(e) => setForm({ ...form, bonusType: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>

              {/* Bonus Frequency */}
              {form.bonusType === "recurring" && (
                <>
                  <label className="block text-sm font-medium">Bonus Frequency</label>
                  <select
                    value={form.bonusFrequency}
                    onChange={(e) => setForm({ ...form, bonusFrequency: e.target.value })}
                    className="w-full border rounded px-3 py-2 mt-1"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </>
              )}

              {/* Bonus Start Date */}
              <label className="block text-sm font-medium">Bonus Start Date</label>
              <input
                type="date"
                value={form.bonusStartDate || ""}
                onChange={(e) => setForm({ ...form, bonusStartDate: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Bonus End Date */}
              <label className="block text-sm font-medium">Bonus End Date</label>
              <input
                type="date"
                value={form.bonusEndDate || ""}
                onChange={(e) => setForm({ ...form, bonusEndDate: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* PTO Policy */}
              <label className="block text-sm font-medium">Enable PTO Policy</label>
              <input
                type="checkbox"
                checked={form.enablePTO}
                onChange={(e) => setForm({ ...form, enablePTO: e.target.checked })}
              />

              {/* PTO Type */}
              <label className="block text-sm font-medium">PTO Type</label>
              <select
                value={form.ptoType}
                onChange={(e) => setForm({ ...form, ptoType: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              {/* PTO Days Allocated */}
              <label className="block text-sm font-medium">PTO Days Allocated</label>
              <input
                type="number"
                value={form.ptoDaysAllocated || ""}
                onChange={(e) => setForm({ ...form, ptoDaysAllocated: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              {/* Future Salary Preview */}
              <label className="block text-sm font-medium">Future Salary Preview</label>
              <input
                type="month"
                value={form.previewMonth || ""}
                onChange={(e) => setForm({ ...form, previewMonth: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Salaries;
