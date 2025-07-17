'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does SyncTunez work?",
    answer: "SyncTunez connects to your Spotify account and compares your playlists with your friends'. It finds songs you both love and creates collaborative playlists that everyone will enjoy. No more skipping songs during group hangouts!"
  },
      {
      question: "Is SyncTunez free to use?",
      answer: "Absolutely! You can create your first playlist completely free. If you'd like to create more, you can upgrade to SyncTunez Premium for unlimited access"
    },
  {
    question: "Do I need a Spotify Premium account?",
    answer: "No, you can use SyncTunez with any Spotify account (free or premium). "
  },
  {
    question: "Is my music data safe?",
    answer: "Absolutely! We only access the playlists you specifically choose to share. Your music data is never sold or shared with third parties. We use secure OAuth authentication through Spotify."
  },
  {
    question: "Can I use SyncTunez with other music services?",
    answer: "Currently, SyncTunez works with Spotify. We're working on adding support for other music streaming services like Apple Music and YouTube Music in the future."
  },
  {
    question: "Can I edit the collaborative playlists after they're created?",
    answer: "Yes! Once a collaborative playlist is created, you can edit it on Spotify just like any other playlist. Add, remove, or reorder songs as needed."
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f766e]">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Got questions about SyncTunez? We've got answers.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto items-stretch">
          {faqData.map((item, index) => (
            <Collapsible
              key={index}
              open={openItems.has(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <Card className="group border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden h-full flex flex-col hover:bg-muted/30">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 cursor-pointer transition-colors duration-200 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-left leading-tight flex-1 group-hover:text-primary transition-colors duration-200">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-all duration-300 flex-shrink-0 mt-0.5 group-hover:text-primary",
                          openItems.has(index) && "rotate-180"
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4 px-4 flex-1 flex flex-col">
                    <div className="border-t border-border/30 pt-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a 
              href="/contact" 
              className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
} 