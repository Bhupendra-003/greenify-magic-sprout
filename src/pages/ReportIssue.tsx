
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, MapPin } from "lucide-react";

const ReportIssue = () => {
  const { user, updateUserXP } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculatePriorityRating = (severity: string, description: string): number => {
    // Simple priority calculation based on severity and description length
    const severityScore = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;
    const descriptionScore = Math.min(description.length / 100, 2); // Cap at 2
    return Math.round((severityScore + descriptionScore) * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !severity || !verified || !location) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields and verify you are human",
      });
      return;
    }

    try {
      setLoading(true);

      // Calculate priority rating locally
      const priorityRating = calculatePriorityRating(severity, description);

      let imageUrl = null;
      if (image) {
        imageUrl = URL.createObjectURL(image);
      }

      // Create new issue
      const newIssue = {
        id: Math.random().toString(),
        title,
        description,
        status: "pending",
        severity,
        location,
        reporter_id: user!.id,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        solver_id: null,
        solution_image_url: null,
        solved_at: null,
        priorityRating,
      };

      // Get existing issues or initialize empty array
      const existingData = JSON.parse(localStorage.getItem("issuesData") || "{}");
      const updatedIssues = {
        issues: [...(existingData.issues || []), newIssue]
      };

      // Save to localStorage
      localStorage.setItem("issuesData", JSON.stringify(updatedIssues));

      // Update user's XP points (+50 for reporting an issue)
      const newXP = (user?.xp_points || 0) + 50;
      updateUserXP(user!.id, newXP);

      toast({
        title: "Report submitted",
        description: "Your issue has been reported successfully",
      });
      navigate("/citizen/dashboard");
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude}, ${position.coords.longitude}`
          );
          toast({
            title: "Location captured",
            description: "Your current location has been recorded",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Failed to get your location. Please try again.",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-dark mb-2">
              Report an Issue
            </h1>
            <p className="text-gray-600">
              Help us make your community better by reporting issues you observe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the issue"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select onValueChange={setSeverity} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={getLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Capture Location
                </Button>
                {location && (
                  <p className="text-sm text-gray-600 mt-1">
                    Location captured: {location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verify"
                checked={verified}
                onCheckedChange={(checked) => setVerified(checked as boolean)}
              />
              <label
                htmlFor="verify"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I verify that I am a human and this is a genuine report
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/citizen/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !verified}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
