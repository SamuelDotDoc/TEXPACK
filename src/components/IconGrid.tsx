import React from 'react';

interface IconGridProps {
  selectedIcon: string | null;
  onIconSelect: (iconPath: string) => void;
  onClose: () => void;
}

const IconGrid: React.FC<IconGridProps> = ({ selectedIcon, onIconSelect, onClose }) => {
  // Lista de ícones SVG disponíveis
  const availableIcons = [
    'Artillary.svg',
    'SAM.svg',
    'ammo-bag.svg',
    'antitank.svg',
    'apshotgun.svg',
    'armor.svg',
    'arpao.svg',
    'atrifle.svg',
    'autopistol.svg',
    'bastao.svg',
    'bastaoespinhoso.svg',
    'bazooka.svg',
    'bomb.svg',
    'canhaodemao.svg',
    'cannon-ball.svg',
    'cannon.svg',
    'cimitarra.svg',
    'cog.svg',
    'electricity.svg',
    'escopetacanoserrado.svg',
    'evelyn.svg',
    'escopetatatica.svg',
    'espada.svg',
    'flamethrower.svg',
    'fuzil.svg',
    'fuzilpesado.svg',
    'gauntlet.svg',
    'grenade-launcher.svg',
    'hammer.svg',
    'interceptor.svg',
    'knife.svg',
    'lanca.svg',
    'lancadecavalaria.svg',
    'lee-enfield.svg',
    'lightning.svg',
    'lightningpebble.svg',
    'maca.svg',
    'machado.svg',
    'Machadinha.svg',
    'machadodearremeso.svg',
    'machadodeguerra.svg',
    'machadomotorizado.svg',
    'metalammo.svg',
    'metralhadora.svg',
    'minigun.svg',
    'missile.svg',
    'morningstar.svg',
    'mortar.svg',
    'napalm.svg',
    'pebblefire.svg',
    'pebblemissile.svg',
    'pistola.svg',
    'poison.svg',
    'powerarmor.svg',
    'rail.svg',
    'revolver.svg',
    'revolverpesado.svg',
    'rifledeprecisao.svg',
    'sai.svg',
    'rifleleveraction.svg',
    'robot_armor.svg',
    'shell.svg',
    'spear-launcher.svg',
    'stungun.svg',
    'submetralhadora.svg',
    'tank.svg'
  ];

  const handleIconClick = (iconName: string) => {
    const iconPath = `/SVG/${iconName}`;
    onIconSelect(iconPath);
    onClose();
  };

  const getIconDisplayName = (iconName: string) => {
    return iconName.replace('.svg', '').replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000000]">
      <div className="bg-gray-900 border border-yellow-600 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-yellow-400">Selecionar Ícone</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
            {availableIcons.map((iconName) => {
              const iconPath = `/SVG/${iconName}`;
              const isSelected = selectedIcon === iconPath;
              
              return (
                <div
                  key={iconName}
                  onClick={() => handleIconClick(iconName)}
                  className={`
                    relative group cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center aspect-square
                    ${isSelected 
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20' 
                      : 'border-gray-600 hover:border-yellow-400 hover:bg-gray-800'
                    }
                  `}
                  title={getIconDisplayName(iconName)}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                  src={iconPath}
                  alt={getIconDisplayName(iconName)}
                  className="w-12 h-12 object-contain filter brightness-0 invert group-hover:brightness-75"
                  onError={(e) => {
                        // Fallback para ícone não encontrado
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<span class="text-gray-500 text-xs">?</span>';
                      }}
                    />
                  </div>
                  
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconGrid;