import { GitHubRepo } from "@/lib/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CircleIcon, 
  StarIcon, 
  GitForkIcon, 
  ExternalLinkIcon,
  CalendarIcon
} from "lucide-react";

interface RepositoryListProps {
  repositories: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
  selectedRepo?: GitHubRepo | null;
}

const RepositoryList = ({ repositories, onSelectRepo, selectedRepo }: RepositoryListProps) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric"
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Repositories</h2>
        <Badge variant="outline">{repositories.length}</Badge>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {repositories.map((repo) => (
            <Card 
              key={repo.id} 
              className={`transition-all ${
                selectedRepo?.id === repo.id ? "border-blue-500 bg-blue-950/20" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{repo.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <StarIcon size={14} />
                      {repo.stargazers_count}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <GitForkIcon size={14} />
                      {repo.forks_count}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {repo.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  {repo.language && (
                    <div className="flex items-center space-x-1">
                      <CircleIcon size={12} className="text-blue-400" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-gray-400">
                    <CalendarIcon size={14} />
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant={selectedRepo?.id === repo.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => onSelectRepo(repo)}
                >
                  View Commits
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => window.open(repo.html_url, '_blank')}
                >
                  <ExternalLinkIcon size={14} />
                  GitHub
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {repositories.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No repositories found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RepositoryList;