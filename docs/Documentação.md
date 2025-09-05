# T.E.X. PACK — **MVP** Product Specification (para TRAE AI)

Documento em **Markdown** pensado para uma AI de geração (TRAE AI) produzir um **web-based MVP** de um gerenciador de inventário de RPG com tema *steampunk*.
Contém: visão geral, requisitos funcionais, UX/UI, modelagem de dados, XML de import/export, endpoints/contratos, e critérios de aceitação.

---

## Sumário rápido

* Nome do produto: **T.E.X. PACK**
* Plataforma: Web (SPA)
* Tech suggestions: React (component-based), Tailwind CSS (ou Tailwind-like), react-dnd para drag & drop, canvas/image API para redimensionamento de imagens, armazenamento em memória (MVP) + export/import XML.
* Moeda fictícia: **DIMS** — sigla visual: **DB\$**
* Persistência (MVP): arquivo XML gerado/importado pelo usuário.
* Iconografia: ícones simples por item + opção de upload customizado (será reescalonado).
* Tema visual: tons bronze / ouro / prata, estética steampunk, contraste suave.
* Fonte padrão: legível (e.g., `Inter` ou `Roboto`).

---

## Objetivo do MVP

Permitir ao jogador gerenciar uma **maleta / bolsa** visualmente, adicionando/removendo itens (arrastar/soltar), checar peso total, controlar o saldo em DB\$, importar/exportar inventário em XML, e criar itens genéricos com propriedades customizadas.

---

## Principais funcionalidades (must-have)

1. **Lista inicial de itens** — carregar armas presentes no PDF fornecido como catálogo inicial (dados extraídos do PDF).&#x20;
2. **Área da mochila (backpack grid)** — espaço visual com slots arrastáveis.
3. **Área de armazenamento / banco** — local separado onde o jogador pode deixar itens (arrastar entre mochila e banco).
4. **Drag & Drop** — arrastar itens entre inventário, banco, equip/unequip (se aplicável). Descarte via menu de contexto (clique direito).
5. **Carteira / DB\$** — componente que mostra saldo atual, botões para adicionar/remover DB\$ manualmente (input +/−).
6. **Adicionar item genérico** — formulário para criar item custom com campos: nome, tipo, peso (kg), preço DB\$, descrição, icon (upload ou escolher ícone padrão).
7. **Editar item** — permitir editar propriedades do item (nome, peso, preço, quantia).
8. **Remover item** — excluir item da maleta (confirm modal).
9. **Peso atual** — indicador dinâmico (peso atual / capacidade opcional). Atualiza ao mover/editar/colar itens.
10. **Import / Export XML** — gerar arquivo XML representando inventário e permitir importar o mesmo esquema.
11. **Redimensionamento automático de imagens** — qualquer imagem enviada é reescalonada para tamanho padrão (ex.: 64×64 ou 96×96 px) usando canvas; qualidade pode ser perdida — isso é aceitável.
12. **Temas de cor Steampunk** — esquema de cores predefinido com opções leves (bronze / ouro / prata) e variantes de contraste.

---

## UX / UI — Diretrizes de alto nível

* Design limpo, *card-based*.
* Grid responsivo para a mochila (por exemplo 6 col × 4 lin por padrão). Cada slot mostra ícone, nome curto e quantidade (se aplicável).
* Hover em itens exibe tooltip com todas as propriedades (dano, munição, peso, preço DB\$, alcance, etc.).
* Painel direito: **Carteira DB\$**, **Peso atual da mochila**, botões: `Adicionar item`, `Importar XML`, `Exportar XML`, `Salvar snapshot` (gera XML).
* Modal para `Adicionar item` com campos livres.
* Upload de imagem: preview + botão `Reescalar & Usar`. O sistema reescalona em background (client-side).
* Ícones: coleção padrão SVGs monocromáticos (para poder aplicar cor via CSS). Usuário pode trocar por imagem.
* Feedback visual para drag (shadow, scale) e área alvo destacada.
* Paleta (sugestões hex):

  * Bronze médio: `#8B5E3C`
  * Bronze claro / destaque: `#B07A4B`
  * Ouro suave: `#C9A94B`
  * Prata suave: `#C0C6C9`
  * Fundo escuro neutro: `#1E1B18`
  * Texto claro: `#F5F3F1`
  * Accents/hover: `#E6C27A`
* Tamanho de ícone padrão: **64×64 px** (padrão), armazenado como 64×64 no frontend; thumbnails geradas automaticamente.

---

## Componentes (React) sugeridos

* `App` — root, gerencia estado em memória.
* `InventoryGrid` — grid de slots (drag source/target).
* `ItemCard` — visual do item (icon, name, qty).
* `SidePanel` — DB\$, peso, botões de ações.
* `ItemEditorModal` — criar/editar item.
* `ImportExportModal` — importar/exportar XML.
* `IconUploader` — resize via canvas e retorna DataURL/Blob.
* `StorageBank` — área secundária para armazenar itens.
* `ContextMenu` — menu de contexto com opções de descarte, venda e armazenamento.
* `Persistence` — util JS para gerar/ler XML conforme schema.
* `WeightCalculator` — util para calcular peso total.

---

## Modelo de dados (in-memory) — JSON (exemplo)

```json
{
  "wallet": {
    "currency": "DB$",
    "balance": 1250.00
  },
  "inventory": {
    "slots": 24,
    "items": [
      {
        "id": "item-0001",
        "name": "Pistola",
        "type": "Arma - balístico",
        "damage": "1d10",
        "ammo": "9x19mm",
        "magazine": "8",
        "rate": "1",
        "range_m": 75,
        "weight_kg": 1.1,
        "price_db": 450.00,
        "icon": "data:image/png;base64,..."
      },
      {
        "id": "item-0002",
        "name": "Faca",
        "type": "Corpo-a-corpo",
        "damage": "1d3 perfurante",
        "weight_kg": 0.25,
        "price_db": 5.00,
        "icon": "svg:knife"
      }
    ]
  },
  "storageBank": {
    "items": []
  }
}
```

> Observação: IDs únicos por item; quantidade pode ser modelada por `qty` quando aplicável.

---

## Dados extraídos do PDF (catálogo inicial)

O PDF contém uma lista extensa de armas e itens com atributos (dano, munição, pente, cadência, alcance, peso, preço comum em DB\$). Exemplos (extraídos do PDF): **Pistola** (1d10, 9x19mm, pente 8, alcance 75m, peso 1.1kg, preço comum DB\$450,00), **Revolver** (1d6, .38 Special, pente 6, alcance 35m, peso 0.7kg, preço comum DB\$380,00), **Fuzil automático** (1d10, 5.56x45mm, pente 30/50, alcance 550m, peso 3.3kg, preço DB\$1.150,00) e muitos outros. Use esse catálogo como **seed** inicial do inventário.&#x20;

---

## XML Schema (MVP) — proposta simples

### XSD-like (conceitual)

* Root: `<TEXPackInventory version="1.0">`

  * `<Wallet currency="DB$">` `<Balance>1250.00</Balance>` `</Wallet>`
  * `<Inventory slots="24">`

    * `<Item id="item-0001" qty="1">`

      * `<Name>Pistola</Name>`
      * `<Type>Arma</Type>`
      * `<Damage>1d10</Damage>`
      * `<Ammo>9x19mm</Ammo>`
      * `<Magazine>8</Magazine>`
      * `<Rate>1</Rate>`
      * `<Range_m>75</Range_m>`
      * `<Weight_kg>1.1</Weight_kg>`
      * `<Price_db>450.00</Price_db>`
      * `<Icon encoding="base64">data:image/png;base64,...</Icon>`
      * `<Notes>Opcional</Notes>`
    * `</Item>`
  * `</Inventory>`
  * `<StorageBank>`

    * `<Item .../>`
  * `</StorageBank>`
    `</TEXPackInventory>`

### Exemplo XML (real)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<TEXPackInventory version="1.0">
  <Wallet currency="DB$">
    <Balance>1250.00</Balance>
  </Wallet>
  <Inventory slots="24">
    <Item id="item-0001" qty="1">
      <Name>Pistola</Name>
      <Type>Arma</Type>
      <Damage>1d10</Damage>
      <Ammo>9x19mm</Ammo>
      <Magazine>8</Magazine>
      <Rate>1</Rate>
      <Range_m>75</Range_m>
      <Weight_kg>1.1</Weight_kg>
      <Price_db>450.00</Price_db>
      <Icon encoding="base64">[BASE64-DATA]</Icon>
    </Item>
    <Item id="item-0002" qty="2">
      <Name>Faca</Name>
      <Type>Corpo-a-corpo</Type>
      <Damage>1d3 perfurante</Damage>
      <Weight_kg>0.25</Weight_kg>
      <Price_db>5.00</Price_db>
      <Icon encoding="svg">knife</Icon>
    </Item>
  </Inventory>
  <StorageBank/>
</TEXPackInventory>
```

---

## Import / Export (comportamento)

* **Export**: serializar o estado atual em XML conforme schema e disparar download `TEXPack-inventory-YYYYMMDD.xml`. Incluir icons como base64 dentro do XML.
* **Import**: ler arquivo XML, validar contra schema (simples, no front-end checar campos obrigatórios); se válido, substituir *estado em memória* pelo conteúdo importado (com modal confirmando).
* **Versão**: campo `version` no root para futuras migrações.

---

## Regras de cálculo de peso / UX

* Peso total = soma de `weight_kg * qty` de todos os itens na mochila (não conta StorageBank, a não ser que o item esteja marcado como “guardado na mochila”).
* Mostrar `Peso atual: X kg` no SidePanel. Opcional: mostrar `Capacidade recomendada` (por exemplo 30kg) com barra de progresso.
* Ao exceder 100% da capacidade, mudar cor da barra para warning (amarelo/alaranjado) e + 120% vermelho.

---

## Regras da carteira (DB\$)

* Mostrar saldo atual com botão `+` e `−` para adicionar/remover (user input).
* Ao adicionar item com `Price_db` e `qty`, se houver ação de compra, subtrair automaticamente do balance (se `balance >= price*qty`) — para o MVP, compra é manual: botão `Comprar deste catálogo`.
* Formato exibido: `DB$ 1.250,00`.

---

## Operações / Endpoints (contratos front-end)

(Para TRAE AI: implementar como funções internas da SPA; se quiser expor REST para backend futuro, esses endpoints são o esperado.)

* `GET /api/catalog` — retorna catálogo inicial (seed) — opcional local JSON.
* `POST /api/inventory/export` — retorna XML (ou dispara download).
* `POST /api/inventory/import` — recebe XML, valida e retorna estado.
* `PUT /api/wallet` — atualiza balance.
* `POST /api/item` — cria item custom (body = item payload).
* `PUT /api/item/:id` — atualizar item.
* `DELETE /api/item/:id` — remove item.
* `POST /api/drag` — (opcional) registrar migração de item entre containers; em MVP o drag é puramente cliente.

> Para o MVP, todas as operações podem ser **client-side only** (no-memory). Apenas export/import operam com arquivos.

---

## Detalhes técnicos importantes para implementação (TRAE AI)

1. **Drag & Drop**: usar `react-dnd` com HTML5Backend. Cada `ItemCard` é `DragSource`, cada `Slot` é `DropTarget`.
2. **Resizing de imagens**: no `IconUploader`, usar `<canvas>` para reescalonar qualquer imagem recebida para 64×64 (ou tamanho configurável). Armazenar resultante como base64 DataURL.
3. **Armazenamento em memória**: usar Context API ou Zustand para estado global. Permitir `undo`/`redo` simples opcional.
4. **Validations**: impedir colocar item em slot que já está ocupado a menos que `stackable` seja true.
5. **Accessibility**: suporte keyboard (selecionar item + teclas para mover).
6. **I18n**: strings em português por padrão.
7. **Teste**: incluir unit tests básicos para serialização XML e calc peso.
8. **Responsividade**: grid reduz colunas em telas pequenas; usar horizontal scroll se necessário.

---

## Seed catalog — sugestões de itens iniciais (do PDF)

(Incluir no JSON inicial / catálogo; exemplos representativos)

* Pistola — dano `1d10 balístico`, munição `9x19mm`, pente `8`, cadência `1`, alcance `75m`, peso `1.1kg`, preço comum `DB$450,00`.
* Revolver — dano `1d6 balístico`, munição `.38 Special`, pente `6`, alcance `35m`, peso `0.7kg`, preço comum `DB$380,00`.
* Fuzil automático — dano `1d10 balístico`, munição `5.56x45mm`, pente `30/50`, cadência `5`, alcance `550m`, peso `3.3kg`, preço comum `DB$1.150,00`.
* Faca — dano `1d3 perfurante`, tamanho `20cm`, peso `0.25kg`, preço comum `DB$5,00`.
* Machado motorizado — dano `1d4 cortante (+motorizado)`, peso `10.5kg`, preço comum `DB$25.950,00`.

> O PDF contém dezenas de armas e itens; use-o como catálogo completo para popular `GET /api/catalog`.&#x20;

---

## Casos de uso e fluxos (MVP)

1. **Criar novo inventário**: Entrar → `Adicionar item` → preencher → salvar (em memória) → `Exportar XML`.
2. **Carregar inventário**: `Importar XML` → parse → substituir estado → UI atualiza.
3. **Mover item**: arrastar `Pistola` do catálogo/banco para slot na mochila → peso atual atualiza.
4. **Editar item**: clicar no item → `Editar` → modificar peso → confirmar → peso recalculado.
5. **Alterar DB\$**: SidePanel → insere +DB\$500 → balance atualiza.
6. **Upload de ícone**: Ao criar/editar item, `Upload image` → reescalar → armazenar base64 → exibir.

---

## Critérios de aceite (MVP)

* [ ] Pode arrastar e soltar itens entre mochila e storage.
* [ ] Peso total mostrado e recalculado ao mudar itens.
* [ ] Carteira DB\$ visível e atualizável.
* [ ] Usuário consegue criar item genérico com campos obrigatórios (nome, peso, preço).
* [ ] Usuário pode importar um XML gerado pelo app e o estado é restaurado.
* [ ] Usuário pode exportar o inventário atual como XML.
* [ ] Ícones podem ser trocados por upload e o sistema reescalona imagens.
* [ ] Design segue paleta steampunk definida e é legível.
* [ ] Catalogo inicial populado com as armas do PDF (seed).&#x20;

---

## Test cases rápidos

1. Adicionar 3 itens de 1.1kg cada → Peso mostra 3.3kg.
2. Subir uma imagem 2000×2000 px → após upload mostra ícone 64×64.
3. Export → importar o mesmo XML → estado idêntico.
4. Tentar comprar item de DB\$500 com saldo DB\$100 → alert `Saldo insuficiente`.

---

## Notas finais para TRAE AI / Desenvolvedor

* MVP focado em **experiência visual** e operações client-only (imediato).
* Persistência por XML evita backend e facilita demos.
* Catálogo do PDF é fonte autoritativa para atributos de armas — use-o como seed e permita que o usuário adicione variantes.&#x20;
* Manter código modular para futura adição de autenticação, multi-saves, e backend.

---