#!/usr/bin/env node
// TODO manager for tosh. Source of truth: todo/todo.jsonl (one JSON object per line).
// A TODO is a quick note to return to. Kind "task" is a note for the current run.
// Kind "debt" is long-lived tech debt. Every TODO records the session and agent that made it.
// Usage: node todo/scripts/todo.mjs <command> [options]   (run `help` for details)

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, appendFileSync, existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const JSONL = join(dirname(fileURLToPath(import.meta.url)), '..', 'todo.jsonl');

const KINDS = ['task', 'debt'];
const STATUSES = ['open', 'done', 'dropped'];
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const FIELD_ORDER = ['id', 'kind', 'status', 'text', 'file', 'line', 'priority', 'tags', 'session_id', 'agent_id',
  'created', 'updated', 'closed', 'resolution'];

const now = () => new Date().toISOString();
const fail = (msg) => { console.error(`error: ${msg}`); process.exit(1); };

// ---------- storage ----------

function readItems() {
  if (!existsSync(JSONL)) return [];
  return readFileSync(JSONL, 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '').map((line, i) => {
    try { return JSON.parse(line); } catch { return fail(`todo.jsonl line ${i + 1} is not valid JSON`); }
  });
}

const toLine = (it) => JSON.stringify(Object.fromEntries(FIELD_ORDER.filter((k) => it[k] !== undefined).map((k) => [k, it[k]])));

function writeItems(items) {
  const tmp = `${JSONL}.tmp`;
  writeFileSync(tmp, items.length ? items.map(toLine).join('\n') + '\n' : '', 'utf8');
  renameSync(tmp, JSONL);
}

const idNum = (id) => Number(String(id).replace('TODO-', ''));
const fmtId = (n) => `TODO-${String(n).padStart(3, '0')}`;
const nextId = (items) => fmtId(Math.max(0, ...items.map((i) => idNum(i.id))) + 1);

function normalizeId(raw) {
  const m = /^(?:TODO-)?(\d+)$/i.exec(String(raw ?? ''));
  if (!m) fail(`invalid id "${raw}" (use TODO-### or a number)`);
  return fmtId(Number(m[1]));
}

function oneOf(value, allowed, label) {
  if (!allowed.includes(value)) fail(`${label} "${value}" must be one of: ${allowed.join(', ')}`);
  return value;
}

const currentSession = () => process.env.CLAUDE_CODE_SESSION_ID || 'unknown';

// ---------- options ----------

const OPTIONS = {
  id: { type: 'string' }, kind: { type: 'string' }, status: { type: 'string' }, text: { type: 'string' },
  file: { type: 'string' }, line: { type: 'string' }, priority: { type: 'string' }, tags: { type: 'string' },
  session: { type: 'string' }, agent: { type: 'string' }, note: { type: 'string' },
  all: { type: 'boolean' }, json: { type: 'boolean' }, 'all-sessions': { type: 'boolean' },
  'older-than': { type: 'string' }, 'dry-run': { type: 'boolean' },
};

const tagList = (raw) => String(raw).split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);

// ---------- commands ----------

function cmdAdd(o, positionals) {
  const text = (o.text ?? positionals.join(' ')).trim();
  if (!text) fail('add needs the TODO text (positional or --text)');
  const items = readItems();
  const ts = now();
  const item = {
    id: nextId(items),
    kind: oneOf(o.kind ?? 'task', KINDS, 'kind'),
    status: 'open',
    text,
    ...(o.file ? { file: o.file } : {}),
    ...(o.line ? { line: Number(o.line) || fail(`line "${o.line}" must be a number`) } : {}),
    ...(o.priority ? { priority: oneOf(o.priority.toUpperCase(), PRIORITIES, 'priority') } : {}),
    ...(o.tags ? { tags: tagList(o.tags) } : {}),
    session_id: o.session ?? currentSession(),
    agent_id: o.agent ?? 'main',
    created: ts,
    updated: ts,
  };
  appendFileSync(JSONL, toLine(item) + '\n', 'utf8');
  console.log(`${item.id} added (${item.kind}, session ${item.session_id}, agent ${item.agent_id})`);
}

function filtered(o) {
  let items = readItems();
  if (o.session && !o['all-sessions']) items = items.filter((i) => i.session_id === o.session);
  if (o.agent) items = items.filter((i) => i.agent_id === o.agent);
  if (o.kind) items = items.filter((i) => i.kind === oneOf(o.kind, KINDS, 'kind'));
  if (o.file) items = items.filter((i) => i.file === o.file);
  if (o.tags) { const want = tagList(o.tags); items = items.filter((i) => want.every((t) => (i.tags ?? []).includes(t))); }
  if (o.status) items = items.filter((i) => i.status === oneOf(o.status, STATUSES, 'status'));
  else if (!o.all) items = items.filter((i) => i.status === 'open');
  return items;
}

function cmdList(o) {
  const items = filtered(o);
  if (o.json) { items.forEach((i) => console.log(toLine(i))); return; }
  if (!items.length) { console.log('no matching TODOs'); return; }
  for (const i of items) {
    const where = i.file ? ` ${i.file}${i.line ? `:${i.line}` : ''}` : '';
    const pri = i.priority ? ` ${i.priority}` : '';
    const tags = i.tags?.length ? ` ${i.tags.map((t) => `#${t}`).join(' ')}` : '';
    const res = i.resolution ? ` -> ${i.resolution}` : '';
    console.log(`${i.id} [${i.status}] ${i.kind}${pri} (${i.agent_id}) ${i.text}${where}${tags}${res}`);
  }
}

function close(o, status) {
  const id = normalizeId(o.id);
  const items = readItems();
  const it = items.find((i) => i.id === id);
  if (!it) fail(`${id} not found`);
  const ts = now();
  Object.assign(it, { status, updated: ts, closed: ts, ...(o.note ? { resolution: o.note } : {}) });
  writeItems(items);
  console.log(`${id} ${status}`);
}

function cmdEdit(o) {
  const id = normalizeId(o.id);
  const items = readItems();
  const it = items.find((i) => i.id === id);
  if (!it) fail(`${id} not found`);
  if (o.text) it.text = o.text;
  if (o.kind) it.kind = oneOf(o.kind, KINDS, 'kind');
  if (o.file) it.file = o.file;
  if (o.line) it.line = Number(o.line) || fail(`line "${o.line}" must be a number`);
  if (o.priority) it.priority = oneOf(o.priority.toUpperCase(), PRIORITIES, 'priority');
  if (o.tags) it.tags = tagList(o.tags);
  if (o.status) {
    it.status = oneOf(o.status, STATUSES, 'status');
    if (it.status === 'open') { delete it.closed; delete it.resolution; } else it.closed ??= now();
  }
  if (o.note) it.resolution = o.note;
  it.updated = now();
  writeItems(items);
  console.log(`${id} edited`);
}

// Remove closed TODOs. Debt is kept unless --kind debt is given. Open TODOs are never removed.
function cmdPrune(o) {
  const items = readItems();
  const kind = o.kind ?? 'task';
  oneOf(kind, KINDS, 'kind');
  const cutoff = o['older-than'] ? Date.now() - Number(o['older-than']) * 86400000 : Infinity;
  if (!Number.isFinite(cutoff) && o['older-than']) fail('--older-than must be a number of days');
  const drop = items.filter((i) => i.status !== 'open' && i.kind === kind && (!o.session || i.session_id === o.session)
    && Date.parse(i.closed ?? i.updated) <= cutoff);
  if (o['dry-run']) { drop.forEach((i) => console.log(`would remove ${i.id}`)); return; }
  writeItems(items.filter((i) => !drop.includes(i)));
  console.log(`removed ${drop.length} closed ${kind} TODO(s)`);
}

function cmdSession() { console.log(currentSession()); }

const HELP = `todo.mjs - quick TODO capture, stored in todo/todo.jsonl

Commands:
  add <text> [--kind task|debt] [--file P] [--line N] [--priority P0..P3] [--tags a,b]
             [--agent ID] [--session ID]       Add an open TODO. Session defaults to $CLAUDE_CODE_SESSION_ID,
                                               agent defaults to "main".
  list [--all-sessions] [--session ID] [--agent ID] [--kind K] [--status S] [--all]
       [--file P] [--tags a,b] [--json]        List TODOs. Default: open TODOs of the current session.
  done --id N [--note TEXT]                    Mark a TODO done.
  drop --id N [--note TEXT]                    Mark a TODO dropped (no longer needed).
  edit --id N [--text T] [--kind K] [--file P] [--line N] [--priority P] [--tags a,b]
       [--status S] [--note TEXT]              Change fields. --status open reopens.
  prune [--kind task|debt] [--session ID] [--older-than DAYS] [--dry-run]
                                               Remove closed TODOs (default kind: task). Open ones stay.
  session                                      Print the current session id.
  help                                         Show this text.

Schema fields: id, kind, status, text, file, line, priority, tags, session_id, agent_id,
created, updated, closed, resolution.`;

// ---------- main ----------

const [command = 'help', ...rest] = process.argv.slice(2);
let parsed;
try { parsed = parseArgs({ args: rest, options: OPTIONS, allowPositionals: true }); } catch (e) { fail(e.message); }
const { values: o, positionals } = parsed;

// list defaults to the current session unless another scope is given.
if (command === 'list' && !o['all-sessions'] && !o.session) o.session = currentSession();

switch (command) {
  case 'add': cmdAdd(o, positionals); break;
  case 'list': cmdList(o); break;
  case 'done': close(o, 'done'); break;
  case 'drop': close(o, 'dropped'); break;
  case 'edit': cmdEdit(o); break;
  case 'prune': cmdPrune(o); break;
  case 'session': cmdSession(); break;
  case 'help': case '--help': case '-h': console.log(HELP); break;
  default: fail(`unknown command "${command}" (run \`help\`)`);
}
