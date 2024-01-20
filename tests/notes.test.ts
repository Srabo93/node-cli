// import { findNotes } from "../src/notes";
import { expect, test } from "@jest/globals";

const add = (num: number, num2: number) => num + num2;

test("adds numbers", () => {
  const result = add(2, 2);

  expect(result).toBe(4);
});
