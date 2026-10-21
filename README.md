# AquaSmart 💧

Aplicação web para monitoramento e análise do consumo de água e energia elétrica durante o banho, com histórico de sessões, indicadores de consumo e configurações personalizáveis.

O AquaSmart foi desenvolvido como parte de um projeto acadêmico de sustentabilidade, com o objetivo de incentivar o consumo consciente de recursos naturais por meio da tecnologia.

## Funcionalidades

- **Dashboard:** visualização de indicadores de consumo e informações sobre os banhos.
- **Monitoramento de sessões:** criação, acompanhamento e finalização de sessões de banho.
- **Histórico:** consulta aos banhos registrados e seus respectivos dados.
- **Gráficos de consumo:** visualização de informações para análise do consumo.
- **Configurações personalizáveis:** definição dos custos de água e energia elétrica e da duração desejada para o banho.
- **API REST:** endpoints para gerenciamento de sessões, medições, histórico e configurações.
- **Persistência de dados:** armazenamento das sessões, medições e configurações em banco de dados PostgreSQL.
- **PWA:** suporte à instalação da aplicação em dispositivos compatíveis.
- **Acesso demonstrativo:** interface de entrada por código para acessar a aplicação.

## Tecnologias utilizadas

### Frontend
- Next.js 16
- React 19
- TypeScript
- CSS Modules
- Recharts

### Backend
- Next.js App Router e Route Handlers
- API REST
- Prisma ORM 7
- PostgreSQL
- Arquitetura organizada em módulos de serviço, repositório, rotas e validação

### Infraestrutura
- Vercel — hospedagem da aplicação
- Neon — PostgreSQL gerenciado
- Service Worker — recursos de Progressive Web App (PWA)

## Arquitetura do projeto

O projeto utiliza uma organização modular para separar as responsabilidades da aplicação.

- **Routes:** recebem as requisições e definem as respostas HTTP.
- **Services:** concentram a lógica de negócio.
- **Repositories:** realizam as operações de acesso ao banco de dados.
- **Validations:** verificam os dados recebidos pela API.
- **Components:** reúnem componentes reutilizáveis da interface.

Essa separação facilita a manutenção, os testes e a evolução do sistema.

## Estrutura de pastas

```text
aquasmart/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── access/
│   │   ├── api/
│   │   │   ├── dashboard/
│   │   │   ├── health/
│   │   │   ├── history/
│   │   │   ├── sessions/
│   │   │   └── settings/
│   │   ├── dashboard/
│   │   ├── history/
│   │   └── settings/
│   ├── components/
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   └── prisma.ts
│   ├── modules/
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── measurements/
│   │   ├── sessions/
│   │   └── settings/
│   └── proxy.ts
├── prisma7.config.ts
├── package.json
└── README.md
```

A estrutura acima destaca os diretórios principais; arquivos auxiliares e estilos específicos de cada componente foram omitidos para facilitar a leitura.

## Banco de dados

O projeto utiliza PostgreSQL com Prisma ORM para persistência dos dados.

### Modelos principais

| Modelo | Responsabilidade |
|---|---|
| `Session` | Registra cada sessão de banho, incluindo início, fim, duração, consumo de água, energia e status. |
| `Measurement` | Armazena as medições associadas a uma sessão, como vazão, volume acumulado e potência elétrica. |
| `Settings` | Armazena os custos de água e energia, as unidades utilizadas e a duração desejada para o banho. |

### Status das sessões

- `IN_PROGRESS`: sessão em andamento.
- `COMPLETED`: sessão finalizada.

O sistema utiliza transações e bloqueios no PostgreSQL para ajudar a evitar a criação simultânea de múltiplas sessões ativas e inconsistências durante a finalização.

### Migrações

As migrações ficam em `prisma/migrations` e registram as alterações realizadas no esquema do banco de dados.

Para aplicar migrações pendentes em um ambiente de desenvolvimento:

```bash
npx prisma migrate dev
```

Para aplicar migrações já existentes em um ambiente de produção:

```bash
npx prisma migrate deploy
```

**Importante:** em um banco já utilizado, confirme o estado das migrações antes de executar comandos que alterem sua estrutura. Não utilize `migrate dev` em produção.

## API REST

As rotas são implementadas com os Route Handlers do Next.js.

### Sessões

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/sessions` | Lista as sessões registradas. |
| `POST` | `/api/sessions` | Inicia uma nova sessão. |
| `GET` | `/api/sessions/active` | Consulta a sessão ativa. |
| `GET` | `/api/sessions/[id]` | Consulta uma sessão específica e suas medições. |
| `PATCH` | `/api/sessions/[id]/finish` | Finaliza uma sessão ativa. |
| `POST` | `/api/sessions/[id]/measurements` | Registra medições em uma sessão. |

### Dashboard

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/dashboard` | Retorna os dados consolidados do dashboard. |

### Histórico

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/history` | Consulta o histórico de banhos. |
| `GET` | `/api/history/[id]` | Consulta os detalhes de um registro do histórico. |

### Configurações

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/settings` | Consulta as configurações atuais. |
| `PATCH` | `/api/settings` | Atualiza as configurações permitidas. |

### Saúde da aplicação

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Verifica a conectividade com o banco de dados. |

### Exemplos de requisições

Iniciar um banho:

```http
POST /api/sessions
Content-Type: application/json
```

O endpoint inicia uma sessão e retorna o registro criado.

Registrar medições:

```http
POST /api/sessions/ID_DA_SESSAO/measurements
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "measurements": [
    {
      "measuredAt": "2026-10-21T18:00:00.000Z",
      "flowRateLpm": 8.5,
      "totalVolumeLiters": 12.3,
      "powerWatts": 4500
    }
  ]
}
```

O campo `measuredAt` é opcional. Os valores de vazão, volume e potência devem ser números válidos e não negativos; a potência deve ser um número inteiro. A API aceita lotes de 1 a 100 medições por requisição.

Finalizar um banho:

```http
PATCH /api/sessions/ID_DA_SESSAO/finish
```

A duração é calculada pelo backend com base no horário de início e no horário da finalização. Sessões inexistentes retornam erro de não encontrado, e sessões já finalizadas não podem ser finalizadas novamente.

Atualizar configurações:

```http
PATCH /api/settings
Content-Type: application/json
```

Corpo da requisição:

```json
{
  "waterCostPerM3": 6.4,
  "energyCostPerKwh": 0.892,
  "targetDurationMinutes": 8
}
```

Os campos são opcionais individualmente, mas a requisição deve conter ao menos um campo permitido. A duração desejada deve ser um número inteiro entre 1 e 120 minutos, e os custos não podem ser negativos.

As respostas bem-sucedidas normalmente utilizam a propriedade `data`; respostas de erro utilizam `error`. Os códigos HTTP dependem do resultado da operação, incluindo erros de validação, conflitos e registros inexistentes.

## Como executar localmente

### Pré-requisitos

- Node.js compatível com a versão do Next.js utilizada.
- npm.
- Instância PostgreSQL acessível.
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/Kickz1nn/aquasmart.git
cd aquasmart
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="sua_string_de_conexao_postgresql"
```

Substitua o valor pela URL de conexão do seu banco PostgreSQL.

A variável `DATABASE_URL` é utilizada pelo Prisma para estabelecer a conexão com o banco de dados.

Não compartilhe credenciais reais nem envie o arquivo `.env` para o GitHub.

### 4. Preparar o banco de dados

Para um banco novo, com as migrações do projeto disponíveis:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrações existentes sem criar novas migrações.

### 5. Iniciar a aplicação

```bash
npm run dev
```

A aplicação estará disponível, por padrão, em:

http://localhost:3000

O script de build também executa `prisma generate`, gerando o cliente Prisma necessário para a compilação.

## Implantação

A aplicação está preparada para hospedagem na Vercel, utilizando PostgreSQL gerenciado pelo Neon.

Em uma nova implantação:

1. Configure o repositório do GitHub na Vercel.
2. Configure `DATABASE_URL` nas variáveis de ambiente dos ambientes necessários.
3. Confirme que a URL corresponde ao banco PostgreSQL correto.
4. Execute as migrações pendentes de forma controlada.
5. Realize o deploy e verifique a aplicação.
6. Consulte `/api/health` para verificar a conectividade com o banco.

O comando de build do projeto é:

```bash
prisma generate && next build
```

As variáveis de ambiente devem ser configuradas diretamente na plataforma de hospedagem, sem incluir credenciais no código-fonte.

## Acesso demonstrativo

O AquaSmart possui uma tela de acesso por código para facilitar a demonstração da aplicação.

Após a validação, a aplicação grava o cookie `aquasmart_access`, com validade de 24 horas. O proxy utiliza esse cookie para controlar o acesso às páginas principais.

**Limitação de segurança:** esse mecanismo é demonstrativo, não uma solução de autenticação para produção. O código está presente no frontend e o cookie pode ser reproduzido manualmente. O mecanismo também não substitui autenticação e autorização nos endpoints da API.

Para um ambiente de produção, recomenda-se implementar autenticação real, validação de sessão no servidor e autorização nas rotas protegidas.

## Estado atual e próximos passos

O projeto já conta com interface web, persistência PostgreSQL, API para sessões e medições, histórico de banhos, configurações e implantação na Vercel.

Próximas evoluções possíveis:

- Integrar o sistema a um ESP32 e aos sensores físicos.
- Enviar medições de consumo em tempo real.
- Melhorar a autenticação e a autorização.
- Ampliar os indicadores e relatórios de consumo.
- Adicionar testes automatizados para serviços e endpoints.
- Aprimorar o tratamento de falhas de conexão com o dispositivo físico.

A integração com o hardware depende da implementação e validação dos componentes físicos; o funcionamento da API não significa que a comunicação com os sensores já esteja concluída.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
