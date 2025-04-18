
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sage-200 py-8 bg-cream-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deep-ocean-500 to-sage-500 shadow-md flex items-center justify-center">
                <div className="w-6 h-6 bg-white/80 rounded-full"></div>
              </div>
              <span className="text-xl font-heading font-semibold text-deep-ocean-600">MindBloom</span>
            </div>
            <p className="text-sm text-deep-ocean-600/80 font-body">
              Evidence-based tools for mental wellness and personal growth.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-deep-ocean-600 font-heading">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/mood" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Mood Tracking</Link></li>
              <li><Link to="/meditation" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Meditation</Link></li>
              <li><Link to="/journal" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Journaling</Link></li>
              <li><Link to="/resources" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-deep-ocean-600 font-heading">Wellness</h3>
            <ul className="space-y-2">
              <li><Link to="/habits" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Habits</Link></li>
              <li><Link to="/achievements" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Achievements</Link></li>
              <li><Link to="/chat" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">AI Assistant</Link></li>
              <li><Link to="/gratitude" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Gratitude</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-deep-ocean-600 font-heading">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Dashboard</Link></li>
              <li><Link to="/resources" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Help Resources</Link></li>
              <li><Link to="/chat" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Chat Support</Link></li>
              <li><a href="mailto:support@mindbloom-wellness.com" className="text-sm text-deep-ocean-600/70 hover:text-sage-600 transition-colors">Email Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-sage-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-deep-ocean-600/70 font-body">
            © {new Date().getFullYear()} MindBloom. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1.5 text-xs text-deep-ocean-600/70 bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
            <span>Made with</span>
            <Heart size={12} className="text-terracotta-500 fill-terracotta-500" />
            <span>for mental wellness</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-deep-ocean-600/70 hover:text-sage-600 transition-colors bg-white/50 p-2 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-deep-ocean-600/70 hover:text-sage-600 transition-colors bg-white/50 p-2 rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
