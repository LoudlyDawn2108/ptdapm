import { createContext, useContext } from "react";

interface BreadcrumbOverride {
  segment: string;
  label: string;
  collapseAfter?: boolean;
}

interface BreadcrumbContextValue {
  overrides: BreadcrumbOverride[];
  setOverrides: (overrides: BreadcrumbOverride[]) => void;
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  overrides: [],
  setOverrides: () => {},
});

export function useBreadcrumbOverrides() {
  return useContext(BreadcrumbContext);
}

export type { BreadcrumbOverride };
