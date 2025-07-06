import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface UserAccountProps {
  className?: string;
  showInfo?: boolean;
  username?: string;
  profilePicture?: string;
  hasSpotify?: boolean;
  hasApple?: boolean;
  hasYoutube?: boolean;
  hasTidal?: boolean;
  // Add more optional fields if needed
}

export function UserAvatarProfile({
                                       className,
                                       showInfo = false,
                                       username,
                                       profilePicture,
                                   }: UserAccountProps) {
    return (
        <div className='flex items-center gap-2'>
            <Avatar className={className}>
                <AvatarImage src={profilePicture || ''} alt={username || ''} />
                <AvatarFallback className='rounded-lg'>
                    {username?.slice(0, 2)?.toUpperCase() || 'CN'}
                </AvatarFallback>
            </Avatar>

            {showInfo && (
                <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>{username || ''}</span>
                </div>
            )}
        </div>
    );
}
