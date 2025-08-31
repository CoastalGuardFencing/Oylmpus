import React, { useState, useEffect } from 'react';

interface TimestampBarProps {
  isOnline: boolean;
}

const TimestampBar: React.FC<TimestampBarProps> = ({ isOnline }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-1 text-xs text-text-muted bg-surface/50 backdrop-blur-sm border-b border-border/50">
      <div>{formattedTime}</div>
      <div className="flex items-center gap-2">
        <span>{isOnline ? 'System Online' : 'Sovereign Offline'}</span>
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
      </div>
    </header>
  );
};

export default TimestampBar;
