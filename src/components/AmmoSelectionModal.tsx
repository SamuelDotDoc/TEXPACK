import React, { useState } from 'react';
import { type Item } from '../types';

interface AmmoVariant {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  weightMultiplier: number;
  damageModifier?: string;
  penetrationModifier?: string;
}

const AMMO_VARIANTS: AmmoVariant[] = [
  {
    id: 'standard',
    name: 'Comum',
    description: 'Munição padrão sem modificações especiais',
    priceMultiplier: 1.0,
    weightMultiplier: 1.0
  },
  {
    id: 'armor_piercing',
    name: 'Armor Piercing (AP)',
    description: 'Munição perfurante, eficaz contra armaduras',
    priceMultiplier: 1.5,
    weightMultiplier: 1.1,
    penetrationModifier: '+2 penetração'
  },
  {
    id: 'hollow_point',
    name: 'Ponta Oca (HP)',
    description: 'Munição expansiva, maior dano contra alvos sem armadura',
    priceMultiplier: 1.3,
    weightMultiplier: 0.95,
    damageModifier: '+1 dano vs sem armadura'
  },
  {
    id: 'incendiary',
    name: 'Incendiária',
    description: 'Munição incendiária, causa dano por fogo',
    priceMultiplier: 2.0,
    weightMultiplier: 1.2,
    damageModifier: '+1d4 dano de fogo'
  },
  {
    id: 'tracer',
    name: 'Traçante',
    description: 'Munição com rastro luminoso, facilita a mira',
    priceMultiplier: 1.2,
    weightMultiplier: 1.05,
    damageModifier: '+1 precisão'
  },
  {
    id: 'subsonic',
    name: 'Subsônica',
    description: 'Munição silenciosa, reduz ruído do disparo',
    priceMultiplier: 1.4,
    weightMultiplier: 1.1,
    damageModifier: '-1 dano, +stealth'
  }
];

interface AmmoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseAmmo: Item;
  onSelectVariant: (variant: AmmoVariant, baseAmmo: Item, quantity: number) => void;
}

export const AmmoSelectionModal: React.FC<AmmoSelectionModalProps> = ({
  isOpen,
  onClose,
  baseAmmo,
  onSelectVariant
}) => {
  const [selectedVariant, setSelectedVariant] = useState<AmmoVariant>(AMMO_VARIANTS[0]);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const calculatePrice = (variant: AmmoVariant) => {
    return Math.round((baseAmmo.price_db || 0) * variant.priceMultiplier * quantity);
  };

  const calculateWeight = (variant: AmmoVariant) => {
    // O peso é da caixa completa multiplicado pela quantidade e pelo modificador da variante
    return Math.round(((baseAmmo.weight_kg || 0) * variant.weightMultiplier * quantity) * 100) / 100;
  };

  const handleConfirm = () => {
    onSelectVariant(selectedVariant, baseAmmo, quantity);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999999]">
      <div className="bg-gray-900 border-2 border-yellow-600 rounded-lg shadow-2xl p-4 max-w-lg w-full mx-2 max-h-[80%] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-500">
            Selecionar Tipo de Munição
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Informações da munição base */}
        <div className="mb-6 p-4 bg-gray-800 rounded border border-yellow-600">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">{baseAmmo.name}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Calibre:</span>
              <span className="ml-2 text-white">{baseAmmo.ammo}</span>
            </div>
            <div>
              <span className="text-gray-400">Quantidade:</span>
              <span className="ml-2 text-white">{baseAmmo.qty} un</span>
            </div>
            <div>
              <span className="text-gray-400">Preço Base:</span>
              <span className="ml-2 text-green-400">{baseAmmo.price_db} DB</span>
            </div>
            <div>
              <span className="text-gray-400">Peso Base:</span>
              <span className="ml-2 text-blue-400">{baseAmmo.weight_kg} kg</span>
            </div>
          </div>
        </div>

        {/* Seleção de quantidade */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Quantidade de Caixas:</h3>
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 rounded border border-yellow-600">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-bold text-lg"
            >
              −
            </button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                className="w-16 h-10 text-center bg-gray-700 text-white border border-gray-600 rounded focus:border-yellow-500 focus:outline-none"
              />
              <span className="text-gray-400 text-sm">caixas</span>
            </div>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-10 h-10 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Seleção de variantes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">Escolha o Tipo:</h3>
          <div className="grid grid-cols-1 gap-3">
            {AMMO_VARIANTS.map((variant) => (
              <div
                key={variant.id}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  selectedVariant.id === variant.id
                    ? 'border-yellow-500 bg-yellow-900 bg-opacity-20'
                    : 'border-gray-600 bg-gray-800 hover:border-yellow-600'
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{variant.name}</h4>
                    <p className="text-sm text-gray-400">{variant.description}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap">
                    <div className="text-green-400 font-medium">{calculatePrice(variant)} DB</div>
                    <div className="text-blue-400 font-medium">{calculateWeight(variant)} kg</div>
                  </div>
                </div>
                {(variant.damageModifier || variant.penetrationModifier) && (
                  <div className="text-xs text-yellow-400 mt-2">
                    {variant.damageModifier && <div>• {variant.damageModifier}</div>}
                    {variant.penetrationModifier && <div>• {variant.penetrationModifier}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resumo da seleção */}
        <div className="mb-6 p-4 bg-gray-800 rounded border border-yellow-600">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Resumo da Compra:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Tipo Selecionado:</span>
              <span className="text-white font-medium">{selectedVariant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Caixas:</span>
              <span className="text-white font-medium">{quantity}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Munições:</span>
              <span className="text-white font-medium">{(baseAmmo.qty || 0) * quantity} un</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Preço Final:</span>
              <span className="text-green-400 font-medium">{calculatePrice(selectedVariant)} DB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Peso Final:</span>
              <span className="text-blue-400 font-medium">{calculateWeight(selectedVariant)} kg</span>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-yellow-600 text-black font-semibold rounded hover:bg-yellow-500 transition-colors"
          >
            Adicionar ao Inventário
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmmoSelectionModal;