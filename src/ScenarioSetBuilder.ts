import type { BaseScenario, Scenario } from "k6/options";
import {
  type BuilderConstructor,
  ScenarioBuilderProvider,
} from "./ScenarioBuilderProvider";
import type { ScenarioExecutable } from "./ScenarioExecutable";
import { ConstantVUsScenarioBuilder } from "./scenarioBuilder/ConstantVUsScenarioBuilder";

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

  defaultScenarioSet<T extends BaseScenario>(
    scenarios: ScenarioExecutable[] | Record<string, ScenarioExecutable>,
    ScenarioBuilder?: BuilderConstructor<T>,
  ): this {
    if (Array.isArray(scenarios)) {
      for (const scenario of scenarios) {
        this.addDefaultScenario(scenario, ScenarioBuilder);
      }
    } else {
      for (const [name, scenario] of Object.entries(scenarios)) {
        this.addDefaultScenario(scenario, ScenarioBuilder, name);
      }
    }
    return this;
  }

  shortDefaultScenarioSet(scenarios: ScenarioExecutable[]): this {
    for (const scenario of scenarios) {
      this.addShortScenario(scenario);
    }
    return this;
  }

  addDefaultScenario<T extends BaseScenario>(
    scenario: ScenarioExecutable,
    ScenarioBuilder?: BuilderConstructor<T>,
    name?: string,
  ): this {
    const scenarioBuilder = ScenarioBuilder
      ? new ScenarioBuilder(scenario)
      : new ConstantVUsScenarioBuilder(scenario);
    return this.addScenario(scenarioBuilder.buildScenario(), name);
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
