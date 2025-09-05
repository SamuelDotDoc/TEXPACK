export type WeaponCategory = 
  | 'pistol'
  | 'revolver'
  | 'shotgun'
  | 'rifle'
  | 'assault-rifle'
  | 'sniper-rifle'
  | 'submachine-gun'
  | 'machine-gun'
  | 'heavy-weapon'
  | 'launcher'
  | 'explosive'
  | 'poison'
  | 'melee-blade'
  | 'melee-axe'
  | 'melee-hammer'
  | 'melee-spear'
  | 'melee-gauntlet'
  | 'melee-other'
  | 'unknown';

export interface WeaponCategoryInfo {
  name: string;
  svgFilter: string;
  svgFill: string;
}

export function getWeaponCategory(weaponName: string): WeaponCategory {
  const name = weaponName.toLowerCase();
  
  // Armas de pebble - categorização específica
  if (name.includes('pebble')) {
    if (name.includes('minigun')) return 'machine-gun';
    if (name.includes('espingarda') || name.includes('escopeta')) return 'shotgun';
    if (name.includes('canhão de mão')) return 'heavy-weapon';
    if (name.includes('stun-gun') || name.includes('stun gun')) return 'heavy-weapon';
    if (name.includes('morteiro')) return 'heavy-weapon';
    if (name.includes('míssil') || name.includes('missile')) return 'launcher';
    if (name.includes('fire breath') || name.includes('napalm')) return 'heavy-weapon';
    if (name.includes('metralhadora')) return 'machine-gun';
    if (name.includes('arma de arco') || name.includes('arco')) return 'rifle';
    if (name.includes('rail gun') || name.includes('railgun')) return 'sniper-rifle';
    if (name.includes('canhão de artilharia') || name.includes('artilharia') || name.includes('artillery')) return 'heavy-weapon';
    if (name.includes('s.a.m.') || name.includes('sam')) return 'launcher';
    if (name.includes('rifle anti material') || name.includes('anti material') || name.includes('antimaterial')) return 'sniper-rifle';
    if (name.includes('rifle sonoro') || name.includes('sonoro') || name.includes('sonic')) return 'sniper-rifle';
    if (name.includes('napalm')) return 'heavy-weapon';
    // Pebble genérico como arma pesada
    return 'heavy-weapon';
  }
  
  // Pistolas
  if (name.includes('pistol') || name.includes('glock') || name.includes('beretta') || 
      name.includes('colt') || name.includes('walther') || name.includes('sig') ||
      name.includes('pistola')) {
    return 'pistol';
  }
  
  // Revólveres
  if (name.includes('revolver') || name.includes('magnum') || name.includes('smith')) {
    return 'revolver';
  }
  
  // Escopetas
  if (name.includes('shotgun') || name.includes('escopeta') || name.includes('pump') ||
      name.includes('benelli') || name.includes('remington') || name.includes('mossberg')) {
    return 'shotgun';
  }
  
  // Rifles de assalto
  if (name.includes('ak-') || name.includes('m4') || name.includes('ar-') ||
      name.includes('scar') || name.includes('famas') || name.includes('g36')) {
    return 'assault-rifle';
  }
  
  // Rifles de precisão/sniper
  if (name.includes('sniper') || name.includes('barrett') || name.includes('awp') ||
      name.includes('dragunov') || name.includes('precision') || name.includes('precisao') ||
      name.includes('rail gun') || name.includes('railgun')) {
    return 'sniper-rifle';
  }
  
  // Submetralhadoras
  if (name.includes('mp') || name.includes('uzi') || name.includes('submachine') ||
      name.includes('submetralhadora') || name.includes('p90') || name.includes('vector')) {
    return 'submachine-gun';
  }
  
  // Metralhadoras
  if (name.includes('machine') || name.includes('metralhadora') || name.includes('lmg') ||
      name.includes('m249') || name.includes('m60') || name.includes('minigun')) {
    return 'machine-gun';
  }
  
  // Armas de veneno
  if (name.includes('veneno') || name.includes('poison') || name.includes('tóxico') ||
      name.includes('toxic') || name.includes('lança veneno')) {
    return 'poison';
  }
  
  // Lançadores (excluindo lanças corpo a corpo)
  if ((name.includes('launcher') || name.includes('rpg') || name.includes('bazooka') ||
       name.includes('grenade') || name.includes('rocket')) ||
      ((name.includes('lança') || name.includes('lanca')) && 
       (name.includes('foguetes') || name.includes('granadas') || name.includes('chamas') ||
        name.includes('raios') || name.includes('veneno') || name.includes('arpão') ||
        name.includes('arpao')))) {
    return 'launcher';
  }
  
  // Armas pesadas
  if (name.includes('cannon') || name.includes('canhão') || name.includes('mortar') || 
      name.includes('artillery') || name.includes('artilharia') || name.includes('tank') || 
      name.includes('heavy') || name.includes('napalm') || name.includes('interceptor')) {
    return 'heavy-weapon';
  }
  
  // Explosivos
  if (name.includes('bomb') || name.includes('explosive') || name.includes('c4') ||
      name.includes('tnt') || name.includes('mine')) {
    return 'explosive';
  }
  
  // Armas corpo a corpo - Lâminas (facas, espadas, adagas)
  if (name.includes('knife') || name.includes('sword') || name.includes('faca') ||
      name.includes('adaga') || name.includes('punhal') || name.includes('baioneta') ||
      name.includes('espada') || name.includes('katana') || name.includes('rapier') ||
      name.includes('rapieira') || name.includes('cimitarra') || name.includes('sabre') ||
      name.includes('estoque') || name.includes('dagger') || name.includes('sai')) {
    return 'melee-blade';
  }

  // Armas corpo a corpo - Machados
  if (name.includes('axe') || name.includes('machado')) {
    return 'melee-axe';
  }

  // Armas corpo a corpo - Martelos e maças
  if (name.includes('hammer') || name.includes('martelo') || name.includes('martelete') ||
      name.includes('maca') || name.includes('morningstar') || name.includes('estrela da manhã')) {
    return 'melee-hammer';
  }

  // Armas corpo a corpo - Lanças e arpões
  if (name.includes('spear') || name.includes('pike') || name.includes('lança') ||
      name.includes('lanca') || name.includes('arpão') || name.includes('arpao')) {
    return 'melee-spear';
  }

  // Armas corpo a corpo - Manoplas e luvas
  if (name.includes('gauntlet') || name.includes('manopla') || name.includes('manoplas')) {
    return 'melee-gauntlet';
  }

  // Armas corpo a corpo - Outras (bastões, etc.)
  if (name.includes('bastão') || name.includes('bastao') || name.includes('melee') ||
      name.includes('bow sword') || name.includes('stun') || name.includes('bengala')) {
    return 'melee-other';
  }
  
  // Armas híbridas (gunblades, gun axes, etc.)
  if (name.includes('gun') && (name.includes('blade') || name.includes('axe') || name.includes('dagger'))) {
    return name.includes('blade') ? 'melee-blade' : name.includes('axe') ? 'melee-axe' : 'melee-blade';
  }

  // Rifles genéricos
  if (name.includes('rifle') || name.includes('fuzil') || name.includes('carbine') ||
      name.includes('evelyn')) {
    return 'rifle';
  }

  // Armas especiais que podem ter nomes únicos
  if (name.includes('canhão de mão') || name.includes('canhao de mao')) {
    return 'pistol';
  }

  // Metralhadoras especiais
  if (name.includes('minigun')) {
    return 'machine-gun';
  }
  
  return 'unknown';
}

export function getWeaponCategoryInfo(category: WeaponCategory): WeaponCategoryInfo {
  const categoryMap: Record<WeaponCategory, WeaponCategoryInfo> = {
    'pistol': {
      name: 'Pistola',
      svgFilter: 'hue-rotate(220deg) saturate(1.4) brightness(1.1)',
      svgFill: '#3B82F6' // Azul vibrante - confiabilidade
    },
    'revolver': {
      name: 'Revólver',
      svgFilter: 'hue-rotate(35deg) saturate(1.6) brightness(1.2)',
      svgFill: '#F59E0B' // Dourado brilhante - tradição
    },
    'shotgun': {
      name: 'Escopeta',
      svgFilter: 'hue-rotate(25deg) saturate(1.5) brightness(1.2)',
      svgFill: '#D97706' // Laranja terroso - caça
    },
    'rifle': {
      name: 'Rifle',
      svgFilter: 'hue-rotate(80deg) saturate(1.4) brightness(1.2)',
      svgFill: '#65A30D' // Verde militar - campo de batalha
    },
    'assault-rifle': {
      name: 'Rifle de Assalto',
      svgFilter: 'hue-rotate(15deg) saturate(1.7) brightness(1.1)',
      svgFill: '#DC2626' // Vermelho intenso - agressividade
    },
    'sniper-rifle': {
      name: 'Rifle de Precisão',
      svgFilter: 'hue-rotate(190deg) saturate(1.4) brightness(1.2)',
      svgFill: '#0891B2' // Azul gelo - precisão
    },
    'submachine-gun': {
      name: 'Submetralhadora',
      svgFilter: 'hue-rotate(320deg) saturate(1.3) brightness(1.1)',
      svgFill: '#EC4899' // Rosa vibrante - velocidade
    },
    'machine-gun': {
      name: 'Metralhadora',
      svgFilter: 'hue-rotate(10deg) saturate(1.7) brightness(1.1)',
      svgFill: '#B91C1C' // Vermelho sangue - destruição
    },
    'heavy-weapon': {
      name: 'Arma Pesada',
      svgFilter: 'hue-rotate(280deg) saturate(1.4) brightness(1.2)',
      svgFill: '#7C3AED' // Roxo imperial - poder
    },
    'launcher': {
      name: 'Lançador',
      svgFilter: 'hue-rotate(25deg) saturate(1.8) brightness(1.3)',
      svgFill: '#EA580C' // Laranja explosivo - impacto
    },
    'explosive': {
      name: 'Explosivo',
      svgFilter: 'hue-rotate(355deg) saturate(2.2) brightness(1.4)',
      svgFill: '#EF4444' // Vermelho explosivo - perigo
    },
    'poison': {
      name: 'Veneno',
      svgFilter: 'hue-rotate(120deg) saturate(1.8) brightness(1.2)',
      svgFill: '#10B981' // Verde venenoso - toxicidade
    },
    'melee-blade': {
      name: 'Lâminas',
      svgFilter: 'hue-rotate(200deg) saturate(1.4) brightness(1.2)',
      svgFill: '#0EA5E9' // Azul aço - lâminas afiadas
    },
    'melee-axe': {
      name: 'Machados',
      svgFilter: 'hue-rotate(25deg) saturate(1.5) brightness(1.1)',
      svgFill: '#D97706' // Laranja ferrugem - ferro e madeira
    },
    'melee-hammer': {
      name: 'Martelos',
      svgFilter: 'hue-rotate(280deg) saturate(1.3) brightness(1.1)',
      svgFill: '#7C3AED' // Roxo real - peso e impacto
    },
    'melee-spear': {
      name: 'Lanças',
      svgFilter: 'hue-rotate(120deg) saturate(1.4) brightness(1.2)',
      svgFill: '#059669' // Verde floresta - hastes de madeira
    },
    'melee-gauntlet': {
      name: 'Manoplas',
      svgFilter: 'hue-rotate(45deg) saturate(1.6) brightness(1.3)',
      svgFill: '#F59E0B' // Dourado - metal polido
    },
    'melee-other': {
      name: 'Outras C.A.C.',
      svgFilter: 'hue-rotate(0deg) saturate(1.3) brightness(1.2)',
      svgFill: '#DC2626' // Vermelho sangue - combate geral
    },
    'unknown': {
      name: 'Desconhecido',
      svgFilter: 'hue-rotate(180deg) saturate(1.0) brightness(1.1)',
      svgFill: '#06B6D4' // Ciano neutro
    }
  };
  
  return categoryMap[category];
}

export function getAllWeaponCategories(): WeaponCategoryInfo[] {
  const categories: WeaponCategory[] = [
    'pistol', 'revolver', 'shotgun', 'rifle', 'assault-rifle',
    'sniper-rifle', 'submachine-gun', 'machine-gun', 'heavy-weapon',
    'launcher', 'explosive', 'melee-blade', 'melee-axe', 'melee-hammer',
    'melee-spear', 'melee-gauntlet', 'melee-other', 'unknown'
  ];
  
  return categories.map(category => getWeaponCategoryInfo(category));
}