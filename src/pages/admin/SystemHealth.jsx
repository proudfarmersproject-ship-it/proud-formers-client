import { useEffect, useState } from "react";
// import { supabase } from '../lib/supabase';
import {
  Activity,
  Database,
  Server,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function SystemHealth() {
  const [healthData, setHealthData] = useState({
    database: { status: "checking", responseTime: 0 },
    tables: [],
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  async function checkSystemHealth() {
    const startTime = Date.now();

    try {
      const tableNames = [
        "customers",
        "products",
        "categories",
        "orders",
        "order_items",
        "cart_items",
        "promotions",
        "coupons",
        "addresses",
      ];

      const tableStats = await Promise
        .all
        // tableNames.map(async (tableName) => {
        //   try {
        //     const { count, error } = await supabase
        //       .from(tableName)
        //       .select('*', { count: 'exact', head: true });

        //     return {
        //       name: tableName,
        //       count: error ? 0 : count || 0,
        //       status: error ? 'error' : 'healthy',
        //       error: error?.message,
        //     };
        //   } catch (err) {
        //     return {
        //       name: tableName,
        //       count: 0,
        //       status: 'error',
        //       error: err.message,
        //     };
        //   }
        // })
        ();

      const responseTime = Date.now() - startTime;
      const totalRecords = tableStats.reduce(
        (sum, table) => sum + table.count,
        0
      );
      const hasErrors = tableStats.some((table) => table.status === "error");

      setHealthData({
        database: {
          status: hasErrors ? "warning" : "healthy",
          responseTime,
        },
        tables: tableStats,
        totalRecords,
      });
    } catch (error) {
      console.error("Error checking system health:", error);
      setHealthData({
        database: {
          status: "error",
          responseTime: Date.now() - startTime,
        },
        tables: [],
        totalRecords: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="text-green-600" size={20} />;
      case "warning":
      case "error":
        return <AlertTriangle className="text-red-600" size={20} />;
      default:
        return <Activity className="text-gray-600" size={20} />;
    }
  };

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
        <h1 className="text-3xl font-bold text-text-heading mb-2">
          System Health
        </h1>
        <p className="text-text-muted">
          Monitor your system performance and database status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Database className="text-white" size={24} />
            </div>
            {getStatusIcon(healthData.database.status)}
          </div>
          <h3 className="text-text-muted text-sm mb-1">Database Status</h3>
          <p className="text-2xl font-bold text-text-heading capitalize">
            {healthData.database.status}
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-text-muted text-sm mb-1">Response Time</h3>
          <p className="text-2xl font-bold text-text-heading">
            {healthData.database.responseTime}ms
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <HardDrive className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-text-muted text-sm mb-1">Total Records</h3>
          <p className="text-2xl font-bold text-text-heading">
            {healthData.totalRecords.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Server className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-text-muted text-sm mb-1">Total Tables</h3>
          <p className="text-2xl font-bold text-text-heading">
            {healthData.tables.length}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading">
            Database Tables
          </h2>
          <button
            onClick={checkSystemHealth}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Activity size={18} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthData.tables.map((table) => (
            <div
              key={table.name}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-heading capitalize">
                  {table.name.replace(/_/g, " ")}
                </h3>
                {getStatusIcon(table.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-sm">Records</span>
                <span className="text-lg font-bold text-primary">
                  {table.count.toLocaleString()}
                </span>
              </div>
              {table.error && (
                <p className="mt-2 text-xs text-red-600">{table.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-text-heading mb-4">
          System Information
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-text-muted">Environment</span>
            <span className="font-medium text-text-heading">Production</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-text-muted">Database Provider</span>
            <span className="font-medium text-text-heading">Supabase</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-text-muted">Last Health Check</span>
            <span className="font-medium text-text-heading">
              {new Date().toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-text-muted">Auto Refresh</span>
            <span className="font-medium text-text-heading">
              Every 30 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
