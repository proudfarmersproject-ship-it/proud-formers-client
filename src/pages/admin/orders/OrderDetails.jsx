// ViewOrderDetails.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import {
  ordersData,
  orderItemsData,
  usersData,
  addressesData,
  productsData,
  productVariantsData,
  productImagesData,
} from "../../../utils/admin/dummyData";

export default function OrderDetails() {
  const { id } = useParams();
  const order = ordersData.find((o) => o.id === id);

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  const user = usersData.find((u) => u.id === order.user_id);
  const address = addressesData.find((a) => a.id === order.address_id);
  const items = orderItemsData.filter((i) => i.order_id === id);

  const [status, setStatus] = useState(order.order_status);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  //// handling the events
  const handleUpdateStatus = () => {
    console.log("handle Status Update");
  };

  return (
    <div className="space-y-6">
      <AdminHeaderWrapper
        title={`Order #${order.id}`}
        description="Complete order information"
        breadcrumb={[
          { label: "Orders", to: "/admin/orders" },
          { label: order.id },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order + Customer Card */}
          <div className="grid md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl shadow">
            <div>
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">
                Order ID: <b>{order.id}</b>
              </p>
              <p className="text-sm text-gray-600">
                Created At: {order.created_at}
              </p>
              <p className="mt-2 text-sm">
                Payment: <b>{order.payment_status}</b>
              </p>
              <p className="mt-2 text-sm">
                Stripe Id: <b>{order.stripe_payment_id}</b>
              </p>
            </div>

            <div className="bg-gray-200 border-gray-500 p-5 rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Customer</h3>
              <p>
                Full Name: {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-gray-600">Mail: {user.email}</p>
              <p className="text-sm text-gray-600">Phone :{user.phone}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold mb-2 text-blue-700">
                Shipping Address
              </h3>
              <p className="font-medium">{address.full_name}</p>
              <p className="text-sm">{address.address_line1}</p>
              {address.address_line2 && (
                <p className="text-sm">{address.address_line2}</p>
              )}
              <p className="text-sm">
                {address.city}, {address.state} - {address.pincode}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {items.map((i) => {
                const product = productsData.find((p) => p.id === i.product_id);
                const variant = productVariantsData.find(
                  (v) => v.id === i.product_variant_id
                );
                const image = productImagesData.find(
                  (img) => img.product_id === product.id && img.is_primary
                );

                return (
                  <div key={i.id} className="flex gap-4 border-b pb-4">
                    <img
                      src={
                        image?.image_path || "https://via.placeholder.com/80"
                      }
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {variant.variant_name} • SKU: {variant.sku}
                      </p>
                      <p className="text-sm">Qty: {i.quantity}</p>
                    </div>
                    <div className="font-medium">₹{i.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white p-5 rounded-2xl shadow space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white p-5 rounded-2xl shadow space-y-4">
          <h3 className="font-semibold">Order Tracking</h3>
          <p className="text-sm">
            Payment Status: <b>{order.payment_status}</b>
          </p>

          <div>
            <label className="text-sm font-medium">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl p-3 border-2 rounded-xl focus:ring-2 focus:ring-primary bg-white focus:outline-none border-[var(--color-border-color)]"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-xl cursor-pointer"
            type="button"
            onClick={handleUpdateStatus}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
