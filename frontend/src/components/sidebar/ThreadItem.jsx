const ThreadItem = ({ title }) => {
  return (
    <button className="thread-item" title={title}>
      <span className="thread-title">{title}</span>
    </button>
  );
};

export default ThreadItem;
