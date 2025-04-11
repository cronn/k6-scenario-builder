import { expect, test } from "vitest";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import {
  browserScenarioExecutable,
  scenarioExecutable,
  timeFormatErrorMessage,
} from "./fixtures";

test("default scenario", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        scenarioExecutable,
        1,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("scenario with browser", () => {
  const script = new ScriptBuilder()
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        browserScenarioExecutable,
        1,
      ).buildScenario(),
    )
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("configured scenario", () => {
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
  expect(script).toMatchValidationFile();
});

test("wrong format", () => {
  expect(() =>
    new ScriptBuilder().addScenario(
      ScenarioBuilderProvider.rampingScenario(browserScenarioExecutable, 1)
        .withStage("3min", 3)
        .buildScenario(),
    ),
  ).toThrowError(timeFormatErrorMessage);
});
