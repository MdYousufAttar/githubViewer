// // import { Button } from "@/components/ui/button"
// // import { zodResolver } from "@hookform/resolvers/zod"
// // import { useForm } from "react-hook-form"
// // import { z } from "zod"
// // import {
// //   Form,
// //   FormControl,
// //   FormDescription,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form"
// // import { Input } from "@/components/ui/input"

// // const formSchema = z.object({
// //   username: z.string(),
// // })

// // function onSubmit(values: z.infer<typeof formSchema>) {
// //   // Do something with the form values.
// //   // ✅ This will be type-safe and validated.
// //   console.log(values)
// // }

// // function App() {
// //   const form = useForm();
// //   return (

// //     <Form {...form}>
// //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
// //         <FormField
// //           control={form.control}
// //           name="username"
// //           render={({ field }) => (
// //             <FormItem>
// //               <FormLabel>Username</FormLabel>
// //               <FormControl>
// //                 <Input placeholder="shadcn" {...field} />
// //               </FormControl>
// //               <FormDescription>
// //                 This is your public display name.
// //               </FormDescription>
// //               <FormMessage />
// //             </FormItem>
// //           )}
// //         />
// //         <Button type="submit">Submit</Button>
// //       </form>
// //     </Form>


// //     // <div className="flex min-h-screen justify-center items-center text-white bg-black">
// //     //   <div className="flex flex-col text-center space-y-6">
// //     //     <div className="flex justify-center items-center space-x-5 pb-7">
// //     //       <div className="h-[35%] w-[35%]"><img src="/logo.png" alt="###" /></div>
// //     //       <h1 className="text-6xl">Github-View</h1>
// //     //     </div>
// //     //     <form action="POST" className="flex justify-center items-center space-x-7">
// //     //       <input type="text" className="rounded-2xl p-3" placeholder="Enter your Username"/>
// //     //       <Button variant="ghost" size="lg" className="text">Search</Button>
// //     //     </form>
// //     //   </div>
// //     // </div>
// //   )
// // }

// // export default App




// import GitHubForm from "@/components/gitForm";

// export default function App() {
//   const handleSearch = (username: string) => {
//     console.log(username);

//   };

//   return (


//       <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white space-y-10">
//         <div className="flex justify-center items-center space-x-5">
//           <img src="/logo.png" alt="###" className="h-[35%] w-[35%]"/>
//           <h1 className="text-6xl">Github Viewer</h1>
//         </div>
//         <GitHubForm onSearch={handleSearch} />
//       </div>

//   );
// }


import { useState } from "react";
import GitHubForm from "@/components/gitForm";
import UserProfile from "@/components/UserProfile";
import RepositoryList from "@/components/RepositoryList";
import CommitsChart from "@/components/CommitsChart";
import { fetchGitHubUser, fetchUserRepositories, GitHubUser, GitHubRepo } from "@/lib/github";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2Icon, GithubIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    setUser(null);
    setRepositories([]);
    setSelectedRepo(null);
    
    try {
      // Fetch user data
      const userData = await fetchGitHubUser(username);
      setUser(userData);
      
      // Fetch repositories
      const repos = await fetchUserRepositories(username);
      // Sort repositories by last updated
      const sortedRepos = repos.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      
      setRepositories(sortedRepos);
      
      // Select first repo by default if available
      if (sortedRepos.length > 0) {
        setSelectedRepo(sortedRepos[0]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 text-white">
      <div className="w-full max-w-6xl flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex justify-center items-center space-x-4">
          <GithubIcon size={40} />
          <h1 className="text-4xl font-bold">GitHub Viewer</h1>
        </div>
        
        <Separator className="w-full" />
        
        {/* Search Form */}
        <div className="w-full max-w-2xl">
          <GitHubForm onSearch={handleSearch} />
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2Icon className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-400">Fetching GitHub data...</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && !loading && (
          <Alert variant="destructive" className="w-full">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Results */}
        {user && !loading && !error && (
          <div className="w-full space-y-8">
            {/* User Profile */}
            <UserProfile user={user} />
            
            {/* Repository and Commits Tabs on Mobile, Side by Side on Desktop */}
            <Tabs defaultValue="repositories" className="w-full lg:hidden">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="commits">Commit Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="repositories" className="mt-4">
                <RepositoryList 
                  repositories={repositories} 
                  onSelectRepo={setSelectedRepo}
                  selectedRepo={selectedRepo}
                />
              </TabsContent>
              <TabsContent value="commits" className="mt-4">
                {selectedRepo ? (
                  <CommitsChart 
                    username={user.login} 
                    repoName={selectedRepo.name} 
                  />
                ) : (
                  <Alert>
                    <AlertDescription>
                      Select a repository to view commit data
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-9 gap-8">
              {/* Repository List - Takes 4/9 of the width */}
              <div className="col-span-4">
                <RepositoryList 
                  repositories={repositories} 
                  onSelectRepo={setSelectedRepo}
                  selectedRepo={selectedRepo}
                />
              </div>
              
              {/* Commits Chart - Takes 5/9 of the width */}
              <div className="col-span-5">
                {selectedRepo ? (
                  <CommitsChart 
                    username={user.login} 
                    repoName={selectedRepo.name} 
                  />
                ) : (
                  <Alert>
                    <AlertDescription>
                      Select a repository to view commit data
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}