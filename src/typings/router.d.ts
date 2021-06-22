import { Router } from "framework7/types";

interface RoutesExtend {
  meta?: Record<string, unknown>;
}
export type Routes = Router.RouteParameters & RoutesExtend;
