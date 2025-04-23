import { expect, test } from "vitest";
import { ScenarioBuilderProvider } from "../../src";
import { ScenarioSetBuilder } from "../../src";
import { RampingVUsScenarioBuilder } from "../../src";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

test("default scenario", () => {
  validateDefaultScenario();
});

test("scenario with browser", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        browserScenarioExecutable,
        1,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("configured scenario", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(scenarioExecutable, 3, "2m")
        .addEnvOption({ myOption: "value" })
        .withStage("3m", 3)
        .withStages([
          { duration: "2h", target: 4 },
          { duration: "10s", target: 23 },
        ])
        .buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("wrong format", () => {
  expect(() =>
    new ScenarioSetBuilder().addScenario(
      ScenarioBuilderProvider.rampingScenario(browserScenarioExecutable, 1)
        .withStage("3min", 3)
        .buildScenario(),
    ),
  ).toThrowError(timeFormatErrorMessage);
});

test("modify default scenario", () => {
  RampingVUsScenarioBuilder.setDefaultScenario({
    exec: undefined,
    executor: "ramping-vus",
    startVUs: 2,
    stages: [],
    gracefulRampDown: "10s",
    gracefulStop: "10s",
  });
  RampingVUsScenarioBuilder.setDefaultStage({ duration: "40s", target: 2 });
  validateDefaultScenario();
});

function validateDefaultScenario(): void {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
}
