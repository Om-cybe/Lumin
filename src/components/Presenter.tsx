import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Save, Plus, Trash2, 
  Play, LayoutTemplate, Palette, 
  Image as ImageIcon, Type, Square
} from 'lucide-react';
import { OfficeFile } from '../lib/storage';

interface Slide {
  id: string;
  title: string;
  content: string;
  background: string;
}

interface PresenterProps {
  file: OfficeFile;
  onBack: () => void;
  onSave: (file: OfficeFile) => void;
}

export default function Presenter({ file, onBack, onSave }: PresenterProps) {
  const [slides, setSlides] = useState<Slide[]>(file.content?.slides || [
    { id: '1', title: 'Start Here', content: 'Click to edit your first slide.', background: '#ffffff' }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [name, setName] = useState(file.name);
  const [isPreview, setIsPreview] = useState(false);

  const activeSlide = slides[activeSlideIndex];

  const handleSave = () => {
    onSave({ ...file, name, content: { slides } });
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      title: 'New Slide',
      content: 'Add content here...',
      background: '#ffffff'
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[activeSlideIndex] = { ...activeSlide, ...updates };
    setSlides(newSlides);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setActiveSlideIndex(Math.min(activeSlideIndex, newSlides.length - 1));
  };

  if (isPreview) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-4">
        <button 
          onClick={() => setIsPreview(false)}
          className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors"
        >
          Exit Show
        </button>
        <motion.div 
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl aspect-video rounded-lg p-12 flex flex-col justify-center text-center overflow-hidden"
          style={{ backgroundColor: activeSlide.background }}
          onClick={() => {
            if (activeSlideIndex < slides.length - 1) setActiveSlideIndex(activeSlideIndex + 1);
            else setIsPreview(false);
          }}
        >
          <h1 className="text-6xl font-bold mb-8 text-slate-900">{activeSlide.title}</h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto">{activeSlide.content}</p>
        </motion.div>
        <div className="absolute bottom-4 right-4 text-white/50 text-sm">
          {activeSlideIndex + 1} / {slides.length}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-deep text-gray-300 overflow-hidden font-sans">
      {/* Header */}
      <header className="p-2 border-b bg-bg-panel border-border-subtle flex items-center gap-2 shadow-sm z-30">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"><ChevronLeft size={20} /></button>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none font-semibold px-2 py-1 focus:ring-1 focus:ring-orange-500 rounded text-sm sm:text-base text-white"
        />
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreview(true)}
            className="p-2 hover:bg-white/10 rounded-md text-orange-500 transition-colors"
          >
            <Play size={20} />
          </button>
          <button 
            onClick={handleSave}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-900/20"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails Sidebar */}
        <aside className="w-48 bg-bg-surface border-r border-border-subtle flex flex-col overflow-hidden hidden sm:flex">
          <div className="p-4 border-b border-border-subtle bg-bg-panel/50">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slides Library</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {slides.map((slide, idx) => (
              <div key={slide.id} className="relative group">
                <button
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-full aspect-video rounded-lg border-2 transition-all overflow-hidden p-2 text-[6px] text-left leading-tight ${
                    activeSlideIndex === idx ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-border-subtle hover:border-gray-700'
                  }`}
                  style={{ backgroundColor: slide.background }}
                >
                  <div className="font-bold mb-1 truncate text-slate-900">{slide.title}</div>
                  <div className="opacity-50 line-clamp-3 text-slate-800">{slide.content}</div>
                </button>
                <div className="absolute -top-2 -right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                    className="p-1.5 bg-red-600 text-white shadow-xl rounded-full hover:bg-red-700 active:scale-90 transition-all"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-700">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-bg-panel/50 border-t border-border-subtle">
            <button 
                onClick={addSlide}
                className="w-full p-2.5 border-2 border-dashed border-border-subtle rounded-xl text-gray-500 hover:text-orange-500 hover:border-orange-500/50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
                <Plus size={16} /> Add Slide
            </button>
          </div>
        </aside>

        {/* Main Work Area */}
        <main className="flex-1 p-6 sm:p-12 overflow-y-auto flex flex-col items-center gap-8 bg-[#121212]">
          <div className="relative w-full max-w-4xl shadow-2xl group">
             <div className="absolute -top-1 left-0 w-full h-1 bg-orange-500 rounded-t-sm opacity-0 group-hover:opacity-100 transition-opacity" />
             <div 
                className="w-full aspect-video bg-white rounded-sm p-16 sm:p-24 flex flex-col justify-center text-center relative overflow-hidden"
                style={{ backgroundColor: activeSlide.background }}
              >
                <textarea
                  className="text-4xl sm:text-6xl font-black bg-transparent border-none outline-none text-center resize-none mb-6 placeholder:text-slate-200 text-slate-900 leading-tight"
                  value={activeSlide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                  placeholder="Slide Title"
                  rows={2}
                />
                <textarea
                  className="text-lg sm:text-2xl text-slate-500 bg-transparent border-none outline-none text-center resize-none placeholder:text-slate-200 font-medium"
                  value={activeSlide.content}
                  onChange={(e) => updateSlide({ content: e.target.value })}
                  placeholder="Click to add presentation content"
                  rows={4}
                />
              </div>
          </div>

          {/* Slide Controls */}
          <div className="flex items-center gap-4 bg-bg-panel p-2.5 rounded-2xl shadow-2xl border border-border-subtle px-6">
            <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"><Type size={18} /></button>
            <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"><ImageIcon size={18} /></button>
            <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"><Square size={18} /></button>
            <div className="w-px h-6 bg-border-subtle mx-1" />
            <div className="flex gap-2">
              {['#ffffff', '#f8fafc', '#fff7ed', '#f0fdf4'].map(color => (
                <button 
                  key={color}
                  onClick={() => updateSlide({ background: color })}
                  className={`w-6 h-6 rounded-lg border border-border-subtle transition-all cursor-pointer ${activeSlide.background === color ? 'ring-2 ring-orange-500 scale-110 shadow-lg' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
