import { describe, expect, test } from "vitest";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

const VALIDATION_BASE_PATH = "../validation/single_constant_scenario";

describe("single constant scenario", () => {
  test("default", async () => {
    const script = new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantScenario(
          scenarioExecutable,
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
        ScenarioBuilderProvider.constantScenario(
          browserScenarioExecutable,
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
        ScenarioBuilderProvider.constantScenario(scenarioExecutable, "2m")
          .withVus(5)
          .withDuration("2m")
          .addEnvOption({ myOption: "value" })
          .buildScenario(),
      )
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_configured.json`,
    );
  });

  test("short default", async () => {
    const script = new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantScenario(scenarioExecutable)
          .withShortConstantScenario()
          .buildScenario(),
      )
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_short_default.json`,
    );
  });

  test("wrong format", async () => {
    expect(() =>
      new ScriptBuilder()
        .addScenario(
          ScenarioBuilderProvider.constantScenario(scenarioExecutable)
            .withDuration("12Stunden")
            .buildScenario(),
        )
        .buildScript(),
    ).toThrowError(timeFormatErrorMessage);
  });
});
