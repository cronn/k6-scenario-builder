import type { ScenarioExecutable } from "../../src";

function testScenario(): void {
  // biome-ignore lint/suspicious/noConsole: dummy test function
  console.log("testScenario");
}

function testBrowserScenario(): void {
  // biome-ignore lint/suspicious/noConsole: dummy test function
  console.log("testBrowserScenario");
}

export const scenarioExecutable: ScenarioExecutable = {
  exec: testScenario,
};
export const browserScenarioExecutable: ScenarioExecutable = {
  exec: testBrowserScenario,
  browser: true,
};

export const timeFormatErrorMessage =
  "Invalid time string format. Use 's' for seconds, 'm' for minutes, and 'h' for hours.";
