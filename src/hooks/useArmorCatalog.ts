import { useState, useEffect } from 'react';
import { type Item } from '../types';

interface ArmorData {
  Nome: string;
  Preco: string;
  CA: string;
  Forca: string;
  Furtividade: string;
  Peso: string;
  Tipo: string;
}

interface PowerArmorData {
  Nome: string;
  Preco: string;
  CA: string;
  Atributos: string[];
  Tipo: string;
}

interface ArmorCatalogResponse {
  armor_catalog: ArmorData[];
}

interface PowerArmorCatalogResponse {
  armor_catalog: PowerArmorData[];
}

export const useArmorCatalog = () => {
  const [armor, setArmor] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArmorCatalog = async () => {
      try {
        setLoading(true);
        
        // Carregar catálogo de armaduras normais
        const armorResponse = await fetch('/armor_catalog.json');
        if (!armorResponse.ok) {
          throw new Error(`Erro ao carregar catálogo de armaduras: ${armorResponse.status}`);
        }
        const armorData: ArmorCatalogResponse = await armorResponse.json();
        
        // Carregar catálogo de armaduras de robô
        const robotArmorResponse = await fetch('/robot_armor_catalog.json');
        if (!robotArmorResponse.ok) {
          throw new Error(`Erro ao carregar catálogo de armaduras de robô: ${robotArmorResponse.status}`);
        }
        const robotArmorData: ArmorCatalogResponse = await robotArmorResponse.json();
        
        // Carregar catálogo de power armor
        const powerArmorResponse = await fetch('/power_armor.json');
        if (!powerArmorResponse.ok) {
          throw new Error(`Erro ao carregar catálogo de power armor: ${powerArmorResponse.status}`);
        }
        const powerArmorData: PowerArmorCatalogResponse = await powerArmorResponse.json();
        
        // Converter dados de armadura normal para formato Item
        const normalArmorItems: Item[] = armorData.armor_catalog.map((armorItem, index) => {
          // Extrair valor numérico do preço (ex: "100 Dims" -> 100)
          const priceMatch = armorItem.Preco.match(/\d+/);
          const price = priceMatch ? parseInt(priceMatch[0]) : 0;
          
          // Extrair valor numérico do peso (ex: "1,5 Kg" -> 1.5)
          const weightMatch = armorItem.Peso.match(/([\d,]+)/);
          const weight = weightMatch ? parseFloat(weightMatch[1].replace(',', '.')) : 0;
          
          return {
            id: `armor_${index}`,
            name: armorItem.Nome,
            description: `CA: ${armorItem.CA} | Peso: ${armorItem.Peso} | Tipo: ${armorItem.Tipo}${armorItem.Forca !== '-' ? ` | Força: ${armorItem.Forca}` : ''}${armorItem.Furtividade !== '-' ? ` | Furtividade: ${armorItem.Furtividade}` : ''}`,
            price_db: price,
            weight_kg: weight,
            type: 'armor' as const,
            icon: getArmorIcon(armorItem.Tipo),
            // Propriedades específicas de armadura
            armorClass: parseArmorClass(armorItem.CA),
            armorType: armorItem.Tipo,
            strengthRequirement: armorItem.Forca !== '-' ? parseInt(armorItem.Forca) : undefined,
            stealthModifier: armorItem.Furtividade === 'Desvantagem' ? -1 : 0
          };
        });
        
        // Converter dados de armadura de robô para formato Item
        const robotArmorItems: Item[] = robotArmorData.armor_catalog.map((armorItem, index) => {
          // Extrair valor numérico do preço (ex: "100 Dims" -> 100)
          const priceMatch = armorItem.Preco.match(/\d+/);
          const price = priceMatch ? parseInt(priceMatch[0]) : 0;
          
          // Extrair valor numérico do peso (ex: "100 Kg" -> 100)
          const weightMatch = armorItem.Peso.match(/([\d,]+)/);
          const weight = weightMatch ? parseFloat(weightMatch[1].replace(',', '.')) : 0;
          
          return {
            id: `robot_armor_${index}`,
            name: `${armorItem.Nome} (Robô)`,
            description: `CA: ${armorItem.CA} | Peso: ${armorItem.Peso} | Tipo: ${armorItem.Tipo}${armorItem.Forca !== '-' ? ` | Força: ${armorItem.Forca}` : ''}${armorItem.Furtividade !== '-' ? ` | Furtividade: ${armorItem.Furtividade}` : ''} | Categoria: Armaduras para robôs`,
            price_db: price,
            weight_kg: weight,
            type: 'armor' as const,
            icon: getRobotArmorIcon(),
            // Propriedades específicas de armadura
            armorClass: parseArmorClass(armorItem.CA),
            armorType: armorItem.Tipo === 'Módulos de mobilidade' ? 'Módulos de mobilidade' : 
                      armorItem.Tipo === 'Módulos de versatilidade' ? 'Módulos de versatilidade' : 
                      armorItem.Tipo === 'Proteção pesada' ? 'Proteção pesada' : `${armorItem.Tipo} (Robô)`,
            strengthRequirement: armorItem.Forca !== '-' ? parseInt(armorItem.Forca) : undefined,
            stealthModifier: armorItem.Furtividade === 'Desvantagem' ? -1 : 0
          };
        });
        
        // Converter dados de power armor para formato Item
        const powerArmorItems: Item[] = powerArmorData.armor_catalog.map((armorItem, index) => {
          // Extrair valor numérico do preço (ex: "100.000 Dims" -> 100000)
          const priceMatch = armorItem.Preco.match(/[\d.]+/);
          const price = priceMatch ? parseInt(priceMatch[0].replace('.', '')) : 0;
          
          // Power armor não tem peso especificado, usar peso padrão alto
          const weight = 50; // kg
          
          // Criar descrição com atributos
          const attributesText = armorItem.Atributos.join(' | ');
          
          return {
            id: `power_armor_${index}`,
            name: `${armorItem.Nome} (Power Armor)`,
            description: `CA: ${armorItem.CA} | Tipo: ${armorItem.Tipo} | ${attributesText} | Categoria: Power Armor`,
            price_db: price,
            weight_kg: weight,
            type: 'armor' as const,
            icon: getPowerArmorIcon(),
            // Propriedades específicas de armadura
            armorClass: parseArmorClass(armorItem.CA),
            armorType: 'Power Armor',
            strengthRequirement: undefined,
            stealthModifier: -2 // Power armor geralmente tem desvantagem em furtividade
          };
        });
        
        // Combinar todos os catálogos
        const allArmorItems = [...normalArmorItems, ...robotArmorItems, ...powerArmorItems];
        setArmor(allArmorItems);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar catálogo de armaduras:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadArmorCatalog();
  }, []);

  return { armor, loading, error };
};

// Função auxiliar para extrair valor numérico da CA
function parseArmorClass(ca: string): number {
  // Extrair o número base da CA (ex: "11 + modificador de Des" -> 11)
  const match = ca.match(/\d+/);
  return match ? parseInt(match[0]) : 10;
}

// Função auxiliar para determinar ícone baseado no tipo de armadura
function getArmorIcon(tipo: string): string {
  switch (tipo.toLowerCase()) {
    case 'leve':
      return '🥼'; // Jaqueta/roupa leve
    case 'média':
      return '🦺'; // Colete
    case 'pesada':
      return '🛡️'; // Escudo/armadura pesada
    default:
      return '👕'; // Roupa padrão
  }
}

// Função auxiliar para determinar ícone baseado no tipo de armadura de robô
function getRobotArmorIcon(): string {
  // Usar sempre a imagem robot_armor.svg para todas as armaduras de robô
  return '/SVG/robot_armor.svg';
}

// Função auxiliar para determinar ícone de power armor
function getPowerArmorIcon(): string {
  return '⚡'; // Raio para power armor
}