"use client";

type BuddyPoolModalProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function BuddyPoolModal({
  title,
  description,
  onClose,
  children
}: BuddyPoolModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[#12021f] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" 
        onClick={(event) => event.stopPropagation()}
      >
        <header className="p-8 border-b border-white/10 bg-white/5">
          <h3 className="text-2xl font-bold text-white m-0">{title}</h3>
          {description ? <p className="text-white/50 text-base mt-2 m-0">{description}</p> : null}
        </header>
        
        <div className="p-8 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 selection:bg-purple-500/30">
          {children}
        </div>

        <footer className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
          <button 
            className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all active:scale-95" 
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
