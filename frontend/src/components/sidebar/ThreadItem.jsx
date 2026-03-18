import { Trash2 } from "lucide-react";

const ThreadItem = ({ title, onSelect, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="thread-item-wrapper" onClick={onSelect}>
      <button className="thread-item" title={title}>
        <span className="thread-title">{title}</span>
      </button>
      <button className="thread-delete-btn" title="Delete chat" onClick={handleDelete}>
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default ThreadItem;
