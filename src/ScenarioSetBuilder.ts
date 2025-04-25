import type { Scenario } from "k6/options";
import {
  type ScenarioBuilder,
  ScenarioBuilderProvider,
} from "./ScenarioBuilderProvider";
import type { ScenarioExecutable } from "./ScenarioExecutable";

export class ScenarioSetBuilder {
  private readonly currentScript: Record<string, Scenario> = {};
  private callback: ((scenario: Scenario) => void) | undefined;

  addScenario(scenario: Scenario, name?: string): this {
    if (scenario.exec === undefined) {
      throw new Error("No executable function for scenario defined");
    }
    this.currentScript[name ?? scenario.exec] = scenario;
    if (this.callback) {
      this.callback(scenario);
    }
    return this;
  }

  defaultScenarioSet(
    scenarios: ScenarioExecutable[],
    scenarioBuilder: ScenarioBuilder = ScenarioBuilderProvider.constantScenario,
  ): this {
    for (const scenario of scenarios) {
      this.addDefaultScenario(scenario, scenarioBuilder);
    }
    return this;
  }

  shortDefaultScenarioSet(scenarios: ScenarioExecutable[]): this {
    for (const scenario of scenarios) {
      this.addShortScenario(scenario);
    }
    return this;
  }

  addDefaultScenario(
    scenario: ScenarioExecutable,
    scenarioBuilder: ScenarioBuilder = ScenarioBuilderProvider.constantScenario,
  ): this {
    return this.addScenario(scenarioBuilder(scenario).buildScenario());
  }

  addShortScenario(scenario: ScenarioExecutable): this {
    return this.addScenario(
      ScenarioBuilderProvider.constantScenario(scenario)
        .withShortConstantScenario()
        .buildScenario(),
    );
  }

  withCallback(callback: (scenario: Scenario) => void): this {
    this.callback = callback;
    return this;
  }

  buildScenarioSet(): Record<string, Scenario> {
    if (Object.keys(this.currentScript).length === 0) {
      throw new Error("Define at least one scenario for a valid scenario set!");
    }
    return this.currentScript;
  }
}
