import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Bold, Italic, List, AlignLeft, 
  AlignCenter, AlignRight, Save, 
  ChevronLeft, Type, FileHeader, 
  Trash2, Download
} from 'lucide-react';
import { storage, OfficeFile } from '../lib/storage';

interface WriterProps {
  file: OfficeFile;
  onBack: () => void;
  onSave: (file: OfficeFile) => void;
}

export default function Writer({ file, onBack, onSave }: WriterProps) {
  const [content, setContent] = useState(file.content || '');
  const [name, setName] = useState(file.name);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleSave = () => {
    const newFile = {
      ...file,
      name,
      content: editorRef.current?.innerHTML || '',
      lastModified: Date.now(),
    };
    onSave(newFile);
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep text-gray-300 overflow-hidden font-sans">
      {/* Toolbar */}
      <header className="p-2 border-b border-border-subtle flex flex-wrap items-center gap-2 bg-bg-panel shadow-sm z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-semibold px-2 py-1 focus:ring-1 focus:ring-brand rounded text-white"
          placeholder="Untitled Document"
        />

        <div className="h-6 w-px bg-border-subtle mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><Bold size={18} /></button>
          <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><Italic size={18} /></button>
          <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><List size={18} /></button>
        </div>

        <div className="h-6 w-px bg-border-subtle mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><AlignLeft size={18} /></button>
          <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><AlignCenter size={18} /></button>
          <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md transition-colors"><AlignRight size={18} /></button>
        </div>

        <button 
          onClick={handleSave}
          className="ml-auto bg-brand text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-900/20"
        >
          <Save size={16} />
          Save
        </button>
      </header>

      {/* Editor Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-10 flex justify-center bg-[#121212]">
        <div className="relative w-full max-w-4xl min-h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand rounded-t-sm z-20" />
          <div 
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            className="w-full bg-white min-h-[1056px] shadow-2xl p-16 sm:p-24 outline-none prose prose-slate focus:ring-0 text-[#1a1a1a]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </main>
    </div>
  );
}
