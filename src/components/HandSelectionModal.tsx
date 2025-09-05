import React from 'react';
import { useGame } from '../hooks/useGame';
import { type Item } from '../types';

interface HandSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

const HandSelectionModal: React.FC<HandSelectionModalProps> = ({ isOpen, onClose, item }) => {
  const { state, dispatch } = useGame();

  if (!isOpen || !item) return null;

  // Verificar se é uma arma pesada
  const isHeavyWeapon = (item.type === 'weapon' || item.type === 'Revving Weapon' || item.type === 'Firearm' || item.type === 'Gunblade') && item.weight_kg > 2.5;

  const handleEquipToHand = (slotIndex: number) => {
    // Armas pesadas não devem usar esta função
    if (isHeavyWeapon) return;
    
    // Se já há uma arma equipada no slot, desequipar primeiro
    const currentItem = state.equippedItems[slotIndex];
    if (currentItem && currentItem.id !== item.id) {
      dispatch({ type: 'UNEQUIP_ITEM', item: currentItem });
    }
    
    dispatch({ type: 'EQUIP_ITEM_TO_SLOT', item, slotIndex });
    onClose();
  };

  const handleEquipHeavyWeapon = () => {
    // Se há armas equipadas em qualquer mão, desequipar primeiro
    const leftHandItem = state.equippedItems[0];
    const rightHandItem = state.equippedItems[1];
    
    if (leftHandItem && leftHandItem.id !== item.id) {
      dispatch({ type: 'UNEQUIP_ITEM', item: leftHandItem });
    }
    if (rightHandItem && rightHandItem.id !== item.id) {
      dispatch({ type: 'UNEQUIP_ITEM', item: rightHandItem });
    }
    
    dispatch({ type: 'EQUIP_ITEM', item });
    onClose();
  };

  const leftHandItem = state.equippedItems[0];
  const rightHandItem = state.equippedItems[1];
  const leftHandSameItem = leftHandItem?.id === item.id;
  const rightHandSameItem = rightHandItem?.id === item.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999999]">
      <div className="bg-dark-neutral border border-bronze-medium rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gold-soft mb-4 text-center">
          {isHeavyWeapon ? 'Arma Pesada Detectada' : 'Escolher Mão para Equipar'}
        </h2>
        
        <div className="text-center mb-6">
          <div className="text-bronze-light mb-2">
            <strong>{item.name}</strong>
          </div>
          <div className="text-sm text-gray-300">
            {isHeavyWeapon 
              ? `Esta arma pesa ${item.weight_kg}kg e requer ambas as mãos para ser equipada.`
              : 'Selecione em qual mão deseja equipar esta arma:'}
          </div>
        </div>

        {isHeavyWeapon ? (
          <div className="text-center mb-6">
            <button
              onClick={handleEquipHeavyWeapon}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              ⚔️ Equipar em Ambas as Mãos
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Mão Esquerda */}
          <button
            onClick={() => handleEquipToHand(0)}
            disabled={leftHandSameItem}
            className={`p-4 rounded-lg border-2 transition-all ${
              leftHandSameItem
                ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'border-bronze-medium bg-dark-neutral/50 text-bronze-light hover:border-gold-soft hover:bg-gold-soft/10'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-2">🤚</div>
              <div className="font-medium">Mão Esquerda</div>
              {leftHandItem && !leftHandSameItem && (
                <div className="text-xs text-yellow-400 mt-1">
                  Trocar: {leftHandItem.name}
                </div>
              )}
              {leftHandSameItem && (
                <div className="text-xs text-red-400 mt-1">
                  Já equipado
                </div>
              )}
            </div>
          </button>

          {/* Mão Direita */}
          <button
            onClick={() => handleEquipToHand(1)}
            disabled={rightHandSameItem}
            className={`p-4 rounded-lg border-2 transition-all ${
              rightHandSameItem
                ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'border-bronze-medium bg-dark-neutral/50 text-bronze-light hover:border-gold-soft hover:bg-gold-soft/10'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-2">✋</div>
              <div className="font-medium">Mão Direita</div>
              {rightHandItem && !rightHandSameItem && (
                <div className="text-xs text-yellow-400 mt-1">
                  Trocar: {rightHandItem.name}
                </div>
              )}
              {rightHandSameItem && (
                <div className="text-xs text-red-400 mt-1">
                  Já equipado
                </div>
              )}
            </div>
          </button>
        </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandSelectionModal;