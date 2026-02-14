# Design do Aplicativo AACB Gestão de Associados

## Visão Geral

Aplicativo móvel para gestão de associados de uma associação/cooperativa, com foco em gerenciamento de cobranças, pagamentos e envio automático de boletos. O app é voltado para administradores/gerentes da organização.

**Orientação:** Portrait (9:16) | **Uso:** Uma mão | **Padrão:** iOS HIG (Human Interface Guidelines)

---

## Lista de Telas

1. **Login** - Autenticação de administradores
2. **Dashboard** - Visão geral com estatísticas e alertas
3. **Lista de Associados** - Todos os associados com busca e filtros
4. **Detalhe do Associado** - Informações completas, histórico de pagamentos e status de débitos
5. **Adicionar/Editar Associado** - Formulário para cadastro ou atualização
6. **Lista de Cobranças** - Devedores e atrasos pendentes
7. **Detalhe da Cobrança** - Informações do débito, gerar boleto, enviar notificação
8. **Histórico de Pagamentos** - Todos os pagamentos registrados
9. **Configurações** - Logout, preferências da aplicação

---

## Conteúdo Primário e Funcionalidade por Tela

### 1. Login
- **Conteúdo:** Campo de email/CPF, campo de senha, botão "Entrar"
- **Funcionalidade:** Autenticar usuário administrador, persistir sessão
- **Fluxo:** Validar credenciais → Dashboard

### 2. Dashboard
- **Conteúdo:**
  - Cartão com total de associados (ativo/inativo)
  - Cartão com total de cobranças pendentes (valor total)
  - Cartão com total de pagamentos do mês
  - Lista de "Últimas Cobranças" (3-5 itens)
  - Botão flutuante para ações rápidas
- **Funcionalidade:** Exibir resumo, acesso rápido às principais funcionalidades
- **Fluxo:** Dashboard → Gestão de Associados / Cobranças / Pagamentos

### 3. Lista de Associados
- **Conteúdo:**
  - Barra de busca (nome, email, CPF)
  - Filtros: Ativo/Inativo
  - Lista de cards com: nome, email, status, data de adesão
  - Botão flutuante "+" para adicionar novo
- **Funcionalidade:** Visualizar todos, buscar, filtrar, navegar para detalhe
- **Fluxo:** Toque em associado → Detalhe | Toque "+" → Adicionar

### 4. Detalhe do Associado
- **Conteúdo:**
  - Informações: Nome, Email, CPF, Data de Adesão, Status
  - Seção "Pagamentos Recentes" (últimos 3)
  - Seção "Débitos Pendentes" (se houver)
  - Botões: Editar, Registrar Pagamento, Gerar Boleto, Excluir
- **Funcionalidade:** Visualizar histórico completo, ações diretas
- **Fluxo:** Editar → Editar Associado | Registrar → Novo Pagamento | Gerar Boleto → Detalhe Cobrança

### 5. Adicionar/Editar Associado
- **Conteúdo:**
  - Campos: Nome, Email, CPF, Data de Adesão (pré-preenchida), Status (dropdown)
  - Botões: Salvar, Cancelar
- **Funcionalidade:** Criar novo ou atualizar existente
- **Fluxo:** Salvar → Voltar para Lista / Detalhe

### 6. Lista de Cobranças
- **Conteúdo:**
  - Filtros: Por Status (Pendente, Vencido, Pago)
  - Lista de cards com: Nome do Associado, Valor, Mês de Referência, Status, Dias em Atraso
  - Ícone visual para urgência (cores: verde=ok, amarelo=próximo vencimento, vermelho=vencido)
- **Funcionalidade:** Visualizar cobranças, filtrar por status, navegar para detalhe
- **Fluxo:** Toque em cobrança → Detalhe da Cobrança

### 7. Detalhe da Cobrança
- **Conteúdo:**
  - Informações: Associado, Valor, Mês de Referência, Data de Vencimento, Status
  - Histórico de tentativas de cobrança (envios de boleto, notificações)
  - Botões: Gerar Boleto, Enviar Notificação, Marcar como Pago, Excluir
- **Funcionalidade:** Visualizar detalhes, gerar boleto, enviar notificações automáticas
- **Fluxo:** Gerar Boleto → Exibir/Compartilhar | Enviar Notificação → Confirmação

### 8. Histórico de Pagamentos
- **Conteúdo:**
  - Filtros: Por Data, Por Associado
  - Lista com: Data, Associado, Valor, Mês de Referência
  - Busca por período
- **Funcionalidade:** Visualizar todos os pagamentos registrados
- **Fluxo:** Visualização apenas (leitura)

### 9. Configurações
- **Conteúdo:**
  - Informações do usuário logado
  - Opção de tema (claro/escuro)
  - Opção de notificações
  - Botão Logout
- **Funcionalidade:** Gerenciar preferências, sair da aplicação
- **Fluxo:** Logout → Tela de Login

---

## Fluxos de Usuário Principais

### Fluxo 1: Visualizar Associado e Registrar Pagamento
1. Usuário abre Dashboard
2. Toca em "Gestão de Associados"
3. Busca por associado (nome/email)
4. Toca no associado para ver detalhe
5. Toca em "Registrar Pagamento"
6. Preenche valor e mês de referência
7. Confirma → Pagamento registrado, débito removido

### Fluxo 2: Gerar e Enviar Boleto para Devedor
1. Usuário abre Dashboard
2. Toca em "Cobranças Pendentes"
3. Visualiza lista de devedores
4. Toca em um devedor
5. Toca em "Gerar Boleto"
6. Sistema gera boleto (simulado ou integrado com API)
7. Toca em "Enviar Notificação"
8. Sistema envia email/SMS com boleto
9. Confirmação de envio

### Fluxo 3: Adicionar Novo Associado
1. Usuário abre "Gestão de Associados"
2. Toca em botão "+"
3. Preenche formulário (Nome, Email, CPF, Status)
4. Toca "Salvar"
5. Novo associado aparece na lista

---

## Escolhas de Cor

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primary** | #0a7ea4 (Azul Profissional) | Botões principais, destaques, headers |
| **Success** | #22C55E (Verde) | Status "Pago", confirmações |
| **Warning** | #F59E0B (Âmbar) | Próximo vencimento, alertas leves |
| **Error** | #EF4444 (Vermelho) | Status "Vencido", erros críticos |
| **Background** | #FFFFFF (Claro) / #151718 (Escuro) | Fundo geral |
| **Surface** | #F5F5F5 (Claro) / #1e2022 (Escuro) | Cards, superfícies elevadas |
| **Foreground** | #11181C (Claro) / #ECEDEE (Escuro) | Texto principal |
| **Muted** | #687076 (Claro) / #9BA1A6 (Escuro) | Texto secundário, labels |

---

## Padrões de Interação

- **Botões Primários:** Azul com texto branco, feedback de escala (0.97) + haptic
- **Botões Secundários:** Contorno azul, fundo transparente
- **Cards:** Toque com feedback de opacidade (0.7)
- **Listas:** ScrollView para conteúdo longo, FlatList para listas grandes
- **Modais:** Sheet modal do bottom para ações (gerar boleto, confirmar exclusão)
- **Feedback:** Haptic em ações críticas, toast para confirmações

---

## Considerações de Acessibilidade

- Texto mínimo 16pt para legibilidade
- Contraste suficiente (WCAG AA)
- Ícones com labels descritivos
- Suporte a dark mode nativo
- Gestos alternativos para todas as ações
