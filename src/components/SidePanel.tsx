import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { CogIcon } from '../utils/armorIconUtils';

const SidePanel: React.FC = () => {
  const { state, dispatch, getTotalWeight, getEquippedWeight, getTotalCharacterWeight } = useGame();
  const [walletInput, setWalletInput] = useState('');
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [maxWeightInput, setMaxWeightInput] = useState('');
  const [showMaxWeightInput, setShowMaxWeightInput] = useState(false);
  const [totalMaxWeightInput, setTotalMaxWeightInput] = useState('');
  const [showTotalMaxWeightInput, setShowTotalMaxWeightInput] = useState(false);

  const formatCurrency = (amount: number) => {
    return `DB$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const handleWalletUpdate = (isAddition: boolean) => {
    const amount = parseFloat(walletInput.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }

    // Verificar saldo insuficiente ao remover dinheiro
    if (!isAddition && amount > state.wallet.balance) {
      alert(`Saldo insuficiente! Você tem apenas ${formatCurrency(state.wallet.balance)} disponível.`);
      return;
    }

    dispatch({ 
      type: 'UPDATE_WALLET', 
      amount: isAddition ? amount : -amount 
    });
    
    setWalletInput('');
    setShowWalletInput(false);
  };

  const totalWeight = getTotalWeight();
  const maxWeight = state.inventory.maxWeight;
  const weightPercentage = (totalWeight / maxWeight) * 100;
  
  const equipmentWeight = getEquippedWeight();
  const totalCharacterWeight = getTotalCharacterWeight();
  const totalMaxWeight = state.totalMaxWeight || 50; // Peso máximo padrão de 50kg para o personagem
  const totalWeightPercentage = (totalCharacterWeight / totalMaxWeight) * 100;

  const handleMaxWeightUpdate = () => {
    const newMaxWeight = parseFloat(maxWeightInput.replace(',', '.'));
    if (isNaN(newMaxWeight) || newMaxWeight <= 0) {
      alert('Por favor, insira um peso máximo válido.');
      return;
    }

    dispatch({ 
      type: 'UPDATE_MAX_WEIGHT', 
      maxWeight: newMaxWeight 
    });
    
    setMaxWeightInput('');
    setShowMaxWeightInput(false);
  };
  
  const handleTotalMaxWeightUpdate = () => {
    const newTotalMaxWeight = parseFloat(totalMaxWeightInput.replace(',', '.'));
    if (isNaN(newTotalMaxWeight) || newTotalMaxWeight <= 0) {
      alert('Por favor, insira um peso máximo válido.');
      return;
    }

    dispatch({ 
      type: 'UPDATE_TOTAL_MAX_WEIGHT', 
      maxWeight: newTotalMaxWeight 
    });
    
    setTotalMaxWeightInput('');
    setShowTotalMaxWeightInput(false);
  };

  const getWeightBarColor = () => {
    if (weightPercentage <= 100) return 'bg-gold-soft';
    if (weightPercentage <= 120) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getTotalWeightBarColor = () => {
    if (totalWeightPercentage <= 100) return 'bg-gold-soft';
    if (totalWeightPercentage <= 120) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-80 space-y-4">
      {/* Carteira */}
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-gold-soft mb-3">Carteira</h3>
        <div className="text-2xl font-bold text-light-text mb-4">
          {formatCurrency(state.wallet.balance)}
        </div>
        
        {!showWalletInput ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowWalletInput(true)}
              className="steampunk-button flex-1 text-sm"
            >
              + Adicionar
            </button>
            <button
              onClick={() => setShowWalletInput(true)}
              className="steampunk-button flex-1 text-sm"
            >
              - Remover
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              placeholder="Valor (ex: 100,50)"
              className="steampunk-input w-full text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleWalletUpdate(true)}
                className="steampunk-button flex-1 text-sm bg-green-600 hover:bg-green-700"
              >
                + Adicionar
              </button>
              <button
                onClick={() => handleWalletUpdate(false)}
                className="steampunk-button flex-1 text-sm bg-red-600 hover:bg-red-700"
              >
                - Remover
              </button>
            </div>
            <button
              onClick={() => {
                setShowWalletInput(false);
                setWalletInput('');
              }}
              className="w-full text-sm text-bronze-light hover:text-light-text"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Peso */}
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-gold-soft mb-3">Peso da Mochila</h3>
        <div className="text-xl font-bold text-light-text mb-2">
          {totalWeight.toFixed(1)} kg / {maxWeight} kg
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-bronze-medium rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getWeightBarColor()}`}
            style={{ width: `${Math.min(weightPercentage, 100)}%` }}
          ></div>
        </div>
        
        {weightPercentage > 100 && (
          <div className="text-sm text-red-400">
            ⚠️ Sobrepeso! ({weightPercentage.toFixed(0)}%)
          </div>
        )}
        
        <div className="text-sm text-bronze-light mb-3">
          {weightPercentage.toFixed(0)}% da capacidade
        </div>
        
        {!showMaxWeightInput ? (
          <button
            onClick={() => setShowMaxWeightInput(true)}
            className="steampunk-button w-full text-sm"
          >
            <span className="flex items-center gap-2">
              <CogIcon className="w-4 h-4" color="#D4AF37" />
              Alterar Peso Máximo
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={maxWeightInput}
              onChange={(e) => setMaxWeightInput(e.target.value)}
              placeholder="Novo peso máximo (kg)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gold-soft"
            />
            <div className="flex gap-2">
              <button
                onClick={handleMaxWeightUpdate}
                className="steampunk-button flex-1 text-sm bg-gold-medium hover:bg-gold-soft text-bronze-dark"
              >
                ✓ Confirmar
              </button>
            </div>
            <button
              onClick={() => {
                setShowMaxWeightInput(false);
                setMaxWeightInput('');
              }}
              className="w-full text-sm text-bronze-light hover:text-light-text"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Peso Total do Personagem */}
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-gold-soft mb-3">Peso Total do Personagem</h3>
        <div className="text-xl font-bold text-light-text mb-2">
          {totalCharacterWeight.toFixed(1)} kg / {totalMaxWeight} kg
        </div>
        
        <div className="text-sm text-bronze-light mb-2">
          Mochila: {totalWeight.toFixed(1)} kg + Equipamentos: {equipmentWeight.toFixed(1)} kg
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-bronze-medium rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getTotalWeightBarColor()}`}
            style={{ width: `${Math.min(totalWeightPercentage, 100)}%` }}
          ></div>
        </div>
        
        {totalWeightPercentage > 100 && (
          <div className="text-sm text-red-400">
            ⚠️ Sobrepeso! ({totalWeightPercentage.toFixed(0)}%)
          </div>
        )}
        
        <div className="text-sm text-bronze-light mb-3">
          {totalWeightPercentage.toFixed(0)}% da capacidade
        </div>
        
        {!showTotalMaxWeightInput ? (
          <button
            onClick={() => setShowTotalMaxWeightInput(true)}
            className="steampunk-button w-full text-sm"
          >
            <span className="flex items-center gap-2">
              <CogIcon className="w-4 h-4" color="#D4AF37" />
              Alterar Peso Máximo Total
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={totalMaxWeightInput}
              onChange={(e) => setTotalMaxWeightInput(e.target.value)}
              placeholder="Novo peso máximo total (kg)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gold-soft"
            />
            <div className="flex gap-2">
              <button
                onClick={handleTotalMaxWeightUpdate}
                className="steampunk-button flex-1 text-sm bg-gold-medium hover:bg-gold-soft text-bronze-dark"
              >
                ✓ Confirmar
              </button>
            </div>
            <button
              onClick={() => {
                setShowTotalMaxWeightInput(false);
                setTotalMaxWeightInput('');
              }}
              className="w-full text-sm text-bronze-light hover:text-light-text"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>



      {/* Estatísticas */}
      <div className="steampunk-card p-4">
        <h3 className="text-lg font-bold text-gold-soft mb-3">Estatísticas</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-bronze-light">Itens no inventário:</span>
            <span className="text-light-text font-medium">{Object.keys(state.inventory.items).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bronze-light">Itens no banco:</span>
            <span className="text-light-text font-medium">{state.storageBank.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bronze-light">Itens equipados:</span>
            <span className="text-light-text font-medium">{Object.keys(state.equippedItems).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bronze-light">Valor total (inventário):</span>
            <span className="text-light-text font-medium">
              {formatCurrency(
                Object.values(state.inventory.items).reduce((total, item) => {
                  // Para munições, price_db já contém o valor total das munições individuais
                  if (item.ammo) {
                    return total + item.price_db;
                  }
                  // Para outros itens, multiplicar pela quantidade
                  return total + (item.price_db * (item.qty || 1));
                }, 0)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-bronze-light">Valor equipamentos:</span>
            <span className="text-light-text font-medium">
              {formatCurrency(
                Object.values(state.equippedItems).reduce((total, item) => {
                  // Não contar cópias de armas pesadas para evitar duplicação
                  if (item.isLeftHandCopy) return total;
                  // Para munições, price_db já contém o valor total das munições individuais
                  if (item.ammo) {
                    return total + item.price_db;
                  }
                  // Para outros itens, multiplicar pela quantidade
                  return total + (item.price_db * (item.qty || 1));
                }, 0)
              )}
            </span>
          </div>
          <div className="flex justify-between border-t border-bronze-medium pt-2 mt-2">
            <span className="text-gold-soft font-semibold">Valor total geral:</span>
            <span className="text-gold-soft font-bold">
              {formatCurrency(
                Object.values(state.inventory.items).reduce((total, item) => {
                  // Para munições, price_db já contém o valor total das munições individuais
                  if (item.ammo) {
                    return total + item.price_db;
                  }
                  // Para outros itens, multiplicar pela quantidade
                  return total + (item.price_db * (item.qty || 1));
                }, 0) +
                Object.values(state.equippedItems).reduce((total, item) => {
                  // Não contar cópias de armas pesadas para evitar duplicação
                  if (item.isLeftHandCopy) return total;
                  // Para munições, price_db já contém o valor total das munições individuais
                  if (item.ammo) {
                    return total + item.price_db;
                  }
                  // Para outros itens, multiplicar pela quantidade
                  return total + (item.price_db * (item.qty || 1));
                }, 0)
              )}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SidePanel;