# AACB Gestão de Associados - TODO

## Versão 2.0 - Profissional

### Sistema de Permissões
- [x] Criar tipos de usuário (admin, usuario)
- [x] Implementar lógica de permissões no AuthContext
- [x] Criar telas diferentes para admin vs usuário
- [x] Usuário comum vê apenas seu valor devedor
- [x] Admin tem acesso completo ao sistema

### Telas de Carregamento e Animações
- [x] Criar Splash Screen animada
- [x] Implementar skeleton loading em listas
- [x] Adicionar animações de transição entre telas
- [x] Loading states em botões e ações
- [x] Animações de feedback (sucesso, erro)
- [x] Pull-to-refresh animado

### Sistema de Personalização de Conta
- [x] Tela de Perfil completa
- [X] Upload de foto de perfil
- [x] Editar nome e email
- [x] Alterar senha
- [x] Configurações de notificações
- [x] Preferências de tema (claro/escuro/automático)
- [ ] Configurações de privacidade
- [x] Histórico de atividades
- [ ] Excluir conta

### Novas Abas e Telas
- [x] Aba Início (Dashboard melhorado)
- [x] Aba Associados (apenas admin)
- [x] Aba Minha Conta (usuário comum)
- [x] Aba Cobranças (admin) / Minhas Dívidas (usuário)
- [ ] Aba Relatórios (apenas admin)
- [x] Aba Configurações
- [ ] Tela de Notificações
- [ ] Tela de Ajuda/Suporte

### Botões 100% Funcionais
- [x] Login com validação completa
- [x] Logout com confirmação
- [x] CRUD completo de associados
- [x] Registrar pagamento funcional
- [x] Gerar boleto funcional
- [x] Enviar notificação funcional
- [x] Marcar como pago funcional
- [x] Editar perfil funcional
- [x] Alterar senha funcional
- [x] Upload de foto funcional

### Tela do Usuário Comum
- [x] Dashboard simplificado
- [x] Exibir apenas valor devedor total
- [x] Lista de débitos pendentes
- [x] Histórico de pagamentos pessoal
- [x] Gerar 2ª via de boleto
- [x] Perfil pessoal

### Melhorias de UX/UI
- [x] Design mais moderno e limpo
- [x] Cores e tipografia profissionais
- [x] Ícones consistentes
- [x] Feedback háptico em todas as ações
- [x] Estados vazios com ilustrações
- [x] Mensagens de erro amigáveis
- [ ] Tooltips e dicas

### Segurança
- [x] Validação de formulários
- [x] Proteção de rotas por permissão
- [ ] Timeout de sessão
- [x] Confirmação de ações críticas

---

## Funcionalidades Anteriores (Mantidas)

### Estrutura e Autenticação
- [x] Configurar banco de dados PostgreSQL
- [x] Implementar sistema de autenticação
- [x] Criar tela de Login
- [x] Implementar persistência de sessão
- [x] Criar middleware de proteção de rotas

### Dashboard
- [x] Criar tela Dashboard com estatísticas
- [x] Exibir total de associados
- [x] Exibir total de cobranças pendentes
- [x] Exibir total de pagamentos do mês
- [x] Listar últimas cobranças

### Gestão de Associados
- [x] Criar tela Lista de Associados
- [x] Implementar busca
- [x] Implementar filtros
- [x] Criar tela Detalhe do Associado
- [x] Criar tela Adicionar Associado

### Gestão de Cobranças
- [x] Criar tela Lista de Cobranças
- [x] Implementar filtros por status
- [x] Criar indicadores visuais
- [x] Criar tela Detalhe da Cobrança

### Automação de Boletos
- [x] Implementar geração de boleto
- [x] Implementar envio de notificações


---

## Versão 2.1 - Redesign Visual

### Paleta de Cores AACB
- [x] Atualizar cores primárias para verde AACB
- [x] Manter branco como cor secundária
- [x] Ajustar cores de destaque e contraste

### Tela Inicial (Dashboard)
- [x] Criar header com gradiente verde
- [x] Adicionar cards com sombras e efeitos
- [x] Implementar ícones ilustrativos
- [x] Criar seções visuais atraentes
- [x] Adicionar animações sutis

### Tela de Login
- [x] Redesenhar com visual moderno
- [x] Adicionar gradiente de fundo
- [x] Melhorar campos de input
- [x] Adicionar logo destacado


---

## Versão 2.2 - Cadastro e Pagamentos

### Sistema de Cadastro Obrigatório
- [x] Criar tela de cadastro para novos usuários
- [x] Campos: nome completo, data de nascimento, valor total, número de parcelas
- [x] Validação de todos os campos
- [x] Bloquear acesso até completar cadastro
- [x] Calcular parcelas automaticamente

### Dashboard do Usuário
- [x] Exibir valor total da dívida
- [x] Listar todas as parcelas com status
- [x] Mostrar próximo vencimento
- [x] Calcular valor pago vs pendente

### Pagamento via PIX
- [x] Criar tela de pagamento PIX
- [x] Gerar QR Code do PIX
- [x] Exibir chave PIX para cópia
- [x] Confirmar pagamento

### Dashboard do Administrador
- [x] Total de pessoas que pagaram
- [x] Total de pessoas que não pagaram
- [x] Valor total recebido
- [x] Gráfico de pagamentos

### Correções de UI
- [x] Corrigir cores na tela de configurações
- [x] Melhorar legibilidade dos textos
- [x] Ajustar contraste
