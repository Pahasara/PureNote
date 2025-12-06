import api from "./api";
import type {
  CreateEntryDto,
  UpdateEntryDto,
  DecryptEntryDto,
  DiaryEntryListItem,
  DiaryEntryResponse,
  SearchParams,
} from "@/types/diary.types";

export const diaryService = {
  createEntry: async (data: CreateEntryDto): Promise<DiaryEntryResponse> => {
    const response = await api.post<DiaryEntryResponse>("/diaries", data);
    return response.data;
  },

  listEntries: async (): Promise<DiaryEntryListItem[]> => {
    const response = await api.get<DiaryEntryListItem[]>("/diaries");
    return response.data;
  },

  searchEntries: async (
    params: SearchParams
  ): Promise<DiaryEntryListItem[]> => {
    const response = await api.get<DiaryEntryListItem[]>("/diaries/search", {
      params,
    });
    return response.data;
  },

  getDecryptedEntry: async (
    id: number,
    password: string
  ): Promise<DiaryEntryResponse> => {
    const data: DecryptEntryDto = { password };
    const response = await api.post<DiaryEntryResponse>(
      `/diaries/${id}/decrypt`,
      data
    );
    return response.data;
  },

  updateEntry: async (
    id: number,
    data: UpdateEntryDto
  ): Promise<DiaryEntryResponse> => {
    const response = await api.put<DiaryEntryResponse>(`/diaries/${id}`, data);
    return response.data;
  },

  deleteEntry: async (id: number): Promise<void> => {
    await api.delete(`/diaries/${id}`);
  },
};
