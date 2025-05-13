"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:5060/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditData({ username: data.username, email: data.email });
      }
    } catch (err) {
      setError("Failed to load profile.");
    }
    setLoading(false);
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setEditData({ username: profile.username, email: profile.email });
    setError("");
    setMessage("");
  };

  const handleSave = async () => {
    // TODO: Implement backend update endpoint. For now, just update UI.
    setProfile({ ...profile, ...editData });
    setEditMode(false);
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (!profile) return <div className="flex justify-center items-center h-96">No profile data found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
          {profile.username[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1">{profile.username}</h2>
          <p className="text-gray-500 dark:text-gray-300">{profile.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-xs font-semibold">{profile.role}</span>
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        <Button onClick={handleEdit}>Edit Profile</Button>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>
      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Username</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                value={editData.username}
                onChange={e => setEditData({ ...editData, username: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                value={editData.email}
                onChange={e => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2 mt-8">Favorites</h3>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[80px] text-gray-500 dark:text-gray-400">
          {/* TODO: Fetch and display user's favorite vehicles or items here */}
          No favorites yet.
        </div>
      </div>
    </div>
  );
} 