import { expect, test } from "vitest";

import { scenarioExecutable } from "./fixtures";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import { Scenario } from "k6/options";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";

test("callback function", async () => {
  let gracefulStop = "";
  const callback = (scenario: Scenario) => {
    gracefulStop = scenario.gracefulStop!;
  };
  new ScriptBuilder()
    .withCallbackFunction(callback)
    .defaultScript([scenarioExecutable])
    .buildScript();
  expect(gracefulStop).toEqual("120s");
});

test("renew callback function", async () => {
  let message1 = "";
  const firstCallBackMessage = "first callback says hi";
  let message2 = "";
  const secondCallBackMessage = "second callback says bye";
  const firstCallback = (scenario: Scenario) => {
    message1 = firstCallBackMessage;
  };
  const secondCallback = (scenario: Scenario) => {
    message2 = secondCallBackMessage;
  };
  new ScriptBuilder()
    .withCallbackFunction(firstCallback)
    .addScenario(
      ScenarioBuilderProvider.constantScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .withCallbackFunction(secondCallback)
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        scenarioExecutable,
        1,
      ).buildScenario(),
    )
    .buildScript();
  expect(message1).toEqual(firstCallBackMessage);
  expect(message2).toEqual(secondCallBackMessage);
});
