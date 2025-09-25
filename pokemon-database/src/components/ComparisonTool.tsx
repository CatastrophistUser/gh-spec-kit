import React from 'react';
import { Link } from 'react-router-dom';

export default function ComparisonTool() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comparison Tool</h1>
        <Link to="/" className="text-sm text-blue-600">Back</Link>
      </div>

      <p className="text-sm text-gray-600">Select up to 3 Pokémon to compare their stats and typings side-by-side. (UI placeholder)</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 border rounded">Slot 1</div>
        <div className="p-4 border rounded">Slot 2</div>
        <div className="p-4 border rounded">Slot 3</div>
      </div>
    </div>
  );
}
