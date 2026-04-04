/**
 * Admin Pricing Management
 * 
 * CRUD for pricing_config table
 * - Zoom Rental pricing
 * - Operator packages
 * - Add-on pricing
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { Pencil, Trash2, Plus, DollarSign, Users, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminPricingPage() {
  await requireRole(["admin", "super_admin"]);

  // Fetch all pricing configs
  const pricing = await pool.query(
    `SELECT * FROM pricing_config ORDER BY service_type, sort_order`
  );

  // Group by service type
  const grouped = pricing.rows.reduce((acc, row) => {
    if (!acc[row.service_type]) acc[row.service_type] = [];
    acc[row.service_type].push(row);
    return acc;
  }, {});

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      zoom_rental: "Zoom Rental",
      operator: "Operator Packages",
      mc: "MC Services",
      addon: "Add-ons",
    };
    return labels[type] || type;
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "zoom_rental":
        return <Users className="w-5 h-5" />;
      case "operator":
        return <Clock className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
            Pricing Management 💰
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage pricing for Zoom rentals, operator packages, and add-ons.
          </p>
        </div>
        <Link href="/admin/pricing/new">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            Add Pricing
          </button>
        </Link>
      </div>

      {/* Pricing Groups */}
      {Object.entries(grouped).map(([serviceType, items]: [string, any]) => (
        <div key={serviceType} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Group Header */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {getServiceTypeIcon(serviceType)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {getServiceTypeLabel(serviceType)}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {items.length} items
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                      {formatCurrency(item.base_price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {item.discount_price ? formatCurrency(item.discount_price) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {item.capacity ? `${item.capacity}P` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.is_active
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/pricing/${item.id}/edit`}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
