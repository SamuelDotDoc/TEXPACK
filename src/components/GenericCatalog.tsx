import React, { useState } from 'react';
import ItemCard from './ItemCard';
import type { Item, Catalog } from '../types';

interface GenericCatalogProps {
  catalog: Catalog;
  onEditItem?: (item: Item) => void;
  onAddToInventory?: (item: Item) => void;
  onRemoveCatalog?: (catalogId: string) => void;
}

const GenericCatalog: React.FC<GenericCatalogProps> = ({ 
  catalog, 
  onEditItem, 
  onAddToInventory, 
  onRemoveCatalog 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = catalog.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveCatalog = () => {
    if (window.confirm(`Tem certeza que deseja remover o catálogo "${catalog.name}"?`)) {
      onRemoveCatalog?.(catalog.id);
    }
  };

  return (
    <div className="steampunk-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-yellow-500">{catalog.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveCatalog}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
            title="Remover catálogo"
          >
            🗑️
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Barra de pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="steampunk-input w-full"
            />
          </div>

          {/* Estatísticas */}
          <div className="mb-4 text-sm text-gray-300 relative z-10">
            <p>Total de itens: {catalog.items.length}</p>
            {searchTerm && (
              <p>Resultados: {filteredItems.length}</p>
            )}
          </div>

          {/* Grid de itens */}
          <div className="max-h-96 overflow-y-auto flex justify-center" style={{overflow: 'visible auto'}}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'Nenhum item encontrado' : 'Catálogo vazio'}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 w-fit mx-auto">
                {filteredItems.map((item, index) => (
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
            💡 Arraste os itens para o inventário/banco ou clique duas vezes para adicionar à mochila
          </div>
        </>
      )}
    </div>
  );
};

export default GenericCatalog;