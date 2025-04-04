import { GratitudeJournal } from '@/components/journal/GratitudeJournal';

export default function Gratitude() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gratitude Journal</h1>
        <GratitudeJournal />
      </div>
    </div>
  );
} 