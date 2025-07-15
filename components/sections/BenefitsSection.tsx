'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Quote, User } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { FloatingUpArrow } from "@/components/ui/floating-up-arrow";

export function BenefitsSection() {
  const testimonial1 = useInView<HTMLDivElement>();
  const testimonial2 = useInView<HTMLDivElement>();
  const testimonial3 = useInView<HTMLDivElement>();

  return (
    <section id="benefits" className="min-h-screen bg-[#134e4a]/5 flex items-center relative">
      <div className="absolute left-12 top-12 hidden lg:block">
        <FloatingUpArrow />
      </div>
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
              className="mt-8 text-lg px-8 py-6 h-auto bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#14b8a6] hover:from-[#0d9488] hover:via-[#14b8a6] hover:to-[#0f766e] text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#134e4a]/25 hover:scale-[1.02] transition-all duration-200 font-semibold overflow-hidden w-full sm:w-auto min-w-[250px]
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
                <span className="ml-2">Get Started</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </div>

          <div className="lg:order-2">
            <div className="space-y-6">
              {/* Testimonial 1 */}
              <div 
                ref={testimonial1.ref}
                className={`transition-all duration-[1500ms] transform ${
                  testimonial1.isInView ? 'opacity-100 translate-y-0 lg:translate-x-0' : 'opacity-0 translate-y-12 lg:translate-x-full'
                }`}
              >
                <Card className="bg-card/50 py-2 lg:mr-auto lg:ml-0 lg:max-w-[85%] transform lg:-translate-x-8">
                  <CardContent className="py-2">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#134e4a] flex items-center justify-center flex-shrink-0">
                        <Quote className="h-4 w-4 text-white" />
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
                  testimonial2.isInView ? 'opacity-100 translate-y-0 lg:translate-x-0' : 'opacity-0 translate-y-12 lg:translate-x-full'
                }`}
              >
                <Card className="bg-card/50 py-2 lg:mx-auto lg:max-w-[85%]">
                  <CardContent className="py-2">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#134e4a] flex items-center justify-center flex-shrink-0">
                        <Quote className="h-4 w-4 text-white" />
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
                  testimonial3.isInView ? 'opacity-100 translate-y-0 lg:translate-x-0' : 'opacity-0 translate-y-12 lg:translate-x-full'
                }`}
              >
                <Card className="bg-card/50 py-2 lg:ml-auto lg:mr-0 lg:max-w-[85%] transform lg:translate-x-8">
                  <CardContent className="py-2">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#134e4a] flex items-center justify-center flex-shrink-0">
                        <Quote className="h-4 w-4 text-white" />
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
  );
} 