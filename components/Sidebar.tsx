import Link from 'next/link';
import { Home, Columns, Calendar, Settings } from 'lucide-react';

export default function Sidebar({ className = '' }: { className?: string }) {
  return (
    <aside className={`w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col ${className}`}>
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-white">Legal Task OS</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2a2a2a] hover:text-white transition-colors">
          <Home size={18} />
          <span>Tabla Principal</span>
        </Link>
        <Link href="/kanban" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2a2a2a] hover:text-white transition-colors">
          <Columns size={18} />
          <span>Tablero Kanban</span>
        </Link>
        <Link href="/calendar" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2a2a2a] hover:text-white transition-colors">
          <Calendar size={18} />
          <span>Calendario</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2a2a2a] hover:text-white transition-colors">
          <Settings size={18} />
          <span>Configuración</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-[#333]">
        <div className="text-xs text-gray-500">v0.1.0</div>
      </div>
    </aside>
  );
}
