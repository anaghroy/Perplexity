import { useState } from "react";
import { Compass, TrendingUp, Cpu, DollarSign, Palette, Trophy, Film } from "lucide-react";

const CATEGORIES = [
  { id: "top", label: "Top", icon: TrendingUp },
  { id: "tech", label: "Tech", icon: Cpu },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "arts", label: "Arts & Culture", icon: Palette },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "entertainment", label: "Entertainment", icon: Film },
];

const DISCOVER_NEWS = [
  {
    id: 1,
    category: "tech",
    title: "The Next Era of AI Models is Here: What to Expect in 2024",
    snippet: "From massive parameter jumps to hyper-efficient local models, the artificial intelligence landscape is evolving rapidly.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    sourceName: "TechCrunch",
    sourceIcon: "https://logo.clearbit.com/techcrunch.com",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    category: "finance",
    title: "Global Markets Rally as Tech Stocks Surge Higher",
    snippet: "Investors are pouring billions into tech infrastructure, pushing market indices to absolute record highs across regions.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    sourceName: "Bloomberg",
    sourceIcon: "https://logo.clearbit.com/bloomberg.com",
    timeAgo: "4h ago",
  },
  {
    id: 3,
    category: "tech",
    title: "Quantum Computing Breakthrough Hits Milestone",
    snippet: "Researchers have finally achieved stable qubits at room temperature, a monumental leap for quantum.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    sourceName: "Wired",
    sourceIcon: "https://logo.clearbit.com/wired.com",
    timeAgo: "5h ago",
  },
  {
    id: 4,
    category: "arts",
    title: "The Renaissance of Digital Art Collections",
    snippet: "Museums worldwide are partnering to digitize millions of historical art pieces, making them globally accessible.",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800",
    sourceName: "ArtNews",
    sourceIcon: "https://logo.clearbit.com/artnews.com",
    timeAgo: "1d ago",
  },
  {
    id: 5,
    category: "top",
    title: "SpaceX Unveils Next-Generation Starship Architecture",
    snippet: "The new orbital vehicles promise vastly improved payload capacities and unprecedented reusable turnaround times.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800",
    sourceName: "Space.com",
    sourceIcon: "https://logo.clearbit.com/space.com",
    timeAgo: "12h ago",
  },
  {
    id: 6,
    category: "sports",
    title: "Underdog Team Secures Shocking Championship Victory",
    snippet: "In a stunning upset, the lowest-seeded regional team defeated the reigning champions in triple overtime.",
    image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=800",
    sourceName: "ESPN",
    sourceIcon: "https://logo.clearbit.com/espn.com",
    timeAgo: "3h ago",
  },
  {
    id: 7,
    category: "entertainment",
    title: "Director's Cut Transforms Sci-Fi Cult Classic",
    snippet: "A newly released 4-hour extended cut is wowing fans, adding entirely new subplots into the famous film.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
    sourceName: "IGN",
    sourceIcon: "https://logo.clearbit.com/ign.com",
    timeAgo: "7h ago",
  },
  {
    id: 8,
    category: "finance",
    title: "Renewable Energy Investments Cross $1 Trillion Mark",
    snippet: "For the first time in history, global private investments in solar and wind far exceed fossil fuel expenditure.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    sourceName: "Forbes",
    sourceIcon: "https://logo.clearbit.com/forbes.com",
    timeAgo: "9h ago",
  }
];

const Discover = () => {
  const [activeCategory, setActiveCategory] = useState("top");

  const filteredNews = activeCategory === "top" 
    ? DISCOVER_NEWS 
    : DISCOVER_NEWS.filter(news => news.category === activeCategory);

  return (
    <div className="discover-page">
      <div className="discover-header">
        <div className="discover-title-row">
          <Compass className="discover-icon" size={28} />
          <h1 className="discover-title">Discover</h1>
        </div>
      </div>

      <div className="category-scroll">
        <div className="category-tabs">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button 
                key={cat.id} 
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="news-grid">
        {filteredNews.map(news => (
          <div key={news.id} className="news-card">
            <div className="news-image-wrapper">
              <img src={news.image} alt={news.title} className="news-image" />
              <div className="news-image-overlay"></div>
            </div>
            <div className="news-content">
              <h2 className="news-title">{news.title}</h2>
              <p className="news-snippet">{news.snippet}</p>
              
              <div className="news-meta">
                <div className="news-source">
                  <img src={news.sourceIcon} alt={news.sourceName} className="source-icon" onError={(e) => { e.target.style.display = 'none' }} />
                  <span className="source-name">{news.sourceName}</span>
                </div>
                <div className="news-meta-divider">•</div>
                <span className="news-time">{news.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
