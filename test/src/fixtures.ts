import { ScenarioExecutable } from "../../src/ScenarioExecutable";

export const scenarioExecutable: ScenarioExecutable = {
  exec: "testScenario",
  browser: false,
};
export const browserScenarioExecutable: ScenarioExecutable = {
  exec: "testBrowserScenario",
  browser: true,
};

export const timeFormatErrorMessage =
  "Invalid time string format. Use 's' for seconds, 'm' for minutes, and 'h' for hours.";
