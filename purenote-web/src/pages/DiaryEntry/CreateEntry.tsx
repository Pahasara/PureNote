import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { diaryService } from "@/services/diaryService";
import { useDiaryStore } from "@/store/diaryStore";
import type { CreateEntryDto } from "@/types/diary.types";

export const CreateEntry: React.FC = () => {
  const navigate = useNavigate();
  const { addEntry } = useDiaryStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    password: "",
    mood: "",
    tags: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      const dto: CreateEntryDto = {
        title: formData.title,
        content: formData.content,
        password: formData.password,
        mood: formData.mood || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      const response = await diaryService.createEntry(dto);

      addEntry({
        id: response.id,
        title: response.title,
        mood: response.mood,
        tags: response.tags,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });

      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.detail || "Failed to create entry";
      setError(message);
    } finally {
      setIsLoading(false);
    }
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

        <h1 className="text-3xl font-bold mb-8">Create New Entry</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title *"
            name="title"
            type="text"
            placeholder="My amazing day..."
            value={formData.title}
            onChange={handleChange}
            required
          />

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
              This password will be used to encrypt your entry. Remember it to
              decrypt later!
            </p>
          </div>

          <Input
            label="Mood (Optional)"
            name="mood"
            type="text"
            placeholder="Happy, Sad, Excited..."
            value={formData.mood}
            onChange={handleChange}
          />

          <Input
            label="Tags (Optional)"
            name="tags"
            type="text"
            placeholder="travel, work, personal (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Entry"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
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
