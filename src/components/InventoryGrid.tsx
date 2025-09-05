import React, { memo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useGame } from '../hooks/useGame';
import { type DragItem, type DropResult, type Item, type DndRef } from '../types';
import ItemCard from './ItemCard';

interface InventoryGridProps {
  onEditItem?: (item: Item) => void;
}

interface InventorySlotProps {
  index: number;
  item: Item | null;
  onEditItem?: (item: Item) => void;
}

const InventorySlot: React.FC<InventorySlotProps> = memo(({ index, item, onEditItem }) => {
  const { dispatch } = useGame();
  
  const dropHandler = useCallback((draggedItem: DragItem) => {
    if (draggedItem.source === 'storage') {
      dispatch({ type: 'MOVE_ITEM_TO_INVENTORY', itemId: draggedItem.item.id });
    } else if (draggedItem.source === 'catalog') {
      dispatch({ type: 'ADD_ITEM_TO_INVENTORY', item: draggedItem.item });
    } else if (draggedItem.source === 'inventory' && draggedItem.index !== undefined) {
      dispatch({ type: 'REORDER_INVENTORY', fromIndex: draggedItem.index, toIndex: index });
    } else if (draggedItem.source === 'equipment') {
      dispatch({ type: 'UNEQUIP_ITEM', item: draggedItem.item });
    }
    return { target: 'inventory' as const, index };
  }, [dispatch, index]);

  const [{ isOverSlot }, dropSlot] = useDrop<DragItem, DropResult, { isOverSlot: boolean }>({
    accept: 'item',
    drop: dropHandler,
    collect: (monitor) => ({
      isOverSlot: monitor.isOver(),
    }),
  });

  return (
    <div
      key={index}
      ref={dropSlot as DndRef}
      className={`relative w-16 h-16 border-2 rounded-lg transition-colors ${
        isOverSlot ? 'border-accent bg-accent/20' : 'border-bronze-light/30'
      }`}
    >
      {item && (
        <ItemCard
          key={`${item.id}-${item.currentAmmo || 0}`}
          item={item}
          source="inventory"
          index={index}
          onEdit={onEditItem}
        />
      )}
    </div>
  );
});

InventorySlot.displayName = 'InventorySlot';

const InventoryGrid: React.FC<InventoryGridProps> = ({ onEditItem }) => {
  const { state, dispatch } = useGame();
  const { inventory } = state;

  const [{ isOver }, drop] = useDrop<DragItem, DropResult, { isOver: boolean }>({
    accept: 'item',
    drop: (draggedItem) => {
      if (draggedItem.source === 'storage') {
        dispatch({ type: 'MOVE_ITEM_TO_INVENTORY', itemId: draggedItem.item.id });
      } else if (draggedItem.source === 'catalog') {
        dispatch({ type: 'ADD_ITEM_TO_INVENTORY', item: draggedItem.item });
      } else if (draggedItem.source === 'equipment') {
        dispatch({ type: 'UNEQUIP_ITEM', item: draggedItem.item });
      }
      return { target: 'inventory' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Criar array de slots com base no mapeamento
  const slots = Array.from({ length: inventory.slots }, (_, index) => {
    const item = inventory.items[index]; // Pode ser undefined se slot vazio
    return { index, item };
  });

  return (
    <div className="steampunk-card p-4">
      <h2 className="text-xl font-bold text-gold-soft mb-4 text-center">
        Mochila ({Object.keys(inventory.items).length}/{inventory.slots})
      </h2>
      
      <div
        ref={drop as DndRef}
        className={`grid grid-cols-6 gap-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'border-accent-hover bg-accent-hover/10' : 'border-bronze-light/50'
        }`}
      >
        {slots.map(({ index, item }) => (
          <InventorySlot
            key={index}
            index={index}
            item={item || null}
            onEditItem={onEditItem}
          />
        ))}
      </div>
      
      {Object.keys(inventory.items).length === 0 && (
        <div className="text-center text-bronze-light mt-4">
          <p>Mochila vazia</p>
          <p className="text-sm">Arraste itens aqui para adicioná-los ao inventário</p>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;