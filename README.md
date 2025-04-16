# k6 Scenario Builder

This library provides a builder for k6 scenario configurations. How scenarios in k6 are defined is explained in their [documentation](https://grafana.com/docs/k6/latest/using-k6/scenarios/).

## Motivation

If your k6 setup grows bigger, and you want to run multiple scenarios the scenario configuration can become very long and tedious.
In particular, making changes to adjust scenarios for test runs is tedious and can easily lead to errors in the configuration, costing time.
This library tries to make the configuration and customisation of k6 scenarios easier and less error-prone.

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

For creating a new set of scenarios, consisting of one or more scenarios create a new instance of the `ScriptBuilder` class. Individual scenarios can be added with `addScenario`, `addShortScenario` or `addDefaultScenario` to the current scenario list. A full set of scenarios can be added using `defaultScript` or `shortDefaultScript`.

To create a single scenario which can be passed to `addScenario` use the builder for your desired executor type. These builders can be accessed by the `ScenarioBuilderProvider`. Currently, only the `ConstantVUsScenario`, `RampingVUsScenario` and `ConstantArrivalRateScenario` are implemented!

To create a scenario with one of these builders you need to describe your scenario as a `ScenarioExecutable`, which currently only contains the title of the function which shall be executed by the scenario and a toggle whether a browser is necessary or not.

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

This builder call creates a 2-minute scenario which executes `myScenarioFunction` with constant 5 VUs.
To make this scenario executable for k6, make sure you have the function `myScenarioFunction` defined and exported in the file which is run by k6.

If you have multiple scenarios you want to execute, an approach is to create a list of `ScenarioExecutable`s from which you can choose your desired scenario when calling a ScenarioBuilder.

### Browser based scenarios

If your `ScenarioExecutable` contains `browser: true` the ScenarioBuilder will add

```json
{ "browser": { "type": "chromium" } }
```

as an option to your scenario and k6 will use a browser when executing.

### Callback

The `ScriptBuilder` provides `withCallbackFunction` which allows you to set a function which is executed every time a scenario is added.
The function gets passed a copy of the new scenario and can be used to modify values outside the builder which depend on the to be executed scenarios.
When calling `withCallbackFunction` multiple times for one ScriptBuilder object the callback function will be overridden and the latest function will be used.

### Default scenarios

Each ScenarioBuilder has a default configuration for mandatory values which will be used if `buildScenario` is called without configuring the scenario.
Additionally `ScriptBuilder` has functions for default scripts which accept `ScenarioExecutables` that should be executed with default values.
