import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const ActiveUsersChart = () => {
  const [filterType, setFilterType] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [ageData, setAgeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with axios call
    // Example:
    // const fetchUsersData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get('/api/users/statistics');
    //     setRoleData(response.data.roles);
    //     setAgeData(response.data.ages);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUsersData();

    // Mock data for now
    setRoleData([
      { name: "Students", value: 10, color: "#1E3A8A" },
      { name: "Teachers", value: 5, color: "#3B82F6" },
      { name: "Parents", value: 2, color: "#60A5FA" },
    ]);

    setAgeData({
      Students: [
        { name: "5-10 years", value: 3, color: "#1E3A8A" },
        { name: "10-15 years", value: 5, color: "#3B82F6" },
        { name: "15-20 years", value: 2, color: "#60A5FA" },
      ],
      Teachers: [
        { name: "20-30 years", value: 2, color: "#1E3A8A" },
        { name: "30-40 years", value: 2, color: "#3B82F6" },
        { name: "40-50 years", value: 1, color: "#60A5FA" },
      ],
      Parents: [
        { name: "30-40 years", value: 1, color: "#1E3A8A" },
        { name: "40-50 years", value: 1, color: "#3B82F6" },
      ],
    });
  }, []);

  const currentData = selectedRole && filterType === "age" 
    ? ageData[selectedRole]
    : roleData;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Active Users Today</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedRole && filterType === "age" ? `${selectedRole} by Age` : "By Role"}
          </p>
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
          <div className="flex gap-2 mb-4">
            <Button
              variant={!selectedRole ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilterType("role");
                setSelectedRole(null);
              }}
            >
              By Role
            </Button>
            {roleData.map((role) => (
              <Button
                key={role.name}
                variant={selectedRole === role.name ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilterType("age");
                  setSelectedRole(role.name);
                }}
              >
                {role.name}
              </Button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {currentData.map((item) => (
              <div key={item.name} className="text-center">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: item.color }}
                />
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
