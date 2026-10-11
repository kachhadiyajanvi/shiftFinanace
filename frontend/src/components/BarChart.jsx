import React from 'react';
import { inr } from '../context/DataContext';

export default function BarChart({ values = [], labels = [], color = '#12B8A6' }) {
  const mx = Math.max(...values, 1);

  return (
    <svg viewBox="0 0 300 130" className="ch">
      {values.map((x, i) => {
        const h = (x / mx) * 88;
        const xPos = i * 50 + 10;
        const yPos = 100 - h;
        const label = labels[i] || '';

        return (
          <g key={i}>
            <rect
              x={xPos}
              y={yPos}
              width="30"
              height={h}
              rx="6"
              fill={color}
            >
              <title>{`${label}: ${inr(x)}`}</title>
            </rect>
            <text
              x={xPos + 15}
              y="118"
              textAnchor="middle"
              fontSize="11"
              fill="#33405a"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
