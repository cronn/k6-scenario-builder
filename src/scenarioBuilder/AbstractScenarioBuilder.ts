import { BaseScenario, Scenario } from "k6/options";
import { ScenarioExecutable } from "../ScenarioExecutable";

export abstract class AbstractScenarioBuilder<T extends BaseScenario> {
  protected readonly scenarioExecutable: ScenarioExecutable;
  protected abstract readonly currentScenario: T;

  protected constructor(scenarioExecutable: ScenarioExecutable) {
    this.scenarioExecutable = scenarioExecutable;
  }

  protected addBrowserIfNeeded() {
    if (this.scenarioExecutable.browser) {
      this.currentScenario.options = {
        browser: {
          type: "chromium",
        },
      };
    }
  }

  protected addStartDelay(startDelay?: string) {
    if (startDelay != undefined) {
      this.checkTimeStringFormat(startDelay);
      this.currentScenario.startTime = startDelay;
    }
  }

  protected checkTimeStringFormat(timeString: string) {
    if (!/^(\d+)(s|m|h)$/.test(timeString)) {
      throw new Error(
        "Invalid time string format. Use 's' for seconds, 'm' for minutes, and 'h' for hours.",
      );
    }
  }

  addEnvOption(envOption: Record<string, string>): this {
    if (!this.currentScenario.env) {
      this.currentScenario.env = {};
    }

    Object.assign(this.currentScenario.env, envOption);
    return this;
  }

  abstract buildScenario(): Scenario;
}
