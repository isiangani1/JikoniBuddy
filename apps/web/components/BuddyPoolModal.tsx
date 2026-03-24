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
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <h3>{title}</h3>
        {description ? <p className="muted">{description}</p> : null}
        {children}
        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
