import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Trophy, CheckCircle, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  location: string;
  reporter_id: string;
  image_url: string | null;
  created_at: string;
  solver_id: string | null;
  solution_image_url: string | null;
  solved_at: string | null;
  priorityRating: number | 0;
}

interface User {
  id: string;
  email: string;
  name: string;
  type: "citizen" | "ngo";
  xp_points: number;
}

const NGODashboard = () => {
  const { user, logout, updateUserXP } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [topNGOs, setTopNGOs] = useState<User[]>([]);
  const [solutionImage, setSolutionImage] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load issues from localStorage
    const storedIssues = JSON.parse(localStorage.getItem("issuesData") || "{}");
    const sortedIssues = [...storedIssues.issues].sort((a, b) => {
      // First sort by severity
      const severityOrder = { high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity as keyof typeof severityOrder] -
        severityOrder[a.severity as keyof typeof severityOrder];

      // If severity is equal, sort by priorityRating
      if (severityDiff === 0) {
        return (b.priorityRating || 0) - (a.priorityRating || 0);
      }
      return severityDiff;
    });
    setIssues(sortedIssues);

    // Load top NGOs
    const storedData = JSON.parse(localStorage.getItem("usersData") || "{}");
    const sortedNGOs = [...storedData.ngos]
      .sort((a, b) => b.xp_points - a.xp_points)
      .slice(0, 5);
    setTopNGOs(sortedNGOs);
  }, []);
  const refreshTopNGOs = () => {
    const storedData = JSON.parse(localStorage.getItem("usersData") || "{}");
    const sortedNGOs = [...storedData.ngos]
      .sort((a, b) => b.xp_points - a.xp_points)
      .slice(0, 5);
    setTopNGOs(sortedNGOs);
  };

  const handleSolveIssue = async () => {
    if (!selectedIssue || !solutionImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload a solution image",
      });
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(solutionImage);

      // Update the issues data
      const updatedIssues = issues.map(issue =>
        issue.id === selectedIssue.id
          ? {
            ...issue,
            status: "solved",
            solver_id: user!.id,
            solution_image_url: imageUrl,
            solved_at: new Date().toISOString()
          }
          : issue
      );

      // Update localStorage
      const storedIssues = JSON.parse(localStorage.getItem("issuesData") || "{}");
      storedIssues.issues = updatedIssues;
      localStorage.setItem("issuesData", JSON.stringify(storedIssues));
      setIssues(updatedIssues);

      // Update NGO's XP points (+200 per solved issue)
      const newXP = (user?.xp_points || 0) + 200;
      updateUserXP(user!.id, newXP);
      refreshTopNGOs(); // Add this line

      toast({
        title: "Success",
        description: "Issue has been marked as solved",
      });

      setSelectedIssue(null);
      setSolutionImage(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to solve issue",
      });
    }
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSolutionImage(event.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-dark">NGO Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <h3 className="text-2xl font-bold">{user?.xp_points || 0}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter((i) => i.status === "pending").length}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light rounded-full">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Solved Issues</p>
                <h3 className="text-2xl font-bold">
                  {issues.filter((i) => i.status === "solved").length}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Active Reports</h2>
          {issues.map((issue) => (
            <Card key={issue.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-sm text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {issue.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {issue.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${issue.severity === "high"
                          ? "bg-red-100 text-red-800"
                          : issue.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Priority: {issue.priorityRating || 0}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedIssue(issue)}
                    disabled={issue.status === "solved"}
                  >
                    {issue.status === "solved" ? "Solved" : "View Details"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}

        </div>
      </main>

      {/* Add Leaderboard */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top NGOs</h2>
        <div className="space-y-4">
          {topNGOs.map((ngo, index) => (
            <Card key={ngo.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    #{index + 1} {ngo.name}
                  </h3>
                  <p className="text-sm text-gray-600">XP Points: {ngo.xp_points}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedIssue.title}</h3>
                <p className="text-sm text-gray-600">{selectedIssue.description}</p>
              </div>

              <div>
                <Label>Issue Image</Label>
                {selectedIssue.image_url && (
                  <img
                    src={selectedIssue.image_url}
                    alt="Issue"
                    className="w-full h-64 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              {selectedIssue.status === "pending" && (
                <div className="space-y-2">
                  <Label>Upload Solution Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                {selectedIssue.status === "pending" && (
                  <Button onClick={handleSolveIssue} disabled={!solutionImage}>
                    Mark as Solved
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NGODashboard;
