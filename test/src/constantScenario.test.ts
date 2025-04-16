import { expect, test } from "vitest";
import { ScenarioBuilderProvider } from "../../src";
import { ScenarioSetBuilder } from "../../src";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

test("default scenario", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("scenario with browser", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(
        browserScenarioExecutable,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
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
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("short default scenario", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(scenarioExecutable)
        .withShortConstantScenario()
        .buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("wrong format", () => {
  expect(() =>
    new ScenarioSetBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantScenario(scenarioExecutable)
          .withDuration("12Stunden")
          .buildScenario(),
      )
      .buildScript(),
  ).toThrowError(timeFormatErrorMessage);
});
