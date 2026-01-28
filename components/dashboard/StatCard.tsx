import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}% ce mois
            </p>
          )}
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={iconColor} size={28} />
        </div>
      </div>
    </div>
  );
}
