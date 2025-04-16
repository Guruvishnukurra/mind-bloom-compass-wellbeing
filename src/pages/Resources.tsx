import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ResourcesList } from '../components/resources/ResourcesList';
import { useQuotes } from '../hooks/useQuotes';
import { Search, BookOpen } from 'lucide-react';

const contentTypes = [
  { value: null, label: 'All' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'exercise', label: 'Exercises' },
  { value: 'tool', label: 'Tools' },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<'article' | 'video' | 'exercise' | 'tool' | null>(null);
  const quote = useQuotes();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-teal">Wellness Resources</h1>
        <p className="text-neutral-blue/80 max-w-2xl mx-auto">
          Explore our curated collection of resources to support your mental health and wellbeing journey.
          From guided meditations to educational articles, find tools that resonate with your needs.
        </p>
      </div>

      {/* Featured Quote */}
      {quote && (
        <Card className="bg-gradient-to-r from-primary-teal/10 to-primary-teal/5 p-6 border-none">
          <blockquote className="text-center">
            <p className="text-lg text-neutral-blue italic">"{quote.text}"</p>
            <footer className="mt-2 text-sm text-neutral-blue/60">— {quote.author}</footer>
          </blockquote>
        </Card>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-blue/40 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-white border-neutral-blue/20 focus:border-primary-teal"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {contentTypes.map((type) => (
            <Button
              key={type.label}
              variant={selectedContentType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedContentType(type.value)}
              className={`whitespace-nowrap ${
                selectedContentType === type.value
                  ? 'bg-primary-teal hover:bg-primary-teal/90'
                  : 'text-neutral-blue hover:text-primary-teal'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <ResourcesList
        searchQuery={searchQuery}
        contentType={selectedContentType}
      />
    </div>
  );
} 