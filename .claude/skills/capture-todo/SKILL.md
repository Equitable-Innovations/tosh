---
name: capture-todo
description: "Instantly capture a TODO (a quick note to return to) in todo/todo.jsonl with todo/scripts/todo.mjs, tagged with the session id and agent id. Use for \"todo:\", \"add a todo\", \"remind me to\", \"come back to this\", \"tech debt\", or /capture-todo. The LLM runs it on its own to leave itself a note in the middle of a task (kind task), or to record tech debt it found (kind debt). Also use it to list, finish, or drop TODOs from the current session."
metadata:
  node_type: memory
  allowed-tools: Bash
  originSessionId: d3501aa2-7884-4e26-82e8-81838f7cadf9
  modified: 2026-11-03T00:16:17.624Z
---

# Capture TODO

Save a quick note in `todo/todo.jsonl` with one command, then go back to the current task. This
skill must never pull the developer or the LLM away from the work in progress.

A TODO is a note to return to. It is not a work item. If the note needs a declared intent,
invariants, or evidence, use `create-work-item`. If it is a design question, use `capture-topic`.
If it is a feature idea, use `capture-idea`.

## Kinds

- `task` is the default. It is a short-lived note for the current run, for example "re-run the
  link check after the rename". The LLM closes it before the run ends, or drops it.
- `debt` is tech debt that lives past the session, for example "this parser ignores nested
  tables". Use `--kind debt` and add `--file` (and `--line` if known) so the next reader can find the spot.

## Session and agent ids

Every TODO stores `session_id` and `agent_id`. The script reads `session_id` from the
`CLAUDE_CODE_SESSION_ID` environment variable, so you do not pass it.

- The main agent leaves `--agent` out. The script stores `main`.
- A subagent passes `--agent <its agent name or id>`, so the main agent can see who left the note.
- `list` shows only open TODOs of the current session by default. Use `--all-sessions` to see
  TODOs from earlier sessions, which includes the open debt.

## Commands

Run all commands from the repository root.

```bash
# add a run note (task is the default kind)
node todo/scripts/todo.mjs add "re-run the link check after the rename"

# add tech debt
node todo/scripts/todo.mjs add "parser ignores nested tables" --kind debt --file src/parse.mjs --line 42 --priority P2 --tags parser

# add a note from a subagent
node todo/scripts/todo.mjs add "confirm the schema version" --agent schema-reviewer

# list open TODOs of this session; add --agent, --kind, --tags, --file, --json to filter
node todo/scripts/todo.mjs list

# list open debt from all sessions
node todo/scripts/todo.mjs list --all-sessions --kind debt

# close a TODO
node todo/scripts/todo.mjs done --id 3 --note "fixed in the rename commit"
node todo/scripts/todo.mjs drop --id 4 --note "no longer needed"

# change a TODO, or reopen it
node todo/scripts/todo.mjs edit --id 3 --status open

# remove closed run notes (debt stays unless --kind debt is given)
node todo/scripts/todo.mjs prune --dry-run
node todo/scripts/todo.mjs prune
```

Run `node todo/scripts/todo.mjs help` for every option.

## Steps

1. To capture: take the note from the skill args or the user message. Keep the wording and
   trim it to one line. If no text exists, ask "What is the TODO?" once and wait.
2. Choose the kind. Use `task` for a note about the current run. Use `debt` for a flaw that will
   outlast the run.
3. Run the `add` command. Reply with one short line, for example `TODO-004 added.` Then continue
   the task that was in progress.
4. Before the LLM ends a run, it runs `list`, then closes each open `task` TODO with `done` or
   `drop`. It leaves `debt` open and tells the user how many debt TODOs it added.
5. When the user asks "what is left" or "what did we note", run `list` and report the result.

## Rules

- Do not read `todo/todo.jsonl` directly or edit it by hand. Use the script.
- Do not search the repo or check for duplicates before an `add`.
- Do not ask follow-up questions. Do not suggest next steps.
- Do not create a work item, topic, or idea from a TODO.
- `prune` removes only closed TODOs. Open TODOs are never removed by the script.
- Do not pass `--session` unless you act for another session on purpose.
