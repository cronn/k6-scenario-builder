import type { ConstantVUsScenario } from "k6/options";
import type { ScenarioExecutable } from "../ScenarioExecutable";
import { AbstractScenarioBuilder } from "./AbstractScenarioBuilder";

const DEFAULT_SCENARIO: ConstantVUsScenario = {
  exec: undefined,
  executor: "constant-vus",
  vus: 1,
  duration: "30s",
  gracefulStop: "120s",
};

export class ConstantVUsScenarioBuilder extends AbstractScenarioBuilder<ConstantVUsScenario> {
  protected readonly currentScenario: ConstantVUsScenario = {
    ...DEFAULT_SCENARIO,
  };

  constructor(scenarioExecutable: ScenarioExecutable, startDelay?: string) {
    super(scenarioExecutable);
    this.currentScenario.exec =
      typeof scenarioExecutable.exec === "string"
        ? scenarioExecutable.exec
        : scenarioExecutable.exec.name;
    this.addStartDelay(startDelay);
    this.addBrowserIfNeeded();
  }

  withVus(vus: number): this {
    this.currentScenario.vus = vus;
    return this;
  }

  withDuration(duration: string): this {
    this.checkTimeStringFormat(duration);
    this.currentScenario.duration = duration;
    return this;
  }

  withShortConstantScenario(): this {
    this.currentScenario.duration = "3s";
    return this;
  }

  buildScenario(): ConstantVUsScenario {
    return this.currentScenario;
  }
}
