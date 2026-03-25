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
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-[#160b24] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl z-50" onClick={(event) => event.stopPropagation()}>
        <h3>{title}</h3>
        {description ? <p className="text-white/50 text-sm">{description}</p> : null}
        {children}
        <div className="modal-actions">
          <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
