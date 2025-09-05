import React from 'react';
import {
  PistolaIcon,
  AutoPistolIcon,
  RevolverIcon,
  RevolverPesadoIcon,
  EscopetaIcon,
  EscopetaTaticaIcon,
  RiflePrecisaoIcon,
  MetralhadoraIcon,
  SubmetralhadoraIcon,
  BazookaIcon,
  GrenadeLauncherIcon,
  FlamethrowerIcon,
  LightningIcon,
  PoisonIcon,
  ArmaBrancaIcon,
  CanhaoMaoIcon,
  CannonIcon,
  FuzilIcon,
  FuzilPesadoIcon,
  MiniguIcon,
  AntiTankIcon,
  RifleLeverActionIcon,
  LeeEnfieldIcon,
  SpearLauncherIcon,
  GenericoIcon
} from '../assets/icons/WeaponIcons';

// Componente SVG para Stun Gun
const StunGunSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#3B82F6'
  }, React.createElement('path', {
    d: 'M192.063 20.375l-44.625 98.563-36.344-13.657 40.312 47.22 29.47-50.656 17.093 159.437 88.874-159.936 7.906 138.22 74.72-140.408 32.905 9.094-32.594-57.28-58.75 91.343L300.657 27.28 216.75 153.657l-24.688-133.28zM61.25 100.813c-22.213 0-40.03 17.785-40.03 40 0 22.214 17.817 40.03 40.03 40.03.558 0 1.104-.04 1.656-.062l19.5 72.814-27.812 7.437 4.843 18.064 27.813-7.47 6.656 24.876-27.812 7.438L70.938 322l27.812-7.438 7.156 26.782-27.78 7.437 4.81 18.033 27.814-7.438 6.906 25.813-27.78 7.437 4.843 18.063 27.78-7.438 7.188 26.75-27.813 7.47 4.844 18.06 27.81-7.467 12.25 45.78h19.345l-13.563-50.593 27.813-7.47-4.844-18.06-27.81 7.467-7.157-26.78 27.78-7.438-4.812-18.064-27.81 7.438-6.907-25.813 27.78-7.436-4.812-18.063-27.81 7.47-7.157-26.78 27.78-7.44-4.843-18.06-27.78 7.436-6.657-24.875 27.78-7.436-4.843-18.03-27.78 7.436-19.564-73.03c12.173-6.842 20.344-19.858 20.344-34.907 0-22.215-17.787-40-40-40zm391.188 0c-22.213 0-40.032 17.785-40.032 40 0 15.052 8.19 28.066 20.375 34.906l-19.56 73.03-27.814-7.438-4.844 18.032 27.813 7.47-6.656 24.842-27.814-7.437-4.844 18.06 27.813 7.44-7.156 26.78-27.814-7.47-4.844 18.064 27.813 7.437-6.906 25.814-27.814-7.438-4.844 18.063 27.813 7.436-7.156 26.78-27.845-7.467-4.813 18.06 27.813 7.47-13.563 50.594h19.313l12.25-45.78 27.813 7.467 4.843-18.06-27.81-7.47 7.186-26.75 27.813 7.438 4.842-18.063L396 385.187l6.906-25.812 27.813 7.438 4.842-18.032-27.812-7.467 7.156-26.75L442.72 322l4.842-18.063-27.812-7.437 6.656-24.875 27.813 7.47 4.842-18.064-27.812-7.436 19.5-72.813c.562.024 1.12.064 1.688.064 22.212 0 40-17.817 40-40.03 0-22.216-17.788-40-40-40z'
  }));
};

// Componente SVG para Espingarda Antipessoal
const APShotgunSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 321.995 321.995',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#DC2626'
  }, React.createElement('path', {
    d: 'M320.749,143.137c-1.232-2.763-0.917-6.294,0.273-9.078c0.984-2.312,0.793-4.316,0.166-5.921c-1.103-2.822-5.385-4.365-7.901-4.492c-2.527-0.127-5.463-2.61-7.57-4.782c-1.279-1.315-3.034-2.67-5.417-3.672c-2.796-1.17-7.73-1.675-10.739-2.045c-12.981-1.618-35.413-4.599-48.012-8.971c-6.426-2.234-10.646-2.229-13.359-1.522c-2.931,0.764-6.918,2.869-9.947,2.778c-21.308-0.611-97.949-2.589-107.376,0.166c-8.06,2.348-26.491,5.193-35.69,6.537c-2.996,0.433-6.045,2.612-6.804,4.883c-0.756,2.268-3.821,4.114-6.856,4.114h-9.134c-3.029,0-7.477,1.432-9.937,3.203l-20.34,14.617c-2.462,1.766-3.531,5.145-2.397,7.542c1.134,2.396,0.927,6.522-0.466,9.209c-3.076,5.909-8.697,16.637-15.299,28.946c-5.704,10.631-4.199,16.845-1.828,20.231c1.732,2.485,6.569,3.525,9.598,3.525h0.456c3.026,0,7.003,1.947,9.199,4.034c30.388,28.857,62.694-36.931,66.645-36.931c1.432,0,2.574-0.455,3.446-1.046c1.672-1.129,4.841-2.558,7.78-1.817c10.009,2.521,21.549,9.43,27.768,13.489c2.534,1.657,8.277,2.858,7.503-0.067c-0.598-2.258-2.475-5.127-2.286-6.441c0.202-1.408-3.26-5.535-6.154-8.705c-2.043-2.242-3.019-5.193-2.069-6.695c0.945-1.496,4.168-2.713,7.195-2.713h42.147c3.029,0,6.861,1.756,8.57,3.914c1.703,2.165,5.54,3.895,8.569,3.879l43.522-0.274c3.023-0.021,6.317-2.346,7.353-5.184l0.368-1.005c1.03-2.845,4.323-5.151,7.353-5.151h5.137c3.029,0,5.483,2.454,5.483,5.483v3.086c0,3.024,2.455,5.479,5.484,5.479h3.422c3.029,0,5.867-1.149,6.344-2.568c0.477-1.424,3.309-2.604,6.333-2.393c10.739,0.751,15.099,3.749,16.776,6.535c1.564,2.594,2.01,5.204,3.62,5.111c1.61-0.099,2.905-2.637,3.345-5.635c0.668-4.541,1.988-9.046,3.112-12.336c0.979-2.869,3.884-5.126,6.281-5.126c2.392,0,6.473-1.623,7.265-4.546C322.427,148.079,321.737,145.342,320.749,143.137z M76.411,178.389c-8.228,11.186-30.722,38.759-46.251,29.329c-2.589-1.569-3.337-5.929-2.393-8.808l5.774-17.513c0.95-2.874,3.915-4.106,6.649-2.812c0.111,0.057,0.228,0.108,0.344,0.166c2.736,1.294,7.487,2.081,10.043,0.461c2.514-1.59,5.393-3.92,7.674-5.873c2.296-1.973,6.532-3.66,9.559-3.66h4.8c3.026,0,5.815,0.942,6.224,2.112C79.244,172.963,78.203,175.95,76.411,178.389z'
  }));
};

// Componente SVG para Morteiro
const MortarSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 18.238 18.238',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#8B5A2B'
  }, React.createElement('path', {
    d: 'M18.088,15.157l-6.211-6.211l0.529-0.529l-0.633-0.632l-0.529,0.528L11.23,8.3l4.358-4.358l-1.897-1.897l-4.39,4.389l1.075,1.936c-0.061,0.01-0.115,0.029-0.167,0.057l-1.45-1.451l-6,6.001l1.6,1.601H0v1.614h6.708v-1.614H4.954l4.989-4.989v5.966c0,0.281,0.229,0.512,0.511,0.512s0.51-0.23,0.51-0.512V9.858l0.19-0.189l6.21,6.211c0.101,0.099,0.231,0.15,0.362,0.15s0.262-0.052,0.361-0.15C18.288,15.681,18.288,15.355,18.088,15.157z'
  }));
};

// Componente SVG para Lee-Enfield (Evelyn)
const LeeEnfieldSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#654321'
  }, React.createElement('path', {
    d: 'M465.659 42.63l-16.16 11.83 11.82 15.69-.272.181 6.32 8.559 22.551-17-8-10.68-6.26 4.71-10-13.29zm-29.09 21.48L269.108 183.86c0 .54-.06 1.03-.06 1.54l-2.16 22.78a16 16 0 0 1-6.52 11.46l-41.91 30.5a16 16 0 0 1-22.35-3.52l-4.95-6.8-29.79 21.48c-1.67 1.22-2.011 3.74-.811 6l2.09 3.951a4.9 4.9 0 0 1-.158 5.37l-48 58.71a1.77 1.77 0 0 1-.282.27l-90.699 70.42c-1.84 1.43-1.91 4.46-.15 6.76l40.82 54.179a5.69 5.69 0 0 0 4.41 2.41h.18a3.47 3.47 0 0 0 2.84-1.59l84.43-111.3a4.2 4.2 0 0 0 1.33-4.37s-3.04-16.07-2.32-17.07c0 0 28.7-38.39 28.95-38.58L454.788 88.7l-18.22-24.59zm-183.5 119.82l-54.14 39.39 10.118 13.91 41.91-30.5 2.112-22.8zm20.138 64.25l-38.629 29.6 7.49 15.37a5.14 5.14 0 0 0 4.73 2.87h.25a6 6 0 0 0 4.57-2.45l22.77-30.59a5.63 5.63 0 0 0 1-4.51l-2.18-10.29zm-59.44 45.6l-5.929 4.59a12.81 12.81 0 0 1-16.48 18.16l-2.26 3-2.26 3a20.27 20.27 0 0 0 30.08-14.81 20.1 20.1 0 0 0-3.15-13.94z'
  }));
};

// Componente SVG para Míssil de Ombro
const PebbleMissileSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 459.615 459.614',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#FF6B35'
  }, React.createElement('path', {
    d: 'M455.456,249.343l-13.932,3.993v53.451h-40.142l-30.042-37.909h-68.935v50.638c0,6.752-2.573,12.224-5.734,12.224l-78.506-62.856H101.073c-1.374,0-2.733-0.027-4.09-0.05v-78.049c1.357-0.022,2.717-0.047,4.09-0.047h121.717l73.873-62.862c3.169,0,5.729,5.475,5.729,12.238v50.624h64.635l34.354-43.598h40.142v59.82l13.927,4.169C464.818,230.934,455.456,249.343,455.456,249.343z M0,229.808c0,19.485,34.821,35.634,80.359,38.594v-77.169C34.827,194.19,0,210.327,0,229.808z'
  }));
};

// Componente SVG para Fire Breath
const PebbleFireSVG: React.FC<{ className?: string }> = ({ className }) => {
  return React.createElement('svg', {
    className,
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: '#FF4500'
  }, React.createElement('path', {
    d: 'M493.2 17.08c-6.5 13.85-30.7 31.28-34.7 30.14-5.7-1.6-11.5-11.29-7.1-22.57-12.4 7.46-19.1 22.92-21.6 35.23l17.8 23.2c8.2-.24 20.4-1.3 27.7-5.21 14.4-7.72 17.9-60.79 17.9-60.79zm-72.9 60.03l-36.5 27.99 8.6 11.1 36.4-28.01zm33.1 19.84l-.9 13.35L285 239l10.9 14.2 173.4-133.1 3.4-26.08zm-93.6 6.45l-11.1 8.4 28 36.6 11.1-8.5zm-15.7 32.1l-11.1 8.6 8.6 11.1 11.1-8.6zm-26.5 18l-15.3 11.7-44.9-5.9-33.9 26 11 14.3 27.9-21.5 19.7 2.6-39.1 30s-21.1 17.4-25 20.3l10.6 13.5 11.2-8.6 8.5 11.1 14.2-10.9L254 225l74.5-57.3zm-107.1 44.3l-11.1 8.6 8.5 11.1 11.1-8.6zm-51 4.3c-4.7.2-9.1 1.6-12.1 3.9l-5.6 4.3 14 18.2-14.2 11-14-18.3-23.8 18.3 13.9 18.2-14.2 11-14.06-18.3-5.56 4.3c-3.95 3.1-7.06 8.9-7.9 15.4-.85 6.4.64 13 3.68 16.9l17.22 22.4 15.12 2 91.4-70.3-23.7-30.9c-3.1-4-9-7.1-15.4-7.9-1.2-.1-2.4-.2-3.6-.2zm112.4 49.4l-53.5 41.1.4 6.1 54.8-10.6 16.6-12.8zm-73.3 16l-28.6 22 3.3 47.2 30-2.5zm184.6 0c-11.5 0-23 7-23 27v39h46v-39c0-20-11.5-27-23-27zm64 0c-11.5 0-23 7-23 27v39h46v-39c0-20-11.5-27-23-27zm-103.9 16.1c-19.9 5.8-39.5 13.8-52.5 26.2-12.1 11.5-17.6 28-20.8 45.2-3.1 17.3-4 35.8-5.2 52.6-1.3 16.8-3.3 32-7.3 41.4-2 4.6-4.4 7.7-7 9.7-2.6 1.9-5.8 3-11 2.8-9.7-.3-16.8-7.1-23.2-20.6-6.4-13.6-10.6-32.9-13.1-52.2-1.6-12.5-2.4-25-2.9-36.2l-17.9 1.5c.4 11.4 1.4 24.1 3 36.9 2.6 20.4 6.8 41 14.7 57.6 7.8 16.6 20.6 30.4 38.8 31 8.5.3 16.2-1.9 22.2-6.3 6-4.3 10.1-10.4 12.9-17.2 5.8-13.4 7.4-29.8 8.7-47 1.3-17.2 2.2-35.2 5-50.7 2.9-15.5 7.7-28.1 15.5-35.5 7.8-7.4 22.7-14.3 39-19.8v-8.5c0-3.9.4-7.5 1.1-10.9zm-190.4 19.1L117 330.2l-15.7-2.1-4.82 36.5-77.65 59.3c-.21 9.1 2.64 24 9.24 38.1 6.18 13.1 15.29 25.3 26.18 32.9l52.25-76.7 6.2-47.4 42.7-32.7zm191.3 48.8v14h142v-14zm16 32v110h46v-46h-32v-64zm32 0v46h46v-46zm64 0v64h-32v46h46v-110z'
  }));
};

// Função para obter o ícone baseado no nome do item
export const getWeaponIcon = (itemName: string, className?: string) => {
  // Verificação de segurança para evitar erro quando itemName é undefined
  if (!itemName || typeof itemName !== 'string') {
    return React.createElement(GenericoIcon, { className });
  }
  
  const name = itemName.toLowerCase();
  
  // Stun Gun específico
  if (name.includes('armamento de pebble (stun-gun)') || name.includes('stun-gun') || name.includes('stungun')) {
    return React.createElement(StunGunSVG, { className });
  }
  
  // Espingarda Antipessoal específica
  if (name.includes('armamento de pebble (espingarda antip.)') || name.includes('espingarda antip.') || name.includes('espingarda antipessoal')) {
    return React.createElement(APShotgunSVG, { className });
  }
  
  // Morteiro de joelho específico
  if (name.includes('armamento de pebble (morteiro de joelho)') || name.includes('morteiro de joelho') || name.includes('morteiro')) {
    return React.createElement(MortarSVG, { className });
  }
  

  
  // Míssil de ombro específico
  if (name.includes('armamento de pebble (míssil de ombro)') || name.includes('míssil de ombro') || name.includes('missil de ombro')) {
    return React.createElement(PebbleMissileSVG, { className });
  }
  
  // Fire breath específico
  if (name.includes('armamento de pebble (fire breath)') || name.includes('fire breath') || name.includes('firebreath')) {
    return React.createElement(PebbleFireSVG, { className });
  }
  
  // S.A.M. específico
  if (name.includes('armamento pesado de pebble (s.a.m.)') || name.includes('s.a.m.') || name.includes('sam')) {
    return React.createElement('img', {
      src: '/SVG/SAM.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Rail gun específico
  if (name.includes('armamento pesado de pebble (rail gun)') || name.includes('rail gun') || name.includes('railgun')) {
    return React.createElement('img', {
      src: '/SVG/rail.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Napalm específico
  if (name.includes('armamento pesado de pebble (napalm)') || name.includes('napalm')) {
    return React.createElement('img', {
      src: '/SVG/napalm.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Rifle anti material específico
  if (name.includes('armamento pesado de pebble (rifle anti material)') || name.includes('rifle anti material')) {
    return React.createElement('img', {
      src: '/SVG/atrifle.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Rifle sonoro específico
  if (name.includes('armamento pesado de pebble (rifle sonoro)') || name.includes('rifle sonoro')) {
    return React.createElement('img', {
      src: '/SVG/interceptor.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Arma de arco específico
  if (name.includes('armamento de pebble (arma de arco)') || name.includes('arma de arco')) {
    return React.createElement('img', {
      src: '/SVG/lightningpebble.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  if (name.includes('pistola automática') || name.includes('pistola automatica') || name.includes('auto pistol')) {
    return React.createElement(AutoPistolIcon, { className });
  }
  if (name.includes('pistola') || name.includes('glock') || name.includes('beretta')) {
    return React.createElement(PistolaIcon, { className });
  }
  if (name.includes('revolver pesado') || name.includes('revólver pesado')) {
    return React.createElement(RevolverPesadoIcon, { className });
  }
  if (name.includes('revolver') || name.includes('revólver') || name.includes('magnum')) {
    return React.createElement(RevolverIcon, { className });
  }

  // Escopetas
  if (name.includes('escopeta tática') || name.includes('escopeta tatica') || name.includes('tactical shotgun')) {
    return React.createElement(EscopetaTaticaIcon, { className });
  }
  if (name.includes('escopeta') || name.includes('shotgun') || name.includes('cano serrado')) {
    return React.createElement(EscopetaIcon, { className });
  }

  // Evelyn (bengala-rifle) - deve vir antes das verificações gerais de rifle
  if (name.includes('evelyn')) {
    return React.createElement('img', {
      src: '/SVG/evelyn.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Verificações específicas de fuzil devem vir antes da verificação geral de rifle/fuzil
  if ((name.includes('fuzil automático') || name.includes('fuzil automatico')) && 
      !name.includes('pesado')) {
    return React.createElement(FuzilIcon, { className });
  }
  if (name.includes('rifle de tiro único') || name.includes('rifle de tiro unico') || (name.includes('tiro único') && name.includes('rifle')) || (name.includes('tiro unico') && name.includes('rifle'))) {
    return React.createElement(LeeEnfieldIcon, { className });
  }
  if (name.includes('rifle lever action') || name.includes('lever action')) {
    return React.createElement(RifleLeverActionIcon, { className });
  }
  if (name.includes('rifle pesado') || name.includes('sniper')) {
    return React.createElement(RiflePrecisaoIcon, { className });
  }
  if (name.includes('rifle') || name.includes('fuzil') || name.includes('tiro único')) {
    return React.createElement(FuzilPesadoIcon, { className });
  }
  if (name.includes('submetralhadora') || name.includes('smg') || name.includes('uzi')) {
    return React.createElement(SubmetralhadoraIcon, { className });
  }
  
  // Fuzil automático pesado específico (deve vir antes da verificação geral de 'automático')
  if (name.includes('fuzil automático pesado') || name.includes('fuzil automatico pesado')) {
    return React.createElement(FuzilPesadoIcon, { className });
  }

  // Anti-tank específico
  if (name.includes('metralhadora pesada anti-blindado')) {
    return React.createElement(AntiTankIcon, { className });
  }

  // Minigun e armamentos de pebble específicos
  if (name.includes('minigun') || 
      name.includes('armamento de pebble(minigun de baixo calibre)') ||
      name.includes('armamento de pebble(metralhadora pesada)') ||
      name.includes('armamento de pebble (metralhadora pesada)')) {
    return React.createElement(MiniguIcon, { className });
  }
  
  if (name.includes('metralhadora') || name.includes('automático')) {
    return React.createElement(MetralhadoraIcon, { className });
  }
  // Canhão de artilharia específico
  if (name.includes('canhão de artilharia') || name.includes('canhao de artilharia') || name.includes('artilharia')) {
    return React.createElement('img', {
      src: '/SVG/Artillary.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  if (name.includes('c.a.n.h.a.o.') || name.includes('cannon') || (name.includes('canhao') && !name.includes('mão') && !name.includes('mao'))) {
    return React.createElement(CannonIcon, { className });
  }
  if (name.includes('canhão de mão') || name.includes('canhao de mao')) {
    return React.createElement(CanhaoMaoIcon, { className });
  }
  // Lança arpão
  if (name.includes('lança arpão') || name.includes('lanca arpao') || (name.includes('spear') && !name.includes('lança pequena'))) {
    return React.createElement(SpearLauncherIcon, { className });
  }

  // Lança veneno
  if (name.includes('lança veneno') || name.includes('lanca veneno') || name.includes('poison')) {
    return React.createElement(PoisonIcon, { className });
  }

  // Lança raios
  if (name.includes('lança raios') || name.includes('lanca raios') || name.includes('lightning')) {
    return React.createElement(LightningIcon, { className });
  }

  // Lança chamas
  if (name.includes('lança chamas') || name.includes('lanca chamas') || name.includes('flamethrower')) {
    return React.createElement(FlamethrowerIcon, { className });
  }

  // Lança granadas
  if (name.includes('granada')) {
    return React.createElement(GrenadeLauncherIcon, { className });
  }

  // Lança de cavalaria
  if (name.includes('lança de cavalaria') || name.includes('lanca de cavalaria')) {
    return React.createElement('img', {
      src: '/SVG/lancadecavalaria.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Lança foguetes, RPG, bazooka
  if ((name.includes('lança') && !name.includes('lança pequena') && !name.includes('lança de cavalaria')) || name.includes('foguete') || name.includes('rpg') || name.includes('bazooka')) {
    return React.createElement(BazookaIcon, { className });
  }
  // Sai - usar ícone sai.svg
  if (name.includes('sai')) {
    return React.createElement('img', {
      src: '/SVG/sai.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Facas, adagas e baionetas - usar ícone knife.svg
  if (name.includes('faca') || name.includes('adaga') || name.includes('punhal') || name.includes('baioneta')) {
    return React.createElement('img', {
      src: '/SVG/knife.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Machado de arremesso - usar ícone machadodearremesso.svg
  if (name.includes('machado de arremesso')) {
    return React.createElement('img', {
      src: '/SVG/machadodearremeso.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Machadinha - usar ícone Machadinha.svg
  if (name.includes('machadinha')) {
    return React.createElement('img', {
      src: '/SVG/Machadinha.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Machado de combate e machado de mão jotun - usar ícone machado.svg
  if (name.includes('machado de combate') || name.includes('machado de mão jotun')) {
    return React.createElement('img', {
      src: '/SVG/machado.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Machado de guerra, machado pesado e machado de guerra jotun - usar ícone machadodeguerra.svg
  if (name.includes('machado de guerra') || name.includes('machado pesado') || name.includes('machado de guerra jotun')) {
    return React.createElement('img', {
      src: '/SVG/machadodeguerra.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Machado motorizado - usar ícone machadomotorizado.svg
  if (name.includes('machado motorizado')) {
    return React.createElement('img', {
      src: '/SVG/machadomotorizado.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Espadas específicas - usar ícone espada.svg
  if (name.includes('espada curta') || name.includes('espada bastarda') || name.includes('espada longa') || name.includes('espada larga')) {
    return React.createElement('img', {
      src: '/SVG/espada.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Gun Dagger - usar ícone gundagger.svg
  if (name.includes('gun dagger') || name.includes('gundagger')) {
    return React.createElement('img', {
      src: '/SVG/gundagger.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Gunblades - usar ícone gunblade.svg
  if (name.includes('gunblade')) {
    return React.createElement('img', {
      src: '/SVG/gunblade.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Rapier e Reiter Pallasch - usar ícone rapieira.svg (deve vir antes da cimitarra)
  if (name.includes('rapier') || name.includes('reiter pallasch')) {
    return React.createElement('img', {
      src: '/SVG/rapieira.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Cimitarra e armas similares - usar ícone cimitarra.svg
  if (name.includes('sabre') || name.includes('cimitarra') || name.includes('estoque')) {
    return React.createElement('img', {
      src: '/SVG/cimitarra.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Martelos - usar ícone hammer.svg
  if (name.includes('martelete') || name.includes('martelo de guerra') || name.includes('martelo pique') || name.includes('martelo')) {
    return React.createElement('img', {
      src: '/SVG/hammer.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Bastão espinhoso (mais específico primeiro) - usar ícone bastaoespinhoso.svg
  if (name.includes('bastão espinhoso')) {
    return React.createElement('img', {
      src: '/SVG/bastaoespinhoso.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Bastão - usar ícone bastao.svg
  if (name.includes('bastão')) {
    return React.createElement('img', {
      src: '/SVG/bastao.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Maça - usar ícone maca.svg
  if (name.includes('maça')) {
    return React.createElement('img', {
      src: '/SVG/maca.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Morning Star
  if (name.includes('morning star')) {
    return React.createElement('img', {
      src: '/SVG/morningstar.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }

  // Manoplas
  if (name.includes('manoplas') || name.includes('manopla') || name.includes('gauntlet')) {
    return React.createElement('img', {
      src: '/SVG/gauntlet.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Gun Axe - usar ícone gunaxe.svg
  if (name.includes('gun axe')) {
    return React.createElement('img', {
      src: '/SVG/gunaxe.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Boom Hammer - usar ícone boomhammer.svg
  if (name.includes('boom hammer')) {
    return React.createElement('img', {
      src: '/SVG/boomhammer.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Ballistic Lance - usar ícone lanceb.svg
  if (name.includes('ballistic lance')) {
    return React.createElement('img', {
      src: '/SVG/lanceb.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Bow sword - usar ícone bow.svg
  if (name.includes('bow sword')) {
    return React.createElement('img', {
      src: '/SVG/bow.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Arpão
  if (name.includes('arpão') || name.includes('arpao')) {
    return React.createElement('img', {
      src: '/SVG/arpao.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Lança/Pike
  if (name.includes('pike') || name.includes('lança pequena')) {
    return React.createElement('img', {
      src: '/SVG/lanca.svg',
      alt: itemName,
      className: `${className} object-cover rounded`
    });
  }
  
  // Outras armas brancas
  if (name.includes('machado') || name.includes('espada') || name.includes('katana')) {
    return React.createElement(ArmaBrancaIcon, { className });
  }
  
  return React.createElement(GenericoIcon, { className });
};