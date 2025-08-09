import React, { useContext, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserContext, UserContextType } from "@/components/auth/UserContext"
import { Friend, FriendSchema } from "@/lib/api/schemas"
import { useServerEvents } from '@/lib/api/ServerEvents'
import { buildUrl } from '@/lib/api/apiClient'
import { cn } from '@/lib/utils'
import { IconUser } from "@tabler/icons-react"

interface FriendSelectionProps {
  selectedFriends: string[]
  onFriendSelectionChange: (friends: string[]) => void
  title?: string
  emptyMessage?: string
  className?: string
  forceFullHeight?: boolean
  friends?: Array<Friend>
}

// FriendSelectionSkeleton component to prevent layout shifts
export function FriendSelectionSkeleton({ forceFullHeight = false }: { forceFullHeight?: boolean }) {
  const cardClassName = forceFullHeight
    ? 'flex flex-col sm:h-[600px] sm:min-h-0'
    : 'flex flex-col';

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 border-b border-border last:border-b-0">
              <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Friend row component matching onboarding playlist style
 */
interface FriendRowProps {
  friend: Friend
  selected: boolean
  onToggle: (username: string, checked: boolean) => void
  className?: string
}

const FriendRow: React.FC<FriendRowProps> = ({
  friend,
  selected,
  onToggle,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer min-w-0',
        selected ? 'bg-muted/30' : '',
        'border-b border-border last:border-b-0',
        className,
      )}
      onClick={() => onToggle(friend.username, !selected)}
    >
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <Avatar>
          <ProfilePicture name={friend.username} profileUrl={friend.profilePicture} />
          <AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate">
          {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}
        </span>
      </div>

      {selected ? (
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
      )}
    </div>
  );
};

export default function FriendSelection({ 
  selectedFriends, 
  onFriendSelectionChange, 
  title = "Collaborators",
  emptyMessage = "No friends found",
  className,
  forceFullHeight = false,
  friends: friendsProp,
}: FriendSelectionProps) {
  const userContext = useContext(UserContext) as UserContextType
  const [friendsState, setFriendsState] = useState<Array<Friend>>([])
  const [loading, setLoading] = useState(true)

  // Fetch friends - using regular fetch instead of SSE
  useEffect(() => {
    if (friendsProp) {
      setLoading(false);
      return;
    }
    const loadFriends = async () => {
      try {
        const res = await fetch(buildUrl(`account/friends`))
        const json = await res.json()
        const parsed = FriendSchema.array().safeParse(json)
        if (parsed.success) {
          setFriendsState(parsed.data)
        }
      } finally {
        setLoading(false)
      }
    };
    loadFriends();
  }, [friendsProp]);

  // Prune selected collaborators if they were removed from the friends list
  useEffect(() => {
    const effectiveFriends = friendsProp ?? friendsState;
    const friendUsernames = new Set(effectiveFriends.map(f => f.username));
    const pruned = selectedFriends.filter(u => friendUsernames.has(u));
    if (pruned.length !== selectedFriends.length) {
      onFriendSelectionChange(pruned);
    }
  }, [friendsProp, friendsState, selectedFriends, onFriendSelectionChange]);

  const handleFriendToggle = (username: string, checked: boolean) => {
    if (checked) {
      onFriendSelectionChange([...selectedFriends, username]);
    } else {
      onFriendSelectionChange(selectedFriends.filter(friend => friend !== username));
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const effectiveFriends = friendsProp ?? friendsState;
    if (selectedFriends.length === effectiveFriends.length) {
      // If all are selected, deselect all
      onFriendSelectionChange([]);
    } else {
      // Select all
      onFriendSelectionChange(effectiveFriends.map(friend => friend.username));
    }
  };

  const effectiveFriends = friendsProp ?? friendsState;
  const allSelected = effectiveFriends.length > 0 && selectedFriends.length === effectiveFriends.length;
  const someSelected = selectedFriends.length > 0 && selectedFriends.length < effectiveFriends.length;

  // Define class for container height constraints - same as FriendsCard
  const cardClassName = forceFullHeight
    ? 'flex flex-col w-full h-full sm:h-[600px] sm:min-h-0'
    : 'flex flex-col w-full';

  return (
    <Card className={cn(cardClassName, className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          {effectiveFriends.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
                aria-label="Select all friends"
                className="flex-shrink-0"
              />
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {selectedFriends.length} of {effectiveFriends.length} selected
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="max-h-[500px] overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : effectiveFriends.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground px-4">
            <div className="text-center">
              <IconUser className="w-8 h-8 mx-auto mb-2" />
              <p>{emptyMessage}</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full min-h-0 max-h-[450px] sm:max-h-[550px]">
            <div className="divide-y min-w-0">
              {effectiveFriends.map((friend) => (
                <FriendRow
                  key={friend.username}
                  friend={friend}
                  selected={selectedFriends.includes(friend.username)}
                  onToggle={handleFriendToggle}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function ProfilePicture({ name, profileUrl }: { name: string, profileUrl: string }) {
  if (!profileUrl) return null;
  return <AvatarImage src={profileUrl} alt={name} loading="lazy" referrerPolicy="no-referrer" />;
} 