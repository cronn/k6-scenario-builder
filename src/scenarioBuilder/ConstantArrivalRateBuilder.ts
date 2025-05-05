import type { ConstantArrivalRateScenario } from "k6/options";
import type { ScenarioExecutable } from "../ScenarioExecutable";
import { AbstractScenarioBuilder } from "./AbstractScenarioBuilder";

export class ConstantArrivalRateBuilder extends AbstractScenarioBuilder<ConstantArrivalRateScenario> {
  private static DEFAULT_SCENARIO: ConstantArrivalRateScenario = {
    exec: undefined,
    executor: "constant-arrival-rate",
    rate: 1,
    timeUnit: "30s",
    duration: "30s",
    preAllocatedVUs: 1,
    gracefulStop: "120s",
  };

  static setDefaultScenario(newDefault: ConstantArrivalRateScenario): void {
    ConstantArrivalRateBuilder.DEFAULT_SCENARIO = newDefault;
  }

  protected readonly currentScenario: ConstantArrivalRateScenario = {
    ...ConstantArrivalRateBuilder.DEFAULT_SCENARIO,
  };

  constructor(scenarioExecutable: ScenarioExecutable, startDelay?: string) {
    super(scenarioExecutable);
    this.currentScenario.exec = scenarioExecutable.exec;
    this.addStartDelay(startDelay);
    this.addBrowserIfNeeded();
  }

  withRate(rate: number): this {
    this.currentScenario.rate = rate;
    return this;
  }

  withTimeUnit(timeUnit: string): this {
    this.checkTimeStringFormat(timeUnit);
    this.currentScenario.timeUnit = timeUnit;
    return this;
  }

  withDuration(duration: string): this {
    this.checkTimeStringFormat(duration);
    this.currentScenario.duration = duration;
    return this;
  }

  withPreAllocatedVus(preAllocatedVus: number): this {
    this.currentScenario.preAllocatedVUs = preAllocatedVus;
    return this;
  }

  buildScenario(): ConstantArrivalRateScenario {
    return this.currentScenario;
  }
}
