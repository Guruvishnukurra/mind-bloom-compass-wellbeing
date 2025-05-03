import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mail, BookOpen, HelpCircle } from 'lucide-react';

export default function Support() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground mb-8">
          We're here to help you on your wellness journey. Choose from the options below to get the support you need.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <CardTitle>Chat Support</CardTitle>
              </div>
              <CardDescription>
                Get instant help from our AI assistant or connect with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.href = '/chat'}>
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Support</CardTitle>
              </div>
              <CardDescription>
                Send us an email and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@mindbloom-wellness.com'}
              >
                Email Us
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Help Resources</CardTitle>
              </div>
              <CardDescription>
                Browse our library of articles, guides, and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.location.href = '/resources'}
              >
                View Resources
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>FAQ</CardTitle>
              </div>
              <CardDescription>
                Find answers to common questions about using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.location.href = '/resources?type=faq'}
              >
                View FAQs
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-lg font-medium text-amber-800 mb-2">Crisis Support</h3>
          <p className="text-amber-800 mb-4">
            If you or someone you know is in immediate danger, please call emergency services (911 in the US) or go to your nearest emergency room.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-amber-100"
              onClick={() => window.open('https://988lifeline.org/', '_blank')}
            >
              National Suicide Prevention Lifeline (988)
            </Button>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-amber-100"
              onClick={() => window.open('https://www.crisistextline.org/', '_blank')}
            >
              Crisis Text Line (Text HOME to 741741)
            </Button>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-amber-100"
              onClick={() => window.open('https://findtreatment.samhsa.gov/', '_blank')}
            >
              Find Treatment (SAMHSA)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 