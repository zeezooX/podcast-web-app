import type { Podcast } from '@/types/podcast';
import type { Episode } from '@/types/episode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert backend Podcast model to frontend Episode interface
 */
export function podcastToEpisode(podcast: Podcast): Episode {
  const duration = podcast.duration || 0;
  
  return {
    id: podcast._id,
    title: podcast.title,
    members: podcast.author,
    publishedAt: new Date(podcast.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
    thumbnail: podcast.imageUrl ? `${API_BASE_URL}${podcast.imageUrl}` : 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop',
    description: podcast.description,
    duration,
    durationFormatted: formatDuration(duration),
    url: podcast.audioUrl ? `${API_BASE_URL}${podcast.audioUrl}` : '',
    uploadedBy: podcast.uploadedBy ? {
      id: podcast.uploadedBy._id,
      name: podcast.uploadedBy.name,
      email: podcast.uploadedBy.email,
    } : undefined,
  };
}

/**
 * Convert array of backend Podcasts to frontend Episodes
 */
export function podcastsToEpisodes(podcasts: Podcast[]): Episode[] {
  return podcasts.map(podcastToEpisode);
}
