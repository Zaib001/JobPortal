import { useState, useEffect } from "react";
import Table from "../../../components/Table";
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  fetchTimesheets,
  addTimesheet,
  updateTimesheet,
  deleteTimesheet,
} from "../../../api/adminTimesheet";
import API from "../../../api/api";

// Fetch merged PDF for the given user and month
const fetchTimesheetPDF = (userId, month) => {
  return API.get(`/api/admin/timesheets/${userId}/${month}`, {
    responseType: "blob",
  }).then((res) => res.data);
};

const Timesheets = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user: "",
    submittedByRole: "recruiter",
    from: "",
    to: "",
    filename: "",
    hours: "",
    status: "pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    try {
      const data = await fetchTimesheets();
      setTimesheets(data || []);
    } catch {
      toast.error("Failed to fetch timesheets.");
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
      user: "",
      submittedByRole: "recruiter",
      from: "",
      to: "",
      filename: "",
      hours: "",
      status: "pending",
    });
    setSelectedId(null);
    await fetchUsers();
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setMode("edit");
    setSelectedId(t._id);
    setForm({
      user: t.user?._id || "",
      submittedByRole: t.submittedByRole,
      from: t.from?.substring(0, 10),
      to: t.to?.substring(0, 10),
      filename: t.filename || "",
      hours: t.hours || "",
      status: t.status || "pending",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };

      if (mode === "edit") {
        await updateTimesheet(selectedId, payload);
        toast.success("Timesheet updated");
      } else {
        await addTimesheet(payload);
        toast.success("Timesheet added");
      }

      setIsModalOpen(false);
      loadTimesheets();
    } catch (err) {
      console.log(err);
      toast.error(mode === "edit" ? "Update failed" : "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timesheet?")) return;
    try {
      await deleteTimesheet(id);
      toast.success("Timesheet deleted");
      loadTimesheets();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Generate and download PDF for a specific user and month
  const handleDownloadPDF = async (userId, month) => {
    try {
      const pdfBlob = await fetchTimesheetPDF(userId, month);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `timesheet-${userId}-${month}.pdf`;
      link.click();
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timesheets</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          <FaPlus /> Add Timesheet
        </button>
      </div>

      <Table
        headers={["User", "From", "To", "Hours", "Status", "Actions", "Download PDF"]}
        rows={timesheets.map((t) => [
          t.user?.name || "N/A",
          t.from?.slice(0, 10),
          t.to?.slice(0, 10),
          t.hours || "-",
          t.status,
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.05 }} className="text-indigo-600" onClick={() => openEditModal(t)}>
              <FaEdit />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="text-red-600" onClick={() => handleDelete(t._id)}>
              <FaTrash />
            </motion.button>
          </div>,
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-blue-600"
            onClick={() => handleDownloadPDF(t.user._id, t.from.slice(0, 7))}
          >
            <FaFilePdf /> Download PDF
          </motion.button>,
        ])}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{mode === "edit" ? "Edit" : "Add"} Timesheet</h3>
            <div className="space-y-4">
              <select
                className="w-full border rounded px-3 py-2"
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {/* Rest of the form fields */}
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

export default Timesheets;
