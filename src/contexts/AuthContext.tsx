
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import usersData from "../data/users.json";

interface User {
  id: string;
  email: string;
  name: string;
  type: "citizen" | "ngo";
  xp_points: number;
}

interface UserWithPassword extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    type: "citizen" | "ngo"
  ) => Promise<void>;
  logout: () => void;
  updateUserXP: (userId: string, newXP: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const storedData = JSON.parse(localStorage.getItem("usersData") || JSON.stringify(usersData));
      const allUsers = [...storedData.citizens, ...storedData.ngos] as UserWithPassword[];
      const foundUser = allUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate(`/${foundUser.type}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: "citizen" | "ngo"
  ) => {
    try {
      setLoading(true);
      const storedData = JSON.parse(localStorage.getItem("usersData") || JSON.stringify(usersData));
      
      // Check if email already exists
      const allUsers = [...storedData.citizens, ...storedData.ngos];
      if (allUsers.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }

      const newUser: UserWithPassword = {
        id: Math.random().toString(),
        email,
        password,
        name,
        type,
        xp_points: 0,
      };

      // Update users data
      const updatedData = {
        ...storedData,
        [type === "citizen" ? "citizens" : "ngos"]: [
          ...storedData[type === "citizen" ? "citizens" : "ngos"],
          newUser
        ]
      };

      localStorage.setItem("usersData", JSON.stringify(updatedData));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
      
      navigate(`/${type}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please try again later.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserXP = (userId: string, newXP: number) => {
    const updatedUser = { ...user!, xp_points: newXP };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update users data
    const storedData = JSON.parse(localStorage.getItem("usersData") || JSON.stringify(usersData));
    const updatedData = {
      ...storedData,
      citizens: storedData.citizens.map((c: UserWithPassword) => 
        c.id === userId ? { ...c, xp_points: newXP } : c
      ),
      ngos: storedData.ngos.map((n: UserWithPassword) => 
        n.id === userId ? { ...n, xp_points: newXP } : n
      )
    };
    localStorage.setItem("usersData", JSON.stringify(updatedData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    // Initialize users data if not present
    if (!localStorage.getItem("usersData")) {
      localStorage.setItem("usersData", JSON.stringify(usersData));
    }
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserXP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
