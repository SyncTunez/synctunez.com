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
import { authorized } from '@/lib/api/apiClient'
import { IconUserPlus, IconShare, IconHeart, IconChevronDown, IconUser } from "@tabler/icons-react"
import { toast } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
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


export function FriendsCard() {
  const userContext = useContext(UserContext) as UserContextType;
  const [friends, setFriends] = useState<Map<string, { timestamp: number; profileUrl: string }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'remove' | 'share'>('add');
  const [shareLink, setShareLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>(FILTER_MODES.ALL);
  const MOCK_USERNAMES = [
    'jack', 'talisha', 'tim mcgee'
  ];
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [addFriendSearch, setAddFriendSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // Fetch friends on mount
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await authorized.get<FriendApiResponse[]>('account/friends');
      const friendsArray = res.data || [];

      const enrichedEntries: [string, FriendEntry][] = await Promise.all(
        friendsArray.map(async ({ username, addTime }) => {
          const profileUrl = await getProfilePictureUrl(username);
          return [username, { timestamp: addTime, profileUrl }];
        })
      );

      setFriends(new Map<string, FriendEntry>(enrichedEntries));
    } catch (e) {
      console.error('Error fetching friends or profile pictures', e);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = async (name: string): Promise<string> => {
    try {
      const res = await authorized.get(
        `account/profilePicture?profile=${encodeURIComponent(name)}`,
      );
      return res.data;
    } catch {
      return '';
    }
  };

  const openModal = (mode: 'add' | 'remove' | 'share', defaultName = '') => {
    setModalMode(mode);
    if (mode === 'remove') {
      form.setValue('username', defaultName);
    } else {
      form.reset();
    }

    if (mode === 'share') {
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}/profile/${userContext?.userAccount?.username || 'user'}`);
    } else {
      setShareLink('');
    }

    setShowModal(true);
  };

  const handleFriendAction = async (values: z.infer<typeof formSchema>) => {
    setProcessing(true);

    try {
      const endpoint =
        modalMode === 'add'
          ? `account/addFriend?friend=${encodeURIComponent(values.username)}`
          : `account/removeFriend?friend=${encodeURIComponent(values.username)}`;

      await authorized.get(endpoint);
      setShowModal(false);
      form.reset();
      fetchFriends();
      toast.success(
        modalMode === 'add'
          ? 'Friend added successfully'
          : 'Friend removed successfully'
      );
    } catch {
      toast.error(`Failed to ${modalMode} friend. Please try again.`);
    } finally {
      setProcessing(false);
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
    .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(([name]) => {
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
      await authorized.get(`account/addFriend?friend=${encodeURIComponent(username)}`);
      setShowAddCommand(false);
      fetchFriends();
      toast.success('Friend added successfully');
    } catch {
      toast.error('Failed to add friend. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-2 flex-none">
        <div className="flex justify-between items-center">
          <CardTitle>Friends</CardTitle>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openAddFriendCommand}
                >
                  <IconUserPlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Friend</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openModal('share')}
                >
                  <IconShare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Profile</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[170px]">
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[110px] justify-between">
                {filterMode === FILTER_MODES.ALL && "All"}
                {filterMode === FILTER_MODES.RECENT && "Recent"}
                {filterMode === FILTER_MODES.FAVORITES && "Favorites"}
                {filterMode === FILTER_MODES.ALPHABETICAL && "A-Z"}
                <IconChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODES.ALL)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODES.RECENT)}>
                Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODES.FAVORITES)}>
                Favorites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterMode(FILTER_MODES.ALPHABETICAL)}>
                A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground">No friends found</p>
            <Button variant="outline" size="sm" onClick={openAddFriendCommand}>
              Add Friend
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y">
              {filteredFriends.map(([name, { profileUrl }]) => (
                <ContextMenu key={name}>
                  <ContextMenuTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {profileUrl ? (
                            <AvatarImage src={profileUrl} alt={name} referrerPolicy="no-referrer" />
                          ) : null}
                          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(name)}
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
      <CommandDialog open={showAddCommand} onOpenChange={(open) => { setShowAddCommand(open); if (!open) { setAddFriendSearch(""); setSelectedFriend(null); } }} title="Add Friend">
        <CommandInput
          placeholder="Type a username..."
          disabled={processing}
          value={addFriendSearch}
          onValueChange={setAddFriendSearch}
        />
        <CommandList>
          <CommandGroup heading="Suggested">
            {addFriendSearch
              ? (() => {
                  const suggestions = MOCK_USERNAMES.filter(
                    (name) =>
                      name !== userContext?.userAccount?.username &&
                      name.toLowerCase().includes(addFriendSearch.toLowerCase())
                  ).slice(0, 5);
                  return suggestions.length > 0
                    ? suggestions.map((name) => (
                        <CommandItem
                          key={name}
                          onSelect={() => setSelectedFriend(name)}
                          disabled={processing}
                          className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors hover:bg-accent/70 cursor-pointer ${selectedFriend === name ? 'bg-accent' : ''}`}
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={''} alt={name} />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-base">
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </span>
                        </CommandItem>
                      ))
                    : null;
                })()
              : <div className="px-4 py-2 text-muted-foreground text-sm">Start typing to find friends...</div>}
          </CommandGroup>
        </CommandList>
        {selectedFriend && (
          <div className="flex flex-col items-center gap-2 p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={''} alt={selectedFriend} />
                <AvatarFallback>{selectedFriend.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-base">
                {selectedFriend.charAt(0).toUpperCase() + selectedFriend.slice(1)}
              </span>
            </div>
            <Button
              className="w-full mt-2"
              disabled={processing}
              onClick={async () => {
                await handleAddFriend(selectedFriend);
                setSelectedFriend(null);
              }}
            >
              {processing ? 'Adding...' : 'Confirm Add Friend'}
            </Button>
          </div>
        )}
      </CommandDialog>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
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
    </Card>
  );
} 