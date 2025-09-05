import React from 'react';

// Componente SVG para engrenagem baseado no cog.svg
const CogSVG: React.FC<{ className?: string; color?: string }> = ({ className = "w-8 h-8", color = "#6B7280" }) => {
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 16 16',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none'
  }, React.createElement('path', {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    fill: color,
    d: 'M6.50001 0H9.50001L10.0939 2.37548C10.7276 2.6115 11.3107 2.95155 11.8223 3.37488L14.1782 2.70096L15.6782 5.29904L13.9173 7.00166C13.9717 7.32634 14 7.65987 14 8C14 8.34013 13.9717 8.67366 13.9173 8.99834L15.6782 10.701L14.1782 13.299L11.8223 12.6251C11.3107 13.0484 10.7276 13.3885 10.0939 13.6245L9.50001 16H6.50001L5.90614 13.6245C5.27242 13.3885 4.68934 13.0484 4.17768 12.6251L1.82181 13.299L0.321808 10.701L2.08269 8.99834C2.02831 8.67366 2.00001 8.34013 2.00001 8C2.00001 7.65987 2.02831 7.32634 2.08269 7.00166L0.321808 5.29904L1.82181 2.70096L4.17768 3.37488C4.68934 2.95155 5.27241 2.6115 5.90614 2.37548L6.50001 0ZM8.00001 10C9.10458 10 10 9.10457 10 8C10 6.89543 9.10458 6 8.00001 6C6.89544 6 6.00001 6.89543 6.00001 8C6.00001 9.10457 6.89544 10 8.00001 10Z'
  }));
};

// Componente SVG específico para armaduras de robô
const RobotArmorSVG: React.FC<{ className?: string; color?: string }> = ({ className = "w-8 h-8", color = "#6B7280" }) => {
  const pathData = "M217 25v32.512l39 13.002 39-13.002V25h-78zm0 51.488v.787L244.816 119h22.368L295 77.275v-.787l-39 12.998-39-12.998zm-1.04 31.678l-54.245 18.084-9.51 38.033 15.71 39.27L217 269v24h78v-24l49.086-65.447 15.709-39.27-9.51-38.033-54.246-18.084L276.816 137h-41.632l-19.223-28.834zm-69.437 4.635l-43.164 21.582L81.822 199h43.15l21.551-86.2zm218.954 0L387.027 199h43.15l-21.536-64.617-43.164-21.582zM247 160h18v52.473l52.816-13.203 4.368 17.46L256 233.277l-66.184-16.547 4.368-17.46L247 212.473V160zM87.664 217l28.322 86.287 18.244-18.246L120.621 217H87.664zm303.715 0l-13.61 68.041 18.245 18.246L424.336 217h-32.957zM199 286.563l-46.54 23.269-5.5 55.002 28.349 9.45L199 362.437v-75.875zm114 0v75.875l23.691 11.845 28.348-9.449-5.5-55.002L313 286.562zM217 311v16h78v-16h-78zm-18 71.563l-22.309 11.154-31.566-10.522-6.693 66.938L199 425.906v-43.344zm114 0v43.343l60.568 24.227-6.693-66.938-31.566 10.522L313 382.563zm-111.23 61.62l-67.25 26.903L126.562 487h85.91l-10.702-42.816zm108.46 0L299.527 487h85.91l-7.957-15.914-67.25-26.902z";
  
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg'
  }, React.createElement('path', {
    fill: color,
    d: pathData
  }));
};

// Componente SVG para módulos de mobilidade (robô correndo)
const MobilityModuleSVG: React.FC<{ className?: string; color?: string }> = ({ className = "w-8 h-8", color = "#10B981" }) => {
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg'
  }, React.createElement('path', {
    fill: color,
    d: "M217 25v32.512l39 13.002 39-13.002V25h-78zm0 51.488v.787L244.816 119h22.368L295 77.275v-.787l-39 12.998-39-12.998zm-1.04 31.678l-54.245 18.084-9.51 38.033 15.71 39.27L217 269v24h78v-24l49.086-65.447 15.709-39.27-9.51-38.033-54.246-18.084L276.816 137h-41.632l-19.223-28.834zm-69.437 4.635l-43.164 21.582L81.822 199h43.15l21.551-86.2zm218.954 0L387.027 199h43.15l-21.536-64.617-43.164-21.582zM247 160h18v52.473l52.816-13.203 4.368 17.46L256 233.277l-66.184-16.547 4.368-17.46L247 212.473V160z"
  }));
};

// Componente SVG para módulos de proteção pesada (robô blindado)
const HeavyProtectionSVG: React.FC<{ className?: string; color?: string }> = ({ className = "w-8 h-8", color = "#EF4444" }) => {
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg'
  }, React.createElement('path', {
    fill: color,
    d: "M217 25v32.512l39 13.002 39-13.002V25h-78zm0 51.488v.787L244.816 119h22.368L295 77.275v-.787l-39 12.998-39-12.998zm-1.04 31.678l-54.245 18.084-9.51 38.033 15.71 39.27L217 269v24h78v-24l49.086-65.447 15.709-39.27-9.51-38.033-54.246-18.084L276.816 137h-41.632l-19.223-28.834zm-69.437 4.635l-43.164 21.582L81.822 199h43.15l21.551-86.2zm218.954 0L387.027 199h43.15l-21.536-64.617-43.164-21.582zM247 160h18v52.473l52.816-13.203 4.368 17.46L256 233.277l-66.184-16.547 4.368-17.46L247 212.473V160zM87.664 217l28.322 86.287 18.244-18.246L120.621 217H87.664zm303.715 0l-13.61 68.041 18.245 18.246L424.336 217h-32.957zM199 286.563l-46.54 23.269-5.5 55.002 28.349 9.45L199 362.437v-75.875zm114 0v75.875l23.691 11.845 28.348-9.449-5.5-55.002L313 286.562zM217 311v16h78v-16h-78zm-18 71.563l-22.309 11.154-31.566-10.522-6.693 66.938L199 425.906v-43.344zm114 0v43.343l60.568 24.227-6.693-66.938-31.566 10.522L313 382.563zm-111.23 61.62l-67.25 26.903L126.562 487h85.91l-10.702-42.816zm108.46 0L299.527 487h85.91l-7.957-15.914-67.25-26.902z"
  }));
};

// Componente SVG específico para power armor
const PowerArmorSVG: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  const pathData = "M256 24c-64 0-96 48-96 64-48-16-112 0-144 32 0 176 128 368 240 368s240-192 240-368c-32-32-96-48-144-32 0-16-32-64-96-64zm0 23c22.5 0 41 18.46 41 41 0 22.5-18.5 41-41 41s-41-18.5-41-41c0-22.54 18.5-41 41-41zm0 18c-12.8 0-23 10.19-23 23 0 12.8 10.2 23 23 23s23-10.2 23-23c0-12.81-10.2-23-23-23zm-96.7 26.34l13.1 9.76c25.3 18.9 41.9 34 72 51.1 3.8 2.1 6.7 6.1 7.7 10 .9 4 .4 7.6-.6 10.9-2 6.6-5.9 12.5-10.6 18-4.7 5.5-10.2 10.4-16.1 13.9-5.8 3.5-12.6 6.8-20.6 3.2-22-10.2-35-26.5-41.3-44.6-6.3-18.1-6.4-37.6-4.9-56zm193.4 0l1.3 16.26c1.5 18.4 1.4 37.9-4.9 56-6.3 18.1-19.3 34.4-41.3 44.6-8 3.6-14.8.3-20.6-3.2-5.9-3.5-11.4-8.4-16.1-13.9-4.7-5.5-8.6-11.4-10.6-18-1-3.3-1.5-6.9-.6-10.9 1-3.9 3.9-7.9 7.7-10 30.1-17.1 46.7-32.2 72-51.1zM175.4 126.1c.1 11.2 1.2 22.1 4.5 31.6 4.9 14 13.7 25.5 31.3 33.8-.5-.3 1.4-.2 4.4-1.9 3.6-2.2 8-6.1 11.6-10.3 3.6-4.1 6.3-8.8 7-11.3.3-.7.2-.6.2-.9-3.6-2.1-7.1-4.1-10.4-6.2a8 16 0 0 1-8 15.1 8 16 0 0 1-8-16 8 16 0 0 1 1.3-8.6c-12.3-8.4-22.9-16.8-33.9-25.3zm35.8 65.4c.1.1.3.2.6.3zm125.4-65.4c-11 8.5-21.6 16.9-33.9 25.3a8 16 0 0 1 1.3 8.6 8 16 0 0 1-8 16 8 16 0 0 1-8-15.1c-3.3 2.1-6.8 4.1-10.4 6.2 0 .3-.1.2.2.9.7 2.5 3.4 7.2 7 11.3 3.6 4.2 8 8.1 11.6 10.3 3 1.7 4.9 1.6 4.4 1.9 17.6-8.3 26.4-19.8 31.3-33.8 3.3-9.5 4.4-20.4 4.5-31.6zm-35.8 65.4l-.6.3c.3-.1.5-.2.6-.3zm-183.6-15.1l34.7 33.1-12.4 13-34.7-33.1zm277.6 0l12.4 13-34.7 33.1-12.4-13zM93.74 201l34.66 33.1-12.4 13L81.31 214zm324.56 0l12.4 13-34.7 33.1-12.4-13zM256 225c65.8 0 119 53.2 119 119s-53.2 119-119 119-119-53.2-119-119 53.2-119 119-119zm-185.74.5L105 258.7l-12.48 13-34.7-33.2zm371.54 0l12.4 13-34.7 33.2-12.4-13zm-154.1 19.1c-23.7.4-63.2 12.3-63.7 35.4-.2 10.4 2.9 21 7.8 31 6.8-5 15.2-8 24.2-8 11.8 0 22.4 5.1 29.9 13.1 19-24.9 29.7-56 18.1-68.1-2-2.1-6.9-3.3-13.4-3.4zM256 321c-12.8 0-23 10.2-23 23s10.2 23 23 23 23-10.2 23-23-10.2-23-23-23zm-55.6 9.8c-25.1-.3-47.6 6.3-51.5 19.6-3.7 12.9 40.6 68 67.6 53.2 9.1-4.9 16.8-12.9 23-22.1-14.4-6.4-24.5-20.9-24.5-37.5 0-4.2.6-8.2 1.8-12-5.5-.7-11-1.1-16.4-1.2zm96.3 8.7c.2 1.5.3 3 .3 4.5 0 19.3-13.7 35.7-31.8 39.9 12.1 28.8 33.6 53.6 49.9 49.6 13-3.2 38.6-69.2 12.3-85.2-8.8-5.4-19.6-8.1-30.7-8.8z";
  
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg'
  }, React.createElement('path', {
    fill: '#FBBF24',
    d: pathData
  }));
};

// Componente base de armadura usando o SVG armor.svg com cores personalizáveis
const ArmorSVG: React.FC<{ className?: string; color?: string }> = ({ className = "w-8 h-8", color = "#374151" }) => {
  const pathData = "M162 35.75l-94.49 27.1c-12.05 6.3-23.47 23.9-31.01 46.35-6.07 18.2-9.62 38.9-10.93 58.3L136.7 112zm188 .1L375.4 112l111 55.6c-1.3-19.3-4.9-40.2-10.9-58.3-5.7-17.05-13.6-31.35-22.5-40.05-2.7-2.8-5.5-4.9-8.4-6.4zm-172.9 11.5l-25.7 77.45-92.9 46.4 14.08 53.5 88.82 44.4 94.6-15.9 94.6 15.9 88.8-44.4 14.1-53.5-92.8-46.4-25.8-77.35h-10.5l-59.3 73.95-.1 61.1h-18.1l.1-61-59.3-74.15zM78.65 247.7l22.05 83.9 146.2-43.8v-14.7l-88.4 14.7zm354.75 0l-80 40.1-88.4-14.7v14.7l146.3 43.8zm-186.5 58.7l-31.6 9.6-35.1 70.2 66.7-33.3zm18.1 0v46.5l66.9 33.4-35.2-70.3zM191.7 323l-86.4 26 25.3 96.3zm128.6.1l61.1 122.1 25.3-96.2zm-55.3 50l.1 43.2 100.7 37.8-20.4-40.8zm-18.1 0l-80.2 40.1-20.5 40.9L247 416.3zm.1 62.4l-81.6 30.6 81.6 10.2zm18.1 0v40.7l81.7-10.2z";
  
  return React.createElement('svg', {
    className: className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg'
  }, React.createElement('path', {
    fill: color,
    d: pathData
  }));
};

// Exportar os componentes SVG para uso em outros arquivos
export const CogIcon = CogSVG;
export const RobotArmorIcon = RobotArmorSVG;
export const MobilityModuleIcon = MobilityModuleSVG;
export const HeavyProtectionIcon = HeavyProtectionSVG;

// Função para obter o ícone baseado no nome e tipo da armadura
export const getArmorIcon = (itemName: string, armorType?: string, className?: string) => {
  // Verificação de segurança para evitar erro quando itemName é undefined
  if (!itemName || typeof itemName !== 'string') {
    return React.createElement(ArmorSVG, { className, color: "#374151" }); // Cinza padrão
  }
  
  const name = itemName.toLowerCase();
  const type = armorType?.toLowerCase() || '';
  
  // Verificar se é power armor e usar o ícone específico
  if (name.includes('(power armor)') || type.includes('(power armor)')) {
    return React.createElement(PowerArmorSVG, { className });
  }
  
  // Verificar se é armadura de robô e usar a imagem robot_armor.svg
  if (name.includes('(robô)') || type.includes('(robô)')) {
    return React.createElement('img', {
      src: '/SVG/robot_armor.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Verificar por tipo específico para armaduras normais
  if (type === 'leve' || type === 'light') {
    return React.createElement(ArmorSVG, { className, color: "#10B981" }); // Verde para armadura leve
  }
  if (type === 'média' || type === 'medium') {
    return React.createElement(ArmorSVG, { className, color: "#F59E0B" }); // Amarelo para armadura média
  }
  if (type === 'pesada' || type === 'heavy') {
    return React.createElement(ArmorSVG, { className, color: "#EF4444" }); // Vermelho para armadura pesada
  }
  
  // Verificar por palavras-chave no nome
  if (name.includes('escudo') || name.includes('shield') || name.includes('buckler')) {
    return React.createElement(ArmorSVG, { className, color: "#8B5CF6" }); // Roxo para escudos
  }
  if (name.includes('capacete') || name.includes('helmet') || name.includes('elmo') || name.includes('casco')) {
    return React.createElement(ArmorSVG, { className, color: "#6B7280" }); // Cinza para capacetes
  }
  if (name.includes('couro') || name.includes('leather') || name.includes('tecido') || name.includes('cloth') || name.includes('roupa')) {
    return React.createElement(ArmorSVG, { className, color: "#10B981" }); // Verde para armadura leve
  }
  if (name.includes('cota') || name.includes('chain') || name.includes('malha') || name.includes('scale') || name.includes('brigandine')) {
    return React.createElement(ArmorSVG, { className, color: "#F59E0B" }); // Amarelo para armadura média
  }
  if (name.includes('placa') || name.includes('plate') || name.includes('full') || name.includes('completa') || name.includes('pesada')) {
    return React.createElement(ArmorSVG, { className, color: "#EF4444" }); // Vermelho para armadura pesada
  }
  if (name.includes('camisa') || name.includes('shirt') || name.includes('blusa') || name.includes('jaqueta') || name.includes('jacket')) {
    return React.createElement(ArmorSVG, { className, color: "#3B82F6" }); // Azul para roupas
  }
  
  // Verificar por materiais
  if (name.includes('ferro') || name.includes('iron') || name.includes('aço') || name.includes('steel') || name.includes('metal')) {
    return React.createElement(ArmorSVG, { className, color: "#F59E0B" }); // Amarelo para armadura média
  }
  if (name.includes('mithril') || name.includes('adamantium') || name.includes('dragão') || name.includes('dragon')) {
    return React.createElement(ArmorSVG, { className, color: "#EF4444" }); // Vermelho para armadura pesada
  }
  
  return React.createElement(ArmorSVG, { className, color: "#374151" }); // Cinza padrão
};