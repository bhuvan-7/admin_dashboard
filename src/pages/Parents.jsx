import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, UserCircle } from "lucide-react";
import ParentDetailDialog from "@/components/ParentDetailDialog";

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setParents([
      {
        id: 1,
        name: "Rajesh Sharma",
        email: "rajesh.sharma@parent.com",
        phone: "9876543210",
        children: [{ name: "Aarav Sharma", class: "Class 1" }],
      },
      {
        id: 2,
        name: "Neha Patel",
        email: "neha.patel@parent.com",
        phone: "9876543211",
        children: [{ name: "Diya Patel", class: "Class 1" }],
      },
      {
        id: 3,
        name: "Suresh Kumar",
        email: "suresh.kumar@parent.com",
        phone: "9876543212",
        children: [{ name: "Arjun Kumar", class: "Class 2" }],
      },
      {
        id: 4,
        name: "Priya Singh",
        email: "priya.singh@parent.com",
        phone: "9876543213",
        children: [{ name: "Ananya Singh", class: "Class 2" }],
      },
      {
        id: 5,
        name: "Ramesh Reddy",
        email: "ramesh.reddy@parent.com",
        phone: "9876543214",
        children: [{ name: "Vihaan Reddy", class: "Class 3" }],
      },
      {
        id: 6,
        name: "Amit Gupta",
        email: "amit.gupta@parent.com",
        phone: "9876543215",
        children: [
          { name: "Ishaan Gupta", class: "Class 3" },
          { name: "Kavya Gupta", class: "Class 5" },
        ],
      },
    ]);
  }, []);

  const handleCardClick = (parent) => {
    setSelectedParent(parent);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parents</h1>
          <p className="text-muted-foreground mt-1">
            View and manage parent information
          </p>
        </div>

        {/* Total Parents Box */}
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-48 h-12">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wide text-primary/70">
                Total Parents
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">{parents.length}</p>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading parents...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading parents: {error}</p>
        </div>
      )}

      {/* Parent Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parents.map((parent) => (
            <Card
              key={parent.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(parent)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {parent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {parent.children.length} {parent.children.length === 1 ? "child" : "children"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{parent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{parent.phone}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Children</p>
                  <div className="space-y-1">
                    {parent.children.map((child, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{child.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {child.class}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ParentDetailDialog
        parent={selectedParent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
};

export default Parents;
