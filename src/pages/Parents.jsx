import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Users, UserCircle } from "lucide-react";
import ParentDetailDialog from "@/components/ParentDetailDialog";
import api from "@/lib/axios";

const Parents = () => {
  const [selectedParent, setSelectedParent] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: parentsRaw = [], isLoading: loading, isError, error } = useQuery({
    queryKey: ["admin", "parents"],
    queryFn: async () => {
      const { data } = await api.get("/admin/parents");
      return data;
    },
  });

  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Unknown error" : null;

  const parents = useMemo(
    () =>
      parentsRaw.map((p) => ({
        id: p.id,
        name: p.full_name,
        email: p.email || "—",
        phone: p.phone || "—",
        children: [],
      })),
    [parentsRaw],
  );

  const handleCardClick = (parent) => {
    setSelectedParent(parent);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parents</h1>
          <p className="text-muted-foreground mt-1">Parent accounts in the database (student linkage not modeled yet)</p>
        </div>

        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl w-48 h-12">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wide text-primary/70">Total Parents</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">{parents.length}</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading parents...</p>
        </div>
      )}

      {errMsg && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading parents: {errMsg}</p>
        </div>
      )}

      {!loading && !errMsg && (
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
                      <h3 className="font-semibold text-foreground">{parent.name}</h3>
                      <p className="text-sm text-muted-foreground">Parent account</p>
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
                  <p className="text-sm font-medium text-muted-foreground mb-2">Linked students</p>
                  <p className="text-xs text-muted-foreground">Not available until parent–student links exist in the API.</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ParentDetailDialog parent={selectedParent} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
    </div>
  );
};

export default Parents;
