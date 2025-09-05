import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../hooks/useGame';
import { type Item } from '../types';

interface MenuItem {
  label: string;
  onClick: () => void;
  className: string;
  hasSubmenu?: boolean;
  tooltip?: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onEquip: () => void;
  onEquipToLeftHand?: () => void;
  onEquipToRightHand?: () => void;
  onUnequip?: () => void;
  onStoreToBank: () => void;
  onSell: () => void;
  onDiscard: () => void;
  onConsumeAmmo?: () => void;
  onReloadWeapon?: () => void;
  onUnloadWeapon?: () => void;
  onFireWeapon?: () => void;
  isEquipped?: boolean;
  isWeapon?: boolean;
  leftHandOccupied?: boolean;
  rightHandOccupied?: boolean;
  isHeavyWeapon?: boolean;
  isAmmoItem?: boolean;
  isFirearm?: boolean;
  currentAmmo?: number;
  maxAmmo?: number;
  isRevvingWeapon?: boolean;
  tanque?: number;
  maxTanque?: number;
  onRefuelWeapon?: () => void;
  weapon?: Item | null;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onEquip,
  onEquipToLeftHand,
  onEquipToRightHand,
  onUnequip,
  onStoreToBank,
  onSell,
  onDiscard,
  onConsumeAmmo,
  onReloadWeapon,
  onUnloadWeapon,
  onFireWeapon,
  isEquipped = false,
  isWeapon = false,
  leftHandOccupied = false,
  rightHandOccupied = false,
  isHeavyWeapon = false,
  isAmmoItem = false,
  isFirearm = false,
  currentAmmo = 0,
  maxAmmo = 0,
  isRevvingWeapon = false,
  tanque = 0,
  maxTanque = 0,
  onRefuelWeapon,
  weapon,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showAmmoSubmenu, setShowAmmoSubmenu] = useState(false);
  const { state, dispatch } = useGame();

  // Função para verificar compatibilidade de munição
  const isAmmoCompatible = (weaponAmmo: string, itemAmmo: string): boolean => {
    return weaponAmmo === itemAmmo;
  };

  // Encontrar munições compatíveis no inventário
  const compatibleAmmo = useMemo(() => {
    if (!weapon || !weapon.ammo) {
      return [];
    }
    
    return Object.values(state.inventory.items)
      .filter(item => 
        item.type === 'ammo' && 
        item.currentAmmo && 
        item.currentAmmo > 0 &&
        isAmmoCompatible(weapon.ammo!, item.ammo || '')
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [weapon, state.inventory.items]);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setShouldRender(false);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setShowAmmoSubmenu(false);
    setTimeout(() => onClose(), 200);
  };

  const handleSelectAmmo = (ammo: Item) => {
    if (!weapon) return;
    
    // Atualizar a arma com a munição selecionada
    dispatch({ 
      type: 'SET_WEAPON_AMMO', 
      weaponId: weapon.id, 
      ammoId: ammo.id,
      ammoType: ammo.ammo || ammo.name
    });
    
    handleClose();
  };

  if (!shouldRender) return null;

  const menuItems: MenuItem[] = [];
  
  // Opções de equipamento
  if (isEquipped) {
    // Opção de atirar para armas equipadas e carregadas
    if (onFireWeapon && (isFirearm || isRevvingWeapon)) {
      const canFire = (isFirearm && currentAmmo > 0) || (isRevvingWeapon && tanque > 0);
      if (canFire) {
        menuItems.push({
          label: isFirearm ? `🔫 Atirar (${currentAmmo} munições)` : `🔥 Ativar (${tanque} combustível)`,
          onClick: onFireWeapon,
          className: 'text-red-400 hover:text-white hover:bg-red-600',
        });
      }
    }
    
    menuItems.push({
      label: '🎒 Desequipar',
      onClick: onUnequip || (() => {}),
      className: 'text-orange-300 hover:text-white hover:bg-orange-600',
    });
  } else if (isWeapon) {
    if (isHeavyWeapon) {
      // Para armas pesadas, apenas opção genérica (será equipada automaticamente nas duas mãos)
      menuItems.push({
        label: '⚔️ Equipar Arma Pesada (Duas Mãos)',
        onClick: onEquip,
        className: 'text-silver-light hover:text-white hover:bg-silver-dark',
      });
    } else {
      // Para armas leves, mostrar opções de mão (permitindo troca)
      if (onEquipToLeftHand) {
        menuItems.push({
          label: leftHandOccupied ? '🤚 Trocar para Mão Esquerda' : '🤚 Equipar na Mão Esquerda',
          onClick: onEquipToLeftHand,
          className: 'text-silver-light hover:text-white hover:bg-silver-dark',
        });
      }
      if (onEquipToRightHand) {
        menuItems.push({
          label: rightHandOccupied ? '✋ Trocar para Mão Direita' : '✋ Equipar na Mão Direita',
          onClick: onEquipToRightHand,
          className: 'text-silver-light hover:text-white hover:bg-silver-dark',
        });
      }
      // Opção genérica para abrir modal
      menuItems.push({
        label: '⚔️ Escolher Mão para Equipar',
        onClick: onEquip,
        className: 'text-silver-light hover:text-white hover:bg-silver-dark',
      });
      // Opção genérica para abrir modal
      menuItems.push({
        label: '⚔️ Escolher Mão para Equipar',
        onClick: onEquip,
        className: 'text-silver-light hover:text-white hover:bg-silver-dark',
      });
    }
  } else {
    // Para outros itens, opção genérica
    menuItems.push({
      label: '⚔️ Equipar',
      onClick: onEquip,
      className: 'text-silver-light hover:text-white hover:bg-silver-dark',
    });
  }
  
  // Opção para consumir munição (apenas para itens de munição)
  if (isAmmoItem && onConsumeAmmo && currentAmmo > 0) {
    menuItems.push({
      label: `🔫 Usar Munição (${currentAmmo} restantes)`,
      onClick: onConsumeAmmo,
      className: 'text-orange-300 hover:text-white hover:bg-orange-600',
    });
  }
  
  // Opção para recarregar arma de fogo (apenas se equipada)
  if (isFirearm && onReloadWeapon && isEquipped) {
    const isLoaded = currentAmmo && currentAmmo > 0;
    const canReload = !isLoaded || (currentAmmo < maxAmmo);
    
    if (canReload) {
      menuItems.push({
        label: isLoaded ? `🔄 Recarregar (${currentAmmo}/${maxAmmo})` : '🔄 Recarregar Arma',
        onClick: onReloadWeapon,
        className: 'text-blue-300 hover:text-white hover:bg-blue-600',
      });
    }
  }
  
  // Opção para reabastecer Revving Weapon (apenas se equipada)
  if (isRevvingWeapon && onRefuelWeapon && isEquipped) {
    const hasFuel = tanque && tanque > 0;
    const canRefuel = !hasFuel || (tanque < maxTanque);
    
    if (canRefuel) {
      menuItems.push({
        label: hasFuel ? `⛽ Reabastecer (${tanque}/${maxTanque})` : '⛽ Reabastecer Arma',
        onClick: onRefuelWeapon,
        className: 'text-cyan-300 hover:text-white hover:bg-cyan-600',
      });
    }
  }
  
  // Opção para recarregar Gunblade (apenas se equipada)
  const isGunblade = weapon?.type === 'Gunblade';
  if (isGunblade && onReloadWeapon && isEquipped) {
    const isLoaded = currentAmmo && currentAmmo > 0;
    const canReload = !isLoaded || (currentAmmo < maxAmmo);
    
    if (canReload) {
      menuItems.push({
        label: isLoaded ? `⚡ Recarregar (${currentAmmo}/${maxAmmo})` : '⚡ Recarregar Gunblade',
        onClick: onReloadWeapon,
        className: 'text-purple-300 hover:text-white hover:bg-purple-600',
      });
    }
  }
  
  // Opção para descarregar arma (apenas se equipada e carregada)
  if ((isFirearm || weapon?.type === 'Gunblade') && onUnloadWeapon && isEquipped && currentAmmo && currentAmmo > 0) {
    menuItems.push({
      label: `🔓 Descarregar Arma (${currentAmmo} munições)`,
      onClick: onUnloadWeapon,
      className: 'text-yellow-300 hover:text-white hover:bg-yellow-600',
    });
  }
  
  // Submenu para selecionar munição (apenas para armas de fogo e gunblades equipadas)
  if ((isFirearm || weapon?.type === 'Gunblade') && weapon && isEquipped && compatibleAmmo.length > 0) {
    const selectedAmmo = weapon.selectedAmmoId 
      ? compatibleAmmo.find(ammo => ammo.id === weapon.selectedAmmoId)
      : null;
    
    const tooltipText = selectedAmmo 
      ? `Munição atual: ${selectedAmmo.name}`
      : 'Nenhuma munição selecionada';
    
    menuItems.push({
      label: '🎯 Selecionar Munição',
      onClick: () => setShowAmmoSubmenu(!showAmmoSubmenu),
      className: selectedAmmo 
        ? 'text-gold-soft hover:text-white hover:bg-gold-soft/20'
        : 'text-purple-300 hover:text-white hover:bg-purple-600',
      hasSubmenu: true,
      tooltip: tooltipText,
    });
  }
  
  // Outras opções
  menuItems.push(
    {
      label: '🏦 Guardar no Banco',
      onClick: onStoreToBank,
      className: 'text-blue-300 hover:text-white hover:bg-blue-600',
    },
    {
      label: '💰 Vender',
      onClick: onSell,
      className: 'text-gold-soft hover:text-white hover:bg-gold-medium',
    },
    {
      label: '🗑️ Descartar',
      onClick: onDiscard,
      className: 'text-red-400 hover:text-white hover:bg-red-600',
    }
  );

  return createPortal(
    <>
      {/* Overlay invisível para fechar o menu ao clicar fora */}
      <div
        className="fixed inset-0 z-[9998] bg-transparent"
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Menu de contexto */}
      <div
        className={`fixed z-[9999] bg-bronze-medium/95 backdrop-blur-sm border-2 border-gold-soft rounded-lg shadow-2xl shadow-black/50 min-w-[160px] max-w-[220px] py-2 transition-all duration-200 ease-out origin-top-left ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2'
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => (
          <div key={index} className="relative">
            <button
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${item.className} ${item.hasSubmenu ? 'flex items-center justify-between' : ''}`}
              title={item.tooltip || ''}
              onClick={() => {
                if (item.hasSubmenu) {
                  item.onClick();
                } else {
                  item.onClick();
                  handleClose();
                }
              }}
            >
              {item.label}
              {item.hasSubmenu && (
                <span className={`ml-2 transition-transform duration-200 ${showAmmoSubmenu ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              )}
            </button>
            
            {/* Submenu de munições */}
            {item.hasSubmenu && showAmmoSubmenu && (
              <div className="absolute left-full top-0 ml-1 bg-bronze-medium/95 backdrop-blur-sm border-2 border-gold-soft rounded-lg shadow-2xl shadow-black/50 min-w-[180px] max-w-[250px] py-2 z-[10000]">
                {compatibleAmmo.length > 0 ? (
                  compatibleAmmo.map((ammo, ammoIndex) => {
                    const isSelected = weapon?.selectedAmmoId === ammo.id;
                    return (
                      <button
                        key={ammoIndex}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                          isSelected 
                            ? 'text-gold-soft bg-gold-soft/20 border-l-2 border-gold-soft' 
                            : 'text-purple-200 hover:text-white hover:bg-purple-600'
                        }`}
                        onClick={() => handleSelectAmmo(ammo)}
                      >
                        {isSelected ? '✓' : '🔫'} {ammo.name} ({ammo.currentAmmo})
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Nenhuma munição compatível
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>,
    document.body
  );
};

export default ContextMenu;