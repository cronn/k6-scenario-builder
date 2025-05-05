import type { ScenarioExecutable } from "../../src";

export const scenarioExecutable: ScenarioExecutable = {
  exec: "testScenario",
};
export const browserScenarioExecutable: ScenarioExecutable = {
  exec: "testBrowserScenario",
  browser: true,
};

export const timeFormatErrorMessage =
  "Invalid time string format. Use 's' for seconds, 'm' for minutes, and 'h' for hours.";

export const emptyScriptErrorMessage =
  "Define at least one scenario for a valid scenario set!";
