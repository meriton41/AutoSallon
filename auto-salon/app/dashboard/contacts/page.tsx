"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function DashboardContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchContacts = async () => {
    if (!token) {
      setIsLoading(false);
      toast.error("Authentication token not available.");
      return;
    }

    try {
      const response = await axios.get("https://localhost:7234/api/Contact", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const contact = contacts.find(c => c.id === id);
      if (!contact) return;

      await axios.put(`https://localhost:7234/api/Contact/${id}`, {
        ...contact,
        isRead: true
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts(contacts.map(c => 
        c.id === id ? { ...c, isRead: true } : c
      ));
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking contact as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7234/api/Contact/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      toast.success("Contact deleted");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className={contact.isRead ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-950 font-semibold'}>
                <TableCell className="font-medium">
                  <Badge variant={contact.isRead ? "secondary" : "default"}>
                    {contact.isRead ? "Read" : "New"}
                  </Badge>
                </TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{format(new Date(contact.createdAt), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                    >
                      View
                    </Button>
                    {!contact.isRead && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkAsRead(contact.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">From:</h3>
                <p>{selectedContact.name}</p>
                <p>{selectedContact.email}</p>
                <p>{selectedContact.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold">Message:</h3>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date:</h3>
                <p>{format(new Date(selectedContact.createdAt), "PPpp")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 