// src/pages/admin/coupons/CouponDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import {
  fetchCouponById,
  //   deleteCouponById,
} from "../../../utils/admin/coupons";

export default function CouponDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [coupon, setCoupon] = useState(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "",
    discount_value: "",
    min_order_value: "",
    max_discount: "",
    usage_limit: "",
    per_user_limit: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  /* ---------------- LOAD COUPON ---------------- */
  useEffect(() => {
    fetchCouponById(id)
      .then((data) => {
        setCoupon(data);
        setForm({
          code: data.code,
          description: data.description,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_order_value: data.min_order_value ?? "",
          max_discount: data.max_discount ?? "",
          usage_limit: data.usage_limit ?? "",
          per_user_limit: data.per_user_limit,
          start_date: data.start_date,
          end_date: data.end_date,
          is_active: data.is_active,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------------- ACTIONS ---------------- */
  const handleSave = () => {
    console.log("Updated coupon payload:", form);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!confirm("Delete this coupon?")) return;
    // deleteCouponById(id);
    navigate("/admin/coupons");
  };

  if (loading) return <div className="p-6">Loading coupon...</div>;
  if (!coupon) return <div className="p-6 text-red-600">Coupon not found</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <AdminHeaderWrapper
          title={`Coupon #${coupon.code}`}
          description="View / Edit coupon details"
          breadcrumb={[
            { label: "Coupons", to: "/admin/coupons" },
            { label: coupon.code },
          ]}
        />

        <div className="flex gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="border bg-primary-light text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          )}

          <button
            onClick={handleDelete}
            className="border border-red-500 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Coupon Code"
            value={form.code}
            editMode={editMode}
            onChange={(v) => update("code", v)}
          />

          <Field
            label="Status"
            value={form.is_active ? "Active" : "Inactive"}
            editMode={editMode}
            type="select"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            onChange={(v) => update("is_active", v === "true")}
          />

          <Field
            label="Description"
            value={form.description}
            editMode={editMode}
            onChange={(v) => update("description", v)}
            full
          />
        </div>
      </div>

      {/* DISCOUNT INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Discount Details</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <ReadOnly label="Type" value={form.discount_type} />
          <ReadOnly label="Value" value={form.discount_value} />
          {form.discount_type === "PERCENTAGE" && (
            <ReadOnly label="Max Discount" value={form.max_discount || "—"} />
          )}
        </div>
      </div>

      {/* USAGE INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Usage Rules</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <ReadOnly
            label="Min Order Value"
            value={form.min_order_value || "—"}
          />
          <ReadOnly label="Usage Limit" value={form.usage_limit || "∞"} />
          <ReadOnly label="Per User Limit" value={form.per_user_limit} />
        </div>
      </div>

      {/* VALIDITY */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Validity Period</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <ReadOnly label="Start Date" value={form.start_date} />
          <ReadOnly label="End Date" value={form.end_date} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL HELPERS ---------------- */

function Field({
  label,
  value,
  editMode,
  onChange,
  type = "text",
  options = [],
  full = false,
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm text-gray-500">{label}</label>
      {editMode ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full p-3 border-2 rounded-xl"
          >
            {options.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full p-3 border-2 rounded-xl"
          />
        )
      ) : (
        <p className="mt-2 font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <p className="mt-2 font-medium">{value || "-"}</p>
    </div>
  );
}
