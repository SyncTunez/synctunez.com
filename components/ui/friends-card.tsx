import React, { useContext, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UserContext, UserContextType } from "@/components/auth/UserContext"
import { authorized, buildUrl } from '@/lib/api/apiClient'
import { IconUserPlus, IconShare, IconHeart, IconChevronDown, IconUser } from "@tabler/icons-react"
import { toast } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useLiveResourceJson } from '@/hooks/useLiveResource'
import QRCodeWithLogo from "@/components/ui/QRCodeWithLogo";

// FriendsCardSkeleton component to prevent layout shifts
export function FriendsCardSkeleton({ forceFullHeight = false }: { forceFullHeight?: boolean }) {
  const cardClassName = forceFullHeight
    ? 'flex flex-col sm:h-[600px] sm:min-h-0'
    : 'flex flex-col';

  return (
    <Card className={cardClassName}>
      <CardHeader className="space-y-2 flex-none px-4 py-2 sm:py-3">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* Search and filter skeleton */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
          <Skeleton className="h-10 flex-grow max-w-full sm:max-w-xs" />
          <Skeleton className="h-10 w-full sm:w-[110px]" />
        </div>
      </CardHeader>

      {/* Content skeleton */}
      <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col gap-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-6 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const FILTER_MODES = {
  ALL: 'all',
  RECENT: 'recent',
  FAVORITES: 'favorites',
  ALPHABETICAL: 'alphabetical',
} as const;

type FilterMode = typeof FILTER_MODES[keyof typeof FILTER_MODES];

const LOCAL_STORAGE_KEY = 'favoriteFriends';

const formSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
});

// Add types for API response and friend entry
type FriendApiResponse = {
  username: string;
  addTime: number;
};

type FriendEntry = {
  timestamp: number;
  profileUrl: string;
};

export default function FriendsCard({ forceFullHeight = false }: { forceFullHeight?: boolean }) {
  const userContext = useContext(UserContext) as UserContextType

  const [friends, setFriends] = useState<Map<string, FriendEntry>>(new Map())
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'remove' | 'share'>('add')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>(FILTER_MODES.ALL)


  const [showAddCommand, setShowAddCommand] = useState(false)
  const [addFriendSearch, setAddFriendSearch] = useState('')
  const [debouncedAddFriendSearch, setDebouncedAddFriendSearch] = useState('')
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)

  // Debounce addFriendSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAddFriendSearch(addFriendSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [addFriendSearch, debouncedAddFriendSearch]);


  // Change friendSuggestions to a map
  const [friendSuggestions, setFriendSuggestions] = useState<Record<string, string>>({});

  useLiveResourceJson<Record<string, string>>({
    fetchUrl: buildUrl('account/search', { q: debouncedAddFriendSearch }),
    eventName: 'AccountSearch',
    reconnectIntervalMs: 5000,
    shouldProcess: !!debouncedAddFriendSearch && debouncedAddFriendSearch.length > 0,
    onMessage: (newData) => {
      if (!newData || typeof newData !== 'object' || Object.keys(newData).length === 0) return;
      setFriendSuggestions(prev => ({ ...prev, ...newData }));
    },
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const form = useForm<z.infer<typeof formSchema>, unknown, z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
  })

  // State to control when SSE is active for friends
  const [friendsLiveEnabled, setFriendsLiveEnabled] = useState(true);

  // Fetch friends via SSE, only when friendsLiveEnabled is true
  useLiveResourceJson<FriendApiResponse[]>({
    fetchUrl: buildUrl('account/friends'),
    eventName: 'AccountFriends',
    reconnectIntervalMs: 5000,
    shouldProcess: friendsLiveEnabled,
    onMessage: async (friendsArray) => {
      if (!Array.isArray(friendsArray)) return;
      const enrichedEntries: [string, FriendEntry][] = await Promise.all(
        friendsArray.map(async ({ username, addTime }) => {
          const profileUrl = await buildUrl(`account/profilePicture?profile=${encodeURIComponent(username)}`);
          return [username, { timestamp: addTime, profileUrl }];
        })
      );
      setFriends(new Map<string, FriendEntry>(enrichedEntries));
      setLoading(false);
      setFriendsLiveEnabled(false); // Disable after one fetch
    },
    onFail: () => {
      setLoading(false);
      setFriendsLiveEnabled(false);
    },
  });

  const openModal = (mode: 'add' | 'remove' | 'share', defaultName = '') => {
    setModalMode(mode);
    if (mode === 'remove') {
      form.setValue('username' as keyof z.infer<typeof formSchema>, defaultName as z.infer<typeof formSchema>["username"]);
    } else {
      form.reset();
    }

    if (mode === 'share') {
      if (typeof window !== 'undefined') {
        const baseUrl = window.location.origin;
        // setShareLink(`${baseUrl}/profile/${userContext?.userAccount?.username || 'user'}`); // Removed as per edit hint
      } else {
        // setShareLink(`/profile/${userContext?.userAccount?.username || 'user'}`); // Removed as per edit hint
      }
    } else {
      // setShareLink(''); // Removed as per edit hint
    }

    setShowModal(true);
  };

  const handleFriendAction = async (values: z.infer<typeof formSchema>) => {
    setProcessing(true);
    let res = undefined;
    let error = undefined;
    try {
      const endpoint =
        modalMode === 'add'
          ? `account/friends/add?friend=${encodeURIComponent(values.username)}`
          : `account/friends/remove?friend=${encodeURIComponent(values.username)}`;

      res = await authorized.get(endpoint);
      setShowModal(false);
      form.reset();
      // fetchFriends(); // Removed, SSE will update friends
      toast.success(
        modalMode === 'add'
          ? 'Friend added successfully'
          : 'Friend removed successfully'
      );
    } catch (err) {
      error = err;
      console.log('handleFriendAction error:', error);
      console.log('handleFriendAction response:', res);
      toast.error(`Failed to ${modalMode} friend. Please try again.`);
    } finally {
      setProcessing(false);
      if (res) {
        console.log('handleFriendAction response:', res);
      } else if (error) {
        console.log('handleFriendAction error:', error);
      }
    }
  };

  const toggleFavorite = (name: string) => {
    const updated = favorites.includes(name)
      ? favorites.filter((n) => n !== name)
      : [...favorites, name];

    setFavorites(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    toast.success(
      favorites.includes(name)
        ? 'Removed from favorites'
        : 'Added to favorites'
    );
  };

  // Filtering and sorting friends based on search and filter mode
  const filteredFriends = Array.from(friends.entries())
    .filter(([name, _entry]: [string, FriendEntry]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(([name, _entry]: [string, FriendEntry]) => {
      if (filterMode === FILTER_MODES.FAVORITES) {
        return favorites.includes(name);
      }
      return true;
    })
    .sort(([nameA, a], [nameB, b]) => {
      switch (filterMode) {
        case FILTER_MODES.RECENT:
          return b.timestamp - a.timestamp;
        case FILTER_MODES.ALPHABETICAL:
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

  // Replace openModal for 'add' to open CommandDialog
  const openAddFriendCommand = () => {
    setShowAddCommand(true);
  };

  // Add friend handler for CommandDialog
  const handleAddFriend = async (username: string) => {
    setProcessing(true);
    try {
      const res = await authorized.get(`account/friends/add?friend=${encodeURIComponent(username)}`);

      if(res.status === 200) {
        // fetchFriends(); // Removed, SSE will update friends
        toast.success('Friend added successfully');
      } else {
        toast.error('Failed to add friend.');
      }

      setShowAddCommand(false);
    } catch {
      toast.error('Failed to add friend. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Define class for container height constraints
  const cardClassName = forceFullHeight
      ? 'flex flex-col sm:h-[600px] sm:min-h-0'
      : 'flex flex-col';

  return (
      <Card className={cardClassName}>
        <CardHeader className="space-y-2 flex-none px-4 py-2 sm:py-3">
          {/* Header and controls */}
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg sm:text-xl">Friends</CardTitle>
            <div className="flex gap-2">
              {/* Add Friend Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={openAddFriendCommand}
                      aria-label="Add Friend"
                  >
                    <IconUserPlus className="h-4 w-4 sm:h-5 sm:w-5"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Friend</TooltipContent>
              </Tooltip>

              {/* Share Profile Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openModal('share')}
                      aria-label="Share Profile"
                  >
                    <IconShare className="h-4 w-4 sm:h-5 sm:w-5"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Profile</TooltipContent>
              </Tooltip>
              {/* Manual Refresh Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setLoading(true);
                      setFriendsLiveEnabled(true);
                    }}
                    aria-label="Refresh Friends"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" /></svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh Friends</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <div className="flex-grow max-w-full sm:max-w-xs">
              <Input
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  aria-label="Search friends"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[110px] justify-between">
                  {filterMode === FILTER_MODES.ALL && "All"}
                  {filterMode === FILTER_MODES.RECENT && "Recent"}
                  {filterMode === FILTER_MODES.FAVORITES && "Favorites"}
                  {filterMode === FILTER_MODES.ALPHABETICAL && "A-Z"}
                  <IconChevronDown className="h-4 w-4 ml-2"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.values(FILTER_MODES).map(mode => (
                    <DropdownMenuItem
                        key={mode}
                        onClick={() => setFilterMode(mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Content area: scroll with max height */}
        <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
          {loading ? (
              <div className="h-full flex flex-col gap-2 p-4" data-testid="friends-skeleton-list">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-6 w-6 rounded-md ml-auto" />
                    </div>
                ))}
              </div>
          ) : filteredFriends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 p-4">
                <p className="text-muted-foreground">No friends found</p>
                <Button variant="outline" size="sm" onClick={openAddFriendCommand}>
                  Add Friend
                </Button>
              </div>
          ) : (
              <ScrollArea className="h-full min-h-0 max-h-[450px] sm:max-h-[550px]">
                <div className="divide-y min-w-0">
                  {filteredFriends.map(([name, { profileUrl }]) => (
                      <ContextMenu key={name}>
                        <ContextMenuTrigger asChild>
                          <div className="flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer min-w-0">
                            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                              <Avatar>
                                <ProfilePicture name={name} profileUrl={profileUrl} />
                                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium truncate">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleFavorite(name)}
                                      aria-label={favorites.includes(name) ? 'Remove from Favorites' : 'Add to Favorites'}
                                  >
                                    <IconHeart
                                        className={`h-4 w-4 ${
                                            favorites.includes(name)
                                                ? 'fill-current text-red-500'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {favorites.includes(name)
                                      ? 'Remove from Favorites'
                                      : 'Add to Favorites'}
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {/* TODO: Implement view profile navigation */}}
                                  aria-label="View Profile"
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                              <span>
                                <IconUser className="h-4 w-4" />
                              </span>
                                  </TooltipTrigger>
                                  <TooltipContent>View Profile</TooltipContent>
                                </Tooltip>
                              </Button>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem variant="destructive" onClick={() => openModal('remove', name)}>
                            Remove Friend
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                  ))}
                </div>
              </ScrollArea>
          )}
        </CardContent>

        {/* Add Friend CommandDialog */}
        <CommandDialog
            open={showAddCommand}
            onOpenChange={(open) => {
              setShowAddCommand(open);
              if (!open) {
                setAddFriendSearch('');
                setSelectedFriend(null);
              }
            }}
            title="Add Friend"
        >
          <CommandInput
              placeholder="Type a username..."
              disabled={processing}
              value={addFriendSearch}
              onValueChange={setAddFriendSearch}
              aria-label="Add friend username"
          />
          <CommandList>
            <CommandGroup heading="Suggested">
              {addFriendSearch ? (
                Object.keys(friendSuggestions).length > 0 ? (
                  Object.entries(friendSuggestions).map(([name, profileUrl]: [string, string]) => (
                    <CommandItem
                      key={name}
                      onSelect={() => setSelectedFriend(name)}
                      disabled={processing}
                    >
                      <Avatar className="h-7 w-7">
                        <ProfilePicture name={name} profileUrl={profileUrl} />
                        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-base truncate">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </span>
                    </CommandItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-muted-foreground text-sm">No suggestions</div>
                )
              ) : (
                <div className="px-4 py-2 text-muted-foreground text-sm">Start typing to find friends...</div>
              )}
            </CommandGroup>
          </CommandList>
          {selectedFriend && (
            <div className="flex flex-col items-center gap-2 p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <ProfilePicture name={selectedFriend} profileUrl={friendSuggestions[selectedFriend] || ''} />
                  <AvatarFallback>{selectedFriend.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-base truncate">
                  {selectedFriend.charAt(0).toUpperCase() + selectedFriend.slice(1)}
                </span>
              </div>
              <Button
                className="w-full mt-2"
                disabled={processing}
                onClick={async () => {
                  if (!selectedFriend) return;
                  await handleAddFriend(selectedFriend);
                  setSelectedFriend(null);
                }}
              >
                {processing ? 'Adding...' : 'Confirm Add Friend'}
              </Button>
            </div>
          )}
        </CommandDialog>

        {/* Remove Friend Modal */}
        {modalMode === 'remove' && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-sm w-full mx-2">
              <DialogHeader>
                <DialogTitle>Remove Friend</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this friend? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                    variant="destructive"
                    disabled={processing}
                    onClick={form.handleSubmit(handleFriendAction)}
                >
                  {processing ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* Share Profile Modal */}
        {modalMode === 'share' && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-sm w-full mx-2">
              <DialogHeader>
                <DialogTitle>Share Profile</DialogTitle>
                <DialogDescription>
                  Share your profile link with friends!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-2 items-center">
                <QRCodeWithLogo url={buildUrl(`/account/invite?refer=${userContext?.userAccount?.username}`)} size={200} />
                <Input
                    readOnly
                    value={buildUrl(`/account/invite?refer=${userContext?.userAccount?.username}`)}
                    className="select-all"
                />
                <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                          buildUrl(`/account/invite?refer=${userContext?.userAccount?.username}`)
                      );
                    }}
                >
                  Copy Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Card>
  );
}

function ProfilePicture({ name, profileUrl }: { name: string, profileUrl: string }) {
  if (!profileUrl) return null;
  return <AvatarImage src={profileUrl} alt={name} loading="lazy" referrerPolicy="no-referrer" />;
}