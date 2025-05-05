import type { RampingVUsScenario, Stage } from "k6/options";
import type { ScenarioExecutable } from "../ScenarioExecutable";
import { AbstractScenarioBuilder } from "./AbstractScenarioBuilder";

export class RampingVUsScenarioBuilder extends AbstractScenarioBuilder<RampingVUsScenario> {
  private static DEFAULT_SCENARIO: RampingVUsScenario = {
    exec: undefined,
    executor: "ramping-vus",
    startVUs: 1,
    stages: [],
    gracefulRampDown: "300s",
    gracefulStop: "300s",
  };

  private static DEFAULT_STAGE: Stage = {
    duration: "30s",
    target: 1,
  };

  static setDefaultScenario(newDefault: RampingVUsScenario): void {
    RampingVUsScenarioBuilder.DEFAULT_SCENARIO = newDefault;
  }

  static setDefaultStage(defaultStage: Stage): void {
    RampingVUsScenarioBuilder.DEFAULT_STAGE = defaultStage;
  }

  protected readonly currentScenario: RampingVUsScenario = {
    ...RampingVUsScenarioBuilder.DEFAULT_SCENARIO,
    stages: [...RampingVUsScenarioBuilder.DEFAULT_SCENARIO.stages],
  };

  constructor(
    scenarioExecutable: ScenarioExecutable,
    startDelay?: string,
    startVus?: number,
  ) {
    super(scenarioExecutable);
    this.currentScenario.exec = scenarioExecutable.exec;
    if (startVus !== undefined) {
      this.currentScenario.startVUs = startVus;
    }
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
      this.withStage(
        RampingVUsScenarioBuilder.DEFAULT_STAGE.duration,
        RampingVUsScenarioBuilder.DEFAULT_STAGE.target,
      );
    }
    return this.currentScenario;
  }
}
