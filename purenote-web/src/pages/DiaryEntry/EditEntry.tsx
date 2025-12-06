import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { diaryService } from "@/services/diaryService";
import { useDiaryStore } from "@/store/diaryStore";
import type { UpdateEntryDto } from "@/types/diary.types";

export const EditEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEntry: updateStoreEntry } = useDiaryStore();

  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptPassword, setDecryptPassword] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    password: "",
    mood: "",
    tags: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecryptError("");
    setIsDecrypting(true);

    try {
      const decrypted = await diaryService.getDecryptedEntry(
        Number(id),
        decryptPassword
      );

      setFormData({
        title: decrypted.title,
        content: decrypted.content,
        password: decryptPassword, // Use same password by default
        mood: decrypted.mood || "",
        tags: decrypted.tags.join(", "), // Convert array to comma-separated string
      });

      setIsDecrypted(true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid password";
      setDecryptError(message);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.content || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const dto: UpdateEntryDto = {
        title: formData.title,
        content: formData.content,
        password: formData.password,
        mood: formData.mood || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      const response = await diaryService.updateEntry(Number(id), dto);

      updateStoreEntry(Number(id), {
        title: response.title,
        mood: response.mood,
        tags: response.tags,
        updatedAt: response.updatedAt,
      });

      navigate(`/diary/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.detail || "Failed to update entry";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // If not decrypted yet, show decrypt form first
  if (!isDecrypted) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(`/diary/${id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Entry
          </button>

          <h1 className="text-3xl font-bold mb-8">Edit Entry</h1>

          {/* Decrypt form */}
          <div className="max-w-md mx-auto glass rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-neon-blue" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Decrypt to Edit</h2>
              <p className="text-gray-400 text-sm">
                Enter your encryption password to edit this entry
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
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isDecrypting}
                className="w-full"
              >
                {isDecrypting ? "Decrypting..." : "Decrypt & Edit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If decrypted, show edit form
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/diary/${id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Entry
        </button>

        <h1 className="text-3xl font-bold mb-8">Edit Entry</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title input */}
          <Input
            label="Title *"
            name="title"
            type="text"
            placeholder="My amazing day..."
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Content textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">
              Content *
            </label>
            <textarea
              name="content"
              placeholder="Write your thoughts here..."
              value={formData.content}
              onChange={handleChange}
              rows={12}
              required
              className="input-field resize-none"
            />
          </div>

          {/* Encryption password section */}
          <div className="glass rounded-lg p-4 border border-neon-blue/30">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-neon-blue" />
              <span className="font-medium text-neon-blue">
                Encryption Password
              </span>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="Enter encryption password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-400 mt-2">
              You can use the same password or set a new one
            </p>
          </div>

          {/* Mood input */}
          <Input
            label="Mood (Optional)"
            name="mood"
            type="text"
            placeholder="Happy, Sad, Excited..."
            value={formData.mood}
            onChange={handleChange}
          />

          {/* Tags input */}
          <Input
            label="Tags (Optional)"
            name="tags"
            type="text"
            placeholder="travel, work, personal (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
          />

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1"
            >
              {isLoading ? "Updating..." : "Update Entry"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/diary/${id}`)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
