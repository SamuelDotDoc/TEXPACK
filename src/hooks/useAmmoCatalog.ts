import { useState, useEffect } from 'react';
import { type Item } from '../types';

export const useAmmoCatalog = () => {
  const [ammo, setAmmo] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAmmoCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch('/ammo_catalog.json');
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar catálogo: ${response.status}`);
        }
        
        const data: Item[] = await response.json();
        
        // Adicionar ícone padrão para munições se não tiver
        const ammoItems = data.map((item, index) => ({
          ...item,
          id: item.id || `ammo_${index}`,
          icon: item.icon || '🔫',
          type: 'ammo' as const
        }));
        
        setAmmo(ammoItems);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar catálogo de munições:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadAmmoCatalog();
  }, []);

  return { ammo, loading, error };
};