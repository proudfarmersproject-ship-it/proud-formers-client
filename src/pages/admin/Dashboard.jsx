import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Dashboard() {
  console.log("Dash Board file is loaded");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // try {
    //   const [productsRes, customersRes, ordersRes, recentOrdersRes] =
    //     await Promise.all([
    //       supabase
    //         .from("products")
    //         .select("id", { count: "exact", head: true }),
    //       supabase
    //         .from("customers")
    //         .select("id", { count: "exact", head: true }),
    //       supabase
    //         .from("orders")
    //         .select("id, total_amount", { count: "exact" }),
    //       supabase
    //         .from("orders")
    //         .select(
    //           "id, order_number, status, total_amount, created_at, customers(full_name)"
    //         )
    //         .order("created_at", { ascending: false })
    //         .limit(5),
    //     ]);
    //   const totalRevenue =
    //     ordersRes.data?.reduce(
    //       (sum, order) => sum + parseFloat(order.total_amount || 0),
    //       0
    //     ) || 0;
    //   setStats({
    //     totalProducts: productsRes.count || 0,
    //     totalCustomers: customersRes.count || 0,
    //     totalOrders: ordersRes.count || 0,
    //     totalRevenue: totalRevenue,
    //   });
    //   setRecentOrders(recentOrdersRes.data || []);
    // } catch (error) {
    //   console.error("Error fetching dashboard data:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      trend: "+12%",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-green-500",
      trend: "+8%",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-orange-500",
      trend: "+23%",
      isPositive: true,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-primary",
      trend: "+15%",
      isPositive: true,
    },
  ];

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

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading mb-2">
          Dashboard Overview
        </h1>
        <p className="text-text-muted">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-surface rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-text-muted text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-text-heading">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-text-heading mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Order Number
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-text-muted">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-heading">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
