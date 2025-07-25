import type { BaseScenario } from "k6/options";
import type { ScenarioExecutable } from "./ScenarioExecutable";
import type { AbstractScenarioBuilder } from "./scenarioBuilder/AbstractScenarioBuilder";
import { ConstantArrivalRateBuilder } from "./scenarioBuilder/ConstantArrivalRateBuilder";
import { ConstantVUsScenarioBuilder } from "./scenarioBuilder/ConstantVUsScenarioBuilder";
import { RampingVUsScenarioBuilder } from "./scenarioBuilder/RampingVUsScenarioBuilder";

// biome-ignore lint/nursery/useExplicitType: type is inferred and acceptable
export const ScenarioBuilderProvider = {
  rampingScenario,
  constantScenario,
  constantArrivalRateScenario,
};

export type BuilderConstructor<T extends BaseScenario> = new (
  scenarioInfo: ScenarioExecutable,
  startDelay?: string,
) => AbstractScenarioBuilder<T>;

function rampingScenario(
  scenarioInfo: ScenarioExecutable,
  startVus?: number,
  startDelay?: string,
): RampingVUsScenarioBuilder {
  return new RampingVUsScenarioBuilder(scenarioInfo, startDelay, startVus);
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
