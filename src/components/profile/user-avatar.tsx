import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarArt } from "@/components/profile/avatar-art";
import { getAvatarOption } from "@/data/avatars";
import { initials } from "@/lib/utils";

interface UserAvatarProps {
  /** Cartoon avatar id from the catalog, or an avatar URL. */
  avatarId?: string;
  /** Person name used for the fallback initials. */
  name: string;
  className?: string;
}

/**
 * Renders the user's cartoon avatar (or a photo URL if `avatar` is set),
 * falling back to name initials. Use everywhere a user avatar appears.
 */
export function UserAvatar({ avatarId, name, className }: UserAvatarProps) {
  const option = getAvatarOption(avatarId);
  return (
    <Avatar className={className}>
      {option ? (
        <AvatarArt option={option} className="h-full w-full" />
      ) : (
        <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
          {initials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
