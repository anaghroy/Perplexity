const ThreadItem = ({ title, onSelect }) => {
  return (
    <button className="thread-item" title={title} onClick={onSelect}>
      <span className="thread-title">{title}</span>
    </button>
  );
};

export default ThreadItem;
