import { ResourcesList } from '@/components/resources/ResourcesList';

export function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Resources Library</h1>
        <ResourcesList />
      </div>
    </div>
  );
} 