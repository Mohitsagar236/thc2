# Application Structure

## Folder Organization

```
src/
├── config/                          # Configuration & Constants
│   └── dashboard.config.ts         # All dashboard constants (features, stats, caching policy, etc.)
│
├── modules/                         # Feature Modules
│   └── dashboard/                   # Dashboard Module
│       └── sections/                # Reusable section components
│           ├── DashboardHeader.tsx      # Header with logo and theme selector
│           ├── HeroSection.tsx          # Hero banner with stats
│           ├── CapabilityMatrix.tsx     # Feature cards grid
│           ├── FlowSection.tsx          # Pipeline & Runtime flow
│           ├── CachingAndStartupSection.tsx # Caching policy + startup resolution
│           ├── MFEIntegrationSection.tsx    # MFE integration contract
│           ├── DashboardFooter.tsx      # QA Gate section
│           └── Footer.tsx               # Footer
│
├── microfrontends/                  # Micro-frontend Modules (Reserved)
│   └── (To be populated with external module configurations)
│
├── components/                      # Reusable UI Components
│   ├── ThemeSelector.tsx
│   └── ThemedCard.tsx
│
├── theme/                           # Theme System (Existing)
│   ├── types.ts
│   ├── provider.tsx
│   ├── context.ts
│   └── ... (other theme files)
│
└── App.tsx                          # Clean, modular main component

```

## Architecture Benefits

✅ **Separation of Concerns** - Config separate from components
✅ **Modularity** - Each section is an independent, reusable component
✅ **Scalability** - Easy to add new modules or sections
✅ **Maintainability** - Single responsibility principle
✅ **Testing** - Each component can be tested independently
✅ **Future MFE Ready** - Prepared structure for micro-frontends
