import React, { useState, useRef } from 'react';
import { type Item } from '../types';

interface CatalogImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (catalogName: string, items: Item[]) => void;
}

const CatalogImportModal: React.FC<CatalogImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [catalogName, setCatalogName] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Por favor, selecione um arquivo JSON válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonContent(content);
      setError('');
      
      // Sugerir nome baseado no arquivo
      if (!catalogName) {
        const fileName = file.name.replace('.json', '');
        setCatalogName(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
    };
    reader.readAsText(file);
  };

  const handleJsonTextChange = (value: string) => {
    setJsonContent(value);
    setError('');
  };

  const validateAndImport = () => {
    if (!catalogName.trim()) {
      setError('Por favor, digite um nome para o catálogo.');
      return;
    }

    if (!jsonContent.trim()) {
      setError('Por favor, forneça o conteúdo JSON do catálogo.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const parsedData = JSON.parse(jsonContent);
      
      // Validar se é um array de itens
      if (!Array.isArray(parsedData)) {
        throw new Error('O JSON deve conter um array de itens.');
      }

      // Validar estrutura básica dos itens
      const validItems: Item[] = parsedData.map((item, index) => {
        if (!item.name || typeof item.name !== 'string') {
          throw new Error(`Item ${index + 1}: campo 'name' é obrigatório e deve ser uma string.`);
        }
        
        return {
          id: item.id || `${catalogName.toLowerCase()}_${index + 1}`,
          name: item.name,
          type: item.type || 'item',
          weight_kg: parseFloat(item.weight_kg) || 0,
          price_db: parseFloat(item.price_db) || 0,
          damage: item.damage || '',
          ammo: item.ammo || '',
          notes: item.notes || '',
          icon: item.icon || '',
          qty: parseInt(item.qty) || 1
        };
      });

      onImport(catalogName.trim(), validItems);
      handleClose();
    } catch (err) {
      setError(`Erro ao processar JSON: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCatalogName('');
    setJsonContent('');
    setError('');
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999999] p-4">
      <div className="bg-dark-neutral border border-bronze-medium rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gold-soft mb-4 text-center">
          📚 Adicionar Novo Catálogo
        </h2>
        
        {/* Nome do Catálogo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-bronze-light mb-2">
            Nome do Catálogo *
          </label>
          <input
            type="text"
            value={catalogName}
            onChange={(e) => setCatalogName(e.target.value)}
            placeholder="Ex: Armaduras, Poções, Equipamentos..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gold-soft"
          />
        </div>

        {/* Upload de Arquivo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-bronze-light mb-2">
            Importar Arquivo JSON
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gold-soft file:text-bronze-dark hover:file:bg-gold-medium"
          />
        </div>

        {/* Ou inserir JSON manualmente */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-bronze-light mb-2">
            Ou Cole o JSON Aqui
          </label>
          <textarea
            value={jsonContent}
            onChange={(e) => handleJsonTextChange(e.target.value)}
            placeholder={`[\n  {\n    "name": "Item Exemplo",\n    "type": "weapon",\n    "weight_kg": 1.5,\n    "price_db": 100,\n    "damage": "1d6",\n    "notes": "Descrição do item"\n  }\n]`}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gold-soft font-mono text-sm"
            rows={8}
          />
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Dica */}
        <div className="mb-6 p-3 bg-blue-900/30 border border-blue-600 rounded text-blue-300 text-sm">
          💡 <strong>Dica:</strong> O JSON deve ser um array de objetos. Campos obrigatórios: <code>name</code>. 
          Campos opcionais: <code>type</code>, <code>weight_kg</code>, <code>price_db</code>, <code>damage</code>, <code>ammo</code>, <code>notes</code>, <code>icon</code>.
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={validateAndImport}
            disabled={isLoading || !catalogName.trim() || !jsonContent.trim()}
            className="flex-1 px-4 py-2 bg-gold-soft hover:bg-gold-medium disabled:bg-gray-600 disabled:cursor-not-allowed text-bronze-dark font-medium rounded transition-colors"
          >
            {isLoading ? '⏳ Importando...' : '📚 Adicionar Catálogo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogImportModal;