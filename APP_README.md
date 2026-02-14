# AACB Gestão de Associados - Aplicativo Móvel

Aplicativo móvel para gerenciamento de associados, controle de pagamentos e automação de cobranças com envio de boletos.

## Funcionalidades Principais

### 1. Autenticação
- Login seguro com email e senha
- Persistência de sessão com AsyncStorage
- Logout com limpeza de dados

### 2. Dashboard
- Visão geral com estatísticas principais
- Total de associados (ativos/inativos)
- Cobranças pendentes e valor total
- Pagamentos do mês
- Últimas cobranças com status visual

### 3. Gestão de Associados
- Listar todos os associados
- Busca por nome, email ou CPF
- Filtro por status (ativo/inativo)
- Visualizar detalhe completo do associado
- Adicionar novo associado
- Editar informações
- Excluir associado
- Histórico de pagamentos
- Visualizar débitos pendentes

### 4. Gestão de Pagamentos
- Registrar novo pagamento
- Histórico completo de pagamentos
- Filtro por data e associado
- Visualização de valor total recebido

### 5. Gestão de Cobranças
- Listar todas as cobranças
- Filtro por status (pendente, vencido, pago)
- Indicadores visuais de urgência (cores)
- Detalhe completo da cobrança
- Histórico de tentativas de envio

### 6. Automação de Boletos
- Gerar boleto para cobranças
- Envio automático de notificações por email
- Rastreamento de tentativas de envio
- Marcar cobrança como paga
- Histórico de boletos gerados

### 7. Configurações
- Perfil do usuário
- Preferências de notificações
- Informações sobre o aplicativo
- Logout

## Estrutura do Projeto

```
app/
├── (tabs)/                    # Telas principais com tab bar
│   ├── index.tsx             # Dashboard
│   ├── _layout.tsx           # Configuração da tab bar
│   ├── configuracoes.tsx     # Configurações
│   ├── associados/           # Telas de associados
│   ├── cobrancas/            # Telas de cobranças
│   └── pagamentos/           # Telas de pagamentos
├── login.tsx                 # Tela de login
├── _layout.tsx               # Layout raiz com navegação
└── oauth/callback.tsx        # Callback OAuth

lib/
├── auth-context.tsx          # Contexto de autenticação
├── types.ts                  # Tipos e interfaces
├── boleto-service.ts         # Serviço de boletos
└── utils.ts                  # Funções utilitárias

components/
├── screen-container.tsx      # Wrapper de tela com SafeArea
├── haptic-tab.tsx           # Tab com feedback háptico
└── ui/
    └── icon-symbol.tsx       # Mapeamento de ícones
```

## Credenciais de Teste

Para testar o aplicativo, use as seguintes credenciais:

- **Email:** admin@aacb.com
- **Senha:** 123456

## Dados Simulados

O aplicativo inclui dados simulados para demonstração:

- **Associados:** 4 associados (3 ativos, 1 inativo)
- **Cobranças:** 4 cobranças com diferentes status
- **Pagamentos:** 5 pagamentos registrados

Esses dados podem ser substituídos por chamadas reais à API backend.

## Integração com Backend

### Endpoints Esperados

O aplicativo espera os seguintes endpoints no backend:

#### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

#### Associados
- `GET /api/associados` - Listar todos
- `GET /api/associados/:id` - Obter um
- `POST /api/associados` - Criar
- `PUT /api/associados/:id` - Atualizar
- `DELETE /api/associados/:id` - Deletar

#### Pagamentos
- `GET /api/pagamentos` - Listar todos
- `POST /api/pagamentos` - Registrar novo

#### Cobranças
- `GET /api/devedores` - Listar devedores
- `GET /api/devedores/:id` - Obter um

#### Boletos
- `POST /api/boletos/gerar` - Gerar boleto
- `GET /api/boletos/:id` - Obter boleto

#### Notificações
- `POST /api/notificacoes/email` - Enviar email
- `POST /api/notificacoes/sms` - Enviar SMS

## Configuração de Desenvolvimento

### Requisitos
- Node.js 18+
- Expo CLI
- React Native 0.81+

### Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Abrir em iOS
pnpm ios

# Abrir em Android
pnpm android

# Abrir em Web
pnpm web
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:3000
EXPO_PUBLIC_APP_NAME=AACB Gestão
```

## Estilo e Design

O aplicativo segue as **Apple Human Interface Guidelines (HIG)** com:

- Design limpo e minimalista
- Tipografia clara e legível
- Cores consistentes (azul primário #0a7ea4)
- Feedback visual em todas as ações
- Suporte a modo escuro
- Animações sutis e responsivas

### Paleta de Cores

| Cor | Uso |
|-----|-----|
| **Azul (#0a7ea4)** | Primária, botões, destaques |
| **Verde (#22C55E)** | Sucesso, pagamentos |
| **Âmbar (#F59E0B)** | Alertas, próximo vencimento |
| **Vermelho (#EF4444)** | Erro, vencido |
| **Cinza** | Texto secundário, desabilitado |

## Recursos Nativos

- **Haptics:** Feedback tátil em ações importantes
- **AsyncStorage:** Persistência local de dados
- **Notifications:** Notificações push (preparado para integração)
- **SafeArea:** Suporte a notch e home indicator

## Performance

- Listas otimizadas com FlatList
- Lazy loading de imagens
- Memoização de componentes
- Debounce em buscas
- Cache de dados com React Query

## Segurança

- Senhas armazenadas com hash no backend
- Tokens JWT para autenticação
- Dados sensíveis em AsyncStorage com encriptação
- HTTPS para comunicação com API
- Validação de entrada em formulários

## Próximos Passos

1. **Integração com Backend Real**
   - Substituir dados simulados por chamadas à API
   - Implementar sincronização em tempo real

2. **Automação de Cobranças**
   - Agendamento de envios automáticos
   - Integração com serviço de email/SMS
   - Webhook para confirmação de pagamentos

3. **Relatórios e Análises**
   - Gráficos de arrecadação
   - Relatórios de inadimplência
   - Exportação de dados

4. **Melhorias de UX**
   - Animações mais fluidas
   - Gestos customizados
   - Modo offline

5. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes E2E

## Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.

## Licença

Todos os direitos reservados © 2024 AACB
