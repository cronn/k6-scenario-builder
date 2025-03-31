import type { RampingVUsScenario, Stage } from "k6/options";
import type { ScenarioExecutable } from "../ScenarioExecutable";
import { AbstractScenarioBuilder } from "./AbstractScenarioBuilder";

const DEFAULT_SCENARIO: RampingVUsScenario = {
  exec: undefined,
  executor: "ramping-vus",
  startVUs: undefined,
  stages: [],
  gracefulRampDown: "300s",
  gracefulStop: "300s",
};

const DEFAULT_STAGE: Stage = {
  duration: "30s",
  target: 1,
};

export class RampingVUsScenarioBuilder extends AbstractScenarioBuilder<RampingVUsScenario> {
  protected readonly currentScenario: RampingVUsScenario = {
    ...DEFAULT_SCENARIO,
    stages: [...DEFAULT_SCENARIO.stages],
  };

  constructor(
    scenarioExecutable: ScenarioExecutable,
    startVus: number,
    startDelay?: string,
  ) {
    super(scenarioExecutable);
    this.currentScenario.exec = scenarioExecutable.exec;
    this.currentScenario.startVUs = startVus;
    this.addStartDelay(startDelay);
    this.addBrowserIfNeeded();
  }

  withStages(stages: Stage[]): this {
    for (const stage of stages) {
      this.withStage(stage.duration, stage.target);
    }
    return this;
  }

  withStage(duration: string, targetVus: number): this {
    this.checkTimeStringFormat(duration);
    this.currentScenario.stages.push({ duration: duration, target: targetVus });
    return this;
  }

  buildScenario(): RampingVUsScenario {
    if (this.currentScenario.stages.length === 0) {
      this.withStage(DEFAULT_STAGE.duration, DEFAULT_STAGE.target);
    }
    return this.currentScenario;
  }
}
