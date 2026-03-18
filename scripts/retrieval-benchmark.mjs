#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const PROMPTS_FILE = new URL(
  "./retrieval-benchmark.prompts.json",
  import.meta.url,
);

function loadPrompts() {
  return JSON.parse(fs.readFileSync(PROMPTS_FILE, "utf8"));
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = { command: command || "init", input: null, output: null };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--input") {
      const value = rest[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --input");
      }
      args.input = value;
      i += 1;
    } else if (arg === "--output") {
      const value = rest[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --output");
      }
      args.output = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function writeOutput(output, payload) {
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  if (output) {
    fs.writeFileSync(output, text, "utf8");
    return;
  }
  process.stdout.write(text);
}

function initTemplate(output) {
  const prompts = loadPrompts();
  const payload = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    provider: "",
    notes: "",
    results: prompts.map((prompt) => ({
      id: prompt.id,
      prompt: prompt.prompt,
      citedUrls: [],
      responseSnippet: "",
      notes: "",
    })),
  };

  writeOutput(output, payload);
}

function getHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isForbiddenHost(host) {
  if (!host) return false;
  return (
    host === "docs.pomerium.com" ||
    host.endsWith(".docs.pomerium.com") ||
    host === "archive.pomerium.com" ||
    host === "pomerium.io" ||
    host.endsWith(".pomerium.io")
  );
}

function isCurrentHost(host) {
  return host === "www.pomerium.com";
}

function scoreRun(input, output) {
  if (!input) {
    throw new Error("score requires --input <file>");
  }

  const promptList = loadPrompts();
  const prompts = new Map(promptList.map((prompt) => [prompt.id, prompt]));
  const expectedIds = promptList.map((prompt) => prompt.id);
  const run = JSON.parse(fs.readFileSync(input, "utf8"));
  if (!run || typeof run !== "object") {
    throw new Error("Invalid benchmark file: expected a JSON object");
  }
  if (!Array.isArray(run.results)) {
    throw new Error("Invalid benchmark file: missing results array");
  }

  const seenIds = new Set();
  const runIds = [];

  const details = run.results.map((result) => {
    if (!result || typeof result !== "object") {
      throw new Error("Invalid benchmark file: each result must be an object");
    }
    if (typeof result.id !== "string" || result.id.length === 0) {
      throw new Error("Invalid benchmark file: each result needs a string id");
    }
    if (result.citedUrls != null && !Array.isArray(result.citedUrls)) {
      throw new Error(
        `Invalid benchmark file: citedUrls must be an array for result ${result.id}`,
      );
    }
    if (seenIds.has(result.id)) {
      throw new Error(
        `Invalid benchmark file: duplicate result id ${result.id}`,
      );
    }
    seenIds.add(result.id);
    runIds.push(result.id);

    const prompt = prompts.get(result.id);
    if (!prompt) {
      throw new Error(`Invalid benchmark file: unknown result id ${result.id}`);
    }

    const hosts = (result.citedUrls || []).map(getHost).filter(Boolean);
    return {
      id: result.id,
      category: prompt.category,
      citedUrls: result.citedUrls || [],
      hasCurrentHost: hosts.some(isCurrentHost),
      hasForbiddenHost: hosts.some(isForbiddenHost),
      hasNoCitations: hosts.length === 0,
    };
  });

  const missingIds = expectedIds.filter((id) => !seenIds.has(id));
  if (missingIds.length > 0) {
    throw new Error(
      `Invalid benchmark file: missing result ids ${missingIds.join(", ")}`,
    );
  }

  const summary = {
    provider: run.provider || "",
    totalPrompts: details.length,
    expectedPromptCount: expectedIds.length,
    promptIds: runIds,
    currentHostHits: details.filter((item) => item.hasCurrentHost).length,
    forbiddenHostHits: details.filter((item) => item.hasForbiddenHost).length,
    noCitationPrompts: details.filter((item) => item.hasNoCitations).length,
    currentHostAccuracyBasis:
      "all prompts in the run, including prompts with no citations",
  };

  summary.currentHostAccuracy =
    summary.totalPrompts === 0
      ? 0
      : summary.currentHostHits / summary.totalPrompts;
  summary.forbiddenHostRate =
    summary.totalPrompts === 0
      ? 0
      : summary.forbiddenHostHits / summary.totalPrompts;

  writeOutput(output, { summary, details });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "init") {
    initTemplate(args.output);
    return;
  }
  if (args.command === "score") {
    scoreRun(args.input, args.output);
    return;
  }
  throw new Error(`Unknown command: ${args.command}`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
