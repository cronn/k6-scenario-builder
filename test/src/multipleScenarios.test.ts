import { describe, expect, test } from "vitest";

import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import { browserScenarioExecutable, scenarioExecutable } from "./fixtures";

const VALIDATION_BASE_PATH = "../validation/multiple_scenarios";

describe("multiple scenarios", () => {
  test("empty script", async () => {
    const script = new ScriptBuilder().buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_empty.json`,
    );
  });

  test("default script", async () => {
    const script = new ScriptBuilder().defaultScript([]).buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_empty_default.json`,
    );
  });

  test("default script browser and no browser", async () => {
    const script = new ScriptBuilder()
      .defaultScript([scenarioExecutable, browserScenarioExecutable])
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_default_two.json`,
    );
  });

  test("short default with two scenarios", async () => {
    const script = new ScriptBuilder()
      .shortDefaultScript([scenarioExecutable, browserScenarioExecutable])
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_short_default.json`,
    );
  });

  test("each executor once", async () => {
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
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_each_executor_once.json`,
    );
  });
});
