import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, User, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addRemoveDialogOpen, setAddRemoveDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    class: "",
    syllabus: "",
    notes: "",
    teacher: "",
  });
  const [removeSubjectId, setRemoveSubjectId] = useState("");

  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  useEffect(() => {
    // Mock data for subjects
    setSubjects([
      {
        id: 1,
        name: "Mathematics",
        code: "MATH101",
        class: "1",
        teacher: "Dr. Rajesh Kumar",
        syllabus: "Numbers, Addition, Subtraction, Shapes, Patterns",
        notes: "Basic arithmetic operations and geometric shapes for beginners",
      },
      {
        id: 2,
        name: "English",
        code: "ENG101",
        class: "1",
        teacher: "Ms. Priya Sharma",
        syllabus: "Alphabets, Phonics, Simple Words, Rhymes",
        notes: "Introduction to English language with fun activities",
      },
      {
        id: 3,
        name: "Science",
        code: "SCI201",
        class: "2",
        teacher: "Dr. Amit Patel",
        syllabus: "Plants, Animals, Human Body, Water, Air",
        notes: "Basic science concepts with practical examples",
      },
      {
        id: 4,
        name: "Mathematics",
        code: "MATH201",
        class: "2",
        teacher: "Dr. Rajesh Kumar",
        syllabus: "Multiplication, Division, Fractions, Time, Money",
        notes: "Advanced arithmetic with real-world applications",
      },
      {
        id: 5,
        name: "Social Studies",
        code: "SST301",
        class: "3",
        teacher: "Mr. Suresh Reddy",
        syllabus: "Family, Community, Maps, History basics",
        notes: "Understanding society and basic geography",
      },
    ]);
  }, []);

  const filteredSubjects = subjects.filter((subject) => subject.class === selectedClass);

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
    setDetailDialogOpen(true);
  };

  const handleAddRemoveClick = () => {
    setAddRemoveDialogOpen(true);
    setActionType("add");
    setFormData({
      name: "",
      code: "",
      class: selectedClass,
      syllabus: "",
      notes: "",
      teacher: "",
    });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Subject Name is required");
      return false;
    }
    if (!formData.code.trim()) {
      toast.error("Subject Code is required");
      return false;
    }
    if (!formData.class) {
      toast.error("Class must be selected");
      return false;
    }
    if (formData.syllabus.length < 10) {
      toast.error("Syllabus must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setAddRemoveDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    const newSubject = {
      id: subjects.length + 1,
      ...formData,
    };
    setSubjects((prev) => [...prev, newSubject]);
    setConfirmDialogOpen(false);
    toast.success("Subject added successfully!");
    setFormData({
      name: "",
      code: "",
      class: "",
      syllabus: "",
      notes: "",
      teacher: "",
    });
  };

  const handleRemoveClick = () => {
    setActionType("remove");
    setRemoveSubjectId("");
  };

  const handleConfirmRemove = () => {
    if (!removeSubjectId) {
      toast.error("Please select a subject to remove");
      return;
    }
    setSubjects((prev) => prev.filter((subject) => subject.id.toString() !== removeSubjectId));
    setAddRemoveDialogOpen(false);
    setConfirmDialogOpen(false);
    toast.success("Subject removed successfully!");
    setRemoveSubjectId("");
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subjects Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage subjects for each class
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Class Filter Dropdown */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add/Remove Button */}
          <Button onClick={handleAddRemoveClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add / Remove
          </Button>
        </div>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No subjects found for Class {selectedClass}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary"
              onClick={() => handleCardClick(subject)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{subject.name}</h3>
                    <p className="text-xs text-muted-foreground">{subject.code}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">Class {subject.class}</Badge>
              </div>

              {subject.teacher && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{subject.teacher}</span>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-2">{subject.syllabus}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Subject Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Subject Details</DialogTitle>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Subject Name</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedSubject.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Subject Code</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedSubject.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Class</Label>
                  <p className="text-lg font-semibold text-foreground">Class {selectedSubject.class}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Teacher Assigned</Label>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedSubject.teacher || "Not Assigned"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Full Syllabus</Label>
                <p className="text-foreground mt-2 p-4 bg-muted/50 rounded-lg">{selectedSubject.syllabus}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Notes / Materials</Label>
                <p className="text-foreground mt-2 p-4 bg-muted/50 rounded-lg">
                  {selectedSubject.notes || "No notes available"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Remove Subject Dialog */}
      <Dialog open={addRemoveDialogOpen} onOpenChange={setAddRemoveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {actionType === "add" ? "Add New Subject" : "Remove Subject"}
            </DialogTitle>
          </DialogHeader>

          {actionType === "add" ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleFormChange("code", e.target.value)}
                    placeholder="e.g. MATH101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class *</Label>
                  <Select value={formData.class} onValueChange={(value) => handleFormChange("class", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          Class {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="teacher">Teacher Assigned (Optional)</Label>
                  <Input
                    id="teacher"
                    value={formData.teacher}
                    onChange={(e) => handleFormChange("teacher", e.target.value)}
                    placeholder="e.g. Dr. John Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="syllabus">Syllabus * (min 10 characters)</Label>
                <Textarea
                  id="syllabus"
                  value={formData.syllabus}
                  onChange={(e) => handleFormChange("syllabus", e.target.value)}
                  placeholder="Enter the syllabus details..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes / Materials (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  placeholder="Enter additional notes or materials..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Select Subject to Remove</Label>
              <Select value={removeSubjectId} onValueChange={setRemoveSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} ({subject.code}) - Class {subject.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddRemoveDialogOpen(false)}>
              Cancel
            </Button>
            {actionType === "add" ? (
              <>
                <Button variant="outline" onClick={handleRemoveClick}>
                  Switch to Remove
                </Button>
                <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Add Subject
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (!removeSubjectId) {
                    toast.error("Please select a subject to remove");
                    return;
                  }
                  setAddRemoveDialogOpen(false);
                  setConfirmDialogOpen(true);
                }}
                variant="destructive"
              >
                Remove Subject
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "add" ? "Confirm Add Subject" : "Confirm Remove Subject"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "add"
                ? `Are you sure you want to add "${formData.name}" (${formData.code}) to Class ${formData.class}?`
                : `Are you sure you want to remove this subject? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "add" ? handleConfirmAdd : handleConfirmRemove}
              className={actionType === "add" ? "bg-primary hover:bg-primary/90" : "bg-destructive hover:bg-destructive/90"}
            >
              {actionType === "add" ? "Add Subject" : "Remove Subject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;
