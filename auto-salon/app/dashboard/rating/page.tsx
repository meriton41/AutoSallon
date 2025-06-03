"use client";

import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useAuth } from "@/context/auth-context";

interface Rating {
  id: string;
  userId: string;
  value: number;
  comment: string;
  createdAt: string;
}

export default function RatingPage() {
  const { isAdmin, token } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ userId: "", value: 0, comment: "", createdAt: "" });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdmin) fetchRatings();
  }, [isAdmin]);

  const fetchRatings = async () => {
    try {
      const response = await fetch("https://localhost:7234/api/WebsiteRatings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      }
    } catch (err) {
      setError("Failed to fetch ratings");
    }
  };

  const handleEdit = (rating: Rating) => {
    setEditingId(rating.id);
    setEditForm({
      userId: rating.userId,
      value: rating.value,
      comment: rating.comment,
      createdAt: rating.createdAt,
    });
    setShowModal(true);
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`https://localhost:7234/api/WebsiteRatings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        throw new Error("Failed to update rating");
      }
      setEditingId(null);
      setShowModal(false);
      fetchRatings();
    } catch (err) {
      setError("Failed to update rating");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        const response = await fetch(`https://localhost:7234/api/WebsiteRating/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          fetchRatings();
        } else {
          setError("Failed to delete rating");
        }
      } catch (err) {
        setError("Failed to delete rating");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value,
    }));
  };

  if (!isAdmin) {
    return <div className="text-center py-10 text-xl">Access denied.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
     <h1 className="text-3xl font-bold mb-6">Ratings Management</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Comment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created At</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ratings.map((rating) => (
              <tr key={rating.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{rating.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{rating.userId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{rating.value}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{rating.comment}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(rating.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(rating)}
                      className="bg-[#232b36] rounded-xl w-12 h-12 flex items-center justify-center text-white hover:bg-[#2d3642] transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(rating.id)}
                      className="bg-[#232b36] rounded-xl w-12 h-12 flex items-center justify-center text-white hover:bg-[#2d3642] transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Edit Rating</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <FiX size={28} />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">ID</label>
                <div className="px-3 py-2 bg-gray-100 rounded text-gray-700">{editingId}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">User ID</label>
                <input
                  name="userId"
                  value={editForm.userId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Value</label>
                <input
                  name="value"
                  type="number"
                  min={0}
                  max={5}
                  value={editForm.value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Comment</label>
                <textarea
                  name="comment"
                  value={editForm.comment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Created At</label>
                <input
                  name="createdAt"
                  type="datetime-local"
                  value={editForm.createdAt.slice(0, 16)}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingId!)}
                className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
