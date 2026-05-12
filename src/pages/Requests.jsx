import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, User, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const Requests = () => {
  const queryClient = useQueryClient();
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data: d } = await api.get("/admin/requests");
      return {
        student_requests: d?.student_requests ?? [],
        teacher_requests: d?.teacher_requests ?? [],
      };
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { data: res } = await api.post(`/admin/requests/teacher/${id}/approve`);
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setCredentials(res);
      setCredentialsOpen(true);
      toast.success("Student account created.");
    },
    onError: (err) => {
      const d = err?.response?.data?.detail;
      toast.error(d ? String(d) : "Approve failed.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/admin/requests/teacher/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Request declined.");
      setRejectTarget(null);
    },
    onError: (err) => {
      const d = err?.response?.data?.detail;
      toast.error(d ? String(d) : "Reject failed.");
    },
  });

  const studentRequests = data?.student_requests ?? [];
  const teacherRequests = data?.teacher_requests ?? [];
  const errMsg = isError ? error?.response?.data?.detail || error?.message || "Could not load requests." : null;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return String(iso);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Requests</h1>
        <p className="text-muted-foreground mt-1">
          Teachers can request new students from their portal. Approve to create login: username from the student&apos;s
          name, password <span className="font-mono text-foreground">&lt;username&gt;123</span>.
        </p>
        {errMsg && <p className="text-sm text-destructive mt-2">{String(errMsg)}</p>}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && !errMsg && (
        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-2">
            <TabsTrigger value="students">Student requests ({studentRequests.length})</TabsTrigger>
            <TabsTrigger value="teachers">Teacher requests ({teacherRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No self-service student admissions yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Direct student registrations are not wired. Use teacher-initiated requests on the other tab.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            {teacherRequests.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No pending teacher requests</h3>
                <p className="text-sm text-muted-foreground">Teachers submit requests from Teacher → Request student.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherRequests.map((req) => (
                  <Card key={req.id} className="p-6 flex flex-col gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Proposed student</p>
                      <p className="text-lg font-semibold text-foreground">{req.full_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Class {req.class_name} · Roll {req.roll_no}
                      </p>
                      {req.email && <p className="text-xs text-muted-foreground mt-2">{req.email}</p>}
                    </div>
                    <div className="text-sm border-t border-border pt-3">
                      <p className="text-muted-foreground">Requested by</p>
                      <p className="font-medium text-foreground">{req.teacher_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(req.requested_at)}</p>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(req.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive hover:text-destructive"
                        disabled={rejectMutation.isPending}
                        onClick={() => setRejectTarget(req)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={credentialsOpen} onOpenChange={setCredentialsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student login created</DialogTitle>
          </DialogHeader>
          {credentials && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Share these credentials with the student (one-time display):</p>
              <div className="rounded-md bg-muted p-3 font-mono text-foreground space-y-1">
                <p>
                  <span className="text-muted-foreground">Username:</span> {credentials.username}
                </p>
                <p>
                  <span className="text-muted-foreground">Password:</span> {credentials.temporary_password}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCredentialsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this request?</AlertDialogTitle>
            <AlertDialogDescription>
              {rejectTarget && (
                <>
                  {rejectTarget.full_name} (class {rejectTarget.class_name}) will not receive an account.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => rejectTarget && rejectMutation.mutate(rejectTarget.id)}
            >
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Requests;
