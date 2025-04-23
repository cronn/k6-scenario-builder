import { expect, test } from "vitest";
import { ScenarioBuilderProvider } from "../../src";
import { ScenarioSetBuilder } from "../../src";
import { ConstantArrivalRateBuilder } from "../../src";
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
      ScenarioBuilderProvider.constantArrivalRateScenario(
        browserScenarioExecutable,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("configured scenario", () => {
  const script = new ScenarioSetBuilder()
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
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("wrong time format", () => {
  expect(() =>
    new ScenarioSetBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(
          browserScenarioExecutable,
          "5min",
        ).buildScenario(),
      )
      .buildScenarioSet(),
  ).toThrowError(timeFormatErrorMessage);
  expect(() =>
    new ScenarioSetBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(scenarioExecutable)
          .withTimeUnit("3min")
          .buildScenario(),
      )
      .buildScenarioSet(),
  ).toThrowError(timeFormatErrorMessage);
  expect(() =>
    new ScenarioSetBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(
          browserScenarioExecutable,
        )
          .withDuration("3hours")
          .buildScenario(),
      )
      .buildScenarioSet(),
  ).toThrowError(timeFormatErrorMessage);
});

test("modify default scenario", () => {
  ConstantArrivalRateBuilder.setDefaultScenario({
    exec: undefined,
    executor: "constant-arrival-rate",
    rate: 1,
    timeUnit: "60s",
    duration: "60s",
    preAllocatedVUs: 1,
    gracefulStop: "10s",
  });
  validateDefaultScenario();
});

function validateDefaultScenario(): void {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantArrivalRateScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
}
