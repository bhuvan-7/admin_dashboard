import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#1E3A8A", "#3B82F6", "#60A5FA"];

const ActiveUsersChart = ({ stats, loading, error }) => {
  const chartData =
    stats && !loading && !error
      ? [
          { name: "Students", value: stats.total_students ?? 0, color: COLORS[0] },
          { name: "Teachers", value: stats.total_teachers ?? 0, color: COLORS[1] },
          { name: "Parents", value: stats.total_parents ?? 0, color: COLORS[2] },
        ]
      : [
          { name: "Students", value: 0, color: COLORS[0] },
          { name: "Teachers", value: 0, color: COLORS[1] },
          { name: "Parents", value: 0, color: COLORS[2] },
        ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Users by role</h3>
          <p className="text-sm text-muted-foreground mt-1">Counts from the same source as dashboard stats</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading chart: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {chartData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                <p className="text-xs text-muted-foreground">{item.name}</p>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default ActiveUsersChart;
