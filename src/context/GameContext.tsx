import { useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState, Item } from '../types';
import { GameContext, type GameAction } from './context';

// Função auxiliar para calcular preço da munição baseado no catálogo
const calculateAmmoPrice = (ammoType: string, quantity: number): number => {
  // Preços base por unidade baseados no catálogo
  const ammoPrices: { [key: string]: { pricePerUnit: number, baseQty: number } } = {
    '9x19mm': { pricePerUnit: 45/50, baseQty: 50 },
    '9x23mm': { pricePerUnit: 20/50, baseQty: 50 },
    '.38 Special': { pricePerUnit: 25/50, baseQty: 50 },
    '.45 ACP': { pricePerUnit: 40/50, baseQty: 50 },
    '.44 Magnum': { pricePerUnit: 45/50, baseQty: 50 },
    '12 Gauge': { pricePerUnit: 25/25, baseQty: 25 },
    '20 Gauge': { pricePerUnit: 20/25, baseQty: 25 },
    '.308 Winchester': { pricePerUnit: 30/20, baseQty: 20 },
    '5.56x45mm': { pricePerUnit: 35/30, baseQty: 30 },
    '7.62x39mm': { pricePerUnit: 30/30, baseQty: 30 },
    '.50 BMG': { pricePerUnit: 50/10, baseQty: 10 }
  };
  
  const ammoData = ammoPrices[ammoType];
  if (ammoData) {
    return Math.round(ammoData.pricePerUnit * quantity * 100) / 100;
  }
  
  // Preço padrão se não encontrar no catálogo
  return Math.round(0.5 * quantity * 100) / 100;
};

const initialState: GameState = {
  wallet: {
    currency: 'DB$',
    balance: 1250.00
  },
  inventory: {
    slots: 24,
    maxWeight: 30, // Peso máximo padrão de 30kg
    items: {} // Mapeamento vazio inicialmente
  },
  storageBank: {
    items: []
  },
  equippedItems: {}, // Mapeamento dos itens equipados por slot (máximo 8 slots)
  customCatalogs: [], // Catálogos personalizados
  totalMaxWeight: 50 // Peso máximo total padrão de 50kg (equipamentos + mochila)
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_ITEM_TO_INVENTORY': {
      let processedItem = { ...action.item };
      
      // Se for munição do catálogo (tem qty), configurar sub-inventário
      if (action.item.qty && action.item.qty > 1 && action.item.type === 'ammo') {
        processedItem = {
          ...action.item,
          currentAmmo: action.item.qty,
          maxAmmo: action.item.qty
        };
      }
      
      // Verificar se existe um item similar para empilhar (apenas para munições com stackQuantity)
      if (processedItem.type === 'ammo' && processedItem.stackQuantity && processedItem.stackQuantity > 0) {
        const existingItemEntry = Object.entries(state.inventory.items).find(([, item]) => {
          // Comparar nome completo (incluindo variante), tipo de munição e notas (que contêm as modificações)
          return processedItem.name === item.name && 
                 item.type === processedItem.type &&
                 item.ammo === processedItem.ammo &&
                 (processedItem.notes || '') === (item.notes || '') &&
                 item.stackQuantity && item.stackQuantity > 0;
        });
        
        if (existingItemEntry) {
          const [position, existingItem] = existingItemEntry;
          const newStackQuantity = (existingItem.stackQuantity || 1) + (processedItem.stackQuantity || 1);
          const newCurrentAmmo = (existingItem.currentAmmo || 0) + (processedItem.currentAmmo || 0);
          const newMaxAmmo = (existingItem.maxAmmo || 0) + (processedItem.maxAmmo || 0);
          const newWeight = (existingItem.weight_kg || 0) + (processedItem.weight_kg || 0);
          const newPrice = (existingItem.price_db || 0) + (processedItem.price_db || 0);
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: {
                ...state.inventory.items,
                [position]: {
                  ...existingItem,
                  stackQuantity: newStackQuantity,
                  currentAmmo: newCurrentAmmo,
                  maxAmmo: newMaxAmmo,
                  weight_kg: newWeight,
                  price_db: newPrice
                }
              }
            }
          };
        }
      }
      
      const newItem = {
        ...processedItem,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Encontrar primeira posição vazia
      const firstEmptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
        .find(i => !state.inventory.items[i]);
      
      if (firstEmptySlot !== undefined) {
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [firstEmptySlot]: newItem
            }
          }
        };
      }
      
      return state; // Inventário cheio
    }

    case 'ADD_ITEM_TO_STORAGE': {
      let processedItem = { ...action.item };
      
      // Se for munição do catálogo (tem qty), configurar sub-inventário
        if (action.item.qty && action.item.qty > 1 && action.item.type === 'ammo') {
          processedItem = {
            ...action.item,
            currentAmmo: action.item.qty,
            maxAmmo: action.item.qty
          };
        }
      
      // Sempre gerar novo ID único para evitar duplicatas
      const newStorageItem = {
        ...processedItem,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      return {
        ...state,
        storageBank: {
          items: [...state.storageBank.items, newStorageItem]
        }
      };
    }
    
    case 'REMOVE_ITEM_FROM_INVENTORY': {
      const newInventoryItems = { ...state.inventory.items };
      const positionToRemove = Object.keys(newInventoryItems)
        .find(pos => newInventoryItems[parseInt(pos)].id === action.itemId);
      
      if (positionToRemove) {
        delete newInventoryItems[parseInt(positionToRemove)];
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: newInventoryItems
        }
      };
    }

    case 'REMOVE_ITEM_FROM_STORAGE':
      return {
        ...state,
        storageBank: {
          items: state.storageBank.items.filter(item => item.id !== action.itemId)
        }
      };
    
    case 'MOVE_ITEM_TO_STORAGE': {
      const inventoryItems = { ...state.inventory.items };
      const positionToMove = Object.keys(inventoryItems)
        .find(pos => inventoryItems[parseInt(pos)].id === action.itemId);
      
      if (!positionToMove) return state;
      
      const itemToStorage = inventoryItems[parseInt(positionToMove)];
      delete inventoryItems[parseInt(positionToMove)];
      
      // Se o item está equipado, desequipá-lo automaticamente
      const updatedEquippedItems = { ...state.equippedItems };
      const slotToRemove = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)].id === action.itemId);
      
      if (slotToRemove) {
        delete updatedEquippedItems[parseInt(slotToRemove)];
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: inventoryItems
        },
        storageBank: {
          items: [...state.storageBank.items, itemToStorage]
        },
        equippedItems: updatedEquippedItems
      };
    }
    
    case 'MOVE_ITEM_TO_INVENTORY': {
      const itemToInventory = state.storageBank.items.find(item => item.id === action.itemId);
      if (!itemToInventory) return state;
      
      // Encontrar primeira posição vazia no inventário
      const emptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
        .find(i => !state.inventory.items[i]);
      
      if (emptySlot === undefined) return state; // Inventário cheio
      
      return {
        ...state,
        storageBank: {
          items: state.storageBank.items.filter(item => item.id !== action.itemId)
        },
        inventory: {
          ...state.inventory,
          items: {
            ...state.inventory.items,
            [emptySlot]: itemToInventory
          }
        }
      };
    }
    
    case 'REORDER_INVENTORY': {
      const reorderedItems = { ...state.inventory.items };
      
      // Pegar item da posição origem
      const itemToMove = reorderedItems[action.fromIndex];
      
      if (itemToMove) {
        // Se há item na posição destino, fazer troca
        const itemAtDestination = reorderedItems[action.toIndex];
        
        // Remover item da posição origem
        delete reorderedItems[action.fromIndex];
        
        // Colocar item na posição destino
        reorderedItems[action.toIndex] = itemToMove;
        
        // Se havia item no destino, colocar na origem
        if (itemAtDestination) {
          reorderedItems[action.fromIndex] = itemAtDestination;
        }
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: reorderedItems
        }
      };
    }
    
    case 'UPDATE_WALLET': {
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: Math.max(0, state.wallet.balance + action.amount)
        }
      };
    }
    
    case 'UPDATE_MAX_WEIGHT': {
      return {
        ...state,
        inventory: {
          ...state.inventory,
          maxWeight: Math.max(1, action.maxWeight) // Mínimo de 1kg
        }
      };
    }
    
    case 'UPDATE_TOTAL_MAX_WEIGHT': {
      return {
        ...state,
        totalMaxWeight: Math.max(1, action.maxWeight) // Mínimo de 1kg
      };
    }
    
    case 'UPDATE_ITEM': {
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      const positionToUpdate = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.item.id);
      
      console.log('🔄 UPDATE_ITEM chamado para:', action.item.id, 'currentAmmo:', action.item.currentAmmo);
      
      if (positionToUpdate) {
        const oldItem = updatedInventoryItems[parseInt(positionToUpdate)];
        updatedInventoryItems[parseInt(positionToUpdate)] = action.item;
        
        console.log('📦 Item encontrado no inventário, oldAmmo:', oldItem.currentAmmo, 'newAmmo:', action.item.currentAmmo);
        
        // Verificar se houve mudança na munição de uma arma equipada
        if ((action.item.type === 'Firearm' || action.item.type === 'Gunblade') && 
            oldItem.currentAmmo !== action.item.currentAmmo) {
          
          console.log('🔫 Mudança de munição detectada em arma de fogo!');
          
          // Procurar se esta arma está equipada
          const equippedSlot = Object.keys(updatedEquippedItems)
            .find(slot => updatedEquippedItems[parseInt(slot)]?.id === action.item.id);
          
          console.log('🎯 Slot equipado encontrado:', equippedSlot);
          
          if (equippedSlot) {
            // Atualizar a arma equipada
            updatedEquippedItems[parseInt(equippedSlot)] = {
              ...updatedEquippedItems[parseInt(equippedSlot)],
              currentAmmo: action.item.currentAmmo
            };
            
            console.log('✅ Arma equipada atualizada no slot', equippedSlot);
            
            // Se for uma arma pesada no slot 1, sincronizar com a shadow no slot 0
            if (parseInt(equippedSlot) === 1 && action.item.weight_kg > 2.5) {
              const leftHandCopy = updatedEquippedItems[0];
              console.log('🏋️ Arma pesada detectada, shadow no slot 0:', leftHandCopy?.id);
              if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
                updatedEquippedItems[0] = {
                  ...leftHandCopy,
                  currentAmmo: action.item.currentAmmo
                };
                console.log('🔄 Shadow sincronizada com munição:', action.item.currentAmmo);
              }
            }
          }
          
          // Verificar se é uma shadow que foi modificada e sincronizar com a arma principal
          if (action.item.id.includes('_left_hand_copy')) {
            const originalId = action.item.id.replace('_left_hand_copy', '');
            console.log('👻 Shadow detectada, ID original:', originalId);
            
            // Procurar a arma principal no slot 1
            const mainWeapon = updatedEquippedItems[1];
            console.log('🎯 Arma principal no slot 1:', mainWeapon?.id);
            if (mainWeapon && mainWeapon.id === originalId) {
              updatedEquippedItems[1] = {
                ...mainWeapon,
                currentAmmo: action.item.currentAmmo
              };
              console.log('✅ Arma principal sincronizada no slot 1 com munição:', action.item.currentAmmo);
            }
            
            // Procurar a arma principal no inventário
            const mainWeaponInInventory = Object.keys(updatedInventoryItems)
              .find(pos => updatedInventoryItems[parseInt(pos)].id === originalId);
            
            console.log('📦 Arma principal no inventário:', mainWeaponInInventory ? 'encontrada' : 'não encontrada');
            if (mainWeaponInInventory) {
              updatedInventoryItems[parseInt(mainWeaponInInventory)] = {
                ...updatedInventoryItems[parseInt(mainWeaponInInventory)],
                currentAmmo: action.item.currentAmmo
              };
              console.log('✅ Arma principal sincronizada no inventário com munição:', action.item.currentAmmo);
            }
          }
        }
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: updatedInventoryItems
        },
        equippedItems: updatedEquippedItems,
        storageBank: {
          items: state.storageBank.items.map(item => 
            item.id === action.item.id ? action.item : item
          )
        }
      };
    }
    
    case 'EQUIP_ITEM': {
      // Verificar se já está equipado
      const isAlreadyEquipped = Object.values(state.equippedItems).some(item => item.id === action.item.id);
      if (isAlreadyEquipped) return state;
      
      let targetSlot = -1;
      let isHeavyWeapon = false;
      
      // Lógica para equipar armas nos slots corretos
      if (action.item.type === 'weapon' || action.item.type === 'Revving Weapon' || action.item.type === 'Firearm' || action.item.type === 'Gunblade') {
        // Verificar se é uma arma pesada (>2.5kg)
        isHeavyWeapon = action.item.weight_kg > 2.5;
        
        if (isHeavyWeapon) {
          // Armas pesadas ocupam ambas as mãos
          // Verificar se ambas as mãos estão livres
          if (state.equippedItems[0] || state.equippedItems[1]) {
            return state; // Não pode equipar se alguma mão estiver ocupada
          }
          targetSlot = 1; // Equipar na mão direita (principal)
        } else {
          // Armas leves - lógica normal
          // Slot 0 = Mão Esquerda, Slot 1 = Mão Direita
          if (!state.equippedItems[0]) {
            targetSlot = 0; // Mão Esquerda
          } else if (!state.equippedItems[1]) {
            targetSlot = 1; // Mão Direita
          } else {
            // Ambas as mãos ocupadas, não equipar
            return state;
          }
        }
      } else if (action.item.type === 'armor') {
        // Armaduras só podem ser equipadas no slot 2
        targetSlot = 2;
      } else if (action.item.type === 'accessory' || action.item.type === 'electronic') {
        // Acessórios e eletrônicos podem ser equipados nos slots de módulos/artefatos (3-7)
        for (let i = 3; i < 8; i++) {
          if (!state.equippedItems[i]) {
            targetSlot = i;
            break;
          }
        }
      } else {
        // Outros tipos de itens não podem ser equipados automaticamente
        return state;
      }
      
      // Se não encontrou slot disponível
      if (targetSlot === -1) return state;
      
      // Remover item do inventário quando equipado
      const updatedInventoryItems = { ...state.inventory.items };
      const inventoryPosition = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.item.id);
      
      if (inventoryPosition) {
        delete updatedInventoryItems[parseInt(inventoryPosition)];
      }
      
      // Preparar equipamentos atualizados
      const updatedEquippedItems = { ...state.equippedItems };
      
      // Se for armadura e já houver uma armadura equipada, desequipar a anterior
      if (action.item.type === 'armor' && state.equippedItems[2]) {
        const previousArmor = state.equippedItems[2];
        
        // Encontrar primeiro slot vazio no inventário para colocar a armadura anterior
        const emptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
          .find(slot => !updatedInventoryItems[slot]);
        
        if (emptySlot !== undefined) {
          updatedInventoryItems[emptySlot] = previousArmor;
        }
        // Se não há espaço no inventário, a armadura anterior será perdida (sobrescrita)
      }
      
      updatedEquippedItems[targetSlot] = action.item;
      
      // Se for arma pesada, criar cópia na mão esquerda com propriedade especial
      if (isHeavyWeapon && targetSlot === 1) {
        updatedEquippedItems[0] = {
          ...action.item,
          id: `${action.item.id}_left_hand_copy`, // ID único para a cópia
          isLeftHandCopy: true // Propriedade para identificar como cópia
        };
      }
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: updatedInventoryItems
        },
        equippedItems: updatedEquippedItems
      };
    }

    case 'EQUIP_ITEM_TO_SLOT': {
      // Verificar se já está equipado no mesmo slot
      if (state.equippedItems[action.slotIndex]?.id === action.item.id) {
        return state;
      }
      
      // Verificar se é uma arma sendo equipada em slot de mão (0 ou 1)
      if ((action.item.type === 'weapon' || action.item.type === 'Revving Weapon' || action.item.type === 'Firearm' || action.item.type === 'Gunblade') && (action.slotIndex < 0 || action.slotIndex > 1)) {
        return state; // Armas só podem ser equipadas nos slots 0 e 1
      }
      
      // Verificar se não é uma arma sendo equipada em outros slots
      if (action.item.type !== 'weapon' && action.item.type !== 'Revving Weapon' && action.item.type !== 'Firearm' && action.item.type !== 'Gunblade' && action.slotIndex >= 0 && action.slotIndex <= 1) {
        return state; // Apenas armas podem ser equipadas nos slots de mão
      }
      
      // Verificar regras específicas de armadura
      if (action.item.type === 'armor' && action.slotIndex !== 2) {
        return state; // Armaduras só podem ser equipadas no slot 2
      }
      
      // Verificar se não é uma armadura sendo equipada no slot de armadura
      if (action.item.type !== 'armor' && action.slotIndex === 2) {
        return state; // Apenas armaduras podem ser equipadas no slot 2
      }
      
      // Verificar regras específicas de módulos/artefatos (slots 3-7)
      if (action.slotIndex >= 3 && action.slotIndex <= 7) {
        if (action.item.type !== 'accessory' && action.item.type !== 'electronic') {
          return state; // Apenas acessórios e eletrônicos podem ser equipados nos slots de módulos/artefatos
        }
      }
      
      // Verificar se não é um acessório/eletrônico sendo equipado em outros slots
      if ((action.item.type === 'accessory' || action.item.type === 'electronic') && (action.slotIndex < 3 || action.slotIndex > 7)) {
        return state; // Acessórios e eletrônicos só podem ser equipados nos slots 3-7
      }
      
      // Verificar se é uma arma pesada tentando ser equipada em apenas uma mão
      if ((action.item.type === 'weapon' || action.item.type === 'Revving Weapon' || action.item.type === 'Firearm' || action.item.type === 'Gunblade') && action.item.weight_kg > 2.5) {
        // Armas pesadas não podem ser equipadas manualmente em slots específicos
        // Devem usar a ação EQUIP_ITEM que gerencia automaticamente ambas as mãos
        return state;
      }
      
      // Preparar inventário e equipamentos atualizados
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      
      // Primeiro, verificar se o item já está equipado em outro slot e removê-lo
      const currentlyEquippedSlot = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)]?.id === action.item.id);
      
      if (currentlyEquippedSlot) {
        delete updatedEquippedItems[parseInt(currentlyEquippedSlot)];
      }
      
      // Se há um item já equipado no slot de destino, retorná-lo ao inventário
      const currentEquippedItem = state.equippedItems[action.slotIndex];
      if (currentEquippedItem) {
        // Encontrar primeiro slot vazio no inventário
        const emptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
          .find(slot => !updatedInventoryItems[slot]);
        
        if (emptySlot !== undefined) {
          updatedInventoryItems[emptySlot] = currentEquippedItem;
        }
      }
      
      // Remover novo item do inventário (apenas se não estava equipado)
      if (!currentlyEquippedSlot) {
        const inventoryPosition = Object.keys(updatedInventoryItems)
          .find(pos => updatedInventoryItems[parseInt(pos)].id === action.item.id);
        
        if (inventoryPosition) {
          delete updatedInventoryItems[parseInt(inventoryPosition)];
        }
      }
      
      // Equipar o item no novo slot
      updatedEquippedItems[action.slotIndex] = action.item;
      
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: updatedInventoryItems
        },
        equippedItems: updatedEquippedItems
      };
    }
    
    case 'UNEQUIP_ITEM': {
      const newEquippedItems = { ...state.equippedItems };
      
      // Encontrar e remover o item do slot
      const slotToRemove = Object.keys(newEquippedItems)
        .find(slot => newEquippedItems[parseInt(slot)].id === action.item.id);
      
      if (!slotToRemove) return state;
      
      // Verificar se é uma arma pesada ou sua cópia
      const isHeavyWeapon = (action.item.type === 'weapon' || action.item.type === 'Revving Weapon' || action.item.type === 'Firearm' || action.item.type === 'Gunblade') && action.item.weight_kg > 2.5;
      const isLeftHandCopy = action.item.id.includes('_left_hand_copy');
      
      // Se for uma arma pesada ou sua cópia, remover ambos os slots (0 e 1)
      if (isHeavyWeapon || isLeftHandCopy) {
        // Encontrar o item original (sem _left_hand_copy)
        let originalItem = action.item;
        if (isLeftHandCopy) {
          // Se estamos desequipando a cópia, encontrar o item original
          const originalId = action.item.id.replace('_left_hand_copy', '');
          const originalSlot = Object.keys(newEquippedItems)
            .find(slot => newEquippedItems[parseInt(slot)].id === originalId);
          if (originalSlot) {
            originalItem = newEquippedItems[parseInt(originalSlot)];
          }
        }
        
        // Remover ambos os slots
        delete newEquippedItems[0]; // Mão esquerda (cópia)
        delete newEquippedItems[1]; // Mão direita (original)
        
        // Encontrar primeira posição vazia no inventário para colocar apenas o item original de volta
        const emptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
          .find(i => !state.inventory.items[i]);
        
        if (emptySlot === undefined) return state; // Inventário cheio, não pode desequipar
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [emptySlot]: originalItem
            }
          },
          equippedItems: newEquippedItems
        };
      } else {
        // Lógica normal para itens não pesados
        // Encontrar primeira posição vazia no inventário para colocar o item de volta
        const emptySlot = Array.from({ length: state.inventory.slots }, (_, i) => i)
          .find(i => !state.inventory.items[i]);
        
        if (emptySlot === undefined) return state; // Inventário cheio, não pode desequipar
        
        delete newEquippedItems[parseInt(slotToRemove)];
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: {
              ...state.inventory.items,
              [emptySlot]: action.item
            }
          },
          equippedItems: newEquippedItems
        };
      }
    }
    
    case 'SELL_ITEM': {
      const inventoryItemsForSale = { ...state.inventory.items };
      const positionToSell = Object.keys(inventoryItemsForSale)
        .find(pos => inventoryItemsForSale[parseInt(pos)].id === action.itemId);
      
      if (positionToSell) {
        const itemToSell = inventoryItemsForSale[parseInt(positionToSell)];
        const sellPrice = itemToSell.price_db || 0;
        delete inventoryItemsForSale[parseInt(positionToSell)];
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: inventoryItemsForSale
          },
          wallet: {
            ...state.wallet,
            balance: state.wallet.balance + sellPrice
          },
          equippedItems: (() => {
            const updatedEquipped = { ...state.equippedItems };
            const slotToRemove = Object.keys(updatedEquipped)
              .find(slot => updatedEquipped[parseInt(slot)].id === action.itemId);
            
            if (slotToRemove) {
              delete updatedEquipped[parseInt(slotToRemove)];
            }
            
            return updatedEquipped;
          })()
        };
      }
      return state;
    }
    
    case 'DISCARD_ITEM': {
      const inventoryItemsForDiscard = { ...state.inventory.items };
      const positionToDiscard = Object.keys(inventoryItemsForDiscard)
        .find(pos => inventoryItemsForDiscard[parseInt(pos)].id === action.itemId);
      
      if (positionToDiscard) {
        delete inventoryItemsForDiscard[parseInt(positionToDiscard)];
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: inventoryItemsForDiscard
          },
          equippedItems: (() => {
            const updatedEquipped = { ...state.equippedItems };
            const slotToRemove = Object.keys(updatedEquipped)
              .find(slot => updatedEquipped[parseInt(slot)].id === action.itemId);
            
            if (slotToRemove) {
              delete updatedEquipped[parseInt(slotToRemove)];
            }
            
            return updatedEquipped;
          })()
        };
      }
      return state;
    }
    
    case 'CONSUME_AMMO': {
      const consumeAmount = action.amount || 1;
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      
      // Procurar no inventário
      const positionToUpdate = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.itemId);
      
      if (positionToUpdate) {
        const ammoItem = updatedInventoryItems[parseInt(positionToUpdate)];
        
        // Verificar se é um item de munição com sub-inventário
        if (ammoItem.currentAmmo !== undefined && ammoItem.maxAmmo !== undefined) {
          const newCurrentAmmo = Math.max(0, ammoItem.currentAmmo - consumeAmount);
          
          // Se a munição acabou, remover o item do inventário
          if (newCurrentAmmo === 0) {
            delete updatedInventoryItems[parseInt(positionToUpdate)];
          } else {
            // Atualizar a quantidade atual de munição
            updatedInventoryItems[parseInt(positionToUpdate)] = {
              ...ammoItem,
              currentAmmo: newCurrentAmmo
            };
          }
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            }
          };
        }
      }
      
      // Esta lógica foi movida para o case RELOAD_WEAPON
      const equippedSlot = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)].id === action.itemId);
      
      if (equippedSlot) {
        const weapon = updatedEquippedItems[parseInt(equippedSlot)];
        
        // Verificar se é uma arma de fogo com munição
        if (weapon.type === 'Firearm' && weapon.currentAmmo !== undefined) {
          const newCurrentAmmo = Math.max(0, weapon.currentAmmo - consumeAmount);
          
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            currentAmmo: newCurrentAmmo
          };
          
          // Se for uma arma pesada, atualizar também a cópia na mão esquerda
          // Ou se estamos recarregando a partir da cópia, atualizar a cópia também
          if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                currentAmmo: newCurrentAmmo
              };
            }
          }
          
          // Se estamos recarregando via shadow, garantir que a shadow também seja atualizada
          if (isReloadingFromLeftHandCopy) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                currentAmmo: newCurrentAmmo
              };
            }
          }
          
          return {
            ...state,
            equippedItems: updatedEquippedItems
          };
        }
        
        // Verificar se é uma Revving Weapon com tanque
        if (weapon.type === 'Revving Weapon' && weapon.tanque !== undefined) {
          const newTanque = Math.max(0, weapon.tanque - consumeAmount);
          
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            tanque: newTanque
          };
          
          // Se for uma arma pesada, atualizar também a cópia na mão esquerda
          if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                tanque: newTanque
              };
            }
          }
          
          return {
            ...state,
            equippedItems: updatedEquippedItems
          };
        }
        
        // Verificar se é um item de munição equipado (caso raro)
        if (weapon.currentAmmo !== undefined && weapon.maxAmmo !== undefined) {
          const newCurrentAmmo = Math.max(0, weapon.currentAmmo - consumeAmount);
          
          // Se a munição acabou, não remover da equipagem, apenas zerar
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            currentAmmo: newCurrentAmmo
          };
          
          return {
            ...state,
            equippedItems: updatedEquippedItems
          };
        }
      }
      
      return state;
    }
    
    case 'LOAD_GAME_STATE': {
      return action.gameState;
    }
    
    case 'ADD_CUSTOM_CATALOG': {
      return {
        ...state,
        customCatalogs: [...state.customCatalogs, action.catalog]
      };
    }
    
    case 'REMOVE_CUSTOM_CATALOG': {
      return {
        ...state,
        customCatalogs: state.customCatalogs.filter(catalog => catalog.id !== action.catalogId)
      };
    }
    
    case 'RELOAD_WEAPON': {
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      let isReloadingFromLeftHandCopy = false;
      
      console.log('🔫 RELOAD_WEAPON iniciado para itemId:', action.itemId);
      
      // Bloquear recarga de armas de duas mãos através da shadow
      if (action.itemId.includes('_left_hand_copy')) {
        console.log('❌ Recarga bloqueada: não é possível recarregar armas de duas mãos através da shadow');
        return state;
      }
      
      // Função auxiliar para verificar compatibilidade de munição
      const isAmmoCompatible = (weaponAmmo: string, ammoType: string): boolean => {
        // Remover variações (AP, HP, INC, EXP) para comparação base
        const baseWeaponAmmo = weaponAmmo.replace(/ (AP|HP|INC|EXP)$/, '');
        const baseAmmoType = ammoType.replace(/ (AP|HP|INC|EXP)$/, '');
        return baseWeaponAmmo === baseAmmoType;
      };
      
      // Função auxiliar para encontrar munição específica ou compatível no inventário
      const findAmmoToUse = (weapon: Item, inventoryItems: typeof updatedInventoryItems) => {
        // Lógica especial para armas que usam arpão como munição
        if (weapon.ammo === 'Arpão') {
          // VERIFICAÇÃO OBRIGATÓRIA: só procurar arpão se houver munição selecionada
          if (!weapon.selectedAmmoId) {
            return undefined; // Forçar seleção de munição
          }
          
          // Procurar por arpões (armas corpo a corpo) no inventário
          return Object.keys(inventoryItems)
            .map(pos => ({ position: parseInt(pos), item: inventoryItems[parseInt(pos)] }))
            .find(({ item }) => 
              item.type === 'weapon' && 
              item.name && 
              (item.name.toLowerCase().includes('arpão') || item.name.toLowerCase().includes('arpao'))
            );
        }
        
        // VERIFICAÇÃO OBRIGATÓRIA: só permitir recarga se houver munição selecionada
        if (!weapon.selectedAmmoId) {
          return undefined; // Forçar seleção de munição para TODAS as armas
        }
        
        // Procurar pela munição específica selecionada
        const selectedAmmo = Object.keys(inventoryItems)
          .map(pos => ({ position: parseInt(pos), item: inventoryItems[parseInt(pos)] }))
          .find(({ item }) => 
            item.id === weapon.selectedAmmoId && 
            item.type === 'ammo' && 
            item.currentAmmo && 
            item.currentAmmo > 0
          );
        
        return selectedAmmo; // Retornar apenas a munição selecionada ou undefined
      };
      
      // Procurar no inventário
      const positionToUpdate = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.itemId);
      
      if (positionToUpdate) {
        const weapon = updatedInventoryItems[parseInt(positionToUpdate)];
        
        // Verificar se é uma arma de fogo ou gunblade com capacidade de munição
        if ((weapon.type === 'Firearm' || weapon.type === 'Gunblade') && weapon.maxAmmo !== undefined && weapon.ammo) {
          // 1) Verificar se há espaço no pente para recarregar
          const currentAmmo = weapon.currentAmmo || 0;
          const spaceInMagazine = weapon.maxAmmo - currentAmmo;
          
          if (spaceInMagazine <= 0) {
            // Pente já está cheio
            return state;
          }
          
          // 1.5) SEMPRE verificar se a arma tem munição selecionada - OBRIGATÓRIO
          if (!weapon.selectedAmmoId) {
            // Encontrar munições compatíveis disponíveis
            const availableAmmo = Object.keys(updatedInventoryItems)
              .map(pos => ({ position: parseInt(pos), item: updatedInventoryItems[parseInt(pos)] }))
              .filter(({ item }) => 
                item.type === 'ammo' && 
                item.currentAmmo && 
                item.currentAmmo > 0 && 
                isAmmoCompatible(weapon.ammo || '', item.ammo || '')
              );
            
            if (availableAmmo.length > 0) {
              // SEMPRE forçar seleção de munição - não permitir recarga sem seleção prévia
              return {
                ...state,
                showAmmoSelection: {
                  weaponId: weapon.id,
                  availableAmmo: availableAmmo.map(a => a.item)
                }
              };
            } else {
              // Não há munição compatível
              return state;
            }
          }
          
          // 2) Verificação removida - agora a verificação principal (1.5) já cobre todos os casos
          
          // Procurar munição selecionada ou compatível no inventário
          const compatibleAmmo = findAmmoToUse(weapon, updatedInventoryItems);
          
          if (!compatibleAmmo) {
            // Não há munição compatível
            return state;
          }
          
          // 3) Calcular quantas munições usar
          let ammoToUse: number;
          
          if (weapon.ammo === 'Arpão') {
            // Para armas que usam arpão, sempre usar 1 arpão por recarga
            ammoToUse = Math.min(spaceInMagazine, 1);
          } else {
            ammoToUse = Math.min(spaceInMagazine, compatibleAmmo.item.currentAmmo!);
          }
          
          // 4) Recarregar a arma (preservando selectedAmmoId e selectedAmmoType)
          updatedInventoryItems[parseInt(positionToUpdate)] = {
            ...weapon,
            currentAmmo: currentAmmo + ammoToUse,
            selectedAmmoId: weapon.selectedAmmoId,
            selectedAmmoType: weapon.selectedAmmoType
          };
          
          // Feedback sobre o tipo de munição recarregada (removido popup)
          const ammoTypeName = compatibleAmmo.item.name || weapon.selectedAmmoType || weapon.ammo;
          
          // 5) Remover munições da caixa ou excluir se acabou
          if (weapon.ammo === 'Arpão') {
            // Para arpões, remover o arpão inteiro do inventário
            delete updatedInventoryItems[compatibleAmmo.position];
          } else {
            const newAmmoCount = compatibleAmmo.item.currentAmmo! - ammoToUse;
            if (newAmmoCount <= 0) {
              // Excluir caixa vazia
              delete updatedInventoryItems[compatibleAmmo.position];
            } else {
              // Atualizar quantidade na caixa
              updatedInventoryItems[compatibleAmmo.position] = {
                ...compatibleAmmo.item,
                currentAmmo: newAmmoCount
              };
            }
          }
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            }
          };
        }
      }
      
      // Procurar nos itens equipados
      let equippedSlot = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)]?.id === action.itemId);
      
      // Se não encontrou, verificar se é uma cópia na mão esquerda e procurar a arma principal
      if (!equippedSlot && action.itemId.includes('_left_hand_copy')) {
        const originalId = action.itemId.replace('_left_hand_copy', '');
        equippedSlot = Object.keys(updatedEquippedItems)
          .find(slot => updatedEquippedItems[parseInt(slot)]?.id === originalId);
        isReloadingFromLeftHandCopy = true;
      }
      
      if (equippedSlot) {
        const weapon = updatedEquippedItems[parseInt(equippedSlot)];
        
        // Verificar se é uma arma de fogo ou gunblade com capacidade de munição
        if ((weapon.type === 'Firearm' || weapon.type === 'Gunblade') && weapon.maxAmmo !== undefined && weapon.ammo) {
          // 1) Verificar se há espaço no pente para recarregar
          const currentAmmo = weapon.currentAmmo || 0;
          const spaceInMagazine = weapon.maxAmmo - currentAmmo;
          
          if (spaceInMagazine <= 0) {
            // Pente já está cheio
            return state;
          }
          
          // 2) Procurar munição selecionada ou compatível no inventário
          const compatibleAmmo = findAmmoToUse(weapon, updatedInventoryItems);
          
          if (!compatibleAmmo) {
            // Não há munição compatível
            return state;
          }
          
          // 3) Calcular quantas munições usar
          let ammoToUse: number;
          
          if (weapon.ammo === 'Arpão') {
            // Para armas que usam arpão, sempre usar 1 arpão por recarga
            ammoToUse = Math.min(spaceInMagazine, 1);
          } else {
            ammoToUse = Math.min(spaceInMagazine, compatibleAmmo.item.currentAmmo!);
          }
          
          // 4) Recarregar a arma (preservando selectedAmmoId e selectedAmmoType)
          const newCurrentAmmo = currentAmmo + ammoToUse;
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            currentAmmo: newCurrentAmmo,
            selectedAmmoId: weapon.selectedAmmoId,
            selectedAmmoType: weapon.selectedAmmoType
          };
          
          // Feedback sobre o tipo de munição recarregada (removido popup)
          const ammoTypeName = compatibleAmmo.item.name || weapon.selectedAmmoType || weapon.ammo;
          
          // Se estamos recarregando via shadow, garantir que a arma principal também seja atualizada
          if (isReloadingFromLeftHandCopy) {
            updatedEquippedItems[parseInt(equippedSlot)] = {
              ...updatedEquippedItems[parseInt(equippedSlot)],
              currentAmmo: newCurrentAmmo,
              selectedAmmoId: weapon.selectedAmmoId,
              selectedAmmoType: weapon.selectedAmmoType
            };
          }
          
          // Se for uma arma pesada, atualizar também a cópia na mão esquerda
          if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                currentAmmo: newCurrentAmmo,
                selectedAmmoId: weapon.selectedAmmoId,
                selectedAmmoType: weapon.selectedAmmoType
              };
            }
          }
          
          // 5) Remover munições da caixa ou excluir se acabou
          if (weapon.ammo === 'Arpão') {
            // Para arpões, remover o arpão inteiro do inventário
            delete updatedInventoryItems[compatibleAmmo.position];
          } else {
            const newAmmoCount = compatibleAmmo.item.currentAmmo! - ammoToUse;
            if (newAmmoCount <= 0) {
              // Excluir caixa vazia
              delete updatedInventoryItems[compatibleAmmo.position];
            } else {
              // Atualizar quantidade na caixa
              updatedInventoryItems[compatibleAmmo.position] = {
                ...compatibleAmmo.item,
                currentAmmo: newAmmoCount
              };
            }
          }
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            },
            equippedItems: updatedEquippedItems
          };
        }
      }
      
      return state;
    }
    
    case 'REFUEL_WEAPON': {
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      
      // Procurar no inventário
      const positionToUpdate = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.itemId);
      
      if (positionToUpdate) {
        const weapon = updatedInventoryItems[parseInt(positionToUpdate)];
        
        // Verificar se é uma Revving Weapon com capacidade de tanque
        if (weapon.type === 'Revving Weapon' && weapon.maxTanque !== undefined) {
          // Reabastecer completamente a arma
          updatedInventoryItems[parseInt(positionToUpdate)] = {
            ...weapon,
            tanque: weapon.maxTanque
          };
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            }
          };
        }
      }
      
      // Procurar nos itens equipados
      const equippedSlot = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)]?.id === action.itemId);
      
      if (equippedSlot) {
        const weapon = updatedEquippedItems[parseInt(equippedSlot)];
        
        // Verificar se é uma Revving Weapon com capacidade de tanque
        if (weapon.type === 'Revving Weapon' && weapon.maxTanque !== undefined) {
          // Reabastecer completamente a arma
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            tanque: weapon.maxTanque
          };
          
          // Se for uma arma pesada, atualizar também a cópia na mão esquerda
          if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                tanque: weapon.maxTanque
              };
            }
          }
          
          return {
            ...state,
            equippedItems: updatedEquippedItems
          };
        }
      }
      
      return state;
    }
    
    case 'SET_WEAPON_AMMO': {
      const updatedInventoryItems = { ...state.inventory.items };
      const updatedEquippedItems = { ...state.equippedItems };
      
      // Procurar no inventário
      const inventoryPosition = Object.keys(updatedInventoryItems)
        .find(pos => updatedInventoryItems[parseInt(pos)].id === action.weaponId);
      
      if (inventoryPosition) {
        const weapon = updatedInventoryItems[parseInt(inventoryPosition)];
        
        // VERIFICAÇÃO: Se a arma está carregada e mudando tipo de munição, devolver munição atual
        if (weapon.currentAmmo && weapon.currentAmmo > 0 && weapon.selectedAmmoId !== action.ammoId) {
          // Encontrar uma posição vazia no inventário para devolver a munição
          const emptyPosition = Object.keys(Array.from({ length: 100 }, (_, i) => i))
            .find(pos => !updatedInventoryItems[parseInt(pos)]);
          
          if (emptyPosition && weapon.selectedAmmoType) {
            // Criar item de munição para devolver ao inventário
            const returnedAmmo: Item = {
              id: `returned_ammo_${Date.now()}`,
              type: 'ammo',
              name: weapon.selectedAmmoType,
              ammo: weapon.selectedAmmoType,
              currentAmmo: weapon.currentAmmo,
              maxAmmo: weapon.currentAmmo,
              weight_kg: 0.1 * weapon.currentAmmo,
              price_db: calculateAmmoPrice(weapon.selectedAmmoType, weapon.currentAmmo)
            };
            
            updatedInventoryItems[parseInt(emptyPosition)] = returnedAmmo;
          }
        }
        
        updatedInventoryItems[parseInt(inventoryPosition)] = {
          ...weapon,
          selectedAmmoId: action.ammoId,
          selectedAmmoType: action.ammoType,
          currentAmmo: weapon.selectedAmmoId !== action.ammoId ? 0 : weapon.currentAmmo // Zerar munição se mudou tipo
        };
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: updatedInventoryItems
          },
          showAmmoSelection: undefined // Limpar seleção após definir munição
        };
      }
      
      // Procurar nos itens equipados
      const equippedSlot = Object.keys(updatedEquippedItems)
        .find(slot => updatedEquippedItems[parseInt(slot)]?.id === action.weaponId);
      
      if (equippedSlot) {
        const weapon = updatedEquippedItems[parseInt(equippedSlot)];
        
        // VERIFICAÇÃO: Se a arma está carregada e mudando tipo de munição, devolver munição atual
        if (weapon.currentAmmo && weapon.currentAmmo > 0 && weapon.selectedAmmoId !== action.ammoId) {
          // Encontrar uma posição vazia no inventário para devolver a munição
          const emptyPosition = Object.keys(Array.from({ length: 100 }, (_, i) => i))
            .find(pos => !updatedInventoryItems[parseInt(pos)]);
          
          if (emptyPosition && weapon.selectedAmmoType) {
            // Criar item de munição para devolver ao inventário
            const returnedAmmo: Item = {
              id: `returned_ammo_${Date.now()}`,
              type: 'ammo',
              name: weapon.selectedAmmoType,
              ammo: weapon.selectedAmmoType,
              currentAmmo: weapon.currentAmmo,
              maxAmmo: weapon.currentAmmo,
              weight_kg: 0.1 * weapon.currentAmmo,
              price_db: calculateAmmoPrice(weapon.selectedAmmoType, weapon.currentAmmo)
            };
            
            updatedInventoryItems[parseInt(emptyPosition)] = returnedAmmo;
          }
        }
        
        const newCurrentAmmo = weapon.selectedAmmoId !== action.ammoId ? 0 : weapon.currentAmmo;
        
        updatedEquippedItems[parseInt(equippedSlot)] = {
          ...weapon,
          selectedAmmoId: action.ammoId,
          selectedAmmoType: action.ammoType,
          currentAmmo: newCurrentAmmo
        };
        
        // Se for uma arma pesada, atualizar também a cópia na mão esquerda
        if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
          const leftHandCopy = updatedEquippedItems[0];
          if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
            updatedEquippedItems[0] = {
              ...leftHandCopy,
              selectedAmmoId: action.ammoId,
              selectedAmmoType: action.ammoType,
              currentAmmo: newCurrentAmmo
            };
          }
        }
        
        return {
          ...state,
          inventory: {
            ...state.inventory,
            items: updatedInventoryItems
          },
          equippedItems: updatedEquippedItems,
          showAmmoSelection: undefined // Limpar seleção após definir munição
        };
      }
      
      return state;
    }
    
    case 'UNLOAD_WEAPON': {
      const { itemId } = action;
      
      // Procurar a arma no inventário
      const inventoryPosition = Object.keys(state.inventory.items).find(
        key => state.inventory.items[parseInt(key)].id === itemId
      );
      
      if (inventoryPosition) {
        const weapon = state.inventory.items[parseInt(inventoryPosition)];
        
        if (weapon.currentAmmo && weapon.currentAmmo > 0 && weapon.selectedAmmoType) {
          const updatedInventoryItems = { ...state.inventory.items };
          
          // Procurar uma caixa de munição existente do mesmo tipo
          const existingAmmoPosition = Object.keys(updatedInventoryItems).find(key => {
            const item = updatedInventoryItems[parseInt(key)];
            return item.type === 'ammo' && 
                   item.ammo === weapon.selectedAmmoType && 
                   item.currentAmmo !== undefined && 
                   item.maxAmmo !== undefined &&
                   item.currentAmmo < item.maxAmmo;
          });
          
          if (existingAmmoPosition) {
            // Adicionar munição à caixa existente
            const existingAmmo = updatedInventoryItems[parseInt(existingAmmoPosition)];
            const spaceAvailable = existingAmmo.maxAmmo! - existingAmmo.currentAmmo!;
            const ammoToAdd = Math.min(weapon.currentAmmo, spaceAvailable);
            const remainingAmmo = weapon.currentAmmo - ammoToAdd;
            
            updatedInventoryItems[parseInt(existingAmmoPosition)] = {
              ...existingAmmo,
              currentAmmo: existingAmmo.currentAmmo! + ammoToAdd
            };
            
            // Se ainda sobrou munição, criar uma nova caixa
            if (remainingAmmo > 0) {
              const emptyPosition = findEmptyInventorySlot(updatedInventoryItems, state.inventory.slots);
              if (emptyPosition !== null) {
                updatedInventoryItems[emptyPosition] = {
                  id: `ammo_${weapon.selectedAmmoType}_${Date.now()}`,
                  name: `Munição ${weapon.selectedAmmoType}`,
                  type: 'ammo',
                  ammo: weapon.selectedAmmoType,
                  currentAmmo: remainingAmmo,
                  maxAmmo: 50, // Valor padrão
                  weight_kg: 0.1 * remainingAmmo,
                  price_db: calculateAmmoPrice(weapon.selectedAmmoType, remainingAmmo)
                };
              }
            }
          } else {
            // Criar uma nova caixa de munição
            const emptyPosition = findEmptyInventorySlot(updatedInventoryItems, state.inventory.slots);
            if (emptyPosition !== null) {
              updatedInventoryItems[emptyPosition] = {
                id: `ammo_${weapon.selectedAmmoType}_${Date.now()}`,
                name: `Munição ${weapon.selectedAmmoType}`,
                type: 'ammo',
                ammo: weapon.selectedAmmoType,
                currentAmmo: weapon.currentAmmo,
                maxAmmo: 50, // Valor padrão
                weight_kg: 0.1 * weapon.currentAmmo,
                price_db: calculateAmmoPrice(weapon.selectedAmmoType, weapon.currentAmmo)
              };
            }
          }
          
          // Descarregar a arma
          updatedInventoryItems[parseInt(inventoryPosition)] = {
            ...weapon,
            currentAmmo: 0
          };
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            }
          };
        }
      }
      
      // Procurar a arma nos itens equipados
      const equippedSlot = Object.keys(state.equippedItems).find(
        key => state.equippedItems[parseInt(key)].id === itemId
      );
      
      if (equippedSlot) {
        const weapon = state.equippedItems[parseInt(equippedSlot)];
        
        if (weapon.currentAmmo && weapon.currentAmmo > 0 && weapon.selectedAmmoType) {
          const updatedInventoryItems = { ...state.inventory.items };
          const updatedEquippedItems = { ...state.equippedItems };
          
          // Procurar uma caixa de munição existente do mesmo tipo
          const existingAmmoPosition = Object.keys(updatedInventoryItems).find(key => {
            const item = updatedInventoryItems[parseInt(key)];
            return item.type === 'ammo' && 
                   item.ammo === weapon.selectedAmmoType && 
                   item.currentAmmo !== undefined && 
                   item.maxAmmo !== undefined &&
                   item.currentAmmo < item.maxAmmo;
          });
          
          if (existingAmmoPosition) {
            // Adicionar munição à caixa existente
            const existingAmmo = updatedInventoryItems[parseInt(existingAmmoPosition)];
            const spaceAvailable = existingAmmo.maxAmmo! - existingAmmo.currentAmmo!;
            const ammoToAdd = Math.min(weapon.currentAmmo, spaceAvailable);
            const remainingAmmo = weapon.currentAmmo - ammoToAdd;
            
            updatedInventoryItems[parseInt(existingAmmoPosition)] = {
              ...existingAmmo,
              currentAmmo: existingAmmo.currentAmmo! + ammoToAdd
            };
            
            // Se ainda sobrou munição, criar uma nova caixa
            if (remainingAmmo > 0) {
              const emptyPosition = findEmptyInventorySlot(updatedInventoryItems, state.inventory.slots);
              if (emptyPosition !== null) {
                updatedInventoryItems[emptyPosition] = {
                  id: `ammo_${weapon.selectedAmmoType}_${Date.now()}`,
                  name: `Munição ${weapon.selectedAmmoType}`,
                  type: 'ammo',
                  ammo: weapon.selectedAmmoType,
                  currentAmmo: remainingAmmo,
                  maxAmmo: 50, // Valor padrão
                  weight_kg: 0.1 * remainingAmmo,
                  price_db: calculateAmmoPrice(weapon.selectedAmmoType, remainingAmmo)
                };
              }
            }
          } else {
            // Criar uma nova caixa de munição
            const emptyPosition = findEmptyInventorySlot(updatedInventoryItems, state.inventory.slots);
            if (emptyPosition !== null) {
              updatedInventoryItems[emptyPosition] = {
                id: `ammo_${weapon.selectedAmmoType}_${Date.now()}`,
                name: `Munição ${weapon.selectedAmmoType}`,
                type: 'ammo',
                ammo: weapon.selectedAmmoType,
                currentAmmo: weapon.currentAmmo,
                maxAmmo: 50, // Valor padrão
                weight_kg: 0.1 * weapon.currentAmmo,
                price_db: calculateAmmoPrice(weapon.selectedAmmoType, weapon.currentAmmo)
              };
            }
          }
          
          // Descarregar a arma
          updatedEquippedItems[parseInt(equippedSlot)] = {
            ...weapon,
            currentAmmo: 0
          };
          
          // Se for uma arma pesada, atualizar também a cópia na mão esquerda
          if (weapon.weight_kg > 2.5 && parseInt(equippedSlot) === 1) {
            const leftHandCopy = updatedEquippedItems[0];
            if (leftHandCopy && leftHandCopy.id.includes('_left_hand_copy')) {
              updatedEquippedItems[0] = {
                ...leftHandCopy,
                currentAmmo: 0
              };
            }
          }
          
          return {
            ...state,
            inventory: {
              ...state.inventory,
              items: updatedInventoryItems
            },
            equippedItems: updatedEquippedItems
          };
        }
      }
      
      return state;
    }
    
    case 'CLEAR_AMMO_SELECTION': {
      return {
        ...state,
        showAmmoSelection: undefined
      };
    }
    
    default:
      return state;
  }
}



export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const getTotalWeight = () => {
    return Object.values(state.inventory.items).reduce((total, item) => {
      // Para munições, o weight_kg já é o peso da caixa completa, não multiplicar por qty
      const multiplier = item.type === 'ammo' ? 1 : (item.qty || 1);
      return total + (item.weight_kg * multiplier);
    }, 0);
  };
  
  const getEquippedWeight = () => {
    return Object.values(state.equippedItems).reduce((total, item) => {
      // Não contar cópias de armas pesadas na mão esquerda para evitar duplicação
      if (item.isLeftHandCopy) return total;
      // Para munições, o weight_kg já é o peso da caixa completa, não multiplicar por qty
      const multiplier = item.type === 'ammo' ? 1 : (item.qty || 1);
      return total + (item.weight_kg * multiplier);
    }, 0);
  };
  
  const getTotalCharacterWeight = () => {
    return getTotalWeight() + getEquippedWeight();
  };
  
  return (
    <GameContext.Provider value={{ state, dispatch, getTotalWeight, getEquippedWeight, getTotalCharacterWeight }}>
      {children}
    </GameContext.Provider>
  );
}