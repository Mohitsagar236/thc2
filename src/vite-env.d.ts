/// <reference types="vite/client" />

declare module "dashboard/App" {
  import type { ComponentType } from "react";

  const DashboardApp: ComponentType;
  export default DashboardApp;
}

declare module "admin/App" {
  import type { ComponentType } from "react";

  const AdminApp: ComponentType;
  export default AdminApp;
}

declare module "user/App" {
  import type { ComponentType } from "react";

  const UserApp: ComponentType;
  export default UserApp;
}
