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
  });
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
    });
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
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (form.base < 1000) return toast.error("Base salary must be at least 1000");
      if (!form.userId) return toast.error("User is required");

      const payload = {
        userId: form.userId,
        baseSalary: form.base,
        bonus: form.bonus,
        isBonusRecurring: form.isBonusRecurring,
        bonusEndMonth: form.bonusEndMonth,
        currency: form.currency,
        month: form.month,
        remarks: form.remarks,
      };

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

  const filteredSalaries = salaries.filter((s) =>
    s.userId?.name?.toLowerCase().includes(search.toLowerCase())
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
            "Base",
            "Bonus",
            "Recurring",
            "Bonus End",
            "Unpaid Leaves",
            "Final Amount",
            "Month",
            "Currency",
            "Remarks",
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
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-indigo-600"
                onClick={() => openEditModal(s)}
                title="Edit"
              >
                <FaEdit />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-green-600"
                onClick={() => handleSendSlip(s._id)}
                title="Send Slip"
              >
                <FaPaperPlane />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-red-600"
                onClick={() => handleDelete(s._id)}
                title="Delete"
              >
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
            <div className="space-y-4">
              {mode === "add" && (
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
              )}
              <label className="block text-sm font-medium">Base Salary</label>

              <input type="number" placeholder="Base Salary" value={form.base} onChange={(e) => setForm({ ...form, base: Number(e.target.value) })} className="w-full border rounded px-3 py-2 mt-1" />
              <label className="block text-sm font-medium">Bonus</label>

              <input type="number" placeholder="Bonus" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })} className="w-full border rounded px-3 py-2 mt-1" />
              <select value={form.isBonusRecurring} onChange={(e) => setForm({ ...form, isBonusRecurring: e.target.value === 'true' })} className="w-full border rounded px-3 py-2 mt-1">
                <option value="false">One-time Bonus</option>
                <option value="true">Recurring Bonus</option>
              </select>
              {form.isBonusRecurring && <input type="month" value={form.bonusEndMonth} onChange={(e) => setForm({ ...form, bonusEndMonth: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" placeholder="Bonus End Month" />}
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full border rounded px-3 py-2 mt-1">
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
              <input type="month" placeholder="Month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" />
              <textarea placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={2} className="w-full border rounded px-3 py-2 mt-1" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries;
