import React, { useState } from 'react';
import { useArmorCatalog } from '../hooks/useArmorCatalog';
import ItemCard from './ItemCard';
import { type Item } from '../types';
import { getArmorCategory, getAllArmorCategories, getArmorCategoryInfo, type ArmorCategory } from '../utils/armorCategoryUtils';

interface ArmorCatalogProps {
  onEditItem?: (item: Item) => void;
  onAddToInventory?: (item: Item) => void;
}

export const ArmorCatalog: React.FC<ArmorCatalogProps> = ({ onEditItem, onAddToInventory }) => {
  const { armor, loading, error } = useArmorCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArmorCategory>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredArmor = armor.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (item.armorType && getArmorCategory(item.armorType) === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Armaduras</h3>
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
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Armaduras</h3>
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
        <h3 className="text-lg font-bold text-yellow-500">Catálogo de Armaduras</h3>
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
              placeholder="Buscar armaduras..."
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
                {getAllArmorCategories().map((category) => {
                  const categoryInfo = getArmorCategoryInfo(category);
                  const armorInCategory = armor.filter(item => item.armorType && getArmorCategory(item.armorType) === category).length;
                  
                  if (armorInCategory === 0) return null;
                  
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
                        color: selectedCategory === category ? '#000' : categoryInfo.fillColor
                      }}
                    >
                      {categoryInfo.name} ({armorInCategory})
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
            <p>Total de armaduras: {armor.length}</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <p>Resultados filtrados: {filteredArmor.length}</p>
            )}
            {selectedCategory !== 'all' && (
              <p className="text-yellow-400">Categoria: {{
                'light': 'Armadura Leve',
                'medium': 'Armadura Média',
                'heavy': 'Armadura Pesada',
                'mobility-modules': 'Módulos de Mobilidade',
                'versatility-modules': 'Módulos de Versatilidade',
                'heavy-protection': 'Proteção Pesada',
                'power-armor': 'Power Armor'
              }[selectedCategory]}</p>
            )}
          </div>

          {/* Grid de armaduras */}
          <div className="max-h-96 overflow-y-auto flex justify-center">
            {filteredArmor.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm || selectedCategory !== 'all' ? 'Nenhuma armadura encontrada' : 'Catálogo vazio'}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 w-fit mx-auto">
                {filteredArmor.map((item, index) => (
                  <div 
                    key={item.id} 
                    onDoubleClick={() => onAddToInventory?.(item)}
                    className="p-2"
                  >
                    <ItemCard
                      item={item}
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
            💡 Arraste as armaduras para o inventário/banco ou clique duas vezes para adicionar à mochila
          </div>
        </>
      )}
    </div>
  );
};

export default ArmorCatalog;