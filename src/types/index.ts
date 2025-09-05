export interface Item {
  id: string;
  name: string;
  description?: string;
  type: string;
  damage?: string;
  ammo?: string;
  magazine?: string;
  rate?: string;
  range_m?: number;
  weight_kg: number;
  price_db: number;
  icon?: string;
  notes?: string;
  qty?: number;
  isLeftHandCopy?: boolean; // Para identificar cópias de armas pesadas na mão esquerda
  // Propriedades para sistema de sub-inventário de munições
  currentAmmo?: number; // Munições restantes na caixa
  maxAmmo?: number; // Capacidade total da caixa
  // Propriedades para Revving Weapons
  motorizado?: string | number; // Dano extra quando ativada
  tanque?: number; // Usos disponíveis antes de recarregar
  maxTanque?: number; // Capacidade máxima do tanque
  // Propriedades para Gunblades
  gunblade?: string | number; // Dano extra da gunblade
  selectedAmmoId?: string; // ID da munição selecionada para a arma
  selectedAmmoType?: string; // Tipo da munição selecionada
  // Propriedades para Armaduras
  armorClass?: number; // Classe de Armadura (CA)
  armorType?: string; // Tipo de armadura (Leve, Média, Pesada)
  strengthRequirement?: number; // Requisito de força
  stealthModifier?: number; // Modificador de furtividade
  // Propriedades para Stack de Itens
  stackQuantity?: number; // Quantidade de itens empilhados (para caixas de munição)
}

export interface Wallet {
  currency: string;
  balance: number;
}

export interface Inventory {
  slots: number;
  maxWeight: number; // Peso máximo da mochila em kg
  items: { [position: number]: Item }; // Mapeamento posição -> item
}

export interface StorageBank {
  items: Item[];
}

export interface Catalog {
  id: string;
  name: string;
  items: Item[];
}

export interface GameState {
  wallet: Wallet;
  inventory: Inventory;
  storageBank: StorageBank;
  equippedItems: { [slotIndex: number]: Item }; // Mapeamento dos itens equipados por slot (máximo 8 slots)
  customCatalogs: Catalog[]; // Catálogos personalizados adicionados pelo usuário
  totalMaxWeight?: number; // Peso máximo total do personagem (equipamentos + mochila)
  showAmmoSelection?: {
    weaponId: string;
    availableAmmo: Item[];
  }; // Estado para mostrar modal de seleção de munição
}

export interface DragItem {
  type: string;
  item: Item;
  source: 'inventory' | 'storage' | 'catalog' | 'equipment';
  index?: number;
}

export interface DropResult {
  target: 'inventory' | 'storage' | 'trash' | 'equipment';
  index?: number;
}

// Tipo para refs do react-dnd
export type DndRef = (element: HTMLElement | null) => void;

// Tipo para ações do jogo
export type GameAction = 
  | { type: 'RELOAD_WEAPON'; itemId: string }
  | { type: 'REFUEL_WEAPON'; itemId: string }
  | { type: 'SET_WEAPON_AMMO'; weaponId: string; ammoId: string; ammoType: string }
  | { type: 'UNLOAD_WEAPON'; itemId: string };