import { describe, expect, test } from "vitest";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

const VALIDATION_BASE_PATH = "../validation/single_ramping_scenario";

describe("single ramping scenario", () => {
  test("default", async () => {
    const script = new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.rampingScenario(
          scenarioExecutable,
          1,
        ).buildScenario(),
      )
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_default.json`,
    );
  });

  test("with browser", async () => {
    const script = new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.rampingScenario(
          browserScenarioExecutable,
          1,
        ).buildScenario(),
      )
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_with_browser.json`,
    );
  });

  test("configured", async () => {
    const script = new ScriptBuilder()
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
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_configured.json`,
    );
  });

  test("wrong format", async () => {
    expect(() =>
      new ScriptBuilder().addScenario(
        ScenarioBuilderProvider.rampingScenario(browserScenarioExecutable, 1)
          .withStage("3min", 3)
          .buildScenario(),
      ),
    ).toThrowError(timeFormatErrorMessage);
  });
});
