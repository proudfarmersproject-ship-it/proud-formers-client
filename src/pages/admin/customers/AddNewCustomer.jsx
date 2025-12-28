// src/pages/admin/customers/AddCustomer.jsx
import { useState } from "react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { useAdminCustomerStore } from "../../../store/admin/AdminCustomerStore";
import StatusModal from "../../../components/admin/StatusModal";

const wrapperData = {
  title: "Add Customer",
  description: "Create a new customer account",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Customers", to: "/admin/customers" },
    { label: "New Customer", to: "/admin/customers/new" },
  ],
};

export default function AddCustomer() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "customer",
    password: "",
    address: {
      address_line1: "",
      address_line2: "",
      city: "",
      pincode: "",
    },
  });
  const [errors, setErrors] = useState({});
  const { addCustomer, successMessage, loading, error, clearStatus } =
    useAdminCustomerStore();

  const update = (k, v) => {
    setForm({ ...form, [k]: v });
    // Clear the error for this field as the user types
    if (errors[k]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[k];
        return newErrors;
      });
    }
  };
  const updateAddress = (k, v) =>
    setForm({ ...form, address: { ...form.address, [k]: v } });

  const validateForm = (form) => {
    const errors = {};

    // First Name
    if (!form.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (form.first_name.trim().length < 2) {
      errors.first_name = "First name must be at least 2 characters";
    }

    // Email
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    // Phone (India - 10 digits)
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }

    // Password
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password)
    ) {
      errors.password =
        "Password must include uppercase, lowercase, number & special character";
    }

    return errors;
  };
  const convertToDbStructure = (formData) => {
    return {
      id: "USR" + Date.now(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      // Note: DB uses password_hash, but typically we send 'password' to the API
      password: formData.password,
      // Convert single address object into the addresses array
      addresses: [
        {
          id: "AD" + Date.now(),
          full_name: `${formData.first_name} ${formData.last_name}`,
          phone: formData.phone,
          email: formData.email,
          address_line1: formData.address.address_line1,
          address_line2: formData.address.address_line2,
          city: formData.address.city,
          pincode: formData.address.pincode,
          is_default: true, // Defaulting to true for the first address
        },
      ],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Optional: Scroll to the first error
      //  window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const dbData = convertToDbStructure(form);

    try {
      await addCustomer(dbData);
      // Check for success - Assuming your store returns a success indicator
      if (!error) {
        handleReset();
      }
    } catch (err) {
      console.error("Critical Error:", err);
    }

    console.log("Create customer payload", form);
  };
  const handleReset = () => {
    setErrors({});
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "customer",
      password: "",
      address: {
        address_line1: "",
        address_line2: "",
        city: "",
        pincode: "",
      },
    });
    console.log("Form Data is Reset");
  };
  return (
    <>
      {/* Optimized Status Modal */}
      {(successMessage || error) && (
        <StatusModal
          key={successMessage ? `success-${Date.now()}` : `error-${Date.now()}`}
          message={successMessage || error}
          type={successMessage ? "success" : "error"}
          onClose={clearStatus}
        />
      )}
      <AdminHeaderWrapper {...wrapperData} />
      <div className="bg-white p-6 rounded-2xl shadow max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name *"
                name="first_name"
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none ${
                  errors.first_name
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name}</p>
              )}
            </div>

            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            />
            <div>
              <input
                type="email"
                placeholder="Email *"
                name="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone *"
                value={form.phone}
                name="phone"
                autoComplete="tel"
                onChange={(e) => update("phone", e.target.value)}
                className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none ${
                  errors.phone
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password *"
                autoComplete="new-password"
                name="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={`p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <select
              value={form.role}
              name="role"
              onChange={(e) => update("role", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold">Address</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Address Line 1"
              value={form.address.address_line1}
              name="address_line1"
              onChange={(e) => updateAddress("address_line1", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={form.address.address_line2}
              name="address_line2"
              onChange={(e) => updateAddress("address_line2", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={form.address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            />
            <input
              type="number"
              placeholder="Pincode"
              name="pincode"
              value={form.address.pincode}
              onChange={(e) => updateAddress("pincode", e.target.value)}
              className="p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            />
          </div>

          {/* <button className="bg-primary text-white px-6 py-3 rounded-xl">
            Save Customer
          </button> */}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200
    ${
      loading
        ? "bg-primary/50 text-white/90 animate-pulse cursor-wait"
        : "bg-primary hover:bg-primary-dark text-white active:scale-95"
    }`}
          >
            {loading ? "Adding Customer..." : "Save Customer"}
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 ml-2 px-6 py-3 rounded-xl transition-colors"
          >
            Reset
          </button>
        </form>
      </div>
    </>
  );
}
