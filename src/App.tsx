import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameProvider } from './context/GameContext';
import { useGameContext } from './hooks/useGame';
import InventoryGrid from './components/InventoryGrid';
import StorageBank from './components/StorageBank';
import EquipmentGrid from './components/EquipmentGrid';
import SidePanel from './components/SidePanel';
import TopMenu from './components/TopMenu';

import WeaponsCatalog from './components/WeaponsCatalog';
import AmmoCatalog from './components/AmmoCatalog';
import ArmorCatalog from './components/ArmorCatalog';
import GenericCatalog from './components/GenericCatalog';
import ItemEditModal from './components/ItemEditModal';
import CatalogImportModal from './components/CatalogImportModal';
import WeaponAmmoSelectionModal from './components/WeaponAmmoSelectionModal';
import { type Item, type Catalog } from './types';
import { exportToXML, importFromXML, downloadXML, uploadXML } from './utils/xmlUtils';

function AppContent() {
  const { state, dispatch } = useGameContext();
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = (updatedItem: Item) => {
    if (editingItem === null) {
      // Adicionando novo item
      dispatch({ type: 'ADD_ITEM_TO_INVENTORY', item: updatedItem });
    } else {
      // Atualizando item existente
      dispatch({ type: 'UPDATE_ITEM', item: updatedItem });
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleAddToInventory = (item: Item) => {
    dispatch({ type: 'ADD_ITEM_TO_INVENTORY', item });
  };

  const handleImportXML = async () => {
    try {
      const xmlContent = await uploadXML();
      const gameState = importFromXML(xmlContent);
      
      if (gameState) {
        const confirmImport = window.confirm(
          'Isso substituirá todos os dados atuais. Deseja continuar?'
        );
        
        if (confirmImport) {
          dispatch({ type: 'LOAD_GAME_STATE', gameState });
          alert('Dados importados com sucesso!');
        }
      } else {
        alert('Erro ao importar arquivo XML. Verifique se o arquivo está correto.');
      }
    } catch (error) {
      console.error('Erro na importação:', error);
      alert('Erro ao importar arquivo XML.');
    }
  };

  const handleExportXML = () => {
    try {
      const xmlContent = exportToXML(state);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `texpack-backup-${timestamp}.xml`;
      downloadXML(xmlContent, filename);
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Erro ao exportar dados.');
    }
  };

  const handleAddCatalog = () => {
    setShowCatalogModal(true);
  };

  const handleSaveCatalog = (catalogName: string, items: Item[]) => {
    const catalog: Catalog = {
      id: `custom-${Date.now()}`,
      name: catalogName,
      items
    };
    dispatch({ type: 'ADD_CUSTOM_CATALOG', catalog });
    setShowCatalogModal(false);
  };

  const handleAmmoSelection = (ammoId: string, ammoType: string) => {
    if (state.showAmmoSelection) {
      dispatch({
        type: 'SET_WEAPON_AMMO',
        weaponId: state.showAmmoSelection.weaponId,
        ammoId,
        ammoType
      });
      // Após selecionar a munição, tentar recarregar novamente
      dispatch({
        type: 'RELOAD_WEAPON',
        itemId: state.showAmmoSelection.weaponId
      });
    }
  };

  const handleCloseAmmoSelection = () => {
    // Limpar o estado de seleção de munição
    dispatch({ type: 'CLEAR_AMMO_SELECTION' });
  };

  const handleCloseCatalogModal = () => {
    setShowCatalogModal(false);
  };

  const handleRemoveCatalog = (catalogId: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_CATALOG', catalogId });
  };

  return (
    <div className="min-h-screen bg-dark-neutral text-light-text">
          {/* Top Menu */}
          <TopMenu
            onAddItem={handleAddItem}
            onImportXML={handleImportXML}
            onExportXML={handleExportXML}
            onAddCatalog={handleAddCatalog}
          />
          
          <div className="p-4">

          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Aba de Equipamentos - Esquerda */}
            <div className="w-full lg:w-80 xl:w-96">
              <EquipmentGrid onEditItem={handleEditItem} />
            </div>

            {/* Área principal - Centro */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Inventário */}
              <InventoryGrid onEditItem={handleEditItem} />
              
              {/* Banco de Armazenamento */}
              <StorageBank onEditItem={handleEditItem} />
              
              {/* Catálogo de Armas */}
              <WeaponsCatalog 
                onEditItem={handleEditItem} 
                onAddToInventory={handleAddToInventory}
              />
              
              {/* Catálogo de Munições */}
              <AmmoCatalog 
                onEditItem={handleEditItem} 
                onAddToInventory={handleAddToInventory}
              />
              
              {/* Catálogo de Armaduras */}
              <ArmorCatalog 
                onEditItem={handleEditItem} 
                onAddToInventory={handleAddToInventory}
              />
              
              {/* Catálogos Personalizados */}
              {state.customCatalogs.map((catalog) => (
                <GenericCatalog
                  key={catalog.id}
                  catalog={catalog}
                  onEditItem={handleEditItem}
                  onAddToInventory={handleAddToInventory}
                  onRemoveCatalog={handleRemoveCatalog}
                />
              ))}
            </div>

            {/* Painel lateral - Direita */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
              <SidePanel />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 text-bronze-light text-sm">
            <p>T.E.X. PACK v1.0 - MVP | Desenvolvido com React + TypeScript</p>
          </footer>
          </div>

          {/* Modal para editar item */}
          {showItemModal && (
            <ItemEditModal
              item={editingItem}
              isOpen={showItemModal}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
            />
          )}

          {/* Modal para importar catálogo */}
          {showCatalogModal && (
            <CatalogImportModal
              isOpen={showCatalogModal}
              onClose={handleCloseCatalogModal}
              onImport={handleSaveCatalog}
            />
          )}

          {/* Modal para seleção de munição */}
          {state.showAmmoSelection && (() => {
            // Encontrar o objeto weapon pelo ID
            const weaponObj = Object.values(state.inventory.items)
              .find(item => item.id === state.showAmmoSelection!.weaponId) ||
              Object.values(state.equippedItems)
              .find(item => item?.id === state.showAmmoSelection!.weaponId);
            
            return (
              <WeaponAmmoSelectionModal
                isOpen={true}
                onClose={handleCloseAmmoSelection}
                weapon={weaponObj || null}
              />
            );
          })()}
        </div>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </DndProvider>
  );
}

export default App;
