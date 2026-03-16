const PromptCard = ({ prompt }) => {
  const Icon = prompt.icon;
  
  return (
    <div className="prompt-card">
      <div className="prompt-icon-wrapper">
        <Icon size={16} className={prompt.color} />
      </div>
      <span className="prompt-title">{prompt.title}</span>
    </div>
  );
};

export default PromptCard;
