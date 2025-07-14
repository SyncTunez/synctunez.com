'use client';

import { Button } from "@/components/ui/button";
import { Music, Users, Heart, Sparkles } from "lucide-react";
import { GenreChart } from "@/components/ui/genre-chart";
import { LearnMoreButton } from "@/components/ui/learn-more-button";
import { useInView } from "@/hooks/useInView";

export function HeroSection() {
  // Add hooks for playlist items
  const playlistItem1 = useInView<HTMLDivElement>();
  const playlistItem2 = useInView<HTMLDivElement>();
  const playlistItem3 = useInView<HTMLDivElement>();
  const playlistItem4 = useInView<HTMLDivElement>();
  const playlistItem5 = useInView<HTMLDivElement>();
  const matchScore = useInView<HTMLDivElement>();
  const genreChart = useInView<HTMLDivElement>();
  const matchBadge = useInView<HTMLDivElement>();

  return (
    <section id="hero" className="relative bg-[#134e4a]/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
        <div className="grid xl:grid-cols-2 gap-8 xl:gap-16 xl:gap-24 xl:items-center min-h-screen">
          {/* Left Content */}
          <div className="text-left py-8 xl:pr-8 min-h-screen xl:min-h-0 flex flex-col justify-center">
            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 pt-12 xl:pt-0">
              Stop Skipping, <br />
              <span className="inline-block bg-gradient-to-r from-[#0f766e] via-[#2dd4bf] to-[#14b8a6] text-transparent bg-clip-text transform rotate-[0.1deg] [text-shadow:_1px_1px_0_rgb(13_148_136/_30%),_0_1px_8px_rgb(15_118_110_/_15%)]">
                Start Syncing
              </span>
            </h1>
            
            {/* Hero Description */}
            <div className="mb-12 max-w-xl">
              <p className="text-xl font-bold text-foreground mb-3 leading-relaxed">
                Create Your Perfect Playlist
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Compare playlists with friends and create a collaborative mix of all your shared favorites
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Button 
                size="lg" 
                className="relative text-lg px-8 py-6 h-auto bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#14b8a6] hover:from-[#0d9488] hover:via-[#14b8a6] hover:to-[#0f766e] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#134e4a]/25 hover:scale-[1.02] transition-all duration-200 font-semibold overflow-hidden
                  [background-size:200%_200%]
                  animate-[gradientMove_3s_ease-in-out_infinite]
                  before:absolute before:inset-0
                  before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0
                  before:translate-x-[-200%]
                  before:animate-[shimmer_2s_ease-in-out_infinite]
                  before:skew-x-[-20deg]
                  before:w-[75%]"
              >
                <span className="relative flex items-center">
                  <span>🎧</span>
                  <span className="ml-2">Match Playlists Now</span>
                </span>
              </Button>
              <LearnMoreButton />
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center xl:order-2 xl:pl-4 xl:pl-8 pb-24 xl:pb-0">
            <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[600px] xl:w-full xl:max-w-none">
              {/* Main Demo Image */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative">
                {/* Star icon in top right */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl hidden lg:flex">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                {/* Heart icon in bottom left */}
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl hidden lg:flex">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-6">
                  {/* Mock App Interface */}
                  <div className="bg-muted rounded-lg p-4 pb-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Playlist Match</h3>
                        <p className="text-sm text-muted-foreground">Sarah & Alex</p>
                      </div>
                    </div>
                    
                    {/* Mock playlist items */}
                    <div className="space-y-1">
                      <div 
                        ref={playlistItem1.ref}
                        className={`transition-all duration-500 transform ${
                          playlistItem1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0 lg:animate-[slideInLeft_0.5s_ease-out_forwards]'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Blinding Lights</p>
                            <p className="text-xs text-muted-foreground">The Weeknd</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        ref={playlistItem2.ref}
                        className={`transition-all duration-500 transform ${
                          playlistItem2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0 lg:animate-[slideInLeft_0.5s_ease-out_0.2s_forwards]'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">As It Was</p>
                            <p className="text-xs text-muted-foreground">Harry Styles</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        ref={playlistItem3.ref}
                        className={`transition-all duration-500 transform ${
                          playlistItem3.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0 lg:animate-[slideInLeft_0.5s_ease-out_0.4s_forwards]'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Anti-Hero</p>
                            <p className="text-xs text-muted-foreground">Taylor Swift</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        ref={playlistItem4.ref}
                        className={`transition-all duration-500 transform ${
                          playlistItem4.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0 lg:animate-[slideInLeft_0.5s_ease-out_0.6s_forwards]'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Flowers</p>
                            <p className="text-xs text-muted-foreground">Miley Cyrus</p>
                          </div>
                        </div>
                      </div>

                      <div 
                        ref={playlistItem5.ref}
                        className={`transition-all duration-500 transform ${
                          playlistItem5.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0 lg:animate-[slideInLeft_0.5s_ease-out_0.8s_forwards]'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">About Damn Time</p>
                            <p className="text-xs text-muted-foreground">Lizzo</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-0">
                        <div 
                          ref={matchBadge.ref}
                          className={`p-1.5 rounded-md text-center bg-[#1DB954]/30 border border-[#1DB954]/50 shadow-lg relative transition-all duration-500 transform ${
                            matchBadge.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0 lg:animate-[slideUpHigher_0.5s_ease-out_1.3s_forwards]'
                          }`}
                        >
                          <p className="text-sm font-medium text-[#1DB954] relative z-10">
                            <span className="mr-1">✨</span>
                            15 songs matched!
                            <span className="ml-1">✨</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      ref={matchScore.ref}
                      className={`bg-muted rounded-lg p-4 text-center shadow-lg flex flex-col justify-center transition-all duration-500 transform ${
                        matchScore.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0 lg:animate-[slideUp_0.5s_ease-out_1s_forwards]'
                      }`}
                    >
                      <p className="text-4xl font-bold text-primary leading-none mb-1">85%</p>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>
                    <div 
                      ref={genreChart.ref}
                      className={`bg-muted rounded-lg p-4 text-center shadow-lg transition-all duration-500 transform ${
                        genreChart.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0 lg:animate-[slideUp_0.5s_ease-out_1.2s_forwards]'
                      }`}
                    >
                      <div className="h-[100px]">
                        <GenreChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 