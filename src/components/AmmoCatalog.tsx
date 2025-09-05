import React, { useState } from 'react';
import { useAmmoCatalog } from '../hooks/useAmmoCatalog';
import ItemCard from './ItemCard';
import AmmoSelectionModal from './AmmoSelectionModal';
import { type Item } from '../types';

interface AmmoVariant {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  weightMultiplier: number;
  damageModifier?: string;
  penetrationModifier?: string;
}

interface AmmoCatalogProps {
  onEditItem?: (item: Item) => void;
  onAddToInventory?: (item: Item) => void;
}

export const AmmoCatalog: React.FC<AmmoCatalogProps> = ({ onEditItem, onAddToInventory }) => {
  const { ammo, loading, error } = useAmmoCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAmmo, setSelectedAmmo] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAmmo = ammo.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDoubleClick = (item: Item) => {
    setSelectedAmmo(item);
    setIsModalOpen(true);
  };

  const handleSelectVariant = (variant: AmmoVariant, baseAmmo: Item, quantity: number = 1) => {
    if (onAddToInventory) {
      // Criar item modificado com as propriedades da variante e stack
      const modifiedAmmo: Item = {
        ...baseAmmo,
        id: `${baseAmmo.id}-${variant.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${baseAmmo.name} (${variant.name})`,
        price_db: Math.round((baseAmmo.price_db || 0) * variant.priceMultiplier * quantity),
        weight_kg: Math.round(((baseAmmo.weight_kg || 0) * variant.weightMultiplier * quantity) * 100) / 100,
        notes: `${baseAmmo.notes || ''} - ${variant.description}${variant.damageModifier ? ` | ${variant.damageModifier}` : ''}${variant.penetrationModifier ? ` | ${variant.penetrationModifier}` : ''}`,
        // Configurar sub-inventário de munições (total de todas as caixas)
        currentAmmo: (baseAmmo.qty || 1) * quantity,
        maxAmmo: (baseAmmo.qty || 1) * quantity,
        // Configurar stack de caixas
        stackQuantity: quantity
      };
      onAddToInventory(modifiedAmmo);
    }
    setIsModalOpen(false);
    setSelectedAmmo(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAmmo(null);
  };

  if (loading) {
    return (
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Munições</h3>
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
        <h3 className="text-lg font-bold text-yellow-500 mb-4">Catálogo de Munições</h3>
        <div className="text-red-400 text-center py-4">
          <p>❌ Erro ao carregar catálogo</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steampunk-card p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-yellow-500">Catálogo de Munições</h3>
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
              placeholder="Buscar munições..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="steampunk-input w-full"
            />
          </div>

          {/* Estatísticas */}
          <div className="mb-4 text-sm text-gray-300 relative z-10">
            <p>Total de munições: {ammo.length}</p>
            {searchTerm && (
              <p>Resultados: {filteredAmmo.length}</p>
            )}
          </div>

          {/* Grid de munições */}
          <div className="max-h-96 overflow-y-auto flex justify-center" style={{overflow: 'visible auto'}}>
            {filteredAmmo.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'Nenhuma munição encontrada' : 'Catálogo vazio'}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 w-fit mx-auto">
                {filteredAmmo.map((item, index) => (
                  <div 
                    key={item.id} 
                    onDoubleClick={() => handleDoubleClick(item)}
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
            💡 Arraste as munições para o inventário/banco ou clique duas vezes para escolher o tipo
          </div>
        </>
      )}
      
      {/* Modal de seleção de munição */}
      {selectedAmmo && (
        <AmmoSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          baseAmmo={selectedAmmo}
          onSelectVariant={handleSelectVariant}
        />
      )}
    </div>
  );
};

export default AmmoCatalog;