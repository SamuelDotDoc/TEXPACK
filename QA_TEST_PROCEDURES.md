# 📋 Procedimentos de Teste de QA - TEXPACK

## 🎯 Objetivo
Este documento fornece procedimentos detalhados para testar todas as funcionalidades do aplicativo TEXPACK, um sistema de gerenciamento de inventário para RPG.

## 🔧 Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- Navegador web moderno (Chrome, Firefox, Edge)
- Conhecimento básico de navegação web

## 🚀 Configuração Inicial

### 1. Instalação e Execução
```bash
# Clone ou acesse o diretório do projeto
cd TEXPACK

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### 2. Acesso ao Aplicativo
- Abra o navegador e acesse: `http://localhost:5173`
- Verifique se a interface carrega corretamente
- **Resultado Esperado**: Interface steampunk com painéis de inventário, catálogos e equipamentos

## 📝 Casos de Teste

### TC001 - Carregamento Inicial da Aplicação
**Objetivo**: Verificar se a aplicação carrega corretamente

**Passos**:
1. Acesse `http://localhost:5173`
2. Aguarde o carregamento completo
3. Verifique se todos os painéis estão visíveis

**Resultado Esperado**:
- ✅ Interface carrega sem erros
- ✅ Painéis visíveis: Inventário, Equipamentos, Banco de Armazenamento, Catálogos
- ✅ Menu de contexto disponível com clique direito
- ✅ Menu superior com opções funcionais

### TC002 - Catálogo de Armas
**Objetivo**: Testar funcionalidades do catálogo de armas

**Passos**:
1. Clique na aba "Armas" no painel lateral
2. Verifique se as armas são carregadas
3. Teste a busca digitando "pistola"
4. Limpe a busca
5. Teste os filtros por categoria

**Resultado Esperado**:
- ✅ Lista de armas carrega corretamente
- ✅ Busca filtra resultados em tempo real
- ✅ Filtros por categoria funcionam
- ✅ Ícones SVG das armas são exibidos corretamente
- ✅ Cores dos ícones correspondem às categorias

### TC003 - Catálogo de Munições
**Objetivo**: Testar funcionalidades do catálogo de munições

**Passos**:
1. Clique na aba "Munições"
2. Verifique o carregamento das munições
3. Teste a busca por tipo de munição
4. Verifique os ícones e informações

**Resultado Esperado**:
- ✅ Munições carregam corretamente
- ✅ Busca funciona adequadamente
- ✅ Informações de calibre e tipo são exibidas
- ✅ Ícones apropriados para cada tipo

### TC004 - Catálogo de Armaduras
**Objetivo**: Testar funcionalidades do catálogo de armaduras

**Passos**:
1. Clique na aba "Armaduras"
2. Verifique diferentes tipos (Humanos, Power Armor, Robot Armor)
3. Teste a busca e filtros
4. Verifique informações de proteção

**Resultado Esperado**:
- ✅ Todos os tipos de armadura carregam
- ✅ Informações de proteção são exibidas
- ✅ Filtros funcionam corretamente
- ✅ Ícones diferenciados por tipo

### TC005 - Drag & Drop - Catálogo para Inventário
**Objetivo**: Testar adição de itens do catálogo ao inventário

**Passos**:
1. Selecione uma arma no catálogo
2. Arraste para um slot vazio do inventário
3. Verifique se o item foi adicionado
4. Repita com munição e armadura
5. Teste arrastar para slot ocupado

**Resultado Esperado**:
- ✅ Item é adicionado ao inventário
- ✅ Ícone e informações corretas no slot
- ✅ Contador de peso atualiza (se aplicável)
- ✅ Não substitui item existente sem confirmação

### TC006 - Drag & Drop - Inventário para Equipamentos
**Objetivo**: Testar equipar itens do inventário

**Passos**:
1. Adicione uma arma ao inventário
2. Arraste para a área de equipamentos
3. Para armas, teste o modal de seleção de mão
4. Teste equipar armadura
5. Teste equipar módulos/artefatos

**Resultado Esperado**:
- ✅ Modal de seleção de mão aparece para armas
- ✅ Item é equipado no slot correto
- ✅ Item desaparece do inventário
- ✅ Informações do item são mantidas

### TC007 - Drag & Drop - Inventário para Banco
**Objetivo**: Testar armazenamento de itens

**Passos**:
1. Adicione itens ao inventário
2. Arraste para o Banco de Armazenamento
3. Verifique se o contador atualiza
4. Teste arrastar do banco de volta ao inventário

**Resultado Esperado**:
- ✅ Item é movido para o banco
- ✅ Contador do banco atualiza
- ✅ Item pode ser movido de volta
- ✅ Dica sobre peso é exibida

### TC008 - Sistema de Descarte
**Objetivo**: Verificar funcionalidade de descarte de itens via menu de contexto

**Passos**:
1. Clique direito em um item
2. Selecione "Descartar" no menu
3. Confirme a exclusão no modal
4. Verifique se o item foi removido

**Resultado Esperado**:
- ✅ Menu de contexto aparece com clique direito
- ✅ Modal de confirmação aparece
- ✅ Item é removido após confirmação

### TC009 - Edição de Itens
**Objetivo**: Testar funcionalidade de edição

**Passos**:
1. Clique com botão direito em um item
2. Selecione "Editar" no menu contextual
3. Modifique propriedades (nome, munição atual, etc.)
4. Salve as alterações
5. Teste cancelar edição

**Resultado Esperado**:
- ✅ Menu contextual aparece
- ✅ Modal de edição abre
- ✅ Campos são editáveis
- ✅ Alterações são salvas
- ✅ Cancelar descarta mudanças

### TC010 - Seleção de Munição para Armas
**Objetivo**: Testar sistema de munição

**Passos**:
1. Equipe uma arma de fogo
2. Clique com botão direito na arma
3. Selecione "Selecionar Munição"
4. Escolha um tipo de munição compatível
5. Verifique se a munição é aplicada

**Resultado Esperado**:
- ✅ Modal de seleção de munição abre
- ✅ Apenas munições compatíveis são mostradas
- ✅ Munição é aplicada à arma
- ✅ Informações de munição são atualizadas

### TC011 - Importação de Catálogos
**Objetivo**: Testar importação de arquivos JSON

**Passos**:
1. Clique em "Importar Catálogo" no menu
2. Selecione um arquivo JSON válido
3. Verifique se os itens são carregados
4. Teste com arquivo inválido

**Resultado Esperado**:
- ✅ Arquivo válido é importado com sucesso
- ✅ Itens aparecem no catálogo apropriado
- ✅ Arquivo inválido mostra erro
- ✅ Interface não quebra com erro

### TC012 - Responsividade da Interface
**Objetivo**: Testar adaptação a diferentes tamanhos de tela

**Passos**:
1. Redimensione a janela do navegador
2. Teste em diferentes resoluções
3. Verifique scroll quando necessário
4. Teste em dispositivo móvel (se aplicável)

**Resultado Esperado**:
- ✅ Interface se adapta ao tamanho da tela
- ✅ Elementos não se sobrepõem
- ✅ Scroll funciona adequadamente
- ✅ Funcionalidades mantêm-se acessíveis

### TC013 - Performance e Estabilidade
**Objetivo**: Testar performance com muitos itens

**Passos**:
1. Adicione muitos itens ao inventário (20+)
2. Teste drag & drop com inventário cheio
3. Realize múltiplas operações rapidamente
4. Verifique uso de memória no DevTools

**Resultado Esperado**:
- ✅ Interface permanece responsiva
- ✅ Operações não apresentam lag significativo
- ✅ Sem vazamentos de memória
- ✅ Animações fluidas

## 🐛 Relatório de Bugs

### Formato para Reportar Bugs
```
**ID**: BUG-XXX
**Título**: [Descrição breve do problema]
**Severidade**: Alta/Média/Baixa
**Passos para Reproduzir**:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Resultado Atual**: [O que acontece]
**Resultado Esperado**: [O que deveria acontecer]
**Navegador**: [Chrome/Firefox/Edge + versão]
**Screenshots**: [Se aplicável]
```

## ✅ Checklist Final

### Funcionalidades Básicas
- [ ] Aplicação carrega sem erros
- [ ] Todos os catálogos funcionam
- [ ] Drag & drop funciona em todos os cenários
- [ ] Sistema de equipamentos funciona
- [ ] Banco de armazenamento funciona
- [ ] Sistema de descarte via menu de contexto funciona
- [ ] Edição de itens funciona
- [ ] Importação de catálogos funciona

### Interface e UX
- [ ] Interface é intuitiva
- [ ] Feedback visual adequado
- [ ] Animações fluidas
- [ ] Responsividade adequada
- [ ] Sem elementos quebrados

### Performance
- [ ] Carregamento rápido
- [ ] Operações responsivas
- [ ] Sem travamentos
- [ ] Uso de memória adequado

### Compatibilidade
- [ ] Funciona no Chrome
- [ ] Funciona no Firefox
- [ ] Funciona no Edge
- [ ] Funciona em diferentes resoluções

## 📞 Contato
Para reportar bugs ou dúvidas sobre os testes, entre em contato com a equipe de desenvolvimento.

---
**Versão do Documento**: 1.0  
**Data**: $(date)  
**Testador**: [Nome do Testador]