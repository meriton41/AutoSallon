"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

interface TestDrive {
  id: number;
  userId: string;
  vehicleId: number;
  description: string;
  date: string;
  status: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  user: {
    email: string;
  };
}

export default function TestDriveTable() {
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ status: '', description: '' });
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchTestDrives();
  }, []);

  const fetchTestDrives = async () => {
    try {
      const response = await fetch('https://localhost:7234/api/TestDrive', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTestDrives(data);
      }
    } catch (error) {
      console.error('Error fetching test drives:', error);
    }
  };

  const handleEdit = (testDrive: TestDrive) => {
    setEditingId(testDrive.id);
    setEditForm({
      status: testDrive.status || '',
      description: testDrive.description || ''
    });
    setShowModal(true);
  };

  const handleSave = async (id: number) => {
    try {
      const testDrive = testDrives.find(td => td.id === id);
      if (!testDrive) {
        throw new Error('Test drive not found');
      }
      console.log('Saving:', editForm);
      // Update both status and description in one request
      const response = await fetch(`https://localhost:7234/api/TestDrive/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: testDrive.vehicleId,
          description: editForm.description,
          date: testDrive.date,
          status: editForm.status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update test drive');
      }

      setEditingId(null);
      setShowModal(false);
      fetchTestDrives();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update test drive');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this test drive?')) {
      try {
        const response = await fetch(`https://localhost:7234/api/TestDrive/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchTestDrives();
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to delete test drive');
        }
      } catch (error) {
        setError('An error occurred while deleting the test drive');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'status') {
      console.log('Dropdown changed to:', value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/*  */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Vehicle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {testDrives.map((testDrive) => (
              <tr key={testDrive.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{testDrive.user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {testDrive.vehicle.year} {testDrive.vehicle.make} {testDrive.vehicle.model}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(testDrive.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {testDrive.description}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    testDrive.status === 'Finished' ? 'bg-green-100 text-green-800' :
                    testDrive.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {testDrive.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(testDrive)}
                      className="bg-[#232b36] rounded-xl w-12 h-12 flex items-center justify-center text-white hover:bg-[#2d3642] transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={22} />
                    </button>
                    <button
                      onClick={() => handleDelete(testDrive.id)}
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
              <h3 className="text-2xl font-semibold text-gray-800">Edit Test Drive</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <FiX size={28} />
              </button>
            </div>
            {/* Show all attributes, only description and status are editable */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">User</label>
                <div className="px-3 py-2 bg-gray-100 rounded text-gray-700">
                  {testDrives.find(td => td.id === editingId)?.user.email}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Vehicle</label>
                <div className="px-3 py-2 bg-gray-100 rounded text-gray-700">
                  {testDrives.find(td => td.id === editingId)?.vehicle.year} {testDrives.find(td => td.id === editingId)?.vehicle.make} {testDrives.find(td => td.id === editingId)?.vehicle.model}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <div className="px-3 py-2 bg-gray-100 rounded text-gray-700">
                  {testDrives.find(td => td.id === editingId) ? new Date(testDrives.find(td => td.id === editingId)!.date).toLocaleString() : ''}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Finished">Finished</option>
                </select>
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