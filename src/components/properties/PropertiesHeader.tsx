import React from 'react';

interface PropertiesHeaderProps {
  count: number;
  onDelete: () => void;
}

export function PropertiesHeader({ count, onDelete }: PropertiesHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white font-semibold text-sm">
        {count} element{count > 1 ? 's' : ''} selected
      </h3>
      <button
        onClick={onDelete}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
