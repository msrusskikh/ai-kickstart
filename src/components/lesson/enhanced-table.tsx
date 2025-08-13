import React from 'react';

interface EnhancedTableProps {
  children: React.ReactNode;
  className?: string;
}

export function EnhancedTable({ children, className = '' }: EnhancedTableProps) {
  return (
    <div className={`overflow-x-auto my-6 ${className}`}>
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  );
}

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`min-w-full divide-y divide-gray-300 dark:divide-gray-600 ${className}`}>
      {children}
    </table>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 ${className}`}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  isAlternate?: boolean;
}

export function TableRow({ children, className = '', isAlternate = false }: TableRowProps) {
  const baseClasses = 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150';
  const alternateClasses = isAlternate ? 'bg-gray-50 dark:bg-gray-700' : '';
  
  return (
    <tr className={`${baseClasses} ${alternateClasses} ${className}`}>
      {children}
    </tr>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 ${className}`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </td>
  );
}
