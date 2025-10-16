export interface Episode {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number; // in seconds
  durationFormatted: string;
  url: string;
}

export const mockEpisodes: Episode[] = [
  {
    id: "1",
    title: "What is good code?",
    members: "Diego and Richard",
    publishedAt: "2021-01-08",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop",
    description: "In this episode, Diego and Richard discuss what makes code truly good. They explore best practices, code readability, maintainability, and the importance of writing clean code that others can understand and build upon.",
    duration: 3318,
    durationFormatted: "55:18",
    url: ""
  },
  {
    id: "2",
    title: "How to get started with programming in 2021",
    members: "Tiago, Diego and Pellizzetti",
    publishedAt: "2021-01-08",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=600&fit=crop",
    description: "The hosts share their insights on starting a programming career in 2021. From choosing the right language to finding learning resources and building your first projects, this episode covers everything beginners need to know.",
    duration: 2140,
    durationFormatted: "35:40",
    url: ""
  },
  {
    id: "3",
    title: "Life is good",
    members: "Tiago, Diego and Pellizzetti",
    publishedAt: "2021-01-08",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=600&fit=crop",
    description: "A more personal episode where the team discusses work-life balance in the tech industry, mental health, and finding joy in programming. They share their own experiences and tips for maintaining a healthy lifestyle while pursuing a career in technology.",
    duration: 4698,
    durationFormatted: "1:18:18",
    url: ""
  },
  {
    id: "4",
    title: "How to program like a god",
    members: "Maria, Tiago and Samuel",
    publishedAt: "2021-01-07",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=600&fit=crop",
    description: "Advanced programming techniques and patterns that separate good developers from great ones. The team discusses design patterns, architecture decisions, and the mindset needed to write exceptional code.",
    duration: 2100,
    durationFormatted: "35:00",
    url: ""
  },
  {
    id: "5",
    title: "Let's live!",
    members: "Diego and Richard",
    publishedAt: "2021-02-12",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop",
    description: "An energetic episode about embracing challenges and living life to the fullest as a developer. Discussion includes taking on new projects, learning new technologies, and stepping out of your comfort zone.",
    duration: 3247,
    durationFormatted: "54:07",
    url: ""
  },
  {
    id: "6",
    title: "Don't give up on yourself",
    members: "Pelpas, Pulili, Pepe and Pupa",
    publishedAt: "2021-03-24",
    thumbnail: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=600&h=600&fit=crop",
    description: "A motivational episode addressing imposter syndrome, dealing with failure, and persevering through difficult times in your programming journey. The hosts share personal stories of overcoming obstacles.",
    duration: 5231,
    durationFormatted: "1:27:11",
    url: ""
  },
  {
    id: "7",
    title: "Life is incredible",
    members: "B1 and B2 going down the stairs",
    publishedAt: "2021-03-25",
    thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=600&fit=crop",
    description: "Celebrating the wins, big and small, in a developer's life. From fixing that one bug to landing a dream job, this episode reminds us why we love what we do.",
    duration: 4698,
    durationFormatted: "1:18:18",
    url: ""
  },
  {
    id: "8",
    title: "Focus your energy",
    members: "Diego and Richard",
    publishedAt: "2021-04-03",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop",
    description: "Productivity tips for developers. Learn how to manage your time effectively, avoid distractions, and channel your energy into meaningful work that drives results.",
    duration: 3600,
    durationFormatted: "1:00:00",
    url: ""
  }
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
}
