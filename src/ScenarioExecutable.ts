export interface ScenarioExecutable {
  exec: string | ((...args: unknown[]) => unknown);
  browser?: boolean;
}
