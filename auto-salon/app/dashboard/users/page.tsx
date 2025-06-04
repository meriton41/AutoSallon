"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Shield, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}

export default function DashboardUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "User",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://localhost:7234/api/Account/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      username: user.userName,
      email: user.email,
      role: user.roles[0] || "User",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setError(null);
    try {
      // Update user role
      await axios.post(
        `https://localhost:7234/api/Account/${editingUser.id}/role`,
        JSON.stringify(form.role),
        { headers: { "Content-Type": "application/json" } }
      );
      
      // Update other user details if needed
      await axios.put(`https://localhost:7234/api/Account/users/${editingUser.id}`, {
        username: form.username,
        email: form.email
      });

      setIsEditModalOpen(false);
      setEditingUser(null);
      // Refresh list
      const response = await axios.get("https://localhost:7234/api/Account/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      console.log('Attempting to delete user:', id);
      console.log('Using token:', token);

      // Then attempt to delete
      const deleteResponse = await axios.delete(`https://localhost:7234/api/Account/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response:', deleteResponse);

      // Refresh list
      const response = await axios.get("https://localhost:7234/api/Account/users", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(response.data);
    } catch (err: any) {
      console.error('Delete error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config
      });
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to delete users. Admin access required.");
      } else if (err.response?.status === 404) {
        setError("User not found.");
      } else if (err.response?.status === 405) {
        setError("Server error: Method not allowed. Please try again later.");
      } else {
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>

        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/50 dark:border-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
          {users.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">{user.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.roles.includes("Admin") ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"}`}>
                        {user.roles[0] || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="bg-black/90 hover:bg-black text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="bg-black/90 hover:bg-black text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <Select
                  value={form.role}
                  onValueChange={(value) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 border-black text-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-black hover:bg-black/90 text-white px-6"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 