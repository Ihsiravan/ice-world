'use client'

import { User } from "lucide-react";

interface NavigationProps {
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

export function Navigation({ currentUser }: NavigationProps) {

  return (
    <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/80 border-b border-border sticky top-0 z-40">
      <h1 className="text-2xl font-serif font-bold gradient-text">
        Himalika's Memories
      </h1>
      
      {currentUser && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-lavender flex items-center justify-center">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
          <span className="text-sm font-medium text-foreground">
            {currentUser.name}
          </span>
        </div>
      )}
    </nav>
  );
}