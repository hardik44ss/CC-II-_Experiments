import React from 'react';
import { Gauge } from 'lucide-react';

interface SpeedOption {
  label: string;
  value: number;
}

interface VisualizerSpeedControlProps {
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  options?: SpeedOption[];
}

export const DEFAULT_SPEED_OPTIONS: SpeedOption[] = [
  { label: '0.5x Slow', value: 0.5 },
  { label: '0.75x Relaxed', value: 0.75 },
  { label: '1x Normal', value: 1.0 },
  { label: '1.5x Fast', value: 1.5 }
];

export const VisualizerSpeedControl: React.FC<VisualizerSpeedControlProps> = ({
  speed,
  onChangeSpeed,
  options = DEFAULT_SPEED_OPTIONS
}) => {
  return (
    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
      <div className="flex items-center gap-1 px-1.5 text-slate-400 font-mono text-[11px]">
        <Gauge className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">Speed:</span>
      </div>
      {options.map((opt) => {
        const isSelected = Math.abs(speed - opt.value) < 0.05;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChangeSpeed(opt.value)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title={`Set simulation speed to ${opt.label}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
