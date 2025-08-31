import React, { useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  price: number;
  change: number;
}

const initialStocks: Stock[] = [
  { symbol: 'NASDAQ:PRAX', price: 888.88, change: 12.34 },
  { symbol: 'AETHER:OS', price: 333.33, change: -5.67 },
  { symbol: 'GLYPH:TECH', price: 111.11, change: 8.90 },
];

const MarketSyncPanel: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const change = (Math.random() - 0.5) * (stock.price * 0.01);
          return {
            ...stock,
            price: Math.max(0, stock.price + change),
            change: change,
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="space-y-3">
        {stocks.map(stock => (
          <div key={stock.symbol} className="grid grid-cols-3 items-center text-sm">
            <span className="font-semibold text-text-main col-span-1">{stock.symbol}</span>
            <span className="font-mono text-right col-span-1">{stock.price.toFixed(2)}</span>
            <span className={`font-mono text-right col-span-1 ${stock.change >= 0 ? 'text-success' : 'text-warning'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 mt-4 flex items-end justify-center">
        <p className="text-xs text-text-muted/70 text-center">Live chart data integration pending brokerage API sync.</p>
      </div>
    </div>
  );
};

export default MarketSyncPanel;
