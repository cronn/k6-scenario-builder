import { expect, test } from "vitest";

import type { Scenario } from "k6/options";
import { ScenarioBuilderProvider } from "../../src/ScenarioBuilderProvider";
import { ScriptBuilder } from "../../src/ScriptBuilder";
import { scenarioExecutable } from "./fixtures";

test("callback function", async () => {
  let executor = "";
  const callback = (scenario: Scenario): void => {
    executor = scenario.executor;
  };
  new ScriptBuilder()
    .withCallbackFunction(callback)
    .defaultScript([scenarioExecutable])
    .buildScript();
  expect(executor).toEqual("constant-vus");
});

test("renew callback function", async () => {
  let message1 = "";
  const firstCallBackMessage = "first callback says hi";
  let message2 = "";
  const secondCallBackMessage = "second callback says bye";
  const firstCallback = (scenario: Scenario): void => {
    message1 = firstCallBackMessage;
  };
  const secondCallback = (scenario: Scenario): void => {
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
