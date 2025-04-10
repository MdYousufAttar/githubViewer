export interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
  }
  
  export interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
  }
  
  export interface CommitActivity {
    days: number[];
    total: number;
    week: number;
  }
  
  export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`User not found or GitHub API error: ${response.status}`);
    }
    
    return response.json();
  }
  
  export async function fetchUserRepositories(username: string): Promise<GitHubRepo[]> {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }
    
    return response.json();
  }
  
  export const fetchCommitActivity = async (username: string, repoName: string) => {
    const url = `https://api.github.com/repos/${username}/${repoName}/stats/commit_activity`;
    let tries = 0;
  
    while (tries < 3) {
      const response = await fetch(url);
      
      if (response.status === 202) {
        // GitHub is generating the data
        await new Promise(res => setTimeout(res, 2000)); // wait 2s and retry
        tries++;
      } else if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      } else {
        const data = await response.json();
        return data;
      }
    }
  
    throw new Error("GitHub is still generating stats. Please try again later.");
  };
  