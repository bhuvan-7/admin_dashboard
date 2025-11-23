import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { CheckCircle, XCircle, Mail, Phone, User, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Requests = () => {
  const [studentRequests, setStudentRequests] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("accept");
  const [requestType, setRequestType] = useState("student");

  useEffect(() => {
    setStudentRequests([
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "9876543210",
        class: "Class 5",
        parentName: "Robert Smith",
        parentPhone: "9876543200",
        requestDate: "2024-01-15",
        address: "123 Main St, Mumbai, Maharashtra",
        dob: "2015-05-20",
      },
      {
        id: 2,
        name: "Emma Wilson",
        email: "emma.wilson@email.com",
        phone: "9876543211",
        class: "Class 3",
        parentName: "Sarah Wilson",
        parentPhone: "9876543201",
        requestDate: "2024-01-16",
        address: "456 Park Ave, Delhi",
        dob: "2017-08-15",
      },
    ]);

    setTeacherRequests([
      {
        id: 1,
        teacherName: "Dr. Sarah Johnson",
        type: "Notes",
        subject: "Mathematics",
        class: "Class 10",
        title: "Quadratic Equations - Chapter 4",
        description: "Comprehensive notes covering quadratic equations, formulas, and problem-solving techniques",
        fileName: "quadratic_equations_notes.pdf",
        fileSize: "2.5 MB",
        requestDate: "2024-01-18",
      },
      {
        id: 2,
        teacherName: "Prof. Michael Chen",
        type: "Assignment",
        subject: "Physics",
        class: "Class 12",
        title: "Laws of Motion - Practice Problems",
        description: "Assignment containing 15 problems on Newton's laws of motion with varying difficulty levels",
        fileName: "motion_assignment.pdf",
        fileSize: "1.8 MB",
        requestDate: "2024-01-17",
      },
      {
        id: 3,
        teacherName: "Ms. Priya Sharma",
        type: "Exam",
        subject: "English",
        class: "Class 8",
        title: "Mid-Term Examination Paper",
        description: "Mid-term exam paper covering comprehension, grammar, and essay writing",
        fileName: "english_midterm.pdf",
        fileSize: "3.2 MB",
        requestDate: "2024-01-19",
      },
    ]);
  }, []);

  const handleCardClick = (request, type) => {
    setSelectedRequest(request);
    setRequestType(type);
    setDetailDialogOpen(true);
  };

  const handleAction = (request, action, type) => {
    setSelectedRequest(request);
    setActionType(action);
    setRequestType(type);
    setDetailDialogOpen(false);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (selectedRequest) {
      if (requestType === "student") {
        setStudentRequests((prev) =>
          prev.filter((req) => req.id !== selectedRequest.id)
        );
      } else {
        setTeacherRequests((prev) =>
          prev.filter((req) => req.id !== selectedRequest.id)
        );
      }

      toast.success(
        `${requestType === "student" ? "Student" : "Teacher"} request ${
          actionType === "accept" ? "accepted" : "declined"
        } successfully`
      );
    }
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage student registrations and teacher content uploads
        </p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="students">
            Student Requests ({studentRequests.length})
          </TabsTrigger>
          <TabsTrigger value="teachers">
            Teacher Requests ({teacherRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          {studentRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Pending Student Requests
              </h3>
              <p className="text-muted-foreground">
                All student registration requests have been processed.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentRequests.map((request) => (
                <Card
                  key={request.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(request, "student")}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {request.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.class}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Parent: {request.parentName}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-3">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="teachers" className="mt-6">
          {teacherRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Pending Teacher Requests
              </h3>
              <p className="text-muted-foreground">
                All teacher upload requests have been processed.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherRequests.map((request) => (
                <Card
                  key={request.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(request, "teacher")}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {request.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.subject} - {request.class}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          request.type === "Notes"
                            ? "border-blue-500 text-blue-500"
                            : request.type === "Assignment"
                            ? "border-orange-500 text-orange-500"
                            : "border-red-500 text-red-500"
                        }
                      >
                        {request.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{request.teacherName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        <span>
                          {request.fileName} ({request.fileSize})
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {requestType === "student" ? "Student Request Details" : "Teacher Upload Request"}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && requestType === "student" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{selectedRequest.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{selectedRequest.class}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedRequest.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.dob).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p className="font-medium">{selectedRequest.parentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parent Phone</p>
                  <p className="font-medium">{selectedRequest.parentPhone}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedRequest.address}</p>
                </div>
              </div>
            </div>
          ) : selectedRequest && requestType === "teacher" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Teacher Name</p>
                  <p className="font-medium">{selectedRequest.teacherName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.type === "Notes"
                        ? "border-blue-500 text-blue-500"
                        : selectedRequest.type === "Assignment"
                        ? "border-orange-500 text-orange-500"
                        : "border-red-500 text-red-500"
                    }
                  >
                    {selectedRequest.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedRequest.subject}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">{selectedRequest.class}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedRequest.title}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedRequest.description}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">File Name</p>
                  <p className="font-medium">{selectedRequest.fileName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="font-medium">{selectedRequest.fileSize}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p className="font-medium">
                    {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => handleAction(selectedRequest, "decline", requestType)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button onClick={() => handleAction(selectedRequest, "accept", requestType)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept" ? "Accept Request" : "Decline Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this{" "}
              {requestType === "student" ? "student registration" : "teacher upload"} request?
              {actionType === "accept" && " This will add the item to the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {actionType === "accept" ? "Accept" : "Decline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Requests;
