import React from 'react';
import {
  AmmoBagIcon,
  BatteryIcon,
  FuelTankIcon,
  MissileIcon,
  ShellIcon,
  BombIcon,
  CannonBallIcon,
  MetalAmmoIcon,
  ShotgunAmmoIcon
} from '../assets/icons/AmmoIcons';

// Função para obter o ícone baseado no nome da munição
export const getAmmoIcon = (itemName: string, ammoType?: string, className?: string) => {
  // Verificação de segurança para evitar erro quando itemName é undefined
  if (!itemName || typeof itemName !== 'string') {
    return React.createElement(AmmoBagIcon, { className });
  }
  
  const name = itemName.toLowerCase();
  const type = ammoType?.toLowerCase() || '';
  
  // Verificar se é uma bateria
  if (name.includes('bateria') || name.includes('battery') || type.includes('battery')) {
    return React.createElement(BatteryIcon, { className });
  }
  
  // Verificar se é um tanque de combustível
  if (name.includes('tanque') || name.includes('tank') || name.includes('combustível') || name.includes('fuel')) {
    return React.createElement(FuelTankIcon, { className });
  }

  // Verificar se é munição de escopeta (12 gauge ou 20 gauge)
  if (name.includes('12 gauge') || name.includes('20 gauge') || name.includes('12gauge') || name.includes('20gauge') ||
      type.includes('12 gauge') || type.includes('20 gauge') || type.includes('12gauge') || type.includes('20gauge')) {
    return React.createElement(ShotgunAmmoIcon, { className });
  }
  
  // Verificar se é um míssil
  if (name.includes('míssil') || name.includes('missil') || name.includes('missile') || type.includes('missile')) {
    return React.createElement(MissileIcon, { className });
  }
  
  // Verificar se é projétil ou granada de 40mm
  if (name.includes('projétil') || name.includes('projetil') || name.includes('projectile') ||
      name.includes('granada 40mm') || name.includes('40mm') ||
      type.includes('projétil') || type.includes('projetil') || type.includes('projectile') ||
      type.includes('granada 40mm') || type.includes('40mm')) {
    return React.createElement(ShellIcon, { className });
  }
  
  // Verificar se é fósforo branco
  if (name.includes('fósforo branco') ||
      name.includes('fosforo branco') ||
      name.includes('white phosphorus') ||
      type.includes('fósforo branco') ||
      type.includes('fosforo branco') ||
      type.includes('white phosphorus')) {
    return React.createElement(BombIcon, { className });
  }
  
  // Verificar se é bola de canhão
  if (name.includes('bola de canhão') || name.includes('bola de canhao') || name.includes('bola 50cm') || name.includes('cannon ball') ||
      type.includes('bola de canhão') || type.includes('bola de canhao') || type.includes('bola 50cm') || type.includes('cannon ball')) {
    return React.createElement(CannonBallIcon, { className });
  }

  // Verificar se é munição metálica
  if (name.includes('munição metálica') || name.includes('municao metalica') || name.includes('metal ammo') || name.includes('metalammo') ||
      type.includes('munição metálica') || type.includes('municao metalica') || type.includes('metal ammo') || type.includes('metalammo')) {
    return React.createElement(MetalAmmoIcon, { className });
  }

  // Retorna o ícone de saco de munição para todas as outras munições
  return React.createElement(AmmoBagIcon, { className });
};
