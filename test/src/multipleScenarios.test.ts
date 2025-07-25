import { expect, test } from "vitest";
import {
  ConstantArrivalRateBuilder,
  RampingVUsScenarioBuilder,
  ScenarioBuilderProvider,
  ScenarioSetBuilder,
} from "../../src";
import {
  browserScenarioExecutable,
  emptyScriptErrorMessage,
  scenarioExecutable,
} from "./fixtures";

test("empty script", () => {
  expect(() => {
    new ScenarioSetBuilder().buildScenarioSet();
  }).toThrowError(emptyScriptErrorMessage);
});

test("default empty script", () => {
  expect(() => {
    new ScenarioSetBuilder().defaultScenarioSet([]).buildScenarioSet();
  }).toThrowError(emptyScriptErrorMessage);
});

test("default script browser and no browser", () => {
  const script = new ScenarioSetBuilder()
    .defaultScenarioSet([scenarioExecutable, browserScenarioExecutable])
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("short default with two scenarios", () => {
  const script = new ScenarioSetBuilder()
    .shortDefaultScenarioSet([scenarioExecutable, browserScenarioExecutable])
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("default script ramping", () => {
  const script = new ScenarioSetBuilder()
    .defaultScenarioSet([scenarioExecutable], RampingVUsScenarioBuilder)
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("default script constant arrival rate", () => {
  const script = new ScenarioSetBuilder()
    .defaultScenarioSet([scenarioExecutable], ConstantArrivalRateBuilder)
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("default script by record", () => {
  const script = new ScenarioSetBuilder()
    .defaultScenarioSet({
      myParticularName: scenarioExecutable,
      anotherParticularName: browserScenarioExecutable,
    })
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("add default scenario", () => {
  const script = new ScenarioSetBuilder()
    .addDefaultScenario(scenarioExecutable)
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});

test("each executor type once", () => {
  const script = new ScenarioSetBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(scenarioExecutable)
        .withDuration("2m")
        .withVus(2)
        .buildScenario(),
      "constantScenario",
    )
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(browserScenarioExecutable)
        .withStage("2m", 2)
        .buildScenario(),
    )
    .addScenario(
      ScenarioBuilderProvider.constantArrivalRateScenario(scenarioExecutable)
        .withTimeUnit("30s")
        .withDuration("2m")
        .withPreAllocatedVus(2)
        .withRate(1)
        .buildScenario(),
      "constantArrivalScenario",
    )
    .buildScenarioSet();
  expect(script).toMatchValidationFile();
});
