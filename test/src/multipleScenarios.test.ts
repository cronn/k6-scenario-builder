import { expect, test } from "vitest";

import { ScenarioBuilderProvider } from "../../src";
import { ScriptBuilder } from "../../src";
import { browserScenarioExecutable, scenarioExecutable } from "./fixtures";

test("empty script", () => {
  const script = new ScriptBuilder().buildScript();
  expect(script).toMatchValidationFile();
});

test("default empty script", () => {
  const script = new ScriptBuilder().defaultScript([]).buildScript();
  expect(script).toMatchValidationFile();
});

test("default script browser and no browser", () => {
  const script = new ScriptBuilder()
    .defaultScript([scenarioExecutable, browserScenarioExecutable])
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("short default with two scenarios", () => {
  const script = new ScriptBuilder()
    .shortDefaultScript([scenarioExecutable, browserScenarioExecutable])
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("each executor type once", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.constantScenario(scenarioExecutable)
        .withDuration("2m")
        .withVus(2)
        .buildScenario(),
      "constantScenario",
    )
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(browserScenarioExecutable, 1)
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
    .buildScript();
  expect(script).toMatchValidationFile();
});
