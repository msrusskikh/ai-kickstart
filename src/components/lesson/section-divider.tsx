import React from 'react';

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <hr className={`my-8 border-gray-200 dark:border-gray-700 ${className}`} />
  );
}
