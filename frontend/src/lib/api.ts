import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials 
} from '@/types/auth';
import type {
  PodcastsResponse,
  PodcastResponse,
  CreatePodcastData
} from '@/types/podcast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },
};

export const podcastApi = {
  async getAllPodcasts(): Promise<PodcastsResponse> {
    const response = await fetch(`${API_URL}/podcasts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch podcasts');
    }

    return data;
  },

  async getPodcastById(id: string): Promise<PodcastResponse> {
    const response = await fetch(`${API_URL}/podcast/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch podcast');
    }

    return data;
  },

  async createPodcast(podcastData: CreatePodcastData, token: string): Promise<PodcastResponse> {
    const formData = new FormData();
    formData.append('title', podcastData.title);
    formData.append('description', podcastData.description);
    formData.append('author', podcastData.author);
    if (podcastData.category) {
      formData.append('category', podcastData.category);
    }
    formData.append('audio', podcastData.audio);
    if (podcastData.image) {
      formData.append('image', podcastData.image);
    }

    const response = await fetch(`${API_URL}/podcast`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create podcast');
    }

    return data;
  },

  async deletePodcast(id: string, token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/podcast/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete podcast');
    }

    return data;
  },

  getAudioUrl(audioFileId: string): string {
    return `${API_URL}/files/audio/${audioFileId}`;
  },

  getImageUrl(imageFileId: string): string {
    return `${API_URL}/files/image/${imageFileId}`;
  },
};
