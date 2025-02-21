import { describe, expect, test } from "vitest";

import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";

const VALIDATION_BASE_PATH = "../validation/single_constant_arrival_scenario";

describe("single constant arrival scenario", () => {
  test("default", async () => {
    const script = new ScriptBuilder()
      .addScenario(
        ScenarioBuilderProvider.constantArrivalRateScenario(
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
        ScenarioBuilderProvider.constantArrivalRateScenario(
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
        ScenarioBuilderProvider.constantArrivalRateScenario(
          scenarioExecutable,
          "1h",
        )
          .withTimeUnit("30s")
          .withRate(4)
          .withDuration("2h")
          .withPreAllocatedVus(1)
          .addEnvOption({ myOption: "value" })
          .buildScenario(),
      )
      .buildScript();
    await expect(script).toMatchFileSnapshot(
      `${VALIDATION_BASE_PATH}_configured.json`,
    );
  });

  test("wrong format", async () => {
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
          ScenarioBuilderProvider.constantArrivalRateScenario(
            scenarioExecutable,
          )
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
});
