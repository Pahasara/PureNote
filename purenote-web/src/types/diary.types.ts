export interface CreateEntryDto {
  title: string;
  content: string;
  password: string;
  mood?: string;
  tags?: string[];
}

export interface UpdateEntryDto {
  title: string;
  content: string;
  password: string;
  mood?: string;
  tags?: string[];
}

export interface DecryptEntryDto {
  password: string;
}

export interface DiaryEntryListItem {
  id: number;
  title: string;
  mood?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntryResponse {
  id: number;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  fromDate?: string;
  toDate?: string;
  mood?: string;
  tags?: string;
  searchText?: string;
}
