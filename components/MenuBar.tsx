
import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, Plus, Settings, Save, FileUp } from 'lucide-react';

interface MenuBarProps {
  onOpenArchive: () => void;
  onCreateProject: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onSaveProject: () => void;
  onImportProject: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  onOpenArchive, 
  onCreateProject,
  onOpenSettings,
  onOpenHelp,
  onSaveProject,
  onImportProject
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { 
      label: 'File', 
      id: 'file',
      children: [
        { label: 'New Project', icon: <Plus className="w-3 h-3"/>, action: onCreateProject },
        { label: 'Save Project File', icon: <Save className="w-3 h-3"/>, action: onSaveProject },
        { label: 'Open Project File', icon: <FileUp className="w-3 h-3"/>, action: onImportProject },
        { label: 'Project Archive', icon: <FolderOpen className="w-3 h-3"/>, action: onOpenArchive },
      ]
    },
    { 
      label: 'Settings', 
      id: 'settings', 
      action: onOpenSettings,
      children: [] 
    },
    { 
      label: 'Help', 
      id: 'help', 
      action: onOpenHelp,
      children: [] 
    },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
     if (item.action) {
         item.action();
         setActiveMenu(null);
     } else {
         setActiveMenu(activeMenu === item.id ? null : item.id);
     }
  };

  return (
    <nav className="h-[30px] bg-cine-header flex items-center px-[10px] border-b border-black select-none relative z-50" ref={menuRef}>
      <div className="flex space-x-1 text-cine-text text-xs">
        {menuItems.map((item) => (
          <div key={item.id} className="relative">
            <span 
              onClick={() => handleMenuClick(item)}
              className={`px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-2 ${activeMenu === item.id ? 'bg-cine-accent text-white' : 'hover:bg-[#444] hover:text-white'}`}
            >
              {item.label}
            </span>
            
            {activeMenu === item.id && item.children.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#252526] border border-[#444] shadow-xl rounded-sm py-1 flex flex-col animate-fadeIn">
                {item.children.map((child, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      child.action();
                      setActiveMenu(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-left text-cine-text hover:bg-cine-accent hover:text-white text-xs transition-colors"
                  >
                    {child.icon}
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="ml-auto text-cine-text-dim font-semibold text-xs tracking-wide">
        CINE-ENGINE
      </div>
    </nav>
  );
};

export default MenuBar;
