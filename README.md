# k6 Scenario Builder

This library provides a builder for k6 scenario configurations. How scenarios in k6 are defined is explained in their [documentation](https://grafana.com/docs/k6/latest/using-k6/scenarios/).

## Motivation

If your k6 setup grows bigger, and you want to run multiple scenarios the scenario configuration can become very long and tedious.
In particular, making changes to adjust scenarios for test runs is tedious and can easily lead to errors in the configuration, costing time.
This library tries to make the configuration and customisation of k6 scenarios easier and less error-prone.

## Currently supported executor types

In the current version are scenario builders for three k6 executor types implemented.
- constant-vus
- ramping-vus
- constant-arrival-rate
If other executor types are desired we will integrate them or gladly accept pull requests.

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/k6-scenario-builder
```

```shell
yarn add -D @cronn/k6-scenario-builder
```

```shell
pnpm add -D @cronn/k6-scenario-builder
```

### Create a scenario configuration

For creating a new set of scenarios, consisting of one or more scenarios create a new instance of the `ScenarioSetBuilder` class. Individual scenarios can be added with `addScenario`, `addShortScenario` or `addDefaultScenario` to the current scenario list. A full set of scenarios can be added using `defaultScenarioSet` or `shortDefaultScenarioSet`.

To create a single scenario which can be passed to `addScenario` use the builder for your desired executor type. These builders can be accessed by the `ScenarioBuilderProvider`. Currently, only the `ConstantVUsScenario`, `RampingVUsScenario` and `ConstantArrivalRateScenario` are implemented!

To create a scenario with one of these builders you need to describe your scenario as a `ScenarioExecutable`, which currently only contains a reference to the function which shall be executed by the scenario and a toggle whether a browser is necessary or not (optional, default is `false`).

Example:

```typescript
export function myScenarioFunction() {
  console.log("My fancy scenario");
}

const scenarioExecutable: ScenarioExecutable = {
  exec: myScenarioFunction,
  browser: false,
};

new ScenarioSetBuilder()
  .addScenario(
    ScenarioBuilderProvider.constantScenario(scenarioExecutable)
      .withVus(5)
      .withDuration("2m")
      .buildScenario(),
  )
  .buildScenarioSet();
```

This builder call creates a 2-minute scenario which executes `myScenarioFunction` with constant 5 VUs.
To make this scenario executable for k6, you need to export the `myScenarioFunction` function from the file which is run by k6.

If you have multiple scenarios you want to execute, an approach is to create a list of `ScenarioExecutable`s from which you can choose your desired scenario when calling a ScenarioBuilder.

### Browser based scenarios

If your `ScenarioExecutable` contains `browser: true` the ScenarioBuilder will add

```json
{ "browser": { "type": "chromium" } }
```

as an option to your scenario and k6 will use a browser when executing.

### Callback

The `ScenarioSetBuilder` provides `withCallback` which allows you to set a function which is executed every time a scenario is added.
The function gets passed a reference to the new scenario object, so you can do some final adjustments if necessary and you can keep the state of your test framework in sync with the created scenarios.
When calling `withCallback` multiple times for one ScenarioSetBuilder object the callback function will be overridden and the latest function will be used.

### Default scenarios

Each ScenarioBuilder has a default configuration for mandatory values which will be used if `buildScenario` is called without configuring the scenario.
These default values can be modified by using `setDefaultScenario` for the desired builder. Be aware that when adding stages to the default scenario 
for the `RampingVUsScenarioBuilder` they will be used in the customized scenarios as well. `withStage` will only add stages but not override the default ones.
Thus, recommended is to use `setDefaultStages` to modify default stages and keep the stages in the default scenario an empty list. 
Additionally `ScenarioSetBuilder` has functions for default sets which accept `ScenarioExecutables` to be run with default values.
