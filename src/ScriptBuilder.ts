import type { Scenario } from "k6/options";
import { ScenarioBuilderProvider } from "./ScenarioBuilderProvider";
import type { ScenarioExecutable } from "./ScenarioExecutable";

export class ScriptBuilder {
  private readonly currentScript: Record<string, Scenario> = {};
  private callback: ((scenario: Scenario) => void) | undefined;

  addScenario(scenario: Scenario, name?: string): this {
    if (scenario.exec === undefined) {
      throw new Error("No executable function for scenario defined");
    }
    this.currentScript[name ?? scenario.exec] = scenario;
    if (this.callback) {
      this.callback(structuredClone(scenario));
    }
    return this;
  }

  defaultScript(scenarios: ScenarioExecutable[]): this {
    for (const scenario of scenarios) {
      this.addDefaultScenario(scenario);
    }
    return this;
  }

  shortDefaultScript(scenarios: ScenarioExecutable[]): this {
    for (const scenario of scenarios) {
      this.addShortScenario(scenario);
    }
    return this;
  }

  addDefaultScenario(scenario: ScenarioExecutable): this {
    return this.addScenario(
      ScenarioBuilderProvider.constantScenario(scenario).buildScenario(),
    );
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

  buildScript(): Record<string, Scenario> {
    return this.currentScript;
  }
}
