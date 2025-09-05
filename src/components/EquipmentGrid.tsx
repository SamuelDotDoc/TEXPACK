import React, { useState, memo, useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useGame } from '../hooks/useGame';
import ItemCard from './ItemCard';
import HandSelectionModal from './HandSelectionModal';
import { type Item, type DragItem, type DropResult, type DndRef } from '../types';

interface EquipmentGridProps {
  onEditItem: (item: Item) => void;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = memo(({ onEditItem }) => {
  const { state, dispatch } = useGame();
  const [handSelectionModal, setHandSelectionModal] = useState<{ isOpen: boolean; item: Item | null }>({ isOpen: false, item: null });

  const dropHandler = useCallback((draggedItem: DragItem) => {
    // Se for uma arma, abrir modal para escolher a mão
    if (draggedItem.item.type === 'weapon' || draggedItem.item.type === 'Revving Weapon' || draggedItem.item.type === 'Firearm' || draggedItem.item.type === 'Gunblade') {
      setHandSelectionModal({ isOpen: true, item: draggedItem.item });
    } else {
      // Para outros itens, usar a lógica padrão
      dispatch({ type: 'EQUIP_ITEM', item: draggedItem.item });
    }
    return { target: 'equipment' as const };
  }, [dispatch]);

  const [{ isOver }, drop] = useDrop<DragItem, DropResult, { isOver: boolean }>({
    accept: 'item',
    drop: dropHandler,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Criar slots de equipamento (2 colunas x 4 linhas = 8 slots)
  const slotLabels = useMemo(() => [
    'Mão Esquerda', 'Mão Direita',
    'Armadura', 'Módulos/Artefatos',
    'Módulos/Artefatos', 'Módulos/Artefatos',
    'Módulos/Artefatos', 'Módulos/Artefatos'
  ], []);

  const equipmentSlots = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const equippedItem = state.equippedItems[index] || null;
    return {
      id: index,
      item: equippedItem,
      label: slotLabels[index],
    };
  }), [state.equippedItems, slotLabels]);



  return (
    <div className="bg-gray-800/20 border border-bronze-medium rounded-lg p-4">
      <h2 className="text-xl font-bold text-gold-soft mb-4 text-center">
        Equipamentos
      </h2>
      
      <div 
        ref={drop as DndRef}
        className={`grid grid-cols-2 gap-2 min-h-[320px] p-2 border-2 border-dashed rounded-lg transition-colors ${
          isOver 
            ? 'border-gold-soft bg-gold-soft/10' 
            : 'border-bronze-medium bg-dark-neutral/50'
        }`}
      >
        {equipmentSlots.map((slot) => (
          <div
            key={slot.id}
            className="aspect-square border border-bronze-medium rounded-lg bg-dark-neutral/30 flex flex-col p-1"
          >
            {/* Label do slot sempre visível */}
            <div className="text-center py-1 text-[10px] font-medium text-bronze-light opacity-75">
              {slot.label}
            </div>
            
            {/* Área do item */}
            <div className="flex-1 flex items-center justify-center">
              {slot.item ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="transform scale-150">
                    <ItemCard
                      key={`${slot.item.id}-${slot.item.currentAmmo || 0}`}
                      item={slot.item}
                      source="equipment"
                      index={slot.id}
                      onEdit={() => onEditItem(slot.item!)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-bronze-light text-xs opacity-30">
                  {/* Área vazia - sem texto */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-center text-bronze-light text-xs">
        Arraste itens aqui para equipar
      </div>
      
      <HandSelectionModal
        isOpen={handSelectionModal.isOpen}
        onClose={() => setHandSelectionModal({ isOpen: false, item: null })}
        item={handSelectionModal.item}
      />
    </div>
  );
});

EquipmentGrid.displayName = 'EquipmentGrid';

export default EquipmentGrid;