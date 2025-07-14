'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Heart, Sparkles, ArrowRight, CheckCircle, Search, List, SkipForward, User, Play, RotateCw, Quote } from "lucide-react";
import { GenreChart } from "@/components/ui/genre-chart";
import { LearnMoreButton } from "@/components/ui/learn-more-button";
import { useInView } from "@/hooks/useInView";

export default function Home() {
  const row1Card1 = useInView<HTMLDivElement>();
  const row1Card2 = useInView<HTMLDivElement>();
  const row2Card1 = useInView<HTMLDivElement>();
  const row2Card2 = useInView<HTMLDivElement>();
  const row3Card1 = useInView<HTMLDivElement>();
  const row3Card2 = useInView<HTMLDivElement>();
  
  // Add hooks for testimonials
  const testimonial1 = useInView<HTMLDivElement>();
  const testimonial2 = useInView<HTMLDivElement>();
  const testimonial3 = useInView<HTMLDivElement>();

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#134e4a]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
            {/* Left Content */}
            <div className="text-left py-8 lg:pr-8">
              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
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
              <div className="flex flex-col sm:flex-row gap-5 mb-10">
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
              
              {/* Stats */}
              
            </div>

            {/* Right Image */}
            <div className="relative lg:order-2 lg:pl-4 xl:pl-8">
              <div className="relative max-w-2xl lg:max-w-none mx-auto">
                {/* Main Demo Image */}
                <div className="bg-card rounded-2xl p-8 shadow-2xl relative">
                  {/* Star icon in top right */}
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                  {/* Heart icon in bottom left */}
                  <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl">
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
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md animate-[slideInLeft_0.5s_ease-out_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Blinding Lights</p>
                              <p className="text-xs text-muted-foreground">The Weeknd</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md animate-[slideInRight_0.5s_ease-out_0.2s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Good 4 U</p>
                              <p className="text-xs text-muted-foreground">Olivia Rodrigo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md animate-[slideInLeft_0.5s_ease-out_0.4s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Levitating</p>
                              <p className="text-xs text-muted-foreground">Dua Lipa</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md animate-[slideInRight_0.5s_ease-out_0.6s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">As It Was</p>
                              <p className="text-xs text-muted-foreground">Harry Styles</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md animate-[slideInLeft_0.5s_ease-out_0.8s_forwards] opacity-0 mb-1.5">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Anti-Hero</p>
                              <p className="text-xs text-muted-foreground">Taylor Swift</p>
                            </div>
                          </div>
                      </div>
                      
                      <div className="mt-0">
                        <div className="p-1.5 rounded-md text-center bg-[#1DB954]/30 border border-[#1DB954]/50 shadow-lg relative opacity-0 animate-[slideUpHigher_0.5s_ease-out_1.3s_forwards]">
                          <p className="text-sm font-medium text-[#1DB954] relative z-10">
                            <span className="mr-1">✨</span>
                            15 songs matched!
                            <span className="ml-1">✨</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-4 text-center shadow-lg flex flex-col justify-center opacity-0 animate-[slideUp_0.5s_ease-out_1s_forwards]">
                          <p className="text-4xl font-bold text-primary leading-none mb-1">85%</p>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4 text-center shadow-lg opacity-0 animate-[slideUp_0.5s_ease-out_1.2s_forwards]">
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

      {/* Problem-Solution Section */}
      <section id="problems-solutions" className="min-h-screen bg-background flex flex-col justify-center overflow-hidden py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-32 xl:px-48 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Discover Your Shared Sound
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Say goodbye to playlist wars. Create playlists everyone can vibe to.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
            <div className="lg:pr-8">
              {/* Row 1: Endless Scroll vs Perfect Match */}
              <div className="grid md:grid-cols-2 items-stretch gap-12">
                <div 
                  ref={row1Card1.ref}
                  className={`flex justify-end transition-all duration-[1500ms] ease-out transform ${
                    row1Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <Card className="bg-card/80 relative overflow-hidden w-full min-w-[400px] h-[200px]">
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
                  className={`flex justify-start transition-all duration-[1500ms] delay-[185ms] ease-out transform ${
                    row1Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <div className="relative w-full min-w-[400px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                      SyncTunez
                    </div>
                    <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-[200px]">
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
              <div className="grid md:grid-cols-2 items-stretch gap-12 mt-12 lg:translate-x-64">
                <div 
                  ref={row2Card1.ref}
                  className={`flex justify-end transition-all duration-[1500ms] delay-[375ms] ease-out transform ${
                    row2Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <Card className="bg-card/80 relative overflow-hidden w-full min-w-[400px] h-[200px]">
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
                  className={`flex justify-start transition-all duration-[1500ms] delay-[560ms] ease-out transform ${
                    row2Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <div className="relative w-full min-w-[400px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                      SyncTunez
                    </div>
                    <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-[200px]">
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
              <div className="grid md:grid-cols-2 items-stretch gap-12 mt-12 lg:translate-x-[32rem]">
                <div 
                  ref={row3Card1.ref}
                  className={`flex justify-end transition-all duration-[1500ms] delay-[750ms] ease-out transform ${
                    row3Card1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <Card className="bg-card/80 relative overflow-hidden w-full min-w-[400px] h-[200px]">
                    <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="relative w-10 h-6">
                          <User className="h-6 w-6 text-destructive absolute -left-1" />
                          <User className="h-6 w-6 text-destructive absolute -right-1" />
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2 text-destructive text-center">The Connection Gap</CardTitle>
                      <CardDescription className="text-base text-center">
                        Beyond small talk: Wish you could instantly bond over a shared love for that niche band or obscure genre?
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>

                <div 
                  ref={row3Card2.ref}
                  className={`flex justify-start transition-all duration-[1500ms] delay-[935ms] ease-out transform ${
                    row3Card2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                  }`}
                >
                  <div className="relative w-full min-w-[400px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042f2e] text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20 z-10">
                      SyncTunez
                    </div>
                    <Card className="bg-[#134e4a] text-white relative overflow-hidden w-full h-[200px]">
                      <CardContent className="pt-4 pb-3 h-full flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <div className="relative">
                            <Users className="h-6 w-6 text-white" />
                            <Heart className="h-3 w-3 text-white absolute -top-1 -right-1" />
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2 text-white text-center">Your Music Community</CardTitle>
                        <CardDescription className="text-base text-white/80 text-center">
                           Share Playlists, Swap Recommendations, and Discover New Sounds Together.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="min-h-screen bg-[#134e4a]/5 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px] py-24">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center w-full">
            <div className="lg:order-1">
              <h2 className="text-3xl font-bold mb-6 inline-block transform rotate-[0.1deg] [text-shadow:_1px_1px_0_rgb(0_0_0/_10%),_0_1px_8px_rgb(0_0_0/_10%)]">
                Why SyncTunez?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Matching</h3>
                    <p className="text-muted-foreground">
                      Merge playlists and take shared tracks from each
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Measure Compatibility</h3>
                    <p className="text-muted-foreground">
                    Discover your music compatibility score with friends 
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Integration</h3>
                    <p className="text-muted-foreground">
                      Works seamlessly with your favorite music streaming services
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Privacy First</h3>
                    <p className="text-muted-foreground">
                      Your music data is secure and only shared with your consent
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-8 text-lg px-8 py-6 h-auto bg-[#134e4a] hover:bg-[#0d9488] text-white border-0"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="lg:order-2">
              <div className="space-y-6">
                {/* Testimonial 1 */}
                <div 
                  ref={testimonial1.ref}
                  className={`transition-all duration-[1500ms] transform ${
                    testimonial1.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Card className="bg-card/50 py-2 lg:mr-auto lg:ml-0 lg:max-w-[85%] transform lg:-translate-x-8">
                    <CardContent className="py-2">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#134e4a]/10 flex items-center justify-center flex-shrink-0">
                          <Quote className="h-4 w-4 text-[#134e4a]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground italic mb-2">
                            "SyncTunez helped me discover so much amazing music through my friends. Our group hangouts have never been better!"
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#134e4a]/5 flex items-center justify-center">
                              <User className="h-3 w-3 text-[#134e4a]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sarah Chen</p>
                              <p className="text-xs text-muted-foreground">Music Enthusiast</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Testimonial 2 */}
                <div 
                  ref={testimonial2.ref}
                  className={`transition-all duration-[1500ms] delay-[185ms] transform ${
                    testimonial2.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Card className="bg-card/50 py-2 lg:mx-auto lg:max-w-[85%]">
                    <CardContent className="py-2">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#134e4a]/10 flex items-center justify-center flex-shrink-0">
                          <Quote className="h-4 w-4 text-[#134e4a]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground italic mb-2">
                            "The playlist matching is incredible! It's like having a DJ that knows everyone's taste perfectly."
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#134e4a]/5 flex items-center justify-center">
                              <User className="h-3 w-3 text-[#134e4a]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Alex Rivera</p>
                              <p className="text-xs text-muted-foreground">Party Host</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Testimonial 3 */}
                <div 
                  ref={testimonial3.ref}
                  className={`transition-all duration-[1500ms] delay-[375ms] transform ${
                    testimonial3.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <Card className="bg-card/50 py-2 lg:ml-auto lg:mr-0 lg:max-w-[85%] transform lg:translate-x-8">
                    <CardContent className="py-2">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#134e4a]/10 flex items-center justify-center flex-shrink-0">
                          <Quote className="h-4 w-4 text-[#134e4a]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground italic mb-2">
                            "Finally, road trips without the music drama! Everyone's favorites get played and we all discover new songs."
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#134e4a]/5 flex items-center justify-center">
                              <User className="h-3 w-3 text-[#134e4a]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Marcus Johnson</p>
                              <p className="text-xs text-muted-foreground">Road Trip Enthusiast</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}