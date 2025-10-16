export interface Podcast {
  _id: string;
  title: string;
  description: string;
  author: string;
  category?: string;
  imageFileId?: string;
  audioFileId: string;
  duration?: number;
  fileSize?: number;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
  audioUrl?: string;
}

export interface PodcastsResponse {
  success: boolean;
  count: number;
  data: Podcast[];
}

export interface PodcastResponse {
  success: boolean;
  data: Podcast;
}

export interface CreatePodcastData {
  title: string;
  description: string;
  author: string;
  category?: string;
  audio: File;
  image?: File;
}
