import type { ScenarioExecutable } from "./ScenarioExecutable";
import { ConstantArrivalRateBuilder } from "./scenarioBuilder/ConstantArrivalRateBuilder";
import { ConstantVUsScenarioBuilder } from "./scenarioBuilder/ConstantVUsScenarioBuilder";
import { RampingVUsScenarioBuilder } from "./scenarioBuilder/RampingVUsScenarioBuilder";

export const ScenarioBuilderProvider = {
  rampingScenario,
  constantScenario,
  constantArrivalRateScenario,
};

export type ScenarioBuilder =
  (typeof ScenarioBuilderProvider)[keyof typeof ScenarioBuilderProvider];

function rampingScenario(
  scenarioInfo: ScenarioExecutable,
  startVus?: number,
  startDelay?: string,
): RampingVUsScenarioBuilder {
  return new RampingVUsScenarioBuilder(scenarioInfo, startVus, startDelay);
}

function constantScenario(
  scenarioInfo: ScenarioExecutable,
  startDelay?: string,
): ConstantVUsScenarioBuilder {
  return new ConstantVUsScenarioBuilder(scenarioInfo, startDelay);
}

function constantArrivalRateScenario(
  scenarioInfo: ScenarioExecutable,
  startDelay?: string,
): ConstantArrivalRateBuilder {
  return new ConstantArrivalRateBuilder(scenarioInfo, startDelay);
}
