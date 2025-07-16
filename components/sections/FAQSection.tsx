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
    answer: "Yes! SyncTunez is completely free to use. We believe great music experiences should be accessible to everyone."
  },
  {
    question: "Do I need a Spotify Premium account?",
    answer: "No, you can use SyncTunez with any Spotify account (free or premium). However, some features may work better with Premium accounts due to Spotify's API limitations."
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
    answer: "Yes! Once a collaborative playlist is created, you can edit it just like any other Spotify playlist. Add, remove, or reorder songs as needed."
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
    <section id="faq" className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="relative">
              <HelpCircle className="h-6 w-6 text-primary" />
              <Sparkles className="h-3 w-3 text-primary/60 absolute -top-1 -right-1" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Got questions about SyncTunez? We've got answers. 
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-6xl mx-auto">
          {faqData.map((item, index) => (
            <Collapsible
              key={index}
              open={openItems.has(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <Card className="group border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-3 cursor-pointer hover:bg-muted/30 transition-colors duration-200 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-left leading-tight flex-1 group-hover:text-primary transition-colors duration-200">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-all duration-300 flex-shrink-0 mt-0.5 group-hover:text-primary",
                          openItems.has(index) && "rotate-180"
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t border-border/30 pt-2">
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

      </div>
    </section>
  );
} 