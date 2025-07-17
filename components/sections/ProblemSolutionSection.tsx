'use client';

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { List, SkipForward, User, Play, Users, Heart, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export function ProblemSolutionSection() {
  const row1Card1 = useInView<HTMLDivElement>();
  const row1Card2 = useInView<HTMLDivElement>();
  const row2Card1 = useInView<HTMLDivElement>();
  const row2Card2 = useInView<HTMLDivElement>();
  const row3Card1 = useInView<HTMLDivElement>();
  const row3Card2 = useInView<HTMLDivElement>();

  return (
    <section id="problems-solutions" className="bg-background flex flex-col overflow-hidden relative py-16 lg:py-24">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#0f766e]">
            All The Music, None Of The Stress
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make creating the perfect group playlist quick, easy and stress free.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-8 mt-16 lg:mt-24">
          {/* Row 1: Endless Scroll vs Perfect Match */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center xl:translate-x-[-15%] transition-transform duration-500">
            <div 
              ref={row1Card1.ref}
              className={`transition-all duration-[1500ms] ease-out transform ${
                row1Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="bg-card/80 relative overflow-hidden w-[320px] h-[200px] mx-auto lg:mx-0">
                <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <List className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive text-center">The Endless Scroll</CardTitle>
                  <CardDescription className="text-base text-center">
                    That familiar, frustrating cycle of searching for the 'perfect' song, only to be met with blank stares.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div 
              ref={row1Card2.ref}
              className={`transition-all duration-[1500ms] delay-[100ms] ease-out transform ${
                row1Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="relative w-[320px] h-[200px] mx-auto lg:mx-0">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                  SyncTunez
                </div>
                <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-full">
                  <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-white text-center">Perfect Match</CardTitle>
                    <CardDescription className="text-base text-white/80 text-center">
                      Simply import and play. The right music is always ready, no endless searching required.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Row 2: Skip Battle vs Perfect Flow */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center transition-transform duration-500">
            <div 
              ref={row2Card1.ref}
              className={`transition-all duration-[1500ms] delay-[200ms] ease-out transform ${
                row2Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="bg-card/80 relative overflow-hidden w-[320px] h-[200px] mx-auto lg:mx-0">
                <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SkipForward className="h-6 w-6 text-destructive fill-destructive/10" />
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive text-center">The Skip Battle</CardTitle>
                  <CardDescription className="text-base text-center">
                    The dreaded 'skip that!' chorus. When everyone's got an opinion, and no one's really enjoying the music.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div 
              ref={row2Card2.ref}
              className={`transition-all duration-[1500ms] delay-[300ms] ease-out transform ${
                row2Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="relative w-[320px] h-[200px] mx-auto lg:mx-0">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                  SyncTunez
                </div>
                <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-full">
                  <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-white text-center">Uninterrupted Flow</CardTitle>
                    <CardDescription className="text-base text-white/80 text-center">
                      Zero skips. Every track is a pre-approved hit, ensuring everyone's enjoying the music.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Row 3: Connection Gap vs Music Community */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center xl:translate-x-[15%] transition-transform duration-500">
            <div 
              ref={row3Card1.ref}
              className={`transition-all duration-[1500ms] delay-[300ms] ease-out transform ${
                row3Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="bg-card/80 relative overflow-hidden w-[320px] h-[200px] mx-auto lg:mx-0">
                <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative w-10 h-6">
                      <User className="h-6 w-6 text-destructive absolute -left-1" />
                      <User className="h-6 w-6 text-destructive absolute -right-1" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive text-center">The Unplayed Anthem</CardTitle>
                  <CardDescription className="text-base text-center">
                  A favourite niche anthem is silenced from the room. The fear of an awkward pause keeps the best music locked away.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div 
              ref={row3Card2.ref}
              className={`transition-all duration-[1500ms] delay-[400ms] ease-out transform ${
                row3Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="relative w-[320px] h-[200px] mx-auto lg:mx-0">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                  SyncTunez
                </div>
                <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-full">
                  <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="relative">
                        <Users className="h-6 w-6 text-white" />
                        <Heart className="h-3 w-3 text-white absolute -top-1 -right-1" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 text-white text-center">The Shared Treasure</CardTitle>
                    <CardDescription className="text-base text-white/80 text-center">
                    Hidden gems become group favourites. Enjoy the music you really love, with people who get it.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
} 