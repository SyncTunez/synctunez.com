import React from "react";
import SecureContentWrapper from "@/components/SecureContentWrapper";
import { Button } from "@/components/ui/button";
import { buildUrl } from "@/lib/api/apiClient";
import MergePlaylistsContent from "./MergePlaylistsContent";

export default function MergePlaylistsPage() {
  return (
    <SecureContentWrapper
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-semibold mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to merge playlists.</p>
          <Button asChild>
            <a href={buildUrl("/login")}>Sign In</a>
          </Button>
        </div>
      }
    >
      <MergePlaylistsContent />
    </SecureContentWrapper>
  );
} 