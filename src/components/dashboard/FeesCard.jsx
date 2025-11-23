import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeesCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [feesData, setFeesData] = useState({
    totalCollected: 150000,
    totalPending: 25000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with axios call
    // Example:
    // const fetchFeesData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get('/api/fees');
    //     setFeesData({
    //       totalCollected: response.data.collected,
    //       totalPending: response.data.pending,
    //     });
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchFeesData();
  }, []);

  const totalCollected = feesData.totalCollected;
  const totalPending = feesData.totalPending;
  const totalFees = totalCollected + totalPending;

  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Fees Collected</p>
          {loading ? (
            <p className="text-muted-foreground mt-2">Loading...</p>
          ) : error ? (
            <p className="text-destructive mt-2">Error loading data</p>
          ) : (
            <h3 className="text-3xl font-bold text-primary mt-2">₹{totalCollected.toLocaleString()}</h3>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      {expanded && !loading && !error && (
        <div className="space-y-4 pt-4 border-t border-border animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Collected</span>
            </div>
            <span className="text-lg font-bold text-success">₹{totalCollected.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <span className="text-lg font-bold text-warning">₹{totalPending.toLocaleString()}</span>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Expected</span>
              <span className="text-lg font-bold text-foreground">₹{totalFees.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(totalCollected / totalFees) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {((totalCollected / totalFees) * 100).toFixed(1)}% collected
          </p>
        </div>
      )}
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-primary"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? "Show Less" : "Show Details"}
      </Button>
    </Card>
  );
};

export default FeesCard;
