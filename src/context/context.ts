import { createContext } from 'react';
import type { GameState, Item, Catalog } from '../types';

type GameAction =
  | { type: 'ADD_ITEM_TO_INVENTORY'; item: Item }
  | { type: 'ADD_ITEM_TO_STORAGE'; item: Item }
  | { type: 'REMOVE_ITEM_FROM_INVENTORY'; itemId: string }
  | { type: 'REMOVE_ITEM_FROM_STORAGE'; itemId: string }
  | { type: 'MOVE_ITEM_TO_STORAGE'; itemId: string }
  | { type: 'MOVE_ITEM_TO_INVENTORY'; itemId: string }
  | { type: 'REORDER_INVENTORY'; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_WALLET'; amount: number }
  | { type: 'UPDATE_MAX_WEIGHT'; maxWeight: number }
  | { type: 'UPDATE_TOTAL_MAX_WEIGHT'; maxWeight: number }
  | { type: 'UPDATE_ITEM'; item: Item }
  | { type: 'EQUIP_ITEM'; item: Item }
  | { type: 'EQUIP_ITEM_TO_SLOT'; item: Item; slotIndex: number }
  | { type: 'UNEQUIP_ITEM'; item: Item }
  | { type: 'SELL_ITEM'; itemId: string }
  | { type: 'DISCARD_ITEM'; itemId: string }
  | { type: 'CONSUME_AMMO'; itemId: string; amount?: number }
  | { type: 'RELOAD_WEAPON'; itemId: string }
  | { type: 'REFUEL_WEAPON'; itemId: string }
  | { type: 'SET_WEAPON_AMMO'; weaponId: string; ammoId: string; ammoType: string }
  | { type: 'CLEAR_AMMO_SELECTION' }
  | { type: 'LOAD_GAME_STATE'; gameState: GameState }
  | { type: 'ADD_CUSTOM_CATALOG'; catalog: Catalog }
  | { type: 'REMOVE_CUSTOM_CATALOG'; catalogId: string };

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getTotalWeight: () => number;
  getEquippedWeight: () => number;
  getTotalCharacterWeight: () => number;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);
export type { GameAction, GameContextType };