export interface ScenarioExecutable {
  exec: (...args: unknown[]) => unknown;
  browser: boolean;
}
