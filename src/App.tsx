import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { StatsProvider } from '@/contexts/StatsContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { AppRoutes } from '@/routes';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <StatsProvider>
            <AchievementProvider>
              <AppRoutes />
              <Toaster />
            </AchievementProvider>
          </StatsProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
};
