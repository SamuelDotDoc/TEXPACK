import React, { memo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useGame } from '../hooks/useGame';
import ItemCard from './ItemCard';
import { type Item, type DragItem, type DropResult, type DndRef } from '../types';

interface StorageBankProps {
  onEditItem?: (item: Item) => void;
}

const StorageBank: React.FC<StorageBankProps> = memo(({ onEditItem }) => {
  const { state, dispatch } = useGame();
  const { storageBank } = state;

  const dropHandler = useCallback((draggedItem: DragItem) => {
    if (draggedItem.source === 'inventory') {
      dispatch({ type: 'MOVE_ITEM_TO_STORAGE', itemId: draggedItem.item.id });
    } else if (draggedItem.source === 'catalog') {
      dispatch({ type: 'ADD_ITEM_TO_STORAGE', item: draggedItem.item });
    }
    return { target: 'storage' as const };
  }, [dispatch]);

  const [{ isOver }, drop] = useDrop<DragItem, DropResult, { isOver: boolean }>({
    accept: 'item',
    drop: dropHandler,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="steampunk-card p-4">
      <h2 className="text-xl font-bold text-gold-soft mb-4 text-center">
        Banco de Armazenamento ({storageBank.items.length})
      </h2>
      
      <div
        ref={drop as DndRef}
        className={`min-h-32 p-4 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'border-accent-hover bg-accent-hover/10' : 'border-bronze-light/50'
        }`}
      >
        {storageBank.items.length > 0 ? (
          <div className="grid grid-cols-8 gap-2">
            {storageBank.items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                source="storage"
                index={index}
                onEdit={onEditItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-bronze-light py-8">
            <div className="text-4xl mb-2">🏦</div>
            <p>Banco vazio</p>
            <p className="text-sm">Arraste itens aqui para armazenar</p>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-sm text-bronze-light text-center">
        💡 Itens no banco não contam para o peso da mochila
      </div>
    </div>
  );
});

StorageBank.displayName = 'StorageBank';

export default StorageBank;