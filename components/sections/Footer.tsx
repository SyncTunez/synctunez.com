'use client';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 h-[120px] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left Section - Company Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-bold text-foreground">SyncTunez</h3>
            <p className="text-sm text-muted-foreground">© 2025 SyncTunez. All rights reserved.</p>
          </div>
          
          {/* Right Section - Navigation Links */}
          <div className="flex items-center gap-6">
            <a 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 