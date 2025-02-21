# cronn k6 Scenario Builder

This library provides a builder for k6 scenario configurations. How scenarios in k6 are defined you can find on their [website](https://grafana.com/docs/k6/latest/using-k6/scenarios/).

## Usage

For creating a new scenario configuration, consisting of one or more scenarios start with

> new ScriptBuilder()

This class provides a method `addScenario` to add a scenario to the current script/configuration as well as methods for default configurations.
To create a single scenario which can be passed to `addScenario` use the ScenarioBuilder for your desired executor type. These builders can be accessed by the `ScenarioBuilderProvider`.
To create a scenario with one of these builders you need to describe your scenario as a `ScenarioExecutable`, meaning you specify the function this scenario should execute and if it needs a browser.

Example:

```typescript
const scenarioExecutable: ScenarioExecutable = {
  exec: "myScenarioFunction",
  browser: false,
};

new ScriptBuilder()
  .addScenario(
    ScenarioBuilderProvider.constantScenario(scenarioExecutable)
      .withVus(5)
      .withDuration("2m")
      .buildScenario(),
  )
  .buildScript();
```

This builder call would create a 2-minute scenario which executes `myScenarioFunction` with constant 5 VUs.
To make this scenario executable for k6, make sure you have the function `myScenarioFunction` defined in the file which is run by k6.

If you have multiple scenarios you want to execute, an approach is to create a list of `ScenarioExecutable`s from which you can choose your desired scenario when calling a ScenarioBuilder.

### Browser-Option

If your `ScenarioExecutable` contains `browser: true` the ScenarioBuilder will add

```json
{ "browser": { "type": "chromium" } }
```

as an option to your scenario and k6 will use a browser when executing.

### Callback

The `ScriptBuilder` provides `withCallbackFunction` which allows you to set a function which is executed every time a scenario is added to the configuration/script.
The function gets passed a copy of the new scenario and can be used to modify values outside the builder which depend on the to be executed scenarios.
When calling `withCallbackFunction` multiple times for one ScriptBuilder object the callback function will be overridden and the latest function will be used.

### Default scenarios

Each ScenarioBuilder has a default configuration for mandatory values which will be used if `buildScenario` is called without configuring the scenario.
Additionally `ScriptBuilder` has functions for default scripts which accept `ScenarioExecutables` that should be executed with default values.
