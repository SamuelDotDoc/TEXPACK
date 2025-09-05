import React, { useState, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { type Item } from '../types';

interface WeaponAmmoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Item | null;
}

const WeaponAmmoSelectionModal: React.FC<WeaponAmmoSelectionModalProps> = ({ isOpen, onClose, weapon }) => {
  const { state, dispatch } = useGame();
  const [selectedAmmo, setSelectedAmmo] = useState<Item | null>(null);

  // Função para verificar compatibilidade de munição
  const isAmmoCompatible = (weaponAmmo: string, itemAmmo: string): boolean => {
    return weaponAmmo === itemAmmo;
  };

  // Encontrar munições compatíveis no inventário
  const compatibleAmmo = useMemo(() => {
    if (!weapon || !weapon.ammo) return [];
    
    return Object.values(state.inventory.items)
      .filter(item => 
        item.type === 'ammo' && 
        item.currentAmmo && 
        item.currentAmmo > 0 &&
        isAmmoCompatible(weapon.ammo!, item.ammo || '')
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [weapon, state.inventory.items]);

  const handleSelectAmmo = (ammo: Item) => {
    if (!weapon) return;
    
    // Atualizar a arma com a munição selecionada
    dispatch({ 
      type: 'SET_WEAPON_AMMO', 
      weaponId: weapon.id, 
      ammoId: ammo.id,
      ammoType: ammo.ammo || ammo.name
    });
    
    onClose();
  };

  const handleReloadWithSelected = () => {
    if (!weapon || !selectedAmmo) return;
    
    // Primeiro selecionar a munição, depois recarregar
    dispatch({ 
      type: 'SET_WEAPON_AMMO', 
      weaponId: weapon.id, 
      ammoId: selectedAmmo.id,
      ammoType: selectedAmmo.ammo || selectedAmmo.name
    });
    
    // Recarregar a arma
    dispatch({ type: 'RELOAD_WEAPON', itemId: weapon.id });
    
    onClose();
  };

  if (!isOpen || !weapon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-neutral border border-bronze-medium rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gold-soft">Selecionar Munição</h2>
          <button
            onClick={onClose}
            className="text-bronze-light hover:text-light-text text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-dark-surface border border-bronze-medium rounded">
          <div className="font-medium text-gold-soft mb-1">🔫 {weapon.name}</div>
          <div className="text-sm text-bronze-light">
            Munição aceita: <span className="text-light-text">{weapon.ammo}</span>
          </div>
          {weapon.currentAmmo !== undefined && weapon.maxAmmo !== undefined && (
            <div className="text-sm text-bronze-light">
              Munição atual: <span className="text-light-text">{weapon.currentAmmo}/{weapon.maxAmmo}</span>
            </div>
          )}
        </div>

        {compatibleAmmo.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gold-soft mb-3">Munições Disponíveis:</h3>
            {compatibleAmmo.map((ammo) => (
              <div
                key={ammo.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedAmmo?.id === ammo.id
                    ? 'border-gold-soft bg-gold-soft bg-opacity-20'
                    : 'border-bronze-medium bg-dark-surface hover:border-bronze-light'
                }`}
                onClick={() => setSelectedAmmo(ammo)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-light-text">{ammo.name}</div>
                    <div className="text-sm text-bronze-light">
                      Tipo: {ammo.ammo} • Disponível: {ammo.currentAmmo} un
                    </div>
                    {ammo.notes && (
                      <div className="text-xs text-bronze-light mt-1">{ammo.notes}</div>
                    )}
                  </div>
                  <div className="text-sm text-green-400 font-medium">
                    {ammo.price_db} DB
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => selectedAmmo && handleSelectAmmo(selectedAmmo)}
                disabled={!selectedAmmo}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Selecionar Munição
              </button>
              <button
                onClick={handleReloadWithSelected}
                disabled={!selectedAmmo}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Selecionar e Recarregar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-bronze-light mb-2">❌ Nenhuma munição compatível encontrada</div>
            <div className="text-sm text-bronze-light">
              Você precisa de munição do tipo <span className="text-light-text">{weapon.ammo}</span> no seu inventário.
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-bronze-medium">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeaponAmmoSelectionModal;