'use client';

import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Star,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSettings } from '@/components/theme-settings';

const stats = [
  {
    label: 'Total Papers',
    value: '1,284',
    change: '+12%',
    trend: 'up' as const,
    icon: FileText
  },
  {
    label: 'Hours Saved',
    value: '342',
    change: '+8%',
    trend: 'up' as const,
    icon: Clock
  },
  {
    label: 'Avg. Rating',
    value: '4.7',
    change: '+0.3',
    trend: 'up' as const,
    icon: Star
  },
  {
    label: 'Insights',
    value: '89',
    change: '-2%',
    trend: 'down' as const,
    icon: BarChart3
  }
];

const recentPapers = [
  {
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    date: 'Mar 12',
    status: 'Reviewed'
  },
  {
    title: 'Scaling Laws for Neural Language Models',
    authors: 'Kaplan et al.',
    date: 'Mar 10',
    status: 'In Progress'
  },
  {
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    authors: 'Bai et al.',
    date: 'Mar 8',
    status: 'Reviewed'
  },
  {
    title: 'Chain-of-Thought Prompting Elicits Reasoning',
    authors: 'Wei et al.',
    date: 'Mar 5',
    status: 'Queued'
  },
  {
    title: 'Training Language Models to Follow Instructions',
    authors: 'Ouyang et al.',
    date: 'Mar 3',
    status: 'Reviewed'
  }
];

const topTopics = [
  { name: 'Transformers', count: 214, pct: 82 },
  { name: 'Reinforcement Learning', count: 156, pct: 60 },
  { name: 'Multimodal Models', count: 132, pct: 51 },
  { name: 'Alignment', count: 98, pct: 38 },
  { name: 'Efficiency', count: 74, pct: 28 }
];

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
              <FileText className="text-primary-foreground size-4" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Research</h1>
          </div>
          <ThemeSettings />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-sm">Your research overview at a glance.</p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader className="flex-row items-center justify-between">
                <CardDescription className="text-xs font-medium tracking-wider uppercase">
                  {stat.label}
                </CardDescription>
                <stat.icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{stat.value}</span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      stat.trend === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs section */}
        <Tabs defaultValue="recent">
          <TabsList variant="line">
            <TabsTrigger value="recent">Recent Papers</TabsTrigger>
            <TabsTrigger value="topics">Top Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Papers</CardTitle>
                <CardDescription>Papers you&apos;ve added or reviewed recently.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-border divide-y">
                  {recentPapers.map((paper) => (
                    <div
                      key={paper.title}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{paper.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {paper.authors} &middot; {paper.date}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            paper.status === 'Reviewed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : paper.status === 'In Progress'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {paper.status}
                        </span>
                        <ArrowUpRight className="text-muted-foreground size-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Topics</CardTitle>
                <CardDescription>Most frequently appearing research topics.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTopics.map((topic) => (
                    <div key={topic.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-muted-foreground">{topic.count} papers</span>
                      </div>
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${topic.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
