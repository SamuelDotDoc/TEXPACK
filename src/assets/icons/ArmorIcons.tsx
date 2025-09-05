import React from 'react';

// Componentes de ícones SVG para diferentes tipos de armaduras
// Estes são placeholders que podem ser substituídos por ícones personalizados

interface IconProps {
  className?: string;
  color?: string;
}

export const LightArmorIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#10B981" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2"/>
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MediumArmorIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#F59E0B" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="2"/>
    <rect x="8" y="8" width="8" height="8" rx="1" fill={color} stroke="white" strokeWidth="1"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
  </svg>
);

export const HeavyArmorIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#EF4444" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" fill={color} stroke={color} strokeWidth="2"/>
    <rect x="6" y="7" width="12" height="10" rx="2" fill={color} stroke="white" strokeWidth="1"/>
    <rect x="8" y="9" width="8" height="6" rx="1" fill="white"/>
    <rect x="10" y="11" width="4" height="2" rx="1" fill={color}/>
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#8B5CF6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="13" rx="8" ry="9" fill={color} stroke={color} strokeWidth="2"/>
    <ellipse cx="12" cy="13" rx="6" ry="7" fill="white" stroke={color} strokeWidth="1"/>
    <path d="M12 7v12M8 10l8 6M8 16l8-6" stroke={color} strokeWidth="1"/>
  </svg>
);

export const HelmetIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#6B7280" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 3C8.5 3 6 5.5 6 9v4c0 1.5 1 3 2.5 3.5L12 18l3.5-1.5C17 16 18 14.5 18 13V9c0-3.5-2.5-6-6-6z" fill={color} stroke={color} strokeWidth="2"/>
    <rect x="8" y="10" width="8" height="3" rx="1" fill="white" fillOpacity="0.3"/>
    <circle cx="10" cy="11" r="1" fill="white"/>
    <circle cx="14" cy="11" r="1" fill="white"/>
  </svg>
);

export const ClothingIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#3B82F6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M8 4h8l2 2v14H6V6l2-2z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2"/>
    <path d="M8 4v4h8V4" fill={color}/>
    <circle cx="10" cy="10" r="1" fill={color}/>
    <circle cx="14" cy="10" r="1" fill={color}/>
    <circle cx="12" cy="13" r="1" fill={color}/>
  </svg>
);

export const GenericArmorIcon: React.FC<IconProps> = ({ className = "w-8 h-8", color = "#374151" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="6" y="6" width="12" height="12" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2"/>
    <rect x="8" y="8" width="8" height="8" rx="1" fill={color}/>
    <rect x="10" y="10" width="4" height="4" rx="1" fill="white"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);