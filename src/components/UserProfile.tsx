import { GitHubUser } from "@/lib/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GithubIcon, 
  UsersIcon, 
  FolderIcon, 
  UserIcon,
  ExternalLinkIcon
} from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

interface UserProfileProps {
  user: GitHubUser;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GithubIcon size={18} />
          <span className="text-sm text-gray-400">GitHub User</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-6 pt-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="h-24 w-24 border-2 border-blue-500 cursor-pointer">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{user.name || user.login}</h4>
                <p className="text-sm text-gray-400">@{user.login}</p>
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => window.open(user.html_url, '_blank')}
                  >
                    <ExternalLinkIcon size={14} />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
          <p className="text-gray-400 mb-2">@{user.login}</p>
          
          {user.bio && <p className="my-2 text-sm">{user.bio}</p>}
          
          <Separator className="my-4" />
          
          <div className="flex gap-6 justify-center sm:justify-start">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-1 text-gray-400">
                <FolderIcon size={16} />
                <span className="text-sm">Repos</span>
              </div>
              <span className="font-semibold">{user.public_repos}</span>
            </div>
            
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-1 text-gray-400">
                <UsersIcon size={16} />
                <span className="text-sm">Followers</span>
              </div>
              <span className="font-semibold">{user.followers}</span>
            </div>
            
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-1 text-gray-400">
                <UserIcon size={16} />
                <span className="text-sm">Following</span>
              </div>
              <span className="font-semibold">{user.following}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;