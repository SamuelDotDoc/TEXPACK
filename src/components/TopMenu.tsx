import React from 'react';
import { CogIcon } from '../utils/armorIconUtils';

interface TopMenuProps {
  onAddItem: () => void;
  onImportXML: () => void;
  onExportXML: () => void;
  onAddCatalog: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ onAddItem, onImportXML, onExportXML, onAddCatalog }) => {
  return (
    <div className="bg-bronze-dark border-b-2 border-gold-soft shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl">
              <CogIcon className="w-8 h-8" color="#D4AF37" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gold-soft">
                T.E.X. PACK
              </h1>
              <p className="text-sm text-bronze-light">
                Gerenciador de Inventário Steampunk
              </p>
            </div>
          </div>
          
          {/* Menu de Ações */}
          <nav className="flex items-center space-x-3">
            <button
              onClick={onAddItem}
              className="steampunk-button px-4 py-2 text-sm flex items-center space-x-2 bg-gold-medium hover:bg-gold-soft text-bronze-dark font-semibold"
            >
              <span>➕</span>
              <span>Adicionar Item</span>
            </button>
            
            <button
              onClick={onImportXML}
              className="steampunk-button px-4 py-2 text-sm flex items-center space-x-2"
            >
              <span>📁</span>
              <span>Importar XML</span>
            </button>
            
            <button
              onClick={onExportXML}
              className="steampunk-button px-4 py-2 text-sm flex items-center space-x-2"
            >
              <span>💾</span>
              <span>Exportar XML</span>
            </button>
            
            <button
              onClick={onAddCatalog}
              className="steampunk-button px-4 py-2 text-sm flex items-center space-x-2"
            >
              <span>📚</span>
              <span>Catálogo</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;