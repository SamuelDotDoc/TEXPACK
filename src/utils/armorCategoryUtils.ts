export type ArmorCategory = 
  | 'all'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'mobility-modules'
  | 'versatility-modules'
  | 'heavy-protection'
  | 'power-armor';

export interface ArmorCategoryInfo {
  name: string;
  svgFilter: string;
  fillColor: string;
}

/**
 * Categoriza uma armadura baseada no seu tipo
 */
export function getArmorCategory(armorType: string): ArmorCategory {
  const type = armorType.toLowerCase();
  
  // Armaduras de robô
  if (type.includes('módulos de mobilidade')) {
    return 'mobility-modules';
  }
  if (type.includes('módulos de versatilidade')) {
    return 'versatility-modules';
  }
  if (type.includes('proteção pesada')) {
    return 'heavy-protection';
  }
  
  // Power Armor
  if (type.includes('power armor') || type.includes('especial')) {
    return 'power-armor';
  }
  
  // Armaduras normais
  if (type.includes('leve')) {
    return 'light';
  }
  if (type.includes('média')) {
    return 'medium';
  }
  if (type.includes('pesada')) {
    return 'heavy';
  }
  
  // Fallback baseado no nome ou descrição
  return 'medium';
}

/**
 * Retorna informações sobre uma categoria de armadura
 */
export function getArmorCategoryInfo(category: ArmorCategory): ArmorCategoryInfo {
  switch (category) {
    case 'light':
      return {
        name: 'Armadura Leve',
        svgFilter: 'hue-rotate(120deg) saturate(1.2)',
        fillColor: '#10b981' // Verde
      };
    case 'medium':
      return {
        name: 'Armadura Média',
        svgFilter: 'hue-rotate(45deg) saturate(1.1)',
        fillColor: '#f59e0b' // Amarelo/Dourado
      };
    case 'heavy':
      return {
        name: 'Armadura Pesada',
        svgFilter: 'hue-rotate(0deg) saturate(1.3)',
        fillColor: '#dc2626' // Vermelho
      };
    case 'mobility-modules':
      return {
        name: 'Módulos de Mobilidade',
        svgFilter: 'hue-rotate(200deg) saturate(1.2)',
        fillColor: '#3b82f6' // Azul
      };
    case 'versatility-modules':
      return {
        name: 'Módulos de Versatilidade',
        svgFilter: 'hue-rotate(280deg) saturate(1.1)',
        fillColor: '#8b5cf6' // Roxo
      };
    case 'heavy-protection':
      return {
        name: 'Proteção Pesada',
        svgFilter: 'hue-rotate(20deg) saturate(1.4)',
        fillColor: '#ea580c' // Laranja escuro
      };
    case 'power-armor':
      return {
        name: 'Power Armor',
        svgFilter: 'hue-rotate(300deg) saturate(1.5) brightness(1.2)',
        fillColor: '#ec4899' // Rosa/Magenta
      };
    default:
      return {
        name: 'Todas as Categorias',
        svgFilter: 'none',
        fillColor: '#6b7280' // Cinza
      };
  }
}

/**
 * Retorna todas as categorias de armadura disponíveis
 */
export function getAllArmorCategories(): ArmorCategory[] {
  return [
    'light',
    'medium', 
    'heavy',
    'mobility-modules',
    'versatility-modules',
    'heavy-protection',
    'power-armor'
  ];
}