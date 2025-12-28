import { useEffect, useState } from "react";
// import { supabase } from '../lib/supabase';
import { Search, Eye, X } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    // try {
    //   const { data, error } = await supabase
    //     .from("orders")
    //     .select(
    //       "*, customers(full_name, email), addresses(street, city, state)"
    //     )
    //     .order("created_at", { ascending: false });
    //   if (error) throw error;
    //   setOrders(data || []);
    // } catch (error) {
    //   console.error("Error fetching orders:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function fetchOrderItems(orderId) {
    // try {
    //   const { data, error } = await supabase
    //     .from("order_items")
    //     .select("*, products(name, image_url)")
    //     .eq("order_id", orderId);
    //   if (error) throw error;
    //   setOrderItems(data || []);
    // } catch (error) {
    //   console.error("Error fetching order items:", error);
    // }
  }

  async function updateOrderStatus(orderId, newStatus) {
    // try {
    //   const { error } = await supabase
    //     .from("orders")
    //     .update({ status: newStatus })
    //     .eq("id", orderId);
    //   if (error) throw error;
    //   fetchOrders();
    //   if (selectedOrder && selectedOrder.id === orderId) {
    //     setSelectedOrder({ ...selectedOrder, status: newStatus });
    //   }
    // } catch (error) {
    //   console.error("Error updating order status:", error);
    //   alert("Error updating order status. Please try again.");
    // }
  }

  async function openOrderDetails(order) {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customers?.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center h-64">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //       </div>
  //     );
  //   }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading mb-2">Orders</h1>
        <p className="text-text-muted">Manage and track customer orders</p>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Order #
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-muted-bg transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-primary">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {order.customers?.full_name || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )} border-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-heading">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-2 text-primary hover:bg-primary-light hover:text-white rounded transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                Order Details - {selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-text-muted hover:text-text-body"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-heading mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-text-body">
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedOrder.customers?.full_name || "N/A"}
                    </p>
                    <p className="text-text-body">
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedOrder.customers?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-heading mb-4">
                    Shipping Address
                  </h3>
                  {selectedOrder.addresses ? (
                    <div className="text-text-body">
                      <p>{selectedOrder.addresses.street}</p>
                      <p>
                        {selectedOrder.addresses.city},{" "}
                        {selectedOrder.addresses.state}
                      </p>
                    </div>
                  ) : (
                    <p className="text-text-muted">No shipping address</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-heading mb-4">
                  Order Status
                </h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateOrderStatus(selectedOrder.id, e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-heading mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {orderItems.length === 0 ? (
                    <p className="text-text-muted">No items in this order</p>
                  ) : (
                    orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products?.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-text-muted text-xs">
                            No Image
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-heading">
                            {item.products?.name || "Unknown Product"}
                          </h4>
                          <p className="text-text-muted text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-heading">
                            ${parseFloat(item.price).toFixed(2)}
                          </p>
                          <p className="text-text-muted text-sm">each</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-text-heading">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
