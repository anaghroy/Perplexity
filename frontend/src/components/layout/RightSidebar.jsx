import { Info } from "lucide-react";

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="insights-section">
        <h3 className="insights-header">
          <Info size={16} className="text-blue-500" />
          <span>Insights & Resources</span>
        </h3>
        
        <div className="related-questions">
          <h4 className="section-subtitle">RELATED QUESTIONS</h4>
          <ul className="question-list">
            <li>Difference between quantum bits and classical bits?</li>
            <li>How cold does a quantum computer need to be?</li>
            <li>Leading companies in quantum hardware?</li>
          </ul>
        </div>

        <div className="sources-preview">
          <h4 className="section-subtitle">SOURCES PREVIEW</h4>
          <div className="source-list">
            <div className="source-item">
              <div className="source-icon wiki">W</div>
              <div className="source-text">
                <span className="source-title">Wikipedia: Quantum Computing</span>
                <span className="source-desc">History and mechanics of QC...</span>
              </div>
            </div>
            
            <div className="source-item">
              <div className="source-icon ibm">IBM</div>
              <div className="source-text">
                <span className="source-title">IBM Quantum Explorers</span>
                <span className="source-desc">Learning paths for quantum...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-upgrade">
        <div className="pro-card">
          <h4 className="pro-title">PRO UPGRADE</h4>
          <p className="pro-desc">Unlock file uploads, GPT-4, and unlimited search.</p>
          <button className="pro-btn">Learn More</button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
