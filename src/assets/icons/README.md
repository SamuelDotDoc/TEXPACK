# Ícones do Sistema

Esta pasta contém os ícones SVG para diferentes tipos de itens no catálogo.

## Estrutura Atual

- `WeaponIcons.tsx` - Componentes React com ícones SVG para cada tipo de arma
- `ArmorIcons.tsx` - Componentes React com ícones SVG para cada tipo de armadura
- `AmmoIcons.tsx` - Componentes React com ícones SVG para cada tipo de munição

## Como Adicionar Ícones Personalizados

### Opção 1: Substituir os SVGs nos Componentes

1. Abra o arquivo `WeaponIcons.tsx`
2. Localize o componente do tipo de arma que deseja modificar (ex: `PistolaIcon`, `RifleIcon`)
3. Substitua o conteúdo SVG pelo seu ícone personalizado
4. Mantenha as props `className` e `color` para compatibilidade

### Opção 2: Adicionar Arquivos SVG Separados

1. Crie uma subpasta `svg/` dentro desta pasta
2. Adicione seus arquivos SVG com nomes descritivos:
   - `pistola.svg`
   - `rifle.svg`
   - `escopeta.svg`
   - etc.
3. Modifique `WeaponIcons.tsx` para importar e usar esses arquivos

### Opção 3: Usar Ícones de Bibliotecas

Você pode integrar bibliotecas como:
- Heroicons
- Lucide React
- React Icons
- Font Awesome

## Tipos Suportados

### Armas
- **Pistolas** - Glock, Beretta, etc.
- **Revólveres** - Magnum, etc.
- **Escopetas** - Shotgun, cano serrado, etc.
- **Rifles/Fuzis** - Sniper, tiro único, automático, etc.
- **Metralhadoras** - Minigun, automáticas pesadas, etc.
- **Lança-foguetes** - RPG, lança-granadas, etc.
- **Armas Brancas** - Facas, machados, espadas, katanas, etc.
- **Genérico** - Para itens não categorizados

### Armaduras
- **Armadura Leve** - Couro, tecido, roupas básicas
- **Armadura Média** - Cota de malha, brigandine, escamas
- **Armadura Pesada** - Placas, armadura completa
- **Escudos** - Bucklers, escudos grandes
- **Capacetes** - Elmos, cascos, capacetes
- **Roupas** - Camisas, jaquetas, roupas civis
- **Genérico** - Para armaduras não categorizadas

### Munições
- **Munição de Pistola** - 9mm, .38, .45, etc.
- **Munição de Rifle** - 5.56, 7.62, .223, .308, etc.
- **Munição de Escopeta** - 12 gauge, 20 gauge, etc.
- **Munição de Sniper** - .50 BMG, 20x138mm, etc.
- **Granadas** - 40mm, explosivas, incendiárias
- **Foguetes** - RPG, projéteis de canhão
- **Mísseis** - Mini mísseis, S.A.M., etc.
- **Baterias** - 220V, 540V para armas elétricas
- **Combustível** - Tanques para lança-chamas
- **Genérico** - Para munições não categorizadas

## Personalização

Cada ícone pode ser personalizado com:
- **Cor** - Através da prop `color`
- **Tamanho** - Através da prop `className`
- **Detalhes** - Modificando o conteúdo SVG

## Exemplo de Uso

```tsx
// Ícones de Armas
import { PistolaIcon, getWeaponIcon } from './WeaponIcons';
import { getWeaponIcon } from '../utils/weaponIconUtils';

// Ícones de Armaduras
import { LightArmorIcon, getArmorIcon } from './ArmorIcons';
import { getArmorIcon } from '../utils/armorIconUtils';

// Ícones de Munições
import { PistolAmmoIcon, getAmmoIcon } from './AmmoIcons';
import { getAmmoIcon } from '../utils/ammoIconUtils';

// Uso direto dos componentes
<PistolaIcon className="w-8 h-8" color="#3B82F6" />
<LightArmorIcon className="w-8 h-8" color="#10B981" />
<PistolAmmoIcon className="w-8 h-8" color="#3B82F6" />

// Uso das funções automáticas
{getWeaponIcon('Glock 17', 'w-12 h-12')}
{getArmorIcon('Armadura de Couro', 'leve', 'w-12 h-12')}
{getAmmoIcon('9x19mm', undefined, 'w-12 h-12')}
```

## Notas

- Os ícones atuais são placeholders simples
- Eles são dimensionados automaticamente baseado no contexto (catálogo vs inventário)
- A função `getWeaponIcon` detecta automaticamente o tipo baseado no nome do item
- Todos os ícones são SVG para melhor escalabilidade e performance