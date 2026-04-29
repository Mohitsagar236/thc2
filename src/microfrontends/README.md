# Microfrontend Repository Boundaries

This repository is the host shell.

## Host shell repository (current)

- Owns persistent layout: header, sidebar, footer.
- Owns host routing and remote loading with Module Federation.
- Owns global theme and layout controls.
- Must not contain feature implementation code for dashboard, admin, or user profile domains.

## Remote repositories

- Dashboard MFE: https://github.com/Mohitsagar236/mfe-dashboard
- Admin MFE: https://github.com/Mohitsagar236/mfe_admin
- User Profile MFE: https://github.com/Mohitsagar236/mfe_user_profile

Each remote repository should only contain:

- Its own domain screens/components.
- Its own local state and feature services.
- Module Federation expose entry (for example `./App`).
- Optional listener for `theme-changed` event when non-CSS rendering is needed.

Each remote repository should not contain:

- Host layout components (header/sidebar/footer).
- Host route orchestration for other MFEs.
- Other domain code from different MFEs.

## Theme and layout propagation contract

- Host dispatches `theme-changed` with `{ themeName, layout, density }`.
- Remotes rely on CSS variables and body classes from host.
- Remotes must support both layout classes:
  - `layout-sidebar`
  - `layout-top-nav`
