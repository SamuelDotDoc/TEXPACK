import { useState, useEffect } from 'react';
import { type Item } from '../types';

interface WeaponData {
  Nome: string;
  Dano: string;
  Munição: string;
  Pente: string;
  Cadência: string;
  Alcance: string;
  Peso: string;
  Preço: string;
}

interface WeaponsCatalogData {
  catalog: WeaponData[];
}

const parsePrice = (priceStr: string | undefined): number => {
  try {
    if (!priceStr || priceStr === undefined) {
      return 0;
    }
    
    // Remove "DB$" e espaços
    let cleanStr = priceStr.replace('DB$', '').trim();
    
    // Se contém texto não numérico, retorna 0
    if (cleanStr.includes('negociar') || cleanStr.includes('mercado')) {
      return 0;
    }
    
    // Se tem vírgula e ponto, vírgula é separador de milhares
    if (cleanStr.includes(',') && cleanStr.includes('.')) {
      cleanStr = cleanStr.replace(/,/g, '');
    }
    // Se tem apenas vírgula, pode ser decimal ou milhares
    else if (cleanStr.includes(',')) {
      // Se há mais de 3 dígitos após a vírgula, é separador de milhares
      const parts = cleanStr.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // É separador decimal
        cleanStr = cleanStr.replace(',', '.');
      } else {
        // É separador de milhares
        cleanStr = cleanStr.replace(/,/g, '');
      }
    }
    
    return parseFloat(cleanStr) || 0;
  } catch {
    return 0;
  }
};

const parseWeight = (weightStr: string | undefined): number => {
  try {
    if (!weightStr || weightStr === undefined) {
      return 0;
    }
    return parseFloat(weightStr.replace('kg', '').replace(',', '.'));
  } catch {
    return 0;
  }
};

const getGunbladeAmmoCapacity = (weaponName: string): number => {
    const ammoCapacities: { [key: string]: number } = {
      'Gun Dagger': 1,
      'Gunblade': 6,
      'Gun Axe': 4,
      'Boom Hammer': 1,
      'Bow sword': 1,
      'Reiter Pallasch': 1,
      'Literal Cannon': 1
    };
    return ammoCapacities[weaponName] || 6;
  };

const getGunbladeAmmoType = (weaponName: string): string => {
  const ammoTypes: { [key: string]: string } = {
    'Gun Dagger': '9x19mm',
    'Gunblade': '.44 Magnum',
    'Gun Axe': '12 Gauge',
    'Boom Hammer': '40mm Granada',
    'Bow sword': 'Arpão',
    'Reiter Pallasch': '.38 Special',
    'Literal Cannon': 'Projétil de Canhão'
  };
  return ammoTypes[weaponName] || '9x19mm';
};

const convertWeaponToItem = (weapon: WeaponData, index: number): Item => {
  // Verificar se todas as propriedades necessárias existem
  if (!weapon || !weapon.Nome) {
    console.error('Arma inválida encontrada:', weapon);
    return null as any;
  }
  
  // Garantir que todas as propriedades sejam strings ou undefined
  const safeWeapon = {
    Nome: weapon.Nome || '',
    Dano: weapon.Dano || '',
    Munição: weapon.Munição || '',
    Pente: weapon.Pente || '',
    Cadência: weapon.Cadência || '',
    Alcance: weapon.Alcance || '',
    Peso: weapon.Peso || '',
    Preço: weapon.Preço || ''
  };
  
  // Verificar se é uma Revving Weapon
  const revvingWeaponNames = ['Machado motorizado', 'Ballistic Lance'];
  const isRevvingWeapon = revvingWeaponNames.includes(safeWeapon.Nome);
  // Verificar se é uma Gunblade
  const gunbladeNames = ['Gun Dagger', 'Gunblade', 'Gun Axe', 'Boom Hammer', 'Bow sword', 'Reiter Pallasch', 'Literal Cannon'];
  const isGunblade = gunbladeNames.includes(safeWeapon.Nome);
  // Verificar se é uma arma especial que usa arpão
  const harpoonWeaponNames = ['Lança Arpão'];
  const isHarpoonWeapon = harpoonWeaponNames.includes(safeWeapon.Nome);
  // Verificar se a arma tem pente (é uma arma de fogo) - qualquer arma com campo Pente preenchido
  const isFirearm = (safeWeapon.Pente && safeWeapon.Pente.trim() !== '' && !isRevvingWeapon && !isGunblade) || isHarpoonWeapon;
  
  let weaponType = 'weapon';
  if (isFirearm) {
    weaponType = 'Firearm';
  } else if (isRevvingWeapon) {
    weaponType = 'Revving Weapon';
  } else if (isGunblade) {
    weaponType = 'Gunblade';
  }
  
  // Para armas de fogo, adiciona propriedades de munição carregada
  const maxAmmoCapacity = isHarpoonWeapon ? 1 : (parseInt(safeWeapon.Pente.replace(/[^0-9]/g, '')) || 0);
  const firearmProps = isFirearm ? {
    currentAmmo: 0, // Inicia descarregada
    maxAmmo: maxAmmoCapacity,
    selectedAmmoType: undefined, // Sem munição selecionada inicialmente
    selectedAmmoId: undefined // Será definido quando uma munição específica for selecionada
  } : {};
  
  // Para Revving Weapons, adiciona propriedades específicas
  const revvingProps = isRevvingWeapon ? {
    motorizado: '+3d4x1d12', // Dano extra quando ativado
    tanque: 5, // Usos antes de reabastecer
    maxTanque: 5 // Capacidade máxima do tanque
  } : {};
  
  // Para Gunblades, adiciona propriedades específicas
  const getGunbladeDamage = (weaponName: string): string => {
     const damageMap: { [key: string]: string } = {
        'Gun Dagger': '+3d4',
        'Gunblade': '+2d10',
        'Gun Axe': '+3d10',
        'Boom Hammer': '+3d20',
        'Bow sword': '3d20',
        'Reiter Pallasch': '5d6',
        'Literal Cannon': '100+2d100'
      };
     return damageMap[weaponName] || '+2d6';
   };
  
  const gunbladeAmmoCapacity = getGunbladeAmmoCapacity(safeWeapon.Nome);
  const gunbladeProps = isGunblade ? {
    gunblade: getGunbladeDamage(safeWeapon.Nome), // Dano extra da gunblade
    currentAmmo: gunbladeAmmoCapacity, // Inicia carregada
    maxAmmo: gunbladeAmmoCapacity, // Capacidade específica por gunblade
    ammo: getGunbladeAmmoType(safeWeapon.Nome), // Munição compatível
    selectedAmmoType: getGunbladeAmmoType(safeWeapon.Nome), // Tipo de munição padrão
    selectedAmmoId: undefined // Será definido quando uma munição específica for selecionada
  } : {};
  
  return {
    id: `weapon_${index}`,
    name: safeWeapon.Nome,
    type: weaponType,
    damage: safeWeapon.Dano,
    ammo: safeWeapon.Munição,
    magazine: safeWeapon.Pente,
    rate: safeWeapon.Cadência,
    range_m: safeWeapon.Alcance ? parseFloat(safeWeapon.Alcance.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0 : 0,
    weight_kg: parseWeight(safeWeapon.Peso),
    price_db: parsePrice(safeWeapon.Preço),
    icon: isFirearm ? '🔫' : (isRevvingWeapon ? '🪚' : (isGunblade ? '⚡' : '⚔️')), // Ícone específico para cada tipo de arma
    notes: `Dano: ${safeWeapon.Dano} | Munição: ${safeWeapon.Munição} | Pente: ${safeWeapon.Pente} | Cadência: ${safeWeapon.Cadência} | Alcance: ${safeWeapon.Alcance || 'N/A'}`,
    qty: 1,
    ...firearmProps,
    ...revvingProps,
    ...gunbladeProps
  };
};

export const useWeaponsCatalog = () => {
  const [weapons, setWeapons] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeaponsCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch('/weapons_catalog.json');
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar catálogo: ${response.status}`);
        }
        
        const data: WeaponsCatalogData = await response.json();
        const weaponItems = data.catalog.map((weapon, index) => 
          convertWeaponToItem(weapon, index)
        );
        
        setWeapons(weaponItems);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar catálogo de armas:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadWeaponsCatalog();
  }, []);

  return { weapons, loading, error };
};