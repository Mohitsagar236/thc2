import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme } from "@/theme/hooks/useTheme";
import { dispatchAppearanceSync } from "@/theme/mfe-sync";

type LayoutVariant = "layout-sidebar" | "layout-top-nav";

const LAYOUT_PREFERENCE_KEY = "ctms:layout-preference";

interface RemoteLoadErrorProps {
  remoteName: string;
  onRetry?: () => void;
}

function RemoteLoadError({ remoteName, onRetry }: RemoteLoadErrorProps) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-text-muted)] shadow-sm">
      <p className="text-base font-semibold text-[var(--color-text)]">
        Unable to load {remoteName}
      </p>
      <p className="mt-2">Ensure the {remoteName} server is running:</p>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        • Dashboard: port 5001
        <br />
        • Admin: port 5002
        <br />• User: port 5003
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-block rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function createRemoteApp(
  remoteName: string,
  importFn: () => Promise<{ default: ComponentType }>,
) {
  return lazy(async () => {
    try {
      console.log(`Loading ${remoteName}...`);
      const component = await importFn();
      console.log(`✓ ${remoteName} loaded`);
      return component;
    } catch (error) {
      console.error(`✗ Failed to load ${remoteName}:`, error);
      return {
        default: () => (
          <RemoteLoadError
            remoteName={remoteName}
            onRetry={() => window.location.reload()}
          />
        ),
      };
    }
  });
}

const DashboardApp = createRemoteApp(
  "dashboard",
  () => import("dashboard/App"),
);

const AdminApp = createRemoteApp("admin", () => import("admin/App"));

const UserApp = createRemoteApp("user", () => import("user/App"));

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/admin", label: "Admin" },
  { to: "/user", label: "User" },
];

const layoutOptions: Array<{ value: LayoutVariant; label: string }> = [
  { value: "layout-sidebar", label: "Sidebar" },
  { value: "layout-top-nav", label: "Top Navigation" },
];

function getInitialLayoutPreference(): LayoutVariant {
  try {
    const saved = localStorage.getItem(LAYOUT_PREFERENCE_KEY);
    return saved === "layout-top-nav" ? "layout-top-nav" : "layout-sidebar";
  } catch {
    return "layout-sidebar";
  }
}

function applyLayoutVariant(layout: LayoutVariant): void {
  const body = document.body;

  Array.from(body.classList)
    .filter((className) => className.startsWith("layout-"))
    .forEach((className) => body.classList.remove(className));

  body.classList.add(layout);
}

function RemoteFallback() {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-slate-500 shadow-sm">
      <p className="font-medium text-slate-700">Loading microfrontend...</p>
      <p className="mt-2 text-sm text-slate-500">
        The host shell is fetching the selected remote module.
      </p>
    </div>
  );
}

function App() {
  const { currentTheme, themes } = useTheme();
  const [layout, setLayout] = useState<LayoutVariant>(
    getInitialLayoutPreference,
  );

  const activeTheme = useMemo(
    () => themes.find((theme) => theme.themeName === currentTheme),
    [currentTheme, themes],
  );

  useEffect(() => {
    applyLayoutVariant(layout);

    try {
      localStorage.setItem(LAYOUT_PREFERENCE_KEY, layout);
    } catch {
      // Keep running even when storage is unavailable.
    }
  }, [layout]);

  useEffect(() => {
    if (!activeTheme) {
      return;
    }

    dispatchAppearanceSync({
      themeName: activeTheme.themeName,
      layout,
      density: activeTheme.density,
      source: "host-layout-switch",
    });
  }, [activeTheme, layout]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppErrorBoundary>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Host shell
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                      CTMS Microfrontend Platform
                    </h1>
                  </div>
                  <nav
                    className={
                      layout === "layout-top-nav"
                        ? "hidden flex-wrap gap-2 md:flex"
                        : "hidden"
                    }
                  >
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `rounded-full px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <ThemeSelector />

                  <div className="flex w-full flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:max-w-[360px] md:flex-row md:items-center md:gap-3">
                    <div className="md:min-w-[115px]">
                      <label
                        htmlFor="layout-select"
                        className="m-0 text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]"
                      >
                        Layout
                      </label>
                      <p className="m-0 mt-1 text-xs text-[var(--color-text-muted)]">
                        Applied to host and MFEs
                      </p>
                    </div>

                    <select
                      id="layout-select"
                      value={layout}
                      onChange={(event) =>
                        setLayout(event.target.value as LayoutVariant)
                      }
                      className="min-h-[44px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text)] shadow-sm outline-none transition-colors duration-150 hover:border-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] md:min-w-[210px]"
                    >
                      {layoutOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </header>

            <div
              className={
                layout === "layout-sidebar"
                  ? "flex flex-1 flex-col lg:flex-row"
                  : "flex flex-1 flex-col"
              }
            >
              {layout === "layout-sidebar" ? (
                <aside className="order-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:order-1 lg:w-72 lg:border-t-0 lg:border-r">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Navigation
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </aside>
              ) : null}

              <section
                className={
                  layout === "layout-sidebar"
                    ? "order-1 flex-1 bg-[var(--color-bg)] p-6 lg:order-2"
                    : "flex-1 bg-[var(--color-bg)] p-6"
                }
              >
                <div className="mx-auto max-w-7xl">
                  <Suspense fallback={<RemoteFallback />}>
                    <Routes>
                      <Route index element={<DashboardApp />} />
                      <Route path="admin" element={<AdminApp />} />
                      <Route path="user" element={<UserApp />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </div>
              </section>
            </div>

            <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm text-slate-500">
              <div className="mx-auto max-w-7xl">
                Persistent shell layout with header, sidebar, and footer while
                remotes render in the main content area.
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </AppErrorBoundary>
    </main>
  );
}

export default App;
