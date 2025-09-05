import React, { useState } from 'react';
import { useWeaponsCatalog } from '../hooks/useWeaponsCatalog';
import ItemCard from './ItemCard';
import type { Item } from '../types';
import { getWeaponCategory, type WeaponCategory } from '../utils/weaponCategoryUtils';

interface WeaponsCatalogProps {
  onEditItem?: (item: Item) => void;
  onAddToInventory?: (item: Item) => void;
}

const WeaponsCatalog: React.FC<WeaponsCatalogProps> = ({ onEditItem, onAddToInventory }) => {
  const { weapons, loading, error } = useWeaponsCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredWeapons = weapons.filter(weapon => {
    const matchesSearch = weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      getWeaponCategory(weapon.name) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Armas</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-gray-300">Carregando catálogo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Armas</h3>
        <div className="text-red-400 text-center py-4">
          <p>❌ Erro ao carregar catálogo</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steampunk-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-yellow-500">Catálogo de Armas</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Barra de pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar armas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="steampunk-input w-full"
            />
          </div>

          {/* Botão de filtros */}
          <div className="mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="steampunk-button text-sm px-3 py-1 flex items-center gap-2"
            >
              🔍 Filtros por Categoria
              <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          {/* Filtros por categoria */}
          {showFilters && (
            <div className="mb-4 p-3 bg-gray-800 rounded border border-yellow-600">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-yellow-600 text-black font-bold'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Todas
                </button>
                {(['pistol', 'revolver', 'shotgun', 'rifle', 'assault-rifle', 'sniper-rifle', 
                   'submachine-gun', 'machine-gun', 'heavy-weapon', 'launcher', 'explosive', 
                   'poison', 'melee-blade', 'melee-axe', 'melee-hammer', 'melee-spear', 
                   'melee-gauntlet', 'melee-other', 'unknown'] as WeaponCategory[]).map((category) => {
                   const weaponsInCategory = weapons.filter(w => getWeaponCategory(w.name) === category).length;
                   
                   if (weaponsInCategory === 0) return null;
                   
                   const categoryNames: Record<WeaponCategory, string> = {
                     'pistol': 'Pistola',
                     'revolver': 'Revólver',
                     'shotgun': 'Escopeta', 
                     'rifle': 'Rifle',
                     'assault-rifle': 'Rifle de Assalto',
                     'sniper-rifle': 'Rifle de Precisão',
                     'submachine-gun': 'Submetralhadora',
                     'machine-gun': 'Metralhadora',
                     'heavy-weapon': 'Arma Pesada',
                     'launcher': 'Lançador',
                     'explosive': 'Explosivo',
                     'poison': 'Veneno',
                     'melee-blade': 'Lâminas',
                     'melee-axe': 'Machados',
                     'melee-hammer': 'Martelos',
                     'melee-spear': 'Lanças',
                     'melee-gauntlet': 'Manoplas',
                     'melee-other': 'Outras C.A.C.',
                     'unknown': 'Desconhecido'
                   };
                   
                   const categoryColors: Record<WeaponCategory, string> = {
                     'pistol': '#3B82F6',        // Azul vibrante - confiabilidade
                     'revolver': '#F59E0B',       // Dourado brilhante - tradição
                     'shotgun': '#D97706',        // Laranja terroso - caça
                     'rifle': '#65A30D',          // Verde militar - campo de batalha
                     'assault-rifle': '#DC2626',  // Vermelho intenso - agressividade
                     'sniper-rifle': '#0891B2',   // Azul gelo - precisão
                     'submachine-gun': '#EC4899', // Rosa vibrante - velocidade
                     'machine-gun': '#B91C1C',    // Vermelho sangue - destruição
                     'heavy-weapon': '#7C3AED',   // Roxo imperial - poder
                     'launcher': '#EA580C',       // Laranja explosivo - impacto
                     'explosive': '#EF4444',      // Vermelho explosivo - perigo
                     'poison': '#10B981',         // Verde venenoso - toxicidade
                     'melee-blade': '#0EA5E9',    // Azul aço - lâminas afiadas
                     'melee-axe': '#D97706',      // Laranja ferrugem - ferro e madeira
                     'melee-hammer': '#7C3AED',   // Roxo real - peso e impacto
                     'melee-spear': '#059669',    // Verde floresta - hastes de madeira
                     'melee-gauntlet': '#F59E0B', // Dourado - metal polido
                     'melee-other': '#DC2626',    // Vermelho sangue - combate geral
                     'unknown': '#06B6D4'         // Ciano neutro
                   };
                   
                   return (
                     <button
                       key={category}
                       onClick={() => setSelectedCategory(category)}
                       className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                         selectedCategory === category
                           ? 'bg-yellow-600 text-black font-bold'
                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                       }`}
                       style={{
                         color: selectedCategory === category ? '#000' : categoryColors[category]
                       }}
                     >
                       {categoryNames[category]} ({weaponsInCategory})
                     </button>
                   );
                 })}
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          )}

          {/* Estatísticas */}
          <div className="mb-4 text-sm text-gray-300 relative z-10">
            <p>Total de armas: {weapons.length}</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <p>Resultados filtrados: {filteredWeapons.length}</p>
            )}
            {selectedCategory !== 'all' && (
              <p className="text-yellow-400">Categoria: {
                {
                  'pistol': 'Pistola',
                  'revolver': 'Revólver',
                  'shotgun': 'Escopeta',
                  'rifle': 'Rifle',
                  'assault-rifle': 'Rifle de Assalto',
                  'sniper-rifle': 'Rifle de Precisão',
                  'submachine-gun': 'Submetralhadora',
                  'machine-gun': 'Metralhadora',
                  'heavy-weapon': 'Arma Pesada',
                  'launcher': 'Lançador',
                  'explosive': 'Explosivo',
                  'poison': 'Veneno',
                  'melee': 'Corpo a Corpo',
                  'unknown': 'Desconhecido'
                }[selectedCategory]
              }</p>
            )}
          </div>

          {/* Grid de armas */}
          <div className="max-h-96 overflow-y-auto flex justify-center" style={{overflow: 'visible auto'}}>
            {filteredWeapons.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'Nenhuma arma encontrada' : 'Catálogo vazio'}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 w-fit mx-auto">
                {filteredWeapons.map((weapon, index) => (
                  <div 
                    key={weapon.id} 
                    onDoubleClick={() => onAddToInventory?.(weapon)}
                    className="p-2"
                  >
                    <ItemCard
                      item={weapon}
                      source="catalog"
                      index={index}
                      onEdit={onEditItem}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="mt-4 text-xs text-gray-400 text-center">
            💡 Arraste as armas para o inventário/banco ou clique duas vezes para adicionar à mochila
          </div>
        </>
      )}
    </div>
  );
};

export default WeaponsCatalog;