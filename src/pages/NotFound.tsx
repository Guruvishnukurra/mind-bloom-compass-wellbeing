
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen wellness-gradient flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-white/50 flex items-center justify-center">
        <div className="text-4xl font-bold">404</div>
      </div>

      <h1 className="text-2xl md:text-4xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the page you're looking for. Let's get you back to your wellness journey.
      </p>
      
      <Button asChild size="lg">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
