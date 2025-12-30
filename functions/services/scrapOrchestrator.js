import { spawn } from "child_process";
import path from "path";

function runPythonRunAll({ company = null } = {}) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), "functions", "run_all.py");

    const args = [scriptPath];
    if (company) args.push("--company", company);

    const proc = spawn("python3", args, {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    proc.on("close", (code) => {
      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        parsed = { ok: false, error: "Invalid JSON from Python", raw: stdout, stderr };
      }

      if (code === 0 && parsed?.ok !== false) resolve(parsed);
      else reject(new Error(parsed?.error || stderr || "Python run_all failed"));
    });
  });
}

export async function runAllScrapers() {
  const startedAt = new Date().toISOString();
  const results = await Promise.allSettled([runPythonRunAll()]);

  return {
    startedAt,
    results: results.map((r) =>
      r.status === "fulfilled"
        ? { status: "ok", value: r.value }
        : { status: "error", reason: String(r.reason) }
    ),
  };
}
