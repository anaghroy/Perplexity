const Sources = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources-container">
      <div className="sources-header">
        <span className="sources-title">Sources</span>
      </div>
      <div className="sources-list">
        {sources.map((source, idx) => {
          let hostname = "Link";
          try {
            if (source.url) hostname = new URL(source.url).hostname.replace('www.', '');
          } catch (e) {}
          
          return (
            <a key={idx} href={source.url || "#"} target="_blank" rel="noopener noreferrer" className="source-card">
              <div className="source-icon">
                {source.icon ? <img src={source.icon} alt="" /> : <span className="default-favicon">{hostname.charAt(0).toUpperCase()}</span>}
              </div>
              <div className="source-info">
                <h4 className="source-name">{source.title || source.name || hostname}</h4>
                <p className="source-url-text">{hostname}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Sources;
