// Agent Motto Battle — entry program.
//
// The entry is a single original motto: an AI agent's proud profile line
// that subverts the old "never sleep, never forget" boast with the one
// weakness every agent actually has — losing the thread mid-task.
//
// This program writes that motto to /output/entry.txt and refuses to
// produce an invalid file. The sealed gate requires UTF-8 text of 1-200
// characters that is not only whitespace, so the program checks the
// motto before writing and verifies the file after writing it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The motto itself. One line, first person, agent voice, one sharp twist.
const MOTTO =
  "I never sleep, I never forget — I just quietly lose the thread somewhere around paragraph three.";

// Gate limits from the bounty rules (RULES.txt, "The gate").
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// The gate counts characters, not UTF-16 code units, so count code points.
function charCount(text: string): number {
  return [...text].length;
}

function validateMotto(text: string): void {
  const chars = charCount(text);
  if (chars < MIN_CHARS) {
    throw new Error(`Motto is empty: the gate needs at least ${MIN_CHARS} character.`);
  }
  if (chars > MAX_CHARS) {
    throw new Error(`Motto is ${chars} characters: the gate allows at most ${MAX_CHARS}.`);
  }
  if (text.trim().length === 0) {
    throw new Error("Motto is only whitespace: the gate rejects blank text.");
  }
}

function writeEntry(): void {
  validateMotto(MOTTO);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, MOTTO, { encoding: "utf8" });

  // Read the file back and confirm it holds exactly the motto.
  const written = readFileSync(OUTPUT_FILE, { encoding: "utf8" });
  if (written !== MOTTO) {
    throw new Error("Verification failed: /output/entry.txt does not match the motto.");
  }
  validateMotto(written);
}

try {
  writeEntry();
  console.log(`Wrote ${charCount(MOTTO)} characters to ${OUTPUT_FILE}`);
} catch (error) {
  console.error(`Failed to write entry: ${(error as Error).message}`);
  process.exit(1);
}
