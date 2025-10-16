import Image from "next/image";
import { Play } from "lucide-react";
import { Episode, formatDate } from "@/types/episode";

interface EpisodeListProps {
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
  onEpisodeClick: (episode: Episode) => void;
}

export default function EpisodeList({ episodes, onPlay, onEpisodeClick }: Readonly<EpisodeListProps>) {
  return (
    <div className="overflow-x-auto">
      {/* Desktop/Tablet Table View */}
      <table className="w-full border-collapse hidden md:table">
        <thead>
          <tr className="border-b border-gray-100 transition-colors duration-200">
            <th className="pb-3 pr-6 text-left font-inter text-[0.75rem] text-gray-500 uppercase font-medium tracking-wider"></th>
            <th className="pb-3 px-6 text-left font-inter text-[0.75rem] text-gray-500 uppercase font-medium tracking-wider">Podcast</th>
            <th className="pb-3 px-6 text-left font-inter text-[0.75rem] text-gray-500 uppercase font-medium tracking-wider hidden lg:table-cell">Members</th>
            <th className="pb-3 px-6 text-left font-inter text-[0.75rem] text-gray-500 uppercase font-medium tracking-wider hidden xl:table-cell">Date</th>
            <th className="pb-3 px-6 text-left font-inter text-[0.75rem] text-gray-500 uppercase font-medium tracking-wider">Duration</th>
            <th className="pb-3 pl-6"></th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr 
              key={episode.id} 
              className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer hover:shadow-sm"
              onClick={() => onEpisodeClick(episode)}
            >
              <td className="py-4 pr-6">
                <div className="overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
                  <Image
                    src={episode.thumbnail}
                    alt={episode.title}
                    width={64}
                    height={64}
                    className="rounded-lg transition-transform duration-300"
                  />
                </div>
              </td>
              <td className="py-4 px-6">
                <h4 className="font-lexend font-semibold text-gray-800 text-[0.9375rem] lg:text-[1rem] transition-colors duration-200 hover:text-purple-500 line-clamp-2">
                  {episode.title}
                </h4>
              </td>
              <td className="py-4 px-6 hidden lg:table-cell">
                <p className="font-inter text-[0.875rem] text-gray-500 transition-colors duration-200 line-clamp-1">
                  {episode.members}
                </p>
              </td>
              <td className="py-4 px-6 hidden xl:table-cell">
                <span className="font-inter text-[0.875rem] text-gray-500 transition-colors duration-200">
                  {formatDate(episode.publishedAt)}
                </span>
              </td>
              <td className="py-4 px-6">
                <span className="font-inter text-[0.8125rem] lg:text-[0.875rem] text-gray-500 transition-colors duration-200">
                  {episode.durationFormatted}
                </span>
              </td>
              <td className="py-4 pl-6 pr-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(episode);
                  }}
                  className="w-10 h-10 rounded-lg bg-white border-[1.5px] border-gray-200 flex items-center justify-center hover:border-purple-500 hover:bg-purple-500 hover:scale-110 transition-all duration-300 group"
                  aria-label={`Play ${episode.title}`}
                >
                  <Play className="w-4 h-4 text-purple-500 fill-purple-500 ml-0.5 group-hover:text-white group-hover:fill-white transition-colors duration-300" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center gap-4"
            onClick={() => onEpisodeClick(episode)}
          >
            <div className="flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105">
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                width={64}
                height={64}
                className="rounded-lg transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-lexend font-semibold text-gray-800 text-[0.9375rem] transition-colors duration-200 hover:text-purple-500 line-clamp-2 mb-1">
                {episode.title}
              </h4>
              <div className="flex items-center gap-2 font-inter text-[0.75rem] text-gray-500">
                <span>{episode.durationFormatted}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="truncate">{episode.members}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(episode);
              }}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border-[1.5px] border-gray-200 flex items-center justify-center hover:border-purple-500 hover:bg-purple-500 hover:scale-110 transition-all duration-300 group"
              aria-label={`Play ${episode.title}`}
            >
              <Play className="w-4 h-4 text-purple-500 fill-purple-500 ml-0.5 group-hover:text-white group-hover:fill-white transition-colors duration-300" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
