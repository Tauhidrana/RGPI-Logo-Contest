"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

type Stats = {
  byStatus: Record<string, number>;
  byDepartment: { name: string; count: number }[];
  byDay: { date: string; count: number }[];
};

const PIE_COLORS = ["#337df5", "#f59e0b", "#8b5cf6", "#2b9855", "#ef4444"];

export default function Charts({ stats, lang }: { stats: Stats; lang: "bn" | "en" }) {
  const deps = stats.byDepartment.filter((d) => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 8);
  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));

  return (
    <>
      <div className="relative col-span-full h-64 lg:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-extrabold">{lang === "bn" ? "দৈনিক সাবমিশন" : "Submissions per day"}</h3>
          <Badge variant="blue"><TrendingUp className="mr-1 h-3 w-3" />{lang === "bn" ? "ট্রেন্ড" : "Trend"}</Badge>
        </div>
        <div className="h-56">
          {stats.byDay.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.byDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#337df5" stopOpacity={0.4} /><stop offset="100%" stopColor="#337df5" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#1e5fdb" strokeWidth={2.5} fill="url(#area)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
        </div>
      </div>

      <div className="col-span-full h-64 lg:col-span-1">
        <h3 className="mb-2 font-extrabold">{lang === "bn" ? "অবস্থা" : "Status"}</h3>
        <div className="h-56">
          {statusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={3}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
        </div>
      </div>

      <div className="col-span-full h-72 lg:col-span-2">
        <h3 className="mb-2 font-extrabold">{lang === "bn" ? "বিভাগভিত্তিক সাবমিশন" : "Submissions by department"}</h3>
        <div className="h-64">
          {deps.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deps} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="count" fill="#2b9855" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState title={lang === "bn" ? "এখনো ডাটা নেই" : "No data yet"} />}
        </div>
      </div>
    </>
  );
}
