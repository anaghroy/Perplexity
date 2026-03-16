import PromptCard from "./PromptCard";
import { Lightbulb, MapPin, DollarSign, Zap } from "lucide-react";

const mockPrompts = [
  {
    id: 1,
    title: "Explain quantum computing simply",
    icon: Lightbulb,
    color: "prompt-icon--cyan"
  },
  {
    id: 2,
    title: "Best places to visit in Japan",
    icon: MapPin,
    color: "prompt-icon--blue"
  },
  {
    id: 3,
    title: "How does blockchain work?",
    icon: DollarSign,
    color: "prompt-icon--green"
  },
  {
    id: 4,
    title: "Future of artificial intelligence",
    icon: Zap,
    color: "prompt-icon--cyan-light"
  }
];

const PromptList = () => {
  return (
    <div className="prompt-grid">
      {mockPrompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};

export default PromptList;
