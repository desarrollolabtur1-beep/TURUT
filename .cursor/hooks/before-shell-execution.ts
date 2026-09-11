import type { BeforeShellExecutionPayload, BeforeShellExecutionResponse } from "cursor-hooks";

// Leer el payload que Cursor nos envía (el comando que el agente quiere ejecutar)
const input: BeforeShellExecutionPayload = await Bun.stdin.json();
const command = input.command;

let permission: "allow" | "deny" = "allow";
let agentMessage: string | undefined = undefined;

// ---------------------------------------------------------
// REGLA 1: Bloquear `git add .`
// ---------------------------------------------------------
// Detectamos "git add ." o "git add --all" o "git add -A"
if (command.includes("git add .") || command.includes("git add --all") || command.includes("git add -A")) {
  permission = "deny";
  agentMessage = "ERROR: `git add .` está prohibido. Añade archivos explícitamente: `git add <archivo>` o `git add <carpeta>/`.";
}

// ---------------------------------------------------------
// REGLA 2: Bloquear `git push` a main/master
// ---------------------------------------------------------
// Si el comando contiene "git push" y menciona main o master
if (command.includes("git push") && (command.includes("main") || command.includes("master"))) {
  permission = "deny";
  agentMessage = "ERROR: No se permite push directo a `main` o `master`. Crea una rama (`git checkout -b feat/mi-cambio`) y luego haz push a esa rama para abrir un PR.";
}

// ---------------------------------------------------------
// REGLA 3: (Opcional) Bloquear `git push` sin rama especificada
// ---------------------------------------------------------
// Si el comando es exactamente "git push" o "git push origin" sin una rama concreta
// (esto puede ser agresivo, lo dejamos comentado por si acaso)
// if (/^git push(\s+origin)?$/.test(command.trim())) {
//   permission = "deny";
//   agentMessage = "ERROR: Especifica la rama al hacer push: `git push origin <nombre-rama>`.";
// }

// ---------------------------------------------------------
// REGLA 4: Forzar formato de commit (type(scope): description)
// ---------------------------------------------------------
// Buscamos comandos "git commit -m '...'"
const commitMatch = command.match(/git commit -m ['"](.+)['"]/);
if (commitMatch && commitMatch[1]) {
  const message = commitMatch[1];
  // Patrón: type(scope): description
  // Tipos permitidos: feat, fix, docs, style, refactor, test, chore
  const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|test|chore)(\([a-zA-Z0-9_-]+\))?: .{1,}$/;
  
  if (!conventionalCommitPattern.test(message)) {
    permission = "deny";
    agentMessage = `ERROR: El mensaje de commit no sigue el formato. Debe ser: \`type(scope): descripción\`. Ejemplo: \`feat(auth): add login\`. Tipos: feat, fix, docs, style, refactor, test, chore. Tu mensaje fue: "${message}"`;
  }
}

// Construir la respuesta para Cursor
const output: BeforeShellExecutionResponse = {
  permission,
  agentMessage,
};

// Devolver la respuesta a Cursor
console.log(JSON.stringify(output, null, 2));