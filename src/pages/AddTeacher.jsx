import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { UserPlus, ArrowLeft } from "lucide-react";
import api from "@/lib/axios";

const AddTeacher = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    email: "",
    phone: "",
    gender: "",
    qualification: "",
    experience: "",
    subject: "",
    assignedClasses: "",
    country: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject / department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setDialogOpen(true);
    }
  };

  const confirmSubmit = async () => {
    try {
      setSubmitting(true);
      await api.post("/admin/teachers", {
        username: formData.username.trim(),
        password: formData.password,
        full_name: formData.firstName.trim(),
        department: formData.subject.trim(),
        email: formData.email.trim() || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success(`Teacher ${formData.firstName} has been added successfully!`);
      setFormData({
        username: "",
        password: "",
        firstName: "",
        email: "",
        phone: "",
        gender: "",
        qualification: "",
        experience: "",
        subject: "",
        assignedClasses: "",
        country: "",
        state: "",
        city: "",
      });
      setErrors({});
      setDialogOpen(false);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      toast.error(detail ? String(detail) : `Error adding teacher: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Teacher</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to add a new teacher to the system</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/teachers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Link>
        </Button>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Account and profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Login username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="e.g. jsingh"
                  autoComplete="username"
                  className={errors.username ? "border-destructive" : ""}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Initial password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Full name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Full name as it should appear"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional, not stored on teacher record yet)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Contact number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender (optional)</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold text-foreground mb-4">Professional (optional notes)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Only <span className="font-medium text-foreground">Subject / department</span> is saved to the API today
              (as the teacher&apos;s department). Other fields are for your records only.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification (optional)</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange("qualification", e.target.value)}
                  placeholder="e.g., M.Sc, B.Ed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience years (optional)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder="Years of experience"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="subject">Subject / department *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="e.g., Mathematics — stored as department"
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="assignedClasses">Assigned classes (optional note)</Label>
                <Input
                  id="assignedClasses"
                  value={formData.assignedClasses}
                  onChange={(e) => handleChange("assignedClasses", e.target.value)}
                  placeholder="Link teachers to classes via Subjects page"
                />
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold text-foreground mb-4">Location (optional, not sent to API)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Enter country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link to="/teachers">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </form>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Adding Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add {formData.firstName} as a new teacher?
              This action will create a new teacher profile in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={submitting}>
              {submitting ? "Adding..." : "Yes, Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTeacher;
