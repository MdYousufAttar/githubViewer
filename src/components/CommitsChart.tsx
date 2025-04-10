// src/components/CommitsChart.tsx

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCommitActivity } from "@/lib/github";
import { AlertCircle, Calendar, GitCommitIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the data structure we expect from GitHub API
interface CommitActivityData {
  days: number[];
  total: number;
  week: number;
}

// Our processed data structure for charts
interface WeeklyChartData {
  date: string;
  commits: number;
}

interface DailyChartData {
  day: string;
  date: string;
  commits: number;
}

interface CommitsChartProps {
  username: string;
  repoName: string;
}

const CommitsChart = ({ username, repoName }: CommitsChartProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyChartData[]>([]);
  const [dailyData, setDailyData] = useState<DailyChartData[]>([]);
  const [totalCommits, setTotalCommits] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!username || !repoName) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchCommitActivity(username, repoName);
        
        // Process the API data
        processCommitData(response);
      } catch (err) {
        console.error("Error fetching commit data:", err);
        setError("Failed to load commit data. GitHub API might need some time to generate stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, repoName]);

  // Process data from GitHub API into our chart formats
  const processCommitData = (data: CommitActivityData[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      setError("No commit data available");
      return;
    }

    // Process weekly data (last 12 weeks)
    const lastTwelveWeeks = data.slice(-12);
    
    const weekly = lastTwelveWeeks.map(week => {
      const date = new Date(week.week * 1000);
      return {
        date: date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
        commits: week.total
      };
    });
    
    // Process daily data (most recent week)
    const mostRecentWeek = lastTwelveWeeks[lastTwelveWeeks.length - 1];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let daily: DailyChartData[] = [];
    
    if (mostRecentWeek && Array.isArray(mostRecentWeek.days)) {
      const weekStartDate = new Date(mostRecentWeek.week * 1000);
      
      daily = mostRecentWeek.days.map((commits, index) => {
        const dayDate = new Date(weekStartDate);
        dayDate.setDate(dayDate.getDate() + index);
        
        return {
          day: daysOfWeek[index],
          date: dayDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
          commits: commits
        };
      });
    }
    
    // Calculate total commits
    const total = lastTwelveWeeks.reduce((sum, week) => sum + week.total, 0);
    
    // Update state
    setWeeklyData(weekly);
    setDailyData(daily);
    setTotalCommits(total);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-52 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    
    if (weeklyData.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>
            No commit data available for this repository. This could be because:
            <ul className="list-disc ml-6 mt-2">
              <li>The repository is new or has no commits</li>
              <li>GitHub hasn't computed statistics for this repository yet</li>
              <li>You don't have access to view this data</li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Tabs defaultValue="weekly">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <GitCommitIcon size={16} className="text-blue-400" />
            <span className="text-sm">{totalCommits} commits total</span>
          </div>
        </div>
        
        <TabsContent value="weekly" className="h-64 mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="commits" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="daily" className="h-64 mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={dailyData} 
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="day" 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value} commit${value !== 1 ? 's' : ''}`, 'Commits']}
              />
              <Line 
                type="monotone" 
                dataKey="commits" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">{repoName}</CardTitle>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Calendar size={14} />
            Commit Activity
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>{renderContent()}</CardContent>
      
      <CardFooter>
        <div className="text-xs text-gray-400 w-full text-center">
          Data from GitHub API • Last updated {new Date().toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommitsChart;