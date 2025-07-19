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
        'text-left hover:bg-muted/30 py-2 px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-2 cursor-pointer transition-colors',
        selected ? 'bg-muted/30' : '',
        className,
      )}
      onClick={() => onToggle(friend.username, !selected)}
    >
      <Checkbox
        checked={selected}
        onChange={(event) => onToggle(friend.username, event.target.checked)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${friend.username}`}
        className="flex-shrink-0"
      />
      
      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
        <ProfilePicture name={friend.username} profileUrl={friend.profilePicture} />
        <AvatarFallback className="text-sm">{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="overflow-hidden">
        <div className="text-base sm:text-lg font-medium truncate" title={friend.username}>
          {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}
        </div>
        <div className="text-sm text-muted-foreground/80 truncate">
          Added {new Date(friend.addTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default function FriendSelection({ 
  selectedFriends, 
  onFriendSelectionChange, 
  title = "Collaborators",
  emptyMessage = "No friends found",
  className,
  forceFullHeight = false 
}: FriendSelectionProps) {
  const userContext = useContext(UserContext) as UserContextType
  const [friends, setFriends] = useState<Array<Friend>>([])
  const [loading, setLoading] = useState(true)

  // Fetch friends - using regular fetch instead of SSE
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await fetch(buildUrl(`account/friends`))
        const json = await res.json()
        const parsed = FriendSchema.array().safeParse(json)
        if (parsed.success) {
          setFriends(parsed.data)
        }
      } finally {
        setLoading(false)
      }
    };
  
    loadFriends();
  }, []);

  const handleFriendToggle = (username: string, checked: boolean) => {
    if (checked) {
      onFriendSelectionChange([...selectedFriends, username]);
    } else {
      onFriendSelectionChange(selectedFriends.filter(friend => friend !== username));
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFriends.length === friends.length) {
      // If all are selected, deselect all
      onFriendSelectionChange([]);
    } else {
      // Select all
      onFriendSelectionChange(friends.map(friend => friend.username));
    }
  };

  const allSelected = friends.length > 0 && selectedFriends.length === friends.length;
  const someSelected = selectedFriends.length > 0 && selectedFriends.length < friends.length;

  // Define class for container height constraints - same as FriendsCard
  const cardClassName = forceFullHeight
    ? 'flex flex-col w-full h-full sm:h-[600px] sm:min-h-0'
    : 'flex flex-col w-full';

  return (
    <div className={cn(cardClassName, className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {friends.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={handleSelectAll}
              aria-label="Select all friends"
              className="flex-shrink-0"
            />
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {selectedFriends.length} of {friends.length} selected
            </span>
          </div>
        )}
      </div>

      {/* Content Area - matching onboarding style */}
      <div className="bg-card/80 rounded-lg border border-muted-foreground/20 w-full">
        <ScrollArea className="h-[320px] w-full rounded-md">
          {loading ? (
            <div className="py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 py-2 px-4 sm:px-6 grid grid-cols-[auto_1fr_auto]">
                  <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                  <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0" />
                  <div className="space-y-2 pl-2">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-4 w-[140px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <IconUser className="w-8 h-8 mx-auto mb-2" />
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <div className="py-2">
              {friends.map((friend) => (
                <FriendRow
                  key={friend.username}
                  friend={friend}
                  selected={selectedFriends.includes(friend.username)}
                  onToggle={handleFriendToggle}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

function ProfilePicture({ name, profileUrl }: { name: string, profileUrl: string }) {
  if (!profileUrl) return null;
  return <AvatarImage src={profileUrl} alt={name} loading="lazy" referrerPolicy="no-referrer" />;
} 