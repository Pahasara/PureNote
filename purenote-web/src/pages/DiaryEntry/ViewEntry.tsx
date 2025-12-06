import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Smile,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { diaryService } from "@/services/diaryService";
import { useDiaryStore } from "@/store/diaryStore";
import type { DiaryEntryResponse } from "@/types/diary.types";

export const ViewEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, removeEntry } = useDiaryStore();

  const [entry, setEntry] = useState<DiaryEntryResponse | null>(null);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const [password, setPassword] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const entryMetadata = entries.find((e) => e.id === Number(id));

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecryptError("");
    setIsDecrypting(true);

    try {
      const decrypted = await diaryService.getDecryptedEntry(
        Number(id),
        password
      );
      setEntry(decrypted);
      setIsDecrypted(true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid password";
      setDecryptError(message);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await diaryService.deleteEntry(Number(id));
      removeEntry(Number(id));
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("Failed to delete entry");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {entryMetadata && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{entryMetadata.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(entryMetadata.createdAt)}</span>
              </div>

              {entryMetadata.mood && (
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  <span className="capitalize">{entryMetadata.mood}</span>
                </div>
              )}

              {entryMetadata.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex flex-wrap gap-1">
                    {entryMetadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-dark-border px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isDecrypted ? (
          <Card className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-neon-blue" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Entry is Encrypted</h2>
              <p className="text-gray-400 text-sm">
                Enter your encryption password to view this entry
              </p>
            </div>

            {decryptError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                {decryptError}
              </div>
            )}

            <form onSubmit={handleDecrypt} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isDecrypting}
                className="w-full"
              >
                {isDecrypting ? "Decrypting..." : "Decrypt Entry"}
              </Button>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-200">
                  {entry?.content}
                </p>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={() => navigate(`/diary/edit/${id}`)}
                className="flex-1"
              >
                <Edit className="w-4 h-4" />
                Edit Entry
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Entry"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
