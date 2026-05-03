import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Save, Table as TableIcon, 
  Grid3X3, Sigma, Filter, Plus
} from 'lucide-react';
import { OfficeFile } from '../lib/storage';

interface SheetsProps {
  file: OfficeFile;
  onBack: () => void;
  onSave: (file: OfficeFile) => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const ROWS = Array.from({ length: 40 }, (_, i) => i + 1);

export default function Sheets({ file, onBack, onSave }: SheetsProps) {
  const [data, setData] = useState<{ [key: string]: string }>(file.content || {});
  const [name, setName] = useState(file.name);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const handleCellChange = (cellId: string, value: string) => {
    setData(prev => ({ ...prev, [cellId]: value }));
  };

  const handleSave = () => {
    onSave({ ...file, name, content: data });
  };

  const getCellValue = (cellId: string) => {
    return data[cellId] || '';
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep text-gray-300 overflow-hidden font-sans">
      {/* Toolbar */}
      <header className="p-2 border-b border-border-subtle flex items-center gap-2 bg-bg-panel shadow-sm z-30">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"><ChevronLeft size={20} /></button>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-semibold px-2 py-1 focus:ring-1 focus:ring-emerald-500 rounded text-sm sm:text-base text-white"
        />
        <button 
          onClick={handleSave}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Save size={16} />
          Save
        </button>
      </header>

      {/* Formula Bar */}
      <div className="bg-bg-surface border-b border-border-subtle p-1.5 flex items-center gap-2 text-sm px-4 shadow-inner z-20">
        <span className="font-mono text-emerald-500 font-bold w-10 text-center">{selectedCell || '--'}</span>
        <div className="h-6 w-px bg-border-subtle" />
        <div className="flex-1 flex items-center gap-2 px-2">
            <span className="text-gray-600 font-bold italic font-serif">fx</span>
            <input 
            className="flex-1 outline-none bg-transparent text-gray-200"
            placeholder="Enter formula or value"
            value={selectedCell ? getCellValue(selectedCell) : ''}
            onChange={(e) => selectedCell && handleCellChange(selectedCell, e.target.value)}
            />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto relative bg-[#121212]">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex bg-[#1A1A1A] sticky top-0 z-20 shadow-sm">
            <div className="w-10 border-r border-b border-border-subtle bg-[#222] flex-shrink-0" />
            {COLS.map(col => (
              <div key={col} className="w-32 py-1.5 border-r border-b border-border-subtle text-center font-bold text-[10px] text-gray-500 uppercase tracking-widest flex-shrink-0">
                {col}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {ROWS.map(row => (
            <div key={row} className="flex group">
              <div className="w-10 border-r border-b border-border-subtle bg-[#1A1A1A] flex items-center justify-center text-[10px] text-gray-600 font-black sticky left-0 z-10 flex-shrink-0 group-hover:text-emerald-500 transition-colors">
                {row}
              </div>
              {COLS.map(col => {
                const cellId = `${col}${row}`;
                return (
                  <div 
                    key={cellId} 
                    className={cn(
                      "w-32 h-10 border-r border-b border-border-subtle bg-[#0D0D0D] flex-shrink-0 relative overflow-hidden transition-colors",
                      selectedCell === cellId ? "ring-2 ring-emerald-500 z-10 bg-[#1A1A1A]" : "hover:bg-white/[0.02]"
                    )}
                    onClick={() => setSelectedCell(cellId)}
                  >
                    <input
                      className="w-full h-full px-3 outline-none bg-transparent text-sm text-gray-300 font-medium"
                      value={getCellValue(cellId)}
                      onChange={(e) => handleCellChange(cellId, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar Status Bar */}
      <footer className="h-7 bg-bg-panel border-t border-border-subtle flex items-center px-4 gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <div className="flex items-center gap-2 text-brand"><Grid3X3 size={12} /> Live Workspace</div>
        <div className="w-px h-3 bg-border-subtle" />
        <div className="flex items-center gap-2">Sheet 1</div>
        <button className="p-1 hover:bg-white/10 rounded transition-colors ml-auto"><Plus size={12} /></button>
      </footer>
    </div>
  );
}

// Helper for Tailwind classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
