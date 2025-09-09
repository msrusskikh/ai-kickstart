import React from 'react';

interface ScenarioPanelProps {
  title: string;
  description: string;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ title, description }) => {
  return (
    <div className="rounded-xl border border-border/30 bg-card/50 text-card-foreground shadow-sm p-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">
        {title}
      </h2>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ScenarioPanel;
