import { expect, test } from "vitest";

import { ScenarioBuilderProvider } from "../../src";
import { ScriptBuilder } from "../../src";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

test("default scenario", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantArrivalRateScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("scenario with browser", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantArrivalRateScenario(
        browserScenarioExecutable,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("configured scenario", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantArrivalRateScenario(
        scenarioExecutable,
        "1h",
      )
        .withTimeUnit("30s")
        .withRate(4)
        .withDuration("2h")
        .withPreAllocatedVus(1)
        .addEnvOption({ myOption: "value" })
        .addEnvOption({ anotherOption: "anotherValue" })
        .buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("wrong time format", () => {
  expect(() =>
    new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(
          browserScenarioExecutable,
          "5min",
        ).buildScenario(),
      )
      .buildScript(),
  ).toThrowError(timeFormatErrorMessage);
  expect(() =>
    new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(scenarioExecutable)
          .withTimeUnit("3min")
          .buildScenario(),
      )
      .buildScript(),
  ).toThrowError(timeFormatErrorMessage);
  expect(() =>
    new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(
          browserScenarioExecutable,
        )
          .withDuration("3hours")
          .buildScenario(),
      )
      .buildScript(),
  ).toThrowError(timeFormatErrorMessage);
});
