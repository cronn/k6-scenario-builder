import { expect, test } from "vitest";

import type { Scenario } from "k6/options";
import { ScenarioBuilderProvider } from "../../src";
import { ScenarioSetBuilder } from "../../src";
import { scenarioExecutable } from "./fixtures";

test("callback function", async () => {
  let executor = "";
  const callback = (scenario: Scenario): void => {
    executor = scenario.executor;
  };
  new ScenarioSetBuilder()
    .withCallback(callback)
    .defaultScenarioSet([scenarioExecutable])
    .buildScenarioSet();
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
  new ScenarioSetBuilder()
    .withCallback(firstCallback)
    .addScenario(
      ScenarioBuilderProvider.constantScenario(
        scenarioExecutable,
      ).buildScenario(),
    )
    .withCallback(secondCallback)
    .addScenario(
      ScenarioBuilderProvider.rampingScenario(
        scenarioExecutable,
        1,
      ).buildScenario(),
    )
    .buildScenarioSet();
  expect(message1).toEqual(firstCallBackMessage);
  expect(message2).toEqual(secondCallBackMessage);
});
