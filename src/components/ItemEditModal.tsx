import React, { useState, useRef, useEffect } from 'react';
import type { Item } from '../types';
import IconGrid from './IconGrid';

interface ItemEditModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: Item) => void;
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, isOpen, onClose, onSave }) => {
  // Tipos de itens para RPG
  const itemTypes = [
    { value: 'weapon', label: '🗡️ Arma', description: 'Armas corpo a corpo e à distância' },
    { value: 'ammo', label: '🔫 Munição', description: 'Munições e projéteis' },
    { value: 'armor', label: '🛡️ Armadura', description: 'Armaduras e proteções' },
    { value: 'consumable', label: '🧪 Consumível', description: 'Poções, comida, medicamentos' },
    { value: 'tool', label: '🔧 Ferramenta', description: 'Ferramentas e equipamentos utilitários' },
    { value: 'accessory', label: '💍 Acessório', description: 'Anéis, colares, amuletos' },
    { value: 'material', label: '⚒️ Material', description: 'Materiais de crafting e componentes' },
    { value: 'book', label: '📚 Livro/Documento', description: 'Livros, mapas, pergaminhos' },
    { value: 'container', label: '🎒 Recipiente', description: 'Bolsas, frascos, caixas' },
    { value: 'treasure', label: '💎 Tesouro', description: 'Gemas, moedas, objetos valiosos' },
    { value: 'key', label: '🗝️ Chave/Acesso', description: 'Chaves, cartões de acesso, senhas' },
    { value: 'vehicle', label: '🚗 Veículo', description: 'Veículos e montarias' },
    { value: 'electronic', label: '📱 Eletrônico', description: 'Dispositivos eletrônicos e gadgets' },
    { value: 'clothing', label: '👕 Vestimenta', description: 'Roupas e acessórios de vestuário' },
    { value: 'misc', label: '📦 Outros', description: 'Itens diversos' }
  ];

  const defaultItem: Item = {
    id: `item_${Date.now()}`,
    name: '',
    type: 'misc',
    weight_kg: 0,
    price_db: 0,
    qty: 1,
    notes: ''
  };
  
  const [editedItem, setEditedItem] = useState<Item>(item || defaultItem);
  const [iconPreview, setIconPreview] = useState<string | null>(item?.icon || null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para obter ícone padrão baseado no tipo
  const getDefaultIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      weapon: '⚔️',
      ammo: '🔫',
      armor: '🛡️',
      consumable: '🧪',
      tool: '🔧',
      accessory: '💍',
      material: '⚒️',
      book: '📚',
      container: '🎒',
      treasure: '💎',
      key: '🗝️',
      vehicle: '🚗',
      electronic: '📱',
      clothing: '👕',
      misc: '📦'
    };
    return iconMap[type] || '📦';
  };

  // Função para obter valores padrão baseados no tipo
  const getDefaultValues = (type: string) => {
    const defaults: { [key: string]: Partial<Item> } = {
      weapon: { weight_kg: 2.0, price_db: 500 },
      ammo: { weight_kg: 0.1, price_db: 10, qty: 50 },
      armor: { weight_kg: 5.0, price_db: 1000 },
      consumable: { weight_kg: 0.2, price_db: 25, qty: 1 },
      tool: { weight_kg: 1.0, price_db: 100 },
      accessory: { weight_kg: 0.1, price_db: 200 },
      material: { weight_kg: 0.5, price_db: 15, qty: 10 },
      book: { weight_kg: 0.3, price_db: 50 },
      container: { weight_kg: 0.5, price_db: 75 },
      treasure: { weight_kg: 0.1, price_db: 1000 },
      key: { weight_kg: 0.05, price_db: 0 },
      vehicle: { weight_kg: 1000.0, price_db: 50000 },
      electronic: { weight_kg: 0.3, price_db: 300 },
      clothing: { weight_kg: 0.8, price_db: 150 },
      misc: { weight_kg: 0.5, price_db: 50 }
    };
    return defaults[type] || { weight_kg: 0.5, price_db: 50, qty: 1 };
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  // Sincronizar estado quando o item prop muda
  useEffect(() => {
    if (item) {
      setEditedItem(item);
      setIconPreview(item.icon || null);
    } else {
      setEditedItem(defaultItem);
      setIconPreview(null);
    }
  }, [item]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  if (!shouldRender) return null;

  const handleInputChange = (field: keyof Item, value: string | number) => {
    setEditedItem((prev: Item) => {
      const updated = {
        ...prev,
        [field]: value
      };

      // Se mudou o tipo, aplicar valores padrão
      if (field === 'type' && typeof value === 'string') {
        const defaults = getDefaultValues(value);
        const defaultIcon = getDefaultIcon(value);
        
        // Só aplicar defaults se for um item novo (sem item original)
        if (!item) {
          Object.assign(updated, defaults);
          if (!iconPreview) {
            setIconPreview(defaultIcon);
            updated.icon = defaultIcon;
          }
        }
      }

      return updated;
    });
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Verificar tamanho (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setIconPreview(result);
        handleInputChange('icon', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validações básicas
    if (!editedItem.name.trim()) {
      alert('O nome do item é obrigatório.');
      return;
    }

    if (editedItem.price_db < 0) {
      alert('O preço não pode ser negativo.');
      return;
    }

    if (editedItem.weight_kg < 0) {
      alert('O peso não pode ser negativo.');
      return;
    }

    if ((editedItem.qty || 1) < 1) {
      alert('A quantidade deve ser pelo menos 1.');
      return;
    }

    // Garantir que o ícone seja incluído no item salvo
    const itemToSave = {
      ...editedItem,
      icon: iconPreview || editedItem.icon
    };

    onSave(itemToSave);
    handleClose();
  };

  const handleRemoveIcon = () => {
    setIconPreview(null);
    handleInputChange('icon', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIconSelect = (iconPath: string) => {
    setIconPreview(iconPath);
    handleInputChange('icon', iconPath);
    setShowIconGrid(false);
  };

  const handleShowIconGrid = () => {
    setShowIconGrid(true);
  };

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-[9999999] transition-all duration-300 ease-out ${
      isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
    }`}>
      <div className={`bg-gray-900 border border-yellow-600 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
        isAnimating 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-4'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-400">{item ? 'Editar Item' : 'Adicionar Item'}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ícone
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 border border-gray-600 rounded flex items-center justify-center">
                {iconPreview ? (
                  <img 
                    src={iconPreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-500 text-xs">Sem ícone</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleShowIconGrid}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Ícones predefinidos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Upload personalizado
                </button>
                {iconPreview && (
                  <button
                    onClick={handleRemoveIcon}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tipo de Item */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Item *
            </label>
            <select
              value={editedItem.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
            >
              {itemTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {itemTypes.find(t => t.value === editedItem.type)?.description}
            </p>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={editedItem.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              placeholder="Nome do item"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={editedItem.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none h-20 resize-none"
              placeholder="Descrição do item"
            />
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preço (DB$)
            </label>
            <input
              type="number"
              value={editedItem.price_db}
              onChange={(e) => handleInputChange('price_db', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              min="0"
              step="0.01"
            />
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={editedItem.weight_kg}
              onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              min="0"
              step="0.1"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantidade
            </label>
            <input
              type="number"
              value={editedItem.qty || 1}
              onChange={(e) => handleInputChange('qty', parseInt(e.target.value) || 1)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              min="1"
            />
          </div>

          {/* Campos específicos por tipo */}
          {editedItem.type === 'weapon' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Munição
                </label>
                <input
                  type="text"
                  value={editedItem.ammo || ''}
                  onChange={(e) => handleInputChange('ammo', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Ex: 9mm, .45 ACP, 5.56mm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacidade do Pente
                </label>
                <input
                  type="number"
                  value={editedItem.maxAmmo || 0}
                  onChange={(e) => handleInputChange('maxAmmo', parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  min="0"
                  placeholder="Capacidade máxima de munição"
                />
              </div>
            </>
          )}

          {editedItem.type === 'ammo' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Calibre/Tipo
              </label>
              <input
                type="text"
                value={editedItem.ammo || ''}
                onChange={(e) => handleInputChange('ammo', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Ex: 9mm, .45 ACP, 5.56mm"
              />
            </div>
          )}

          {(editedItem.type === 'armor' || editedItem.type === 'weapon' || editedItem.type === 'tool') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durabilidade
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={editedItem.currentAmmo || 100}
                  onChange={(e) => handleInputChange('currentAmmo', parseInt(e.target.value) || 100)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  min="0"
                  placeholder="Atual"
                />
                <input
                  type="number"
                  value={editedItem.maxAmmo || 100}
                  onChange={(e) => handleInputChange('maxAmmo', parseInt(e.target.value) || 100)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                  min="1"
                  placeholder="Máxima"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Durabilidade atual / máxima do item
              </p>
            </div>
          )}

          {editedItem.type === 'consumable' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Efeito/Uso
              </label>
              <select
                value={editedItem.magazine || 'healing'}
                onChange={(e) => handleInputChange('magazine', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="healing">💊 Cura/Medicina</option>
                <option value="food">🍖 Comida/Bebida</option>
                <option value="buff">⚡ Aprimoramento</option>
                <option value="poison">☠️ Veneno/Droga</option>
                <option value="utility">🔧 Utilitário</option>
              </select>
            </div>
          )}

          {editedItem.type === 'container' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Capacidade (slots)
              </label>
              <input
                type="number"
                value={editedItem.maxAmmo || 10}
                onChange={(e) => handleInputChange('maxAmmo', parseInt(e.target.value) || 10)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
                min="1"
                placeholder="Número de slots de armazenamento"
              />
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
      
      {/* Modal de seleção de ícones */}
      {showIconGrid && (
        <IconGrid
          selectedIcon={iconPreview}
          onIconSelect={handleIconSelect}
          onClose={() => setShowIconGrid(false)}
        />
      )}
    </div>
  );
};

export default ItemEditModal;