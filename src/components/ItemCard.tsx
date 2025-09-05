import React, { useState, useMemo, memo } from 'react';
import { useDrag } from 'react-dnd';
import { type Item, type DragItem, type DropResult, type DndRef } from '../types';
import { useGame } from '../hooks/useGame';
import { getWeaponIcon } from '../utils/weaponIconUtils';
import { getAmmoIcon } from '../utils/ammoIconUtils';
import { getArmorIcon } from '../utils/armorIconUtils';
import { getWeaponCategory, getWeaponCategoryInfo } from '../utils/weaponCategoryUtils';
import ContextMenu from './ContextMenu';

interface ItemCardProps {
  item: Item;
  source: 'inventory' | 'storage' | 'catalog' | 'equipment';
  index?: number;
  onEdit?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = memo(({ item, source, index, onEdit }) => {
  const { state, dispatch } = useGame();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  const [{ isDragging }, drag] = useDrag<DragItem, DropResult, { isDragging: boolean }>({
    type: 'item',
    item: { type: 'item', item, source, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isEquipped = Object.values(state.equippedItems).some(equippedItem => {
    // Para shadows, verificar tanto o ID da shadow quanto o ID original
    if (item.isLeftHandCopy) {
      const originalId = item.id.replace('_left_hand_copy', '');
      return equippedItem.id === item.id || equippedItem.id === originalId;
    }
    return equippedItem.id === item.id;
  });
  const isAmmoItem = item.currentAmmo !== undefined && item.maxAmmo !== undefined && item.type !== 'Firearm';
  const isFirearm = item.type === 'Firearm';
  const isRevvingWeapon = item.type === 'Revving Weapon';
  
  // Obter categoria da arma para aplicar cores aos SVGs apenas no catálogo e apenas para armas
  const weaponCategory = useMemo(() => {
    return source === 'catalog' && item.name && 
      (item.type === 'weapon' || item.type === 'Firearm' || item.type === 'Revving Weapon')
      ? getWeaponCategory(item.name) 
      : null;
  }, [source, item.name, item.type]);
  
  const weaponCategoryInfo = useMemo(() => {
    return weaponCategory ? getWeaponCategoryInfo(weaponCategory) : null;
  }, [weaponCategory]);

  const handleDoubleClick = () => {
    if (onEdit && source !== 'catalog') {
      onEdit(item);
      }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Bloquear context menu para shadows (armas de duas mãos)
    if (item.id.includes('_left_hand_copy')) {
      return;
    }
    
    if (source === 'inventory' || source === 'equipment') {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleEquip = () => {
    dispatch({ type: 'EQUIP_ITEM', item: item });
  };

  const handleEquipToLeftHand = () => {
    // Se já há uma arma equipada na mão esquerda, desequipar primeiro
    const currentLeftHandItem = state.equippedItems[0];
    if (currentLeftHandItem && currentLeftHandItem.id !== item.id) {
      dispatch({ type: 'UNEQUIP_ITEM', item: currentLeftHandItem });
    }
    dispatch({ type: 'EQUIP_ITEM_TO_SLOT', item: item, slotIndex: 0 });
  };

  const handleEquipToRightHand = () => {
    // Se já há uma arma equipada na mão direita, desequipar primeiro
    const currentRightHandItem = state.equippedItems[1];
    if (currentRightHandItem && currentRightHandItem.id !== item.id) {
      dispatch({ type: 'UNEQUIP_ITEM', item: currentRightHandItem });
    }
    dispatch({ type: 'EQUIP_ITEM_TO_SLOT', item: item, slotIndex: 1 });
  };

  const handleUnequip = () => {
    dispatch({ type: 'UNEQUIP_ITEM', item: item });
  };

  const handleStoreToBank = () => {
    dispatch({ type: 'MOVE_ITEM_TO_STORAGE', itemId: item.id });
  };

  const handleSell = () => {
    const confirmSell = window.confirm(`Vender ${item.name} por ${formatPrice(item.price_db)}?`);
    if (confirmSell) {
      dispatch({ type: 'SELL_ITEM', itemId: item.id });
    }
  };

  const handleDiscard = () => {
    const confirmDiscard = window.confirm(`Descartar ${item.name} permanentemente?`);
    if (confirmDiscard) {
      dispatch({ type: 'DISCARD_ITEM', itemId: item.id });
    }
  };

  const handleConsumeAmmo = () => {
    if (item.currentAmmo !== undefined && item.currentAmmo > 0) {
      dispatch({ type: 'CONSUME_AMMO', itemId: item.id, amount: 1 });
    }
  };

  const handleReloadWeapon = () => {
    if (isFirearm) {
      dispatch({ type: 'RELOAD_WEAPON', itemId: item.id });
    }
  };

  const handleRefuelWeapon = () => {
    if (isRevvingWeapon) {
      dispatch({ type: 'REFUEL_WEAPON', itemId: item.id });
    }
  };

  const handleUnloadWeapon = () => {
    if ((isFirearm || item.type === 'Gunblade') && item.currentAmmo && item.currentAmmo > 0) {
      dispatch({ type: 'UNLOAD_WEAPON', itemId: item.id });
    }
  };

  const handleFireWeapon = () => {
    // Só pode disparar se for uma arma carregada e equipada
    if ((isFirearm || isRevvingWeapon) && (source === 'equipment') && 
        ((isFirearm && item.currentAmmo && item.currentAmmo > 0) || 
         (isRevvingWeapon && item.tanque && item.tanque > 0))) {
      dispatch({ type: 'CONSUME_AMMO', itemId: item.id, amount: 1 });
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null || isNaN(price)) {
      return 'DB$ 0,00';
    }
    return `DB$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const getIconDisplay = () => {
    const iconSize = source === 'catalog' ? 'w-12 h-12' : 'w-8 h-8';
    
    if (item.icon) {
      if (item.icon.startsWith('data:')) {
        return (
          <img 
            src={item.icon} 
            alt={item.name} 
            className={`${iconSize} object-cover rounded`}
          />
        );
      } else if (item.icon.startsWith('/SVG/')) {
        // Ícone SVG predefinido
        return (
          <img 
            src={item.icon} 
            alt={item.name} 
            className={`${iconSize} object-contain rounded`}
          />
        );
      }
    }
    
    // Usar ícone específico baseado no tipo do item
    if (item.type === 'ammo') {
      return getAmmoIcon(item.name, undefined, iconSize);
    }
    
    if (item.type === 'armor') {
      // Se não tem ícone personalizado, usar armor.svg como padrão
      if (!item.icon) {
        return (
          <img 
            src="/SVG/armor.svg" 
            alt={item.name} 
            className={`${iconSize} object-cover rounded`}
          />
        );
      }
      return getArmorIcon(item.name, item.armorType, iconSize);
    }
    
    return getWeaponIcon(item.name, iconSize);
  };



  return (
    <div className="relative group">
      <div
        ref={drag as DndRef}
        className={`item-card relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
          isDragging ? 'dragging opacity-50 cursor-grabbing' : item.isLeftHandCopy ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'
        }`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}

        title={`${item.name || 'Item'}\n${item.type || 'Tipo desconhecido'}\nPeso: ${item.weight_kg || 0}kg\nPreço: ${formatPrice(item.price_db || 0)}${item.damage ? `\nDano: ${item.damage}` : ''}${item.ammo ? `\nMunição Aceita: ${item.ammo}` : ''}${item.currentAmmo !== undefined ? `\nMunição Atual: ${item.currentAmmo}/${item.magazine || 'N/A'}` : ''}${item.selectedAmmoType ? `\nMunição Carregada: ${item.selectedAmmoType}` : ''}${isEquipped ? '\n⚔️ EQUIPADO' : ''}${item.isLeftHandCopy ? '\n👻 CÓPIA (MÃO ESQUERDA)' : ''}`}
      >
        <div className="flex-shrink-0 mb-1 relative">
          <div 
            className="weapon-icon-container"
            style={weaponCategoryInfo ? {
              filter: weaponCategoryInfo.svgFilter,
              '--svg-fill': weaponCategoryInfo.svgFill
            } as React.CSSProperties & { '--svg-fill': string } : {}}
          >
            {getIconDisplay()}
          </div>
          {/* Indicador de stack de caixas */}
          {item.stackQuantity && item.stackQuantity > 1 && (
            <div className="absolute -top-1 -right-1 bg-yellow-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-yellow-400">
              {item.stackQuantity}
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-[10px] font-medium truncate w-full">
            {item.name && item.name.length > 10 
              ? `${item.name.substring(0, 10)}...` 
              : (item.name || 'Item')}
          </div>
          {/* Exibir estado para armas de fogo, revving weapons, sub-inventário para munições ou quantidade normal para outros itens */}
          {isFirearm && (isEquipped || source === 'equipment') && source !== 'catalog' ? (
            <div className={`text-xs font-bold ${
              item.currentAmmo && item.currentAmmo > 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {item.currentAmmo && item.currentAmmo > 0 
                ? `${item.currentAmmo}/${item.maxAmmo}` 
                : 'Descarregada'}
            </div>
          ) : isRevvingWeapon && (isEquipped || source === 'equipment') && source !== 'catalog' ? (
            <div className={`text-xs font-bold ${
              item.tanque && item.tanque > 0 
                ? 'text-blue-400' 
                : 'text-red-400'
            }`}>
              {item.tanque && item.tanque > 0 
                ? `⛽${item.tanque}/${item.maxTanque}` 
                : 'Sem Combustível'}
            </div>
          ) : item.type === 'Gunblade' && (isEquipped || source === 'equipment') && source !== 'catalog' ? (
            <div className={`text-xs font-bold ${
              item.currentAmmo && item.currentAmmo > 0 
                ? 'text-purple-400' 
                : 'text-red-400'
            }`}>
              {item.currentAmmo && item.currentAmmo > 0 
                ? `⚡${item.currentAmmo}/${item.maxAmmo}` 
                : 'Descarregada'}
            </div>
          ) : item.currentAmmo !== undefined && item.maxAmmo !== undefined && (isEquipped || source === 'equipment') && source !== 'catalog' ? (
            <div className="text-xs text-gold-soft font-bold">
              {item.currentAmmo}/{item.maxAmmo}
            </div>
          ) : item.type === 'ammo' && item.currentAmmo !== undefined && item.maxAmmo !== undefined && source !== 'catalog' ? (
            <div className="text-xs text-gold-soft font-bold">
              {item.currentAmmo}/{item.maxAmmo}
            </div>
          ) : item.type === 'ammo' && item.qty && item.qty > 1 && source === 'catalog' ? (
            <div className="text-xs text-gold-soft font-bold">
              {item.qty}/{item.qty}
            </div>
          ) : item.qty && item.qty > 1 && (
            <div className="text-xs text-gold-soft font-bold">
              x{item.qty}
            </div>
          )}
        </div>
        
        {/* Botão de edição (apenas para itens não do catálogo) */}
        {source !== 'catalog' && onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            title="Editar item"
          >
            ✏️
          </button>
        )}
      </div>

      {/* Tooltips */}
      {source === 'catalog' ? (
        <div className={`absolute px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out pointer-events-none z-[99999] whitespace-nowrap border border-gray-600 top-full mt-2 ${
          index !== undefined && index % 4 === 0 
            ? 'left-0' 
            : index !== undefined && index % 4 === 3 
            ? 'right-0' 
            : 'left-1/2 transform -translate-x-1/2'
        }`}>
          <div className="font-semibold">{item.name}</div>
          <div className="text-green-400">{formatPrice(item.price_db)}</div>
          <div className={`absolute w-0 h-0 border-l-4 border-r-4 border-transparent bottom-full border-b-4 border-b-gray-900 ${
            index !== undefined && index % 4 === 0 
              ? 'left-4' 
              : index !== undefined && index % 4 === 3 
              ? 'right-4' 
              : 'left-1/2 transform -translate-x-1/2'
          }`}></div>
        </div>
      ) : (
        <div className={`absolute left-1/2 transform -translate-x-1/2 px-3 py-2 bg-dark-neutral border border-bronze-light rounded shadow-lg text-xs text-light-text opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none min-w-48 ${
          source === 'equipment' ? 'z-[999999] bottom-full mb-2' : 'z-[99999]'
        } ${
          source === 'inventory' && index !== undefined && index < 6 
            ? 'top-full mt-2 translate-y-1 group-hover:translate-y-0' 
            : 'bottom-full mb-2 -translate-y-1 group-hover:translate-y-0'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-bronze-light">{item.name}</span>
            <span className="text-green-400 font-bold">{formatPrice(item.price_db)}</span>
          </div>
          <div className="text-gray-300 mb-1">{item.type}</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>Peso: <span className="text-bronze-light">{item.weight_kg}kg</span></div>
            {item.damage && (
              <div>Dano: <span className="text-red-400">{item.damage}</span></div>
            )}
            {item.ammo && (
              <div>Munição: <span className="text-blue-400">{item.ammo}</span></div>
            )}
            {/* Mostrar munição equipada para armas equipadas */}
            {isEquipped && (isFirearm || item.type === 'Gunblade') && item.selectedAmmoType && (() => {
              // Buscar a munição selecionada no inventário para obter o nome completo
              const selectedAmmo = item.selectedAmmoId ? 
                Object.values(state.inventory.items).find(invItem => invItem.id === item.selectedAmmoId) :
                null;
              
              const extractAmmoVariant = (name: string): string => {
                // Lista de variantes conhecidas
                const knownVariants = ['AP', 'HP', 'Incendiária', 'Traçante', 'Subsônica', 'Armor Piercing (AP)', 'Ponta Oca (HP)'];
                
                // Procurar por todas as ocorrências de parênteses
                const allMatches = name.match(/\(([^)]+)\)/g);
                if (allMatches) {
                  // Verificar cada match para encontrar uma variante conhecida
                  for (const match of allMatches.reverse()) { // Começar pelo último
                    const content = match.slice(1, -1); // Remover os parênteses
                    
                    // Se o conteúdo é uma variante conhecida, retornar
                    if (knownVariants.some(variant => content.includes(variant) || variant.includes(content))) {
                      return content;
                    }
                  }
                }
                
                // Se não encontrou variante nos parênteses, procurar por variantes no texto
                for (const variant of knownVariants) {
                  if (name.includes(variant)) {
                    return variant;
                  }
                }
                
                return 'Comum';
              };
              
              if (selectedAmmo && selectedAmmo.name) {
                const variant = extractAmmoVariant(selectedAmmo.name);
                return (
                  <div>Munição Equipada: <span className="text-yellow-400">{variant}</span></div>
                );
              }
              
              // Fallback: tentar extrair do selectedAmmoType
              const variant = extractAmmoVariant(item.selectedAmmoType);
              return (
                <div>Munição Equipada: <span className="text-yellow-400">{variant}</span></div>
              );
            })()}
            {item.motorizado && (
              <div>Motorizado: <span className="text-orange-400">{typeof item.motorizado === 'string' ? item.motorizado : `+${item.motorizado}`} dano</span></div>
            )}
            {item.gunblade && (
              <div>Gunblade: <span className="text-purple-400">{typeof item.gunblade === 'string' ? item.gunblade : `+${item.gunblade}`} dano</span></div>
            )}
            {item.type === 'Gunblade' && item.currentAmmo !== undefined && item.maxAmmo !== undefined && (
              <div>Munição: <span className={`${item.currentAmmo > 0 ? 'text-purple-400' : 'text-red-400'}`}>{item.currentAmmo}/{item.maxAmmo}</span></div>
            )}
            {item.stackQuantity && item.stackQuantity > 1 && (
              <div>Caixas: <span className="text-yellow-400">{item.stackQuantity}x</span></div>
            )}
          </div>
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
            source === 'inventory' && index !== undefined && index < 6 
              ? 'bottom-full border-b-4 border-b-dark-neutral' 
              : 'top-full border-t-4 border-t-dark-neutral'
          }`}></div>
        </div>
      )}
      
      {/* Menu de contexto */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.visible}
        onClose={handleCloseContextMenu}
        onEquip={handleEquip}
        onEquipToLeftHand={handleEquipToLeftHand}
        onEquipToRightHand={handleEquipToRightHand}
        onUnequip={handleUnequip}
        onStoreToBank={handleStoreToBank}
        onSell={handleSell}
        onDiscard={handleDiscard}
        onConsumeAmmo={isAmmoItem ? handleConsumeAmmo : undefined}
        onReloadWeapon={(isFirearm || item.type === 'Gunblade') ? handleReloadWeapon : undefined}
        onUnloadWeapon={(isFirearm || item.type === 'Gunblade') ? handleUnloadWeapon : undefined}
        onRefuelWeapon={isRevvingWeapon ? handleRefuelWeapon : undefined}
        onFireWeapon={((isFirearm || isRevvingWeapon) && source === 'equipment') ? handleFireWeapon : undefined}
        isEquipped={isEquipped}
        isWeapon={item.type === 'weapon' || item.type === 'Revving Weapon'}
        leftHandOccupied={!!state.equippedItems[0]}
        rightHandOccupied={!!state.equippedItems[1]}
        isHeavyWeapon={(item.type === 'weapon' || item.type === 'Revving Weapon') && item.weight_kg > 2.5}
        isAmmoItem={isAmmoItem}
        isFirearm={isFirearm}
        currentAmmo={item.currentAmmo}
        maxAmmo={item.maxAmmo}
        isRevvingWeapon={isRevvingWeapon}
        tanque={item.tanque}
        maxTanque={item.maxTanque}
        weapon={(isFirearm || item.type === 'Gunblade') ? item : null}
      />
    </div>
  );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;