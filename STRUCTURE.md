```sh
educ-net-admin/
├── app/
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   └── register-school/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── dashboard/       # Overview page
│   │   ├── users/           # User management
│   │   │   ├── page.tsx
│   │   │   └── pending/
│   │   ├── channels/        # Channel management
│   │   ├── classes/         # Class management
│   │   ├── analytics/       # Analytics dashboard
│   │   └── settings/        # School settings
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   └── Card.tsx
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Page header
│   ├── UserTable.tsx        # User list table
│   ├── ChannelCard.tsx      # Channel display
│   ├── StatsCard.tsx        # Metric cards
│   └── Charts.tsx           # Chart components
├── lib/
│   ├── api.ts               # API client
│   ├── auth.ts              # Auth utilities
│   └── utils.ts             # Helper functions
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   ├── useUsers.ts          # Users data hook
│   └── useChannels.ts       # Channels data hook
├── types/
│   └── index.ts             # TypeScript types
├── public/                  # Static assets
├── .env.example
├── tailwind.config.js
├── next.config.js
├── package.json
├── README.md
└── STRUCTURE.md
```