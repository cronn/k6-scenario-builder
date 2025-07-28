import { expect, test } from "vitest";
import {
  ConstantVUsScenarioBuilder,
  ScenarioBuilderProvider,
  ScenarioSetBuilder,
} from "../../src";
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
      ScenarioBuilderProvider.constantScenario(
        browserScenarioExecutable,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchJsonFile();
});

test("configured scenario", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(scenarioExecutable, "2m")
        .withVus(5)
        .withDuration("2m")
        .addEnvOption({ myOption: "value" })
        .buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchJsonFile();
});

test("short default scenario", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(scenarioExecutable)
        .withShortConstantScenario()
        .buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchJsonFile();
});

test("wrong format", () => {
  expect(() =>
    new ScenarioSetBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantScenario(scenarioExecutable)
          .withDuration("12Stunden")
          .buildScenario(),
      )
      .buildScenarioSet(),
  ).toThrowError(timeFormatErrorMessage);
});

test("modify default scenario", () => {
  ConstantVUsScenarioBuilder.setDefaultScenario({
    exec: undefined,
    executor: "constant-vus",
    vus: 2,
    duration: "60s",
  });
  validateDefaultScenario();
});

function validateDefaultScenario(): void {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchJsonFile();
}
