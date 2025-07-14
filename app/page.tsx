import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Heart, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { GenreChart } from "@/components/ui/genre-chart";

export default async function Home() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
            {/* Left Content */}
            <div className="text-left py-8 lg:pr-8">
              {/* Hero Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-10">
                <Sparkles className="h-4 w-4" />
                <span>Discover Your Musical Match</span>
              </div>
              
              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
                Connect Through <br />
                <span className="text-[#0f766e]">Music</span>
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
                    before:bg-gradient-to-r before:from-[#0f766e]/0 before:via-[#0f766e]/20 before:to-[#0f766e]/0
                    before:animate-[shimmer_4s_ease-in-out_infinite]
                    animate-[pulse_6s_ease-in-out_infinite]"
                >
                  <span className="relative flex items-center">
                    <span>🎧</span>
                    <span className="ml-2">Match Playlists Now</span>
                  </span>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto hover:scale-[1.02] transition-all duration-200">
                  <Music className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <span>🎵 10k+ Songs Matched</span>
                <span>💚 5k+ Happy Users</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:order-2 lg:pl-4 xl:pl-8">
              <div className="relative max-w-2xl lg:max-w-none mx-auto">
                {/* Main Demo Image */}
                <div className="bg-[#18181b] rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    {/* Mock App Interface */}
                    <div className="bg-[#1a1f2b] rounded-lg p-4 pb-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#134e4a] rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-100" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-100">Playlist Match</h3>
                          <p className="text-sm text-gray-400">Sarah & Alex</p>
                        </div>
                      </div>
                      
                      {/* Mock playlist items */}
                      <div className="space-y-1">
                          <div className="flex items-center gap-3 p-2.5 bg-[#252b3b] rounded-md hover:bg-[#2b324a] transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_forwards] opacity-0">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-[#0f766e]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-100">Blinding Lights</p>
                              <p className="text-xs text-gray-400">The Weeknd</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-[#252b3b] rounded-md hover:bg-[#2b324a] transition-colors cursor-pointer group animate-[slideInRight_0.5s_ease-out_0.2s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-[#0f766e]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-100">Good 4 U</p>
                              <p className="text-xs text-gray-400">Olivia Rodrigo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-2.5 bg-[#252b3b] rounded-md hover:bg-[#2b324a] transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_0.4s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-[#0f766e]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-100">Levitating</p>
                              <p className="text-xs text-gray-400">Dua Lipa</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-[#252b3b] rounded-md hover:bg-[#2b324a] transition-colors cursor-pointer group animate-[slideInRight_0.5s_ease-out_0.6s_forwards] opacity-0">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-[#0f766e]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-100">As It Was</p>
                              <p className="text-xs text-gray-400">Harry Styles</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-2.5 bg-[#252b3b] rounded-md hover:bg-[#2b324a] transition-colors cursor-pointer group animate-[slideInLeft_0.5s_ease-out_0.8s_forwards] opacity-0 mb-1.5">
                            <div className="w-8 h-8 rounded flex items-center justify-center">
                              <Music className="h-4 w-4 text-[#0f766e]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-100">Anti-Hero</p>
                              <p className="text-xs text-gray-400">Taylor Swift</p>
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
                        <div className="bg-[#1a1f2b] rounded-lg p-4 text-center shadow-lg flex flex-col justify-center">
                          <p className="text-4xl font-bold text-[#0f766e] leading-none mb-1">85%</p>
                          <p className="text-xs text-gray-400">Match Score</p>
                        </div>
                        <div className="bg-[#1a1f2b] rounded-lg p-4 text-center shadow-lg">
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

      {/* Problem Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tired of Different Music Tastes?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the challenges of finding common ground in music. Here's what you might be experiencing:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl mb-2">Different Tastes</CardTitle>
                <CardDescription>
                  You and your friends have completely different music preferences
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl mb-2">Playlist Wars</CardTitle>
                <CardDescription>
                  Can't agree on what songs to play during hangouts
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl mb-2">Missing Connection</CardTitle>
                <CardDescription>
                  Hard to find shared musical interests with new friends
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              The Perfect Solution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SyncTunez makes it easy to discover and celebrate your shared music interests
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-[#134e4a]" />
                </div>
                <CardTitle className="text-xl mb-2">Smart Matching</CardTitle>
                <CardDescription>
                  Advanced algorithms find common ground in your music tastes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-[#134e4a]" />
                </div>
                <CardTitle className="text-xl mb-2">Auto Playlists</CardTitle>
                <CardDescription>
                  Create perfect playlists that everyone will enjoy
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#134e4a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#134e4a]" />
                </div>
                <CardTitle className="text-xl mb-2">Social Features</CardTitle>
                <CardDescription>
                  Connect with friends and discover new music together
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why SyncTunez?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a] flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Matching</h3>
                    <p className="text-muted-foreground">
                      Compare playlists instantly and see your music compatibility score
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a] flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                    <p className="text-muted-foreground">
                      Get personalized suggestions based on shared music interests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a] flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Integration</h3>
                    <p className="text-muted-foreground">
                      Works seamlessly with your favorite music streaming services
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#134e4a] flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
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
                        <div className="w-12 h-12 bg-[#134e4a] rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
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