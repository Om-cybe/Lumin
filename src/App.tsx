import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, FileText, Layout, 
  Table, Clock, MoreVertical, 
  Trash2, Monitor,Smartphone, 
  Menu, X, Laptop, LogOut
} from 'lucide-react';
import { storage, OfficeFile, FileType } from './lib/storage';
import Writer from './components/Writer';
import Sheets from './components/Sheets';
import Presenter from './components/Presenter';
import { cn } from './lib/utils';

export default function App() {
  const [files, setFiles] = useState<OfficeFile[]>([]);
  const [activeFile, setActiveFile] = useState<OfficeFile | null>(null);
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const allFiles = await storage.getAllFiles();
    setFiles(allFiles.sort((a, b) => b.lastModified - a.lastModified));
  };

  const createNewFile = async (type: FileType) => {
    const newFile: OfficeFile = {
      id: Date.now().toString(),
      name: `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      content: type === 'presentation' ? { slides: [{ id: '1', title: 'Welcome', content: 'Double click to edit', background: '#ffffff' }] } : 
               type === 'spreadsheet' ? {} : '',
      lastModified: Date.now(),
    };
    await storage.saveFile(newFile);
    setActiveFile(newFile);
    loadFiles();
  };

  const handleSave = async (file: OfficeFile) => {
    await storage.saveFile(file);
    setActiveFile(null);
    loadFiles();
  };

  const deleteFile = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this file?')) {
      await storage.deleteFile(id);
      loadFiles();
    }
  };

  const getIcon = (type: FileType) => {
    switch (type) {
      case 'document': return <FileText className="text-brand" size={24} />;
      case 'spreadsheet': return <Table className="text-emerald-500" size={24} />;
      case 'presentation': return <Layout className="text-orange-500" size={24} />;
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // Active Editor View
  if (activeFile) {
    return (
      <div className="h-screen w-full flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFile.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden"
          >
            {activeFile.type === 'document' && (
              <Writer file={activeFile} onBack={() => setActiveFile(null)} onSave={handleSave} />
            )}
            {activeFile.type === 'spreadsheet' && (
              <Sheets file={activeFile} onBack={() => setActiveFile(null)} onSave={handleSave} />
            )}
            {activeFile.type === 'presentation' && (
              <Presenter file={activeFile} onBack={() => setActiveFile(null)} onSave={handleSave} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-gray-300 font-sans flex flex-col">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg-panel/80 backdrop-blur-lg border-b border-border-subtle z-50 px-4 flex items-center justify-between lg:hidden text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">Ω</div>
          <span className="font-bold tracking-tight">Lumina Office</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Main Content (with dynamic sidebar) */}
      <div className="flex flex-1 pt-16 lg:pt-0">
        {/* Desktop Sidebar / Mobile Menu */}
        <aside className={cn(
          "fixed inset-0 lg:relative lg:inset-auto z-40 w-full lg:w-64 bg-bg-surface border-r border-border-subtle transition-transform lg:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col p-4">
            <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 bg-brand rounded-xl shadow-lg shadow-indigo-900/40 flex items-center justify-center text-white font-black text-xl">Ω</div>
              <div>
                <h1 className="font-bold leading-none tracking-tight text-white">Lumina Suite</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Professional Edition</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Start New</p>
              <button 
                onClick={() => { createNewFile('document'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand/10 text-gray-400 hover:text-indigo-100 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-bg-panel rounded-lg flex items-center justify-center group-hover:bg-brand transition-colors">
                  <FileText size={20} className="group-hover:text-white" />
                </div>
                <span className="font-medium">Document</span>
              </button>
              <button 
                onClick={() => { createNewFile('spreadsheet'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-100 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-bg-panel rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <Table size={20} className="group-hover:text-white" />
                </div>
                <span className="font-medium">Spreadsheet</span>
              </button>
              <button 
                onClick={() => { createNewFile('presentation'); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-500/10 text-gray-400 hover:text-orange-100 rounded-xl transition-all group"
              >
                <div className="w-10 h-10 bg-bg-panel rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Layout size={20} className="group-hover:text-white" />
                </div>
                <span className="font-medium">Presentation</span>
              </button>
            </nav>

            <div className="mt-auto pt-4 border-t border-border-subtle">
               <div className="bg-bg-panel p-3 rounded-xl border border-border-subtle">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Laptop size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tighter">Local Sync</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-border-subtle rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500/50"></div>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Dashboard */}
        <main className="flex-1 p-4 lg:p-10 max-w-6xl mx-auto w-full">
          {/* Dashboard Header */}
          <div className="mb-10 lg:flex lg:items-center lg:justify-between gap-4 space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Workspace</h2>
              <p className="text-gray-500 mt-1">Managing {files.length} local files</p>
            </div>
            
            <div className="relative group max-w-sm w-full lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand transition-colors" size={18} />
              <input 
                placeholder="Search your library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-bg-surface border border-border-subtle rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-sm text-white"
              />
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => (
                <motion.div 
                  layout
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setActiveFile(file)}
                  className="bg-bg-surface p-5 rounded-3xl border border-border-subtle hover:border-brand transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-brand transition-colors" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                      file.type === 'document' ? 'bg-indigo-900/10 group-hover:bg-brand' : 
                      file.type === 'spreadsheet' ? 'bg-emerald-900/10 group-hover:bg-emerald-500' : 'bg-orange-900/10 group-hover:bg-orange-500'
                    )}>
                      {React.cloneElement(getIcon(file.type) as React.ReactElement, { 
                        className: cn(
                          (getIcon(file.type) as React.ReactElement).props.className,
                          "group-hover:text-white"
                        )
                      })}
                    </div>
                    <button 
                      onClick={(e) => deleteFile(file.id, e)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-white text-lg mb-1 truncate pr-4">{file.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={12} />
                    <span className="text-xs font-medium">
                      {new Date(file.lastModified).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-indigo-400 transition-colors">
                      Open {file.type}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-border-subtle flex items-center justify-center text-gray-500 group-hover:bg-brand group-hover:text-white transition-all">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-bg-surface border border-dashed border-border-subtle rounded-3xl">
                <div className="w-16 h-16 bg-bg-panel rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-700" size={32} />
                </div>
                <h3 className="font-bold text-white">No files found</h3>
                <p className="text-gray-500 text-sm mt-1">Start by creating a new document, spreadsheet or slide.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <button onClick={() => createNewFile('document')} className="px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-bold shadow-lg shadow-brand/20 hover:bg-indigo-700 transition-all">New Document</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden flex flex-col items-end gap-3 z-50">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col gap-2 mb-2"
            >
              <button 
                onClick={() => createNewFile('presentation')}
                className="w-12 h-12 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Layout size={20} />
              </button>
              <button 
                onClick={() => createNewFile('spreadsheet')}
                className="w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Table size={20} />
              </button>
              <button 
                onClick={() => createNewFile('document')}
                className="w-12 h-12 bg-brand text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <FileText size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "w-14 h-14 bg-white text-bg-deep rounded-full shadow-xl flex items-center justify-center transition-transform",
            isMenuOpen && "rotate-45"
          )}
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}
