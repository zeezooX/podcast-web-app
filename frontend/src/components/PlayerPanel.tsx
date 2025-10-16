"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Loader2 } from "lucide-react";
import { Episode } from "@/types/episode";

interface PlayerPanelProps {
  readonly episode: Episode | null;
  readonly isPlaying: boolean;
  readonly onPlayPause: () => void;
  readonly onNext?: () => void;
  readonly onPrevious?: () => void;
  readonly isRepeatMode?: boolean;
  readonly isShuffleMode?: boolean;
  readonly onToggleRepeat?: () => void;
  readonly onToggleShuffle?: () => void;
}

export default function PlayerPanel({ 
  episode, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  isRepeatMode = false,
  isShuffleMode = false,
  onToggleRepeat,
  onToggleShuffle
}: PlayerPanelProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevEpisodeId = useRef<string | null>(null);

  // Update audio source when episode changes
  useEffect(() => {
    if (episode && audioRef.current && episode.url) {
      const isNewEpisode = prevEpisodeId.current !== null && prevEpisodeId.current !== episode.id;
      
      setIsAudioReady(false);
      audioRef.current.src = episode.url;
      audioRef.current.load();
      setCurrentTime(0);
      
      // Auto-play when episode changes via next/previous
      if (isNewEpisode) {
        audioRef.current.play().catch(err => {
          console.error('Failed to auto-play new episode:', err);
        });
      }
      
      prevEpisodeId.current = episode.id;
    }
  }, [episode]);

  // Play/pause when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Failed to play audio:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || episode?.duration || 0);
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    if (isRepeatMode) {
      // Repeat mode: restart current episode
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Failed to repeat audio:', err);
        });
      }
    } else if (onNext) {
      onNext();
    } else {
      onPlayPause(); // Stop playing if no next episode
    }
  };

  // Handle audio ready to play
  const handleCanPlay = () => {
    setIsAudioReady(true);
  };

  // Handle audio error
  const handleError = () => {
    setIsAudioReady(false);
    console.error('Error loading audio');
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!episode) {
    return (
      <div className="w-full lg:w-[26.5rem] h-[12rem] lg:h-full bg-purple-500 flex flex-row lg:flex-col items-center justify-center px-8 lg:px-16 text-center transition-all duration-300">
        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-b from-purple-300 to-purple-400 flex items-center justify-center lg:mb-6 mr-4 lg:mr-0 animate-pulse">
          <Image
            src="/logo.svg"
            alt="Podcastr"
            width={24}
            height={24}
            className="lg:w-[32px] lg:h-[32px] brightness-0 invert transition-transform duration-300"
          />
        </div>
        <h2 className="font-lexend font-semibold text-white text-[1rem] lg:text-[1.25rem] leading-[1.5rem] lg:leading-[1.75rem] transition-all duration-300">
          Select a podcast to listen
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[26.5rem] h-auto lg:h-full bg-purple-500 flex flex-col transition-all duration-300">
      {/* Hidden audio element */}
      {episode?.url && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          onError={handleError}
          preload="metadata"
        />
      )}
      
      {/* Top section with image and info */}
      <div className="flex-1 flex flex-row lg:flex-col items-center justify-start lg:justify-center px-4 sm:px-8 lg:px-16 pt-4 lg:pt-16 pb-4 lg:pb-8 animate-in fade-in duration-500 gap-4 lg:gap-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[18rem] lg:h-[18rem] rounded-2xl lg:rounded-3xl overflow-hidden lg:mb-8 shadow-2xl transition-all duration-500 hover:shadow-purple-400/50 hover:scale-105 flex-shrink-0">
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            width={288}
            height={288}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        <div className="text-left lg:text-center w-full lg:px-4 animate-in slide-in-from-bottom duration-500 delay-100 flex-1 min-w-0">
          <h2 className="font-lexend font-semibold text-white text-[1rem] lg:text-[1.25rem] leading-[1.5rem] lg:leading-[1.75rem] mb-1 lg:mb-2.5 line-clamp-2 transition-all duration-300">
            {episode.title}
          </h2>
          <p className="font-inter text-purple-200 text-[0.75rem] lg:text-[0.875rem] transition-all duration-300 line-clamp-1">
            {episode.members}
          </p>
        </div>
      </div>

      {/* Player controls */}
      <div className="px-4 sm:px-8 lg:px-16 pb-6 lg:pb-14 animate-in slide-in-from-bottom duration-500 delay-200">
        {/* Progress bar */}
        <div className="mb-4 lg:mb-7">
          <input
            type="range"
            min="0"
            max={duration || episode.duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties}
            className="w-full h-1 rounded-full appearance-none cursor-pointer player-slider transition-all duration-300"
          />
          <div className="flex justify-between mt-2 lg:mt-2.5">
            <span className="font-inter text-[0.75rem] lg:text-[0.875rem] text-purple-200 transition-all duration-300">
              {formatTime(currentTime)}
            </span>
            <span className="font-inter text-[0.75rem] lg:text-[0.875rem] text-purple-200 transition-all duration-300">
              {formatTime(duration || episode.duration || 0)}
            </span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between max-w-md mx-auto lg:max-w-none">
          <button
            onClick={onToggleShuffle}
            className={`relative transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:block ${
              isShuffleMode 
                ? 'text-white' 
                : 'text-purple-200 hover:text-white'
            }`}
            disabled={!onToggleShuffle}
            aria-label="Shuffle"
          >
            <Shuffle className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-200" />
            {isShuffleMode && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={onPrevious}
            className="text-purple-200 hover:text-white transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
            disabled={!onPrevious}
            aria-label="Previous"
          >
            <SkipBack className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-200" />
          </button>
          <button
            onClick={onPlayPause}
            className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-purple-700 hover:bg-purple-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label={!isAudioReady ? "Loading" : isPlaying ? "Pause" : "Play"}
            disabled={!isAudioReady}
          >
            {!isAudioReady ? (
              <Loader2 className="w-6 h-6 lg:w-7 lg:h-7 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 lg:w-7 lg:h-7 text-white fill-white transition-all duration-200" />
            ) : (
              <Play className="w-6 h-6 lg:w-7 lg:h-7 text-white fill-white ml-1 transition-all duration-200" />
            )}
          </button>
          <button
            onClick={onNext}
            className="text-purple-200 hover:text-white transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
            disabled={!onNext}
            aria-label="Next"
          >
            <SkipForward className="w-6 h-6 lg:w-7 lg:h-7 transition-transform duration-200" />
          </button>
          <button
            onClick={onToggleRepeat}
            className={`relative transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:block ${
              isRepeatMode 
                ? 'text-white' 
                : 'text-purple-200 hover:text-white'
            }`}
            disabled={!onToggleRepeat}
            aria-label="Repeat"
          >
            <Repeat className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-200" />
            {isRepeatMode && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
