import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Heart, Sparkles, ArrowRight, CheckCircle, Search, List, SkipForward, User, Play } from "lucide-react";
import { GenreChart } from "@/components/ui/genre-chart";
import { LearnMoreButton } from "@/components/ui/learn-more-button";

export default async function Home() {
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
                <span className="text-[#0f766e]">Start Syncing</span>
              </h1>
              
              {/* Hero Description */}
              <div className="mb-12 max-w-xl">
                <p className="text-xl font-bold text-foreground mb-3 leading-relaxed">
                  Find Your Perfect Playlist Match
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Compare music tastes, discover shared favorites, and create the ultimate collaborative playlists with friends.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 mb-10">
                <Button 
                  size="lg" 
                  className="relative text-lg px-8 py-6 h-auto bg-[#134e4a] hover:bg-[#0d9488] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#134e4a]/25 hover:scale-[1.02] transition-all duration-200 font-semibold overflow-hidden
                    before:absolute before:inset-0
                    before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent
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
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md hover:bg-card/60 transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Blinding Lights</p>
                              <p className="text-xs text-muted-foreground">The Weeknd</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md hover:bg-card/60 transition-colors cursor-pointer group animate-[slideInRight_0.5s_ease-out_0.2s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Good 4 U</p>
                              <p className="text-xs text-muted-foreground">Olivia Rodrigo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md hover:bg-card/60 transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_0.4s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Levitating</p>
                              <p className="text-xs text-muted-foreground">Dua Lipa</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md hover:bg-card/60 transition-colors cursor-pointer group animate-[slideInRight_0.5s_ease-out_0.6s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">As It Was</p>
                              <p className="text-xs text-muted-foreground">Harry Styles</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-card/80 rounded-md hover:bg-card/60 transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_0.8s_forwards] opacity-0 mb-1.5">
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
                            <span className="ml-1">🎉</span>
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
      <section id="problems-solutions" className="h-screen bg-background flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Discover Your Shared Sound
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Say goodbye to playlist wars. Create playlists everyone can vibe to.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 max-w-[800px] mx-auto">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <Card className="text-center bg-card/80 transition-all duration-300 hover:bg-card/90 w-full md:w-[350px] flex flex-col">
                <CardContent className="pt-4 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative w-6 h-6">
                      <List className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive">The Endless Scroll</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    That familiar, frustrating cycle of searching for the 'perfect' song, only to be met with blank stares.
                  </CardDescription>
                </CardContent>
              </Card>

              <div className="hidden md:flex items-center justify-center w-12">
                <ArrowRight className="h-6 w-6 text-[#134e4a]" />
              </div>

              <Card className="text-center relative bg-card transition-all duration-300 hover:bg-card/90 hover:scale-[1.02] hover:shadow-lg w-full md:w-[350px] flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#134e4a] text-white px-3 py-1 rounded-full text-sm">
                SyncTunez
                </div>
                <CardContent className="pt-6 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative">
                      <Users className="h-6 w-6 text-[#134e4a]" />
                      <Music className="h-3 w-3 text-[#134e4a] absolute -top-1 -right-1" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Perfect Match</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    Simply import and play. The right music is always ready, no endless searching required.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <Card className="text-center bg-card/80 transition-all duration-300 hover:bg-card/90 w-full md:w-[350px] flex flex-col">
                <CardContent className="pt-4 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative w-6 h-6">
                      <SkipForward className="h-6 w-6 text-destructive fill-destructive/10" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive">The Skip Battle</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    The dreaded 'skip that!' chorus. When everyone's got an opinion, and no one's really enjoying the music.
                  </CardDescription>
                </CardContent>
              </Card>

              <div className="hidden md:flex items-center justify-center w-12">
                <ArrowRight className="h-6 w-6 text-[#134e4a]" />
              </div>

              <Card className="text-center relative bg-card transition-all duration-300 hover:bg-card/90 hover:scale-[1.02] hover:shadow-lg w-full md:w-[350px] flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#134e4a] text-white px-3 py-1 rounded-full text-sm">
                SyncTunez
                </div>
                <CardContent className="pt-6 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative w-6 h-6">
                      <Play className="h-6 w-6 text-[#134e4a] fill-[#134e4a]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Perfect Flow</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    Zero skips. Every track is a pre-approved hit, ensuring everyone's enjoying the music.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <Card className="text-center bg-card/80 transition-all duration-300 hover:bg-card/90 w-full md:w-[350px] flex flex-col">
                <CardContent className="pt-4 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative w-10 h-6">
                      <User className="h-6 w-6 text-destructive absolute -left-1" />
                      <User className="h-6 w-6 text-destructive absolute -right-1" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2 text-destructive">The Connection Gap</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    Beyond small talk: Wish you could instantly bond over a shared love for that niche band or obscure genre?
                  </CardDescription>
                </CardContent>
              </Card>

              <div className="hidden md:flex items-center justify-center w-12">
                <ArrowRight className="h-6 w-6 text-[#134e4a]" />
              </div>

              <Card className="text-center relative bg-card transition-all duration-300 hover:bg-card/90 hover:scale-[1.02] hover:shadow-lg w-full md:w-[350px] flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#134e4a] text-white px-3 py-1 rounded-full text-sm">
                  SyncTunez
                </div>
                <CardContent className="pt-6 pb-4 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="relative">
                      <Users className="h-6 w-6 text-[#134e4a]" />
                      <Heart className="h-3 w-3 text-[#134e4a] absolute -top-1 -right-1" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Your Music Community</CardTitle>
                  <CardDescription className="text-base flex-1 flex items-center justify-center">
                    Build your ultimate music community. Share playlists, swap recommendations, and experience the joy of discovering new sounds together.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#134e4a]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why SyncTunez?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Matching</h3>
                    <p className="text-muted-foreground">
                      Compare playlists instantly and see your music compatibility score
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a]/10 flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-[#134e4a]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                    <p className="text-muted-foreground">
                      Get personalized suggestions based on shared music interests
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
              <Card className="bg-[#18181b] border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#134e4a]/10 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#134e4a]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl">Your Match</h3>
                          <p className="text-muted-foreground">with Sarah</p>
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-[#0f766e]">85%</div>
                    </div>

                    <div className="h-[200px]">
                      <GenreChart />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-[#1a1f2b] p-4 rounded-lg">
                        <p className="text-2xl font-bold text-[#0f766e] mb-1">127</p>
                        <p className="text-sm text-muted-foreground">Shared Songs</p>
                      </div>
                      <div className="bg-[#1a1f2b] p-4 rounded-lg">
                        <p className="text-2xl font-bold text-[#0f766e] mb-1">8</p>
                        <p className="text-sm text-muted-foreground">Shared Artists</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}