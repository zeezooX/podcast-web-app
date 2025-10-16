import Image from "next/image";
import { Play } from "lucide-react";
import { Episode, formatDate } from "@/types/episode";

interface EpisodeCardProps {
  readonly episode: Episode;
  readonly onPlay: () => void;
  readonly onClick: () => void;
}

export default function EpisodeCard({ episode, onPlay, onClick }: EpisodeCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 hover:scale-[1.02] hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Episode Image */}
      <div className="flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl transition-transform duration-300 w-full sm:w-auto">
        <Image
          src={episode.thumbnail}
          alt={episode.title}
          width={96}
          height={96}
          className="rounded-xl md:rounded-2xl object-cover transition-transform duration-300 hover:scale-110 w-full sm:w-24 h-auto sm:h-24"
        />
      </div>
      
      {/* Episode Info */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <h3 className="font-lexend font-semibold text-gray-800 text-[0.9375rem] md:text-[1rem] leading-[1.25rem] md:leading-[1.375rem] mb-1.5 transition-colors duration-200 hover:text-purple-500 line-clamp-2">
          {episode.title}
        </h3>
        <p className="font-inter text-[0.8125rem] md:text-[0.875rem] text-gray-500 mb-1.5 transition-colors duration-200 line-clamp-1">
          {episode.members}
        </p>
        <div className="flex items-center gap-2 font-inter text-[0.8125rem] md:text-[0.875rem] text-gray-500 transition-colors duration-200">
          <span>{formatDate(episode.publishedAt)}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full transition-colors duration-200"></span>
          <span>{episode.durationFormatted}</span>
        </div>
      </div>
      
      {/* Play Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border-[1.5px] border-green-500 flex items-center justify-center hover:bg-green-500 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md group self-end sm:self-center"
        aria-label="Play episode"
      >
        <Play className="w-4 h-4 md:w-5 md:h-5 text-green-500 fill-green-500 ml-0.5 group-hover:text-white group-hover:fill-white transition-colors duration-300" />
      </button>
    </div>
  );
}
