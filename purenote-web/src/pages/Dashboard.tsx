import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Calendar, Tag, Smile, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDiaryStore } from "@/store/diaryStore";
import { diaryService } from "@/services/diaryService";
import type { DiaryEntryListItem } from "@/types/diary.types";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { entries, setEntries, setLoading, isLoading } = useDiaryStore();

  const [searchText, setSearchText] = useState("");
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntryListItem[]>(
    []
  );

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = entries.filter((entry) =>
        entry.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [searchText, entries]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await diaryService.listEntries();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Notes</h1>
            <p className="text-gray-400">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate("/diary/create")}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-12!"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">
              {searchText
                ? "No entries found"
                : "No entries yet. Create your first one!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                onClick={() => navigate(`/diary/${entry.id}`)}
                className="animate-slide-up hover:scale-[1.02] transition-transform duration-200"
              >
                <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                  {entry.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(entry.createdAt)}</span>
                  </div>

                  {entry.mood && (
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4" />
                      <span className="capitalize">{entry.mood}</span>
                    </div>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-dark-border px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && (
                          <span className="text-xs">
                            +{entry.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
