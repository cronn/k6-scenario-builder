import { expect, test } from "vitest";
import { ScriptBuilder } from "../../src";

test("manual scenario", () => {
  const script = new ScriptBuilder()
    .addScenario({
      executor: "constant-vus",
      exec: "testScenario",
      vus: 1,
      duration: "1m",
    })
    .buildScript();
  expect(script).toMatchValidationFile();
});

test("missing exec function", () => {
  expect(() =>
    new ScriptBuilder().addScenario({
      executor: "constant-vus",
      vus: 1,
      duration: "1m",
    }),
  ).toThrowError("No executable function for scenario defined");
});
