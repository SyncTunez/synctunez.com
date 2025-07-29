import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { IconUserPlus, IconUserMinus, IconShare, IconSearch, IconHeart, IconHeartFilled, IconUser, IconChevronDown } from '@tabler/icons-react';
import { UserContext, UserContextType } from '@/components/auth/UserContext';
import { buildUrl } from '@/lib/api/apiClient';
import { FriendSchema, AddFriendFormSchema, Friend } from '@/lib/api/schemas';
import { useServerEvents } from '@/lib/api/ServerEvents';
import { captureComponentError, captureAPIError, addBreadcrumb } from '@/lib/sentry';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import QRCodeWithLogo from '@/components/ui/QRCodeWithLogo';

const LOCAL_STORAGE_KEY = 'favorite_friends';

export function FriendsCardSkeleton({ forceFullHeight = false }: { forceFullHeight?: boolean }) {
  return (
    <Card className={`${forceFullHeight ? 'h-full' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const FILTER_MODES = {
  ALL: 'all',
  FAVORITES: 'favorites',
  RECENT: 'recent',
} as const;

type FilterMode = typeof FILTER_MODES[keyof typeof FILTER_MODES];

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

  const [friends, setFriends] = useState<Array<Friend>>([])
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
  const [friendSuggestions, setFriendSuggestions] = useState<Array<Friend>>([]);

  // Import friend suggestions via SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    
    const loadSuggestions = async () => {
      if (!debouncedAddFriendSearch.trim()) {
        setFriendSuggestions([]);
        return;
      }
      
        addBreadcrumb('Friend search started', 'friends', {
         query: debouncedAddFriendSearch,
         userId: userContext?.userAccount?.username
       });
      
      try {
        eventSource = await useServerEvents(
          buildUrl(`account/search?q=${debouncedAddFriendSearch}`), 
          'AccountSearch', 
          FriendSchema.array(), 
          (data) => {
            setFriendSuggestions(data);
                         addBreadcrumb('Friend search results received', 'friends', {
               query: debouncedAddFriendSearch,
               resultCount: data.length,
               userId: userContext?.userAccount?.username
             });
          }
        );
      } catch (error) {
        captureComponentError(
          `Failed to load friend suggestions: ${error instanceof Error ? error.message : String(error)}`,
          {
            component: 'FriendsCard',
            action: 'load_friend_suggestions',
            userId: userContext?.userAccount?.username,
            additionalData: {
              query: debouncedAddFriendSearch,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }
          },
          'error'
        );
      }
    };
  
    loadSuggestions();
  
    // Cleanup function to close the connection when component unmounts
    return () => { 
      if (eventSource) {
        eventSource.close();
                 addBreadcrumb('Friend search SSE cleanup', 'friends', {
           query: debouncedAddFriendSearch,
           userId: userContext?.userAccount?.username
         });
      }
    };
  }, [debouncedAddFriendSearch, userContext?.userAccount?.username]);


  // Fetch friends - using regular fetch instead of SSE
  useEffect(() => {
    const loadFriends = async () => {
      addBreadcrumb('Loading friends list', 'friends', {
        userId: userContext?.userAccount?.username
      });
      
      try {
        const res = await fetch(buildUrl(`account/friends`))
        
        if (!res.ok) {
          captureAPIError(
            `Failed to fetch friends: ${res.status} ${res.statusText}`,
            {
              endpoint: 'account/friends',
              method: 'GET',
              statusCode: res.status,
              component: 'FriendsCard',
              userId: userContext?.userAccount?.username,
              additionalData: {
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries())
              }
            },
            'error'
          );
          throw new Error(`Failed to fetch friends: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json()
        const parsed = FriendSchema.array().safeParse(json)
        
        if (parsed.success) {
          setFriends(parsed.data)
          addBreadcrumb('Friends list loaded successfully', 'friends', {
            friendCount: parsed.data.length,
            userId: userContext?.userAccount?.username
          });
        } else {
          captureComponentError(
            `Failed to parse friends data: ${parsed.error.message}`,
            {
              component: 'FriendsCard',
              action: 'parse_friends_data',
              userId: userContext?.userAccount?.username,
              additionalData: {
                rawData: json,
                parseError: parsed.error.message,
                issues: parsed.error.issues
              }
            },
            'error'
          );
        }
      } catch (error) {
        captureComponentError(
          `Failed to load friends: ${error instanceof Error ? error.message : String(error)}`,
          {
            component: 'FriendsCard',
            action: 'load_friends',
            userId: userContext?.userAccount?.username,
            additionalData: {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }
          },
          'error'
        );
      } finally {
        setLoading(false)
      }
    };
  
    loadFriends();
  }, [userContext?.userAccount?.username]);
  
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on client side only
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(parsed);
      }
    } catch (error) {
      captureComponentError(
        `Failed to parse favorites from localStorage: ${error instanceof Error ? error.message : String(error)}`,
        {
          component: 'FriendsCard',
          action: 'parse_favorites',
          userId: userContext?.userAccount?.username,
          additionalData: {
            localStorageValue: localStorage.getItem(LOCAL_STORAGE_KEY),
            error: error instanceof Error ? error.message : String(error)
          }
        },
        'warning'
      );
    }
  }, [userContext?.userAccount?.username]);

  const form = useForm<z.infer<typeof AddFriendFormSchema>, unknown, z.infer<typeof AddFriendFormSchema>>({
    resolver: zodResolver(AddFriendFormSchema),
    defaultValues: { username: '' },
  })

  // State to control when SSE is active for friends
  const [friendsLiveEnabled, setFriendsLiveEnabled] = useState(true);

  const openModal = (mode: 'add' | 'remove' | 'share', defaultName = '') => {
    setModalMode(mode);
    if (mode === 'remove') {
      form.setValue('username', defaultName);
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
    
    addBreadcrumb('Friend modal opened', 'friends', {
      mode,
      defaultName,
      userId: userContext?.userAccount?.username
    });
  };

  const handleFriendAction = async (values: z.infer<typeof AddFriendFormSchema>) => {
console.log("handleFriendAction", values);

    setProcessing(true);
    let res = undefined;
    let error = undefined;

    console.log("handleFriendAction", values);
    
    addBreadcrumb('Friend action started', 'friends', {
      mode: modalMode,
      username: values.username,
      userId: userContext?.userAccount?.username
    });
    
    try {
      const endpoint =
        modalMode === 'add'
          ? `account/friends/add?friend=${encodeURIComponent(values.username)}`
          : `account/friends/remove?friend=${encodeURIComponent(values.username)}`;

      res = await fetch(buildUrl(endpoint));

      if (res.ok) {
        addBreadcrumb('Friend action successful', 'friends', {
          mode: modalMode,
          username: values.username,
          userId: userContext?.userAccount?.username
        });
        
        toast.success(
          modalMode === 'add'
            ? 'Friend added successfully'
            : 'Friend removed successfully'
        );
        
        // Refresh friends list after adding/removing
        const friendsRes = await fetch(buildUrl('account/friends'));
        console.log('friendsRes', friendsRes);
        if (friendsRes.ok) {
          const friendsJson = await friendsRes.json();
          const friendsParsed = FriendSchema.array().safeParse(friendsJson);
          if (friendsParsed.success) {
            setFriends(friendsParsed.data);
          } else {
            captureComponentError(
              `Failed to parse refreshed friends data: ${friendsParsed.error.message}`,
              {
                component: 'FriendsCard',
                action: 'parse_refreshed_friends',
                userId: userContext?.userAccount?.username,
                additionalData: {
                  rawData: friendsJson,
                  parseError: friendsParsed.error.message
                }
              },
              'warning'
            );
          }
        } else {
          captureAPIError(
            `Failed to refresh friends list: ${friendsRes.status} ${friendsRes.statusText}`,
            {
              endpoint: 'account/friends',
              method: 'GET',
              statusCode: friendsRes.status,
              component: 'FriendsCard',
              userId: userContext?.userAccount?.username,
              additionalData: {
                originalAction: modalMode,
                originalUsername: values.username
              }
            },
            'warning'
          );
        }
      } else {
        const errorMessage = `Failed to ${modalMode} friend. Please try again.`;
        
        captureAPIError(
          `Friend action failed: ${res.status} ${res.statusText}`,
          {
            endpoint,
            method: 'GET',
            statusCode: res.status,
            component: 'FriendsCard',
            userId: userContext?.userAccount?.username,
            additionalData: {
              action: modalMode,
              username: values.username,
              statusText: res.statusText,
              responseData: await res.text().catch(() => 'Unable to read response')
            }
          },
          'error'
        );
        
        toast.error(errorMessage);
      }

      setShowModal(false);
      form.reset();
      
      
     
    } catch (err) {
      error = err;
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
  const filteredFriends = friends
    .filter((friend) => friend.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((friend) => {
      if (filterMode === FILTER_MODES.FAVORITES) {
        return favorites.includes(friend.username);
      }
      return true;
    })
    .sort((a, b) => {
      switch (filterMode) {
        case FILTER_MODES.RECENT:
          return b.addTime - a.addTime;
        case FILTER_MODES.FAVORITES:
          return a.favourite ? 1 : -1;
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
    console.log("handleAddFriend called with username:", username);
    setProcessing(true);
    try {
      const res = await fetch(buildUrl(`account/friends/add?friend=${encodeURIComponent(username)}`));
      console.log("Add friend response:", res);

      if(res.ok) {
        console.log("Friend added successfully, refreshing list...");
        // Refresh friends list after adding
        const friendsRes = await fetch(buildUrl('account/friends'));
        console.log('friendsRes', friendsRes);
        if (friendsRes.ok) {
          const friendsJson = await friendsRes.json();
          const friendsParsed = FriendSchema.array().safeParse(friendsJson);
          if (friendsParsed.success) {
            setFriends(friendsParsed.data);
            console.log("Friends list updated:", friendsParsed.data);
          } else {
            console.error("Failed to parse refreshed friends data:", friendsParsed.error);
            captureComponentError(
              `Failed to parse refreshed friends data: ${friendsParsed.error.message}`,
              {
                component: 'FriendsCard',
                action: 'parse_refreshed_friends',
                userId: userContext?.userAccount?.username,
                additionalData: {
                  rawData: friendsJson,
                  parseError: friendsParsed.error.message
                }
              },
              'warning'
            );
          }
        } else {
          console.error("Failed to refresh friends list:", friendsRes.status, friendsRes.statusText);
          captureAPIError(
            `Failed to refresh friends list: ${friendsRes.status} ${friendsRes.statusText}`,
            {
              endpoint: 'account/friends',
              method: 'GET',
              statusCode: friendsRes.status,
              component: 'FriendsCard',
              userId: userContext?.userAccount?.username,
              additionalData: {
                originalAction: 'add',
                originalUsername: username
              }
            },
            'warning'
          );
        }
        toast.success('Friend added successfully');
      } else {
        console.error("Failed to add friend:", res.status, res.statusText);
        toast.error('Failed to add friend.');
      }

      setShowAddCommand(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error('Failed to add friend. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Add this function after handleAddFriend
  const handleRemoveFriend = async (username: string) => {
    console.log("handleRemoveFriend called with username:", username);
    setProcessing(true);
    try {
      const res = await fetch(buildUrl(`account/friends/remove?friend=${encodeURIComponent(username)}`));
      console.log("Remove friend response:", res);

      if(res.ok) {
        console.log("Friend removed successfully, refreshing list...");
        // Refresh friends list after removing
        const friendsRes = await fetch(buildUrl('account/friends'));
        console.log('friendsRes', friendsRes);
        if (friendsRes.ok) {
          const friendsJson = await friendsRes.json();
          const friendsParsed = FriendSchema.array().safeParse(friendsJson);
          if (friendsParsed.success) {
            setFriends(friendsParsed.data);
            console.log("Friends list updated:", friendsParsed.data);
          } else {
            console.error("Failed to parse refreshed friends data:", friendsParsed.error);
            captureComponentError(
              `Failed to parse refreshed friends data: ${friendsParsed.error.message}`,
              {
                component: 'FriendsCard',
                action: 'parse_refreshed_friends',
                userId: userContext?.userAccount?.username,
                additionalData: {
                  rawData: friendsJson,
                  parseError: friendsParsed.error.message
                }
              },
              'warning'
            );
          }
        } else {
          console.error("Failed to refresh friends list:", friendsRes.status, friendsRes.statusText);
          captureAPIError(
            `Failed to refresh friends list: ${friendsRes.status} ${friendsRes.statusText}`,
            {
              endpoint: 'account/friends',
              method: 'GET',
              statusCode: friendsRes.status,
              component: 'FriendsCard',
              userId: userContext?.userAccount?.username,
              additionalData: {
                originalAction: 'remove',
                originalUsername: username
              }
            },
            'warning'
          );
        }
        toast.success('Friend removed successfully');
      } else {
        console.error("Failed to remove friend:", res.status, res.statusText);
        toast.error('Failed to remove friend.');
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error('Failed to remove friend. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Define class for container height constraints
  const cardClassName = forceFullHeight
      ? 'flex flex-col w-full h-full sm:h-[600px] sm:min-h-0'
      : 'flex flex-col w-full';

  return (
      <Card className={cardClassName}>
        <CardHeader className="space-y-2 flex-none px-4 py-2 sm:py-3 w-full">
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
                  {filteredFriends.map((friend) => (
                      <ContextMenu key={friend.username}>
                        <ContextMenuTrigger asChild>
                          <div className="flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer min-w-0">
                            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                              <Avatar>
                                <ProfilePicture name={friend.username} profileUrl={friend.profilePicture} />
                                <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium truncate">
                                {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleFavorite(friend.username)}
                                      aria-label={favorites.includes(friend.username) ? 'Remove from Favorites' : 'Add to Favorites'}
                                  >
                                    <IconHeart
                                        className={`h-4 w-4 ${
                                            favorites.includes(friend.username)
                                                ? 'fill-current text-red-500'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {favorites.includes(friend.username)
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveFriend(friend.username)}
                                      disabled={processing}
                                      aria-label="Remove Friend"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <IconUserMinus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove Friend</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem variant="destructive" onClick={() => openModal('remove', friend.username)}>
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
                friendSuggestions.length > 0 ? (
                  friendSuggestions.map((friend) => (
                    <CommandItem
                      key={friend.username}
                      onSelect={() => setSelectedFriend(friend.username)}
                      disabled={processing}
                    >
                      {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}
                    </CommandItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-muted-foreground text-sm">No suggestions found</div>
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
                  <ProfilePicture name={selectedFriend} profileUrl={friendSuggestions.filter(friend => friend.username === selectedFriend)[0].profilePicture || ''} />
                  <AvatarFallback>{selectedFriend.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-base truncate">
                  {selectedFriend.charAt(0).toUpperCase() + selectedFriend.slice(1)}
                </span>
              </div>
              <Button
                className="w-full mt-2 hover:text-white"
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
                <QRCodeWithLogo url={`/account/invite?refer=${userContext?.userAccount?.username}`} size={200} />
                <Input
                    readOnly
                    value={`/account/invite?refer=${userContext?.userAccount?.username}`}
                    className="select-all"
                />
                <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                          `/account/invite?refer=${userContext?.userAccount?.username}`
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