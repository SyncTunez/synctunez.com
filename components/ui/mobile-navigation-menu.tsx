interface MobileNavigationMenuProps {
    selectedTab: number;
    setSelectedTab: (tab: number) => void;
}

export function MobileNavigationMenu({ selectedTab, setSelectedTab }: MobileNavigationMenuProps) {
    return (
        <nav className="sm:hidden w-full flex justify-center mb-4">
            <div className="flex rounded-lg border bg-card shadow-sm overflow-hidden">
                <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 0 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setSelectedTab(0)}
                >
                    Overview
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${selectedTab === 1 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setSelectedTab(1)}
                >
                    Billing
                </button>
            </div>
        </nav>
    );
} 