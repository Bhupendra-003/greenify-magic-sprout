
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Award, AlertTriangle } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Precise location mapping for accurate issue reporting",
    },
    {
      icon: Users,
      title: "NGO Collaboration",
      description: "Direct connection with local NGOs for quick resolution",
    },
    {
      icon: Award,
      title: "Reward System",
      description: "Earn XP points for active community participation",
    },
    {
      icon: AlertTriangle,
      title: "Priority Handling",
      description: "Critical issues get immediate attention",
    },
  ];

  return (
    <div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-[900] shadow-black shadow-md p-2 text-white">Greenify</h1>
          {user ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/${user.type}/dashboard`)}
            >
              Go to Dashboard
            </Button>
          ) : (
            <div className="space-x-4">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button className="bg-green-600 hover:bg-green-500" onClick={() => navigate("/register")}>Register</Button>
            </div>
          )}
        </nav>

        <main>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-white bg-black rounded-full py-4 mb-6">
              Making Our Cities Better, Together
            </h2>
            <p className="text-lg text-gray-600 bg-white p-2 rounded-2xl mb-8">
              Join our community-driven platform to report and resolve urban issues.
              Together, we can create cleaner, safer, and more sustainable cities.
            </p>
            {!user && (
              <Button
                size="lg"
                className="animate-float text-xl bg-green-700"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary-light rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-primary-dark mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Start reporting issues in your community and earn rewards for your
              contribution.
            </p>
            {!user && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/register")}
              >
                Join Now
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
