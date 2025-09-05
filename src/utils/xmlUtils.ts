import type { GameState, Item } from '../types';

export const exportToXML = (gameState: GameState): string => {
  const formatItem = (item: Item): string => {
    return `    <item>
      <id>${escapeXML(item.id)}</id>
      <name>${escapeXML(item.name)}</name>
      <type>${escapeXML(item.type)}</type>
      <notes>${escapeXML(item.notes || '')}</notes>
      <price_db>${item.price_db}</price_db>
      <weight_kg>${item.weight_kg}</weight_kg>
      <qty>${item.qty || 1}</qty>
      ${item.damage ? `<damage>${escapeXML(item.damage)}</damage>` : ''}
      ${item.ammo ? `<ammo>${escapeXML(item.ammo)}</ammo>` : ''}
      ${item.magazine ? `<magazine>${escapeXML(item.magazine)}</magazine>` : ''}
      ${item.rate ? `<rate>${escapeXML(item.rate)}</rate>` : ''}
      ${item.range_m ? `<range_m>${item.range_m}</range_m>` : ''}
      ${item.icon ? `<icon>${escapeXML(item.icon)}</icon>` : ''}
      ${item.currentAmmo !== undefined ? `<currentAmmo>${item.currentAmmo}</currentAmmo>` : ''}
      ${item.maxAmmo !== undefined ? `<maxAmmo>${item.maxAmmo}</maxAmmo>` : ''}
      ${item.tanque !== undefined ? `<tanque>${item.tanque}</tanque>` : ''}
      ${item.maxTanque !== undefined ? `<maxTanque>${item.maxTanque}</maxTanque>` : ''}
      ${item.motorizado !== undefined ? `<motorizado>${escapeXML(String(item.motorizado))}</motorizado>` : ''}
      ${item.isLeftHandCopy !== undefined ? `<isLeftHandCopy>${item.isLeftHandCopy}</isLeftHandCopy>` : ''}
      ${item.armorClass !== undefined ? `<armorClass>${item.armorClass}</armorClass>` : ''}
      ${item.armorType ? `<armorType>${escapeXML(item.armorType)}</armorType>` : ''}
      ${item.strengthRequirement !== undefined ? `<strengthRequirement>${item.strengthRequirement}</strengthRequirement>` : ''}
      ${item.stealthModifier !== undefined ? `<stealthModifier>${item.stealthModifier}</stealthModifier>` : ''}
    </item>`;
  };

  const inventoryItems = Object.values(gameState.inventory.items).map(formatItem).join('\n');
  const storageItems = gameState.storageBank.items.map(formatItem).join('\n');
  const equippedItems = Object.entries(gameState.equippedItems)
    .map(([slot, item]) => `    <equippedItem slot="${slot}">
${formatItem(item)}
    </equippedItem>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gamestate>
  <wallet>
    <currency>${escapeXML(gameState.wallet.currency)}</currency>
    <balance>${gameState.wallet.balance}</balance>
  </wallet>
  <inventory>
    <slots>${gameState.inventory.slots}</slots>
    <maxWeight>${gameState.inventory.maxWeight}</maxWeight>
    <items>
${inventoryItems}
    </items>
  </inventory>
  <storagebank>
    <items>
${storageItems}
    </items>
  </storagebank>
  <equippedItems>
${equippedItems}
  </equippedItems>
</gamestate>`;
};

export const importFromXML = (xmlString: string): GameState | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Verificar se há erros de parsing
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML inválido');
    }

    const gameStateElement = xmlDoc.querySelector('gamestate');
    if (!gameStateElement) {
      throw new Error('Elemento gamestate não encontrado');
    }

    // Extrair dados da carteira
    const walletElement = gameStateElement.querySelector('wallet');
    const wallet = {
      currency: walletElement?.querySelector('currency')?.textContent || 'DB$',
      balance: parseFloat(walletElement?.querySelector('balance')?.textContent || '0')
    };

    // Extrair dados do inventário
    const inventoryElement = gameStateElement.querySelector('inventory');
    const inventorySlots = parseInt(inventoryElement?.querySelector('slots')?.textContent || '24');
    const inventoryMaxWeight = parseFloat(inventoryElement?.querySelector('maxWeight')?.textContent || '30');
    const inventoryItemsElement = inventoryElement?.querySelector('items');
    const inventoryItemsArray = parseItems(inventoryItemsElement || null);
    
    // Converter array para objeto com posições
    const inventoryItems: { [position: number]: Item } = {};
    inventoryItemsArray.forEach((item, index) => {
      inventoryItems[index] = item;
    });

    // Extrair dados do banco de armazenamento
    const storageBankElement = gameStateElement.querySelector('storagebank');
    const storageItemsElement = storageBankElement?.querySelector('items');
    const storageItems = parseItems(storageItemsElement || null);

    // Extrair itens equipados
    const equippedItemsElement = gameStateElement.querySelector('equippedItems');
    const equippedItems: { [slotIndex: number]: Item } = {};
    if (equippedItemsElement) {
      const equippedItemElements = equippedItemsElement.querySelectorAll('equippedItem');
      equippedItemElements.forEach(element => {
        const slot = element.getAttribute('slot');
        if (slot) {
          // Buscar o elemento <item> dentro do <equippedItem>
          const itemElement = element.querySelector('item');
          if (itemElement) {
            // Processar o item completo usando a função parseItems
            const equippedItemsArray = parseItems(element);
            if (equippedItemsArray.length > 0) {
              equippedItems[parseInt(slot)] = equippedItemsArray[0];
            }
          }
        }
      });
    }

    return {
      wallet,
      inventory: {
        slots: inventorySlots,
        maxWeight: inventoryMaxWeight,
        items: inventoryItems
      },
      storageBank: {
        items: storageItems
      },
      equippedItems: equippedItems,
      customCatalogs: [] // Inicializar com array vazio para evitar erro de .map()
    };
  } catch (error) {
    console.error('Erro ao importar XML:', error);
    return null;
  }
};

const parseItems = (itemsElement: Element | null): Item[] => {
  if (!itemsElement) return [];
  
  const itemElements = itemsElement.querySelectorAll('item');
  const items: Item[] = [];

  itemElements.forEach(itemElement => {
    const item: Item = {
      id: itemElement.querySelector('id')?.textContent || '',
      name: itemElement.querySelector('name')?.textContent || '',
      type: itemElement.querySelector('type')?.textContent || '',
      notes: itemElement.querySelector('notes')?.textContent || undefined,
      price_db: parseFloat(itemElement.querySelector('price_db')?.textContent || '0'),
      weight_kg: parseFloat(itemElement.querySelector('weight_kg')?.textContent || '0'),
      qty: parseInt(itemElement.querySelector('qty')?.textContent || '1'),
      damage: itemElement.querySelector('damage')?.textContent || undefined,
      ammo: itemElement.querySelector('ammo')?.textContent || undefined,
      magazine: itemElement.querySelector('magazine')?.textContent || undefined,
      rate: itemElement.querySelector('rate')?.textContent || undefined,
      range_m: parseInt(itemElement.querySelector('range_m')?.textContent || '0') || undefined,
      icon: itemElement.querySelector('icon')?.textContent || undefined,
      currentAmmo: itemElement.querySelector('currentAmmo')?.textContent !== null ? parseInt(itemElement.querySelector('currentAmmo')?.textContent || '0') : undefined,
      maxAmmo: itemElement.querySelector('maxAmmo')?.textContent !== null ? parseInt(itemElement.querySelector('maxAmmo')?.textContent || '0') : undefined,
      tanque: itemElement.querySelector('tanque')?.textContent !== null ? parseInt(itemElement.querySelector('tanque')?.textContent || '0') : undefined,
      maxTanque: itemElement.querySelector('maxTanque')?.textContent !== null ? parseInt(itemElement.querySelector('maxTanque')?.textContent || '0') : undefined,
      motorizado: itemElement.querySelector('motorizado')?.textContent || undefined,
      isLeftHandCopy: itemElement.querySelector('isLeftHandCopy')?.textContent === 'true' ? true : undefined,
      armorClass: itemElement.querySelector('armorClass')?.textContent ? parseInt(itemElement.querySelector('armorClass')?.textContent || '0') : undefined,
      armorType: itemElement.querySelector('armorType')?.textContent || undefined,
      strengthRequirement: itemElement.querySelector('strengthRequirement')?.textContent ? parseInt(itemElement.querySelector('strengthRequirement')?.textContent || '0') : undefined,
      stealthModifier: itemElement.querySelector('stealthModifier')?.textContent ? parseInt(itemElement.querySelector('stealthModifier')?.textContent || '0') : undefined
    };

    // Remover propriedades undefined para manter o objeto limpo
    Object.keys(item).forEach(key => {
      if (item[key as keyof Item] === undefined) {
        delete item[key as keyof Item];
      }
    });

    items.push(item);
  });

  return items;
};

const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const downloadXML = (xmlContent: string, filename: string = 'gamestate.xml'): void => {
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadXML = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xml';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsText(file);
      } else {
        reject(new Error('Nenhum arquivo selecionado'));
      }
    };
    input.click();
  });
};