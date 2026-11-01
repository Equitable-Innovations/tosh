#!/usr/bin/env node
// Backlog manager for tosh. Source of truth: todo/backlog.jsonl. Output: todo/backlog.md.
// Every command that changes backlog.jsonl regenerates backlog.md from todo/backlog.template.md.
// Usage: node todo/scripts/backlog.mjs <command> [options]   (run `help` for details)

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TODO = join(dirname(fileURLToPath(import.meta.url)), '..');
const JSONL = join(TODO, 'backlog.jsonl');
const MD = join(TODO, 'backlog.md');
const TEMPLATE = join(TODO, 'backlog.template.md');

const STATUSES = ['BACKLOG', 'PLANNED', 'READY', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED', 'CANCELLED'];
const TERMINAL = ['DONE', 'CANCELLED'];
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const DOMAINS = ['CLI', 'MCP', 'REST API', 'Static UI', 'Work Items', 'Wiki', 'OpenAPI', 'SDK/API', 'Core'];
const TIERS = ['observe', 'propose', 'change-with-review', 'scoped-automation'];
const DASH = '—';
const FIELD_ORDER = ['id', 'title', 'slug', 'status', 'priority', 'domain', 'tier', 'assignee', 'milestone',
  'created', 'active', 'updated', 'completed'];

const today = () => new Date().toLocaleDateString('sv');
const fail = (msg) => { console.error(`error: ${msg}`); process.exit(1); };

// ---------- storage ----------

function readItems() {
  if (!existsSync(JSONL)) return [];
  return readFileSync(JSONL, 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '').map((line, i) => {
    try { return JSON.parse(line); } catch { return fail(`backlog.jsonl line ${i + 1} is not valid JSON`); }
  });
}

function writeAtomic(path, text) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, text, 'utf8');
  renameSync(tmp, path);
}

function writeItems(items) {
  items.sort((a, b) => idNum(a.id) - idNum(b.id));
  const lines = items.map((it) => JSON.stringify(Object.fromEntries(FIELD_ORDER.map((k) => [k, it[k] ?? DASH]))));
  writeAtomic(JSONL, lines.length ? lines.join('\n') + '\n' : '');
}

const idNum = (id) => Number(String(id).replace('WORK-ITEM-', ''));
const fmtId = (n) => `WORK-ITEM-${String(n).padStart(3, '0')}`;

function normalizeId(raw) {
  const m = /^(?:WORK-ITEM-)?(\d{1,})$/i.exec(String(raw ?? ''));
  if (!m) fail(`invalid id "${raw}" (use WORK-ITEM-### or a number)`);
  return fmtId(Number(m[1]));
}

function nextId(items) {
  const files = readdirSync(TODO).map((f) => /^WORK-ITEM-(\d+)_/.exec(f)).filter(Boolean).map((m) => Number(m[1]));
  return fmtId(Math.max(0, ...items.map((i) => idNum(i.id)), ...files) + 1);
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ---------- validation ----------

function check(value, allowed, label) {
  if (!allowed.includes(value)) fail(`${label} "${value}" must be one of: ${allowed.join(', ')}`);
  return value;
}

function priorityCode(raw) {
  return check(String(raw).trim().split(/\s|-/)[0].toUpperCase(), PRIORITIES, 'priority');
}

// ---------- generation ----------

const cell = (s) => String(s).replace(/\|/g, '\\|');
const link = (it) => `[\`${it.id}\`](${it.id}_${it.slug}.md)`;
const byId = (a, b) => idNum(a.id) - idNum(b.id);

function activeRows(items) {
  const rows = items.filter((i) => !TERMINAL.includes(i.status));
  const dated = rows.filter((i) => i.active !== DASH).sort((a, b) => a.active.localeCompare(b.active) || byId(a, b));
  const undated = rows.filter((i) => i.active === DASH).sort((a, b) => a.created.localeCompare(b.created) || byId(a, b));
  const sorted = [...dated, ...undated];
  if (!sorted.length) return `| *None yet* | *No active work items registered* | ${Array(8).fill(DASH).join(' | ')} |`;
  return sorted.map((i) => `| ${link(i)} | ${cell(i.title)} | \`${i.status}\` | \`${i.priority}\` | \`${i.domain}\` | \`${i.tier}\` | ${cell(i.assignee)} | \`${i.milestone}\` | ${i.active} | ${i.updated} |`).join('\n');
}

function archiveRows(items) {
  const rows = items.filter((i) => TERMINAL.includes(i.status))
    .sort((a, b) => (a.completed ?? '').localeCompare(b.completed ?? '') || byId(a, b));
  if (!rows.length) return `| *None yet* | *No completed work items registered* | ${Array(5).fill(DASH).join(' | ')} |`;
  return rows.map((i) => `| ${link(i)} | ${cell(i.title)} | \`${i.domain}\` | \`${i.tier}\` | \`${i.status}\` | ${i.completed ?? i.updated} | \`${i.milestone}\` |`).join('\n');
}

function metricsRow(items) {
  const n = (s) => items.filter((i) => i.status === s).length;
  return `| ${items.length} | ${n('BACKLOG')} | ${n('PLANNED')} | ${n('READY')} | ${n('IN_PROGRESS')} | ${n('IN_REVIEW')} | ${n('DONE')} | ${n('BLOCKED')} |`;
}

function generate(items) {
  if (!existsSync(TEMPLATE)) fail(`missing template ${TEMPLATE}`);
  const out = readFileSync(TEMPLATE, 'utf8')
    .replaceAll('{{METRICS_ROW}}', metricsRow(items))
    .replaceAll('{{ACTIVE_ROWS}}', activeRows(items))
    .replaceAll('{{ARCHIVE_ROWS}}', archiveRows(items));
  writeAtomic(MD, out);
}

// ---------- commands ----------

const OPTIONS = {
  id: { type: 'string' }, title: { type: 'string' }, slug: { type: 'string' }, status: { type: 'string' },
  priority: { type: 'string' }, domain: { type: 'string' }, tier: { type: 'string' },
  assignee: { type: 'string' }, milestone: { type: 'string' }, 'keep-file': { type: 'boolean' },
};

function applyStatus(item, status) {
  const old = item.status;
  item.status = check(status, STATUSES, 'status');
  if (item.active === DASH && old === 'BACKLOG' && status !== 'BACKLOG') item.active = today();
  if (TERMINAL.includes(status)) item.completed = item.completed && TERMINAL.includes(old) ? item.completed : today();
  else item.completed = DASH;
}

function applyFields(item, v) {
  if (v.title !== undefined) item.title = v.title;
  if (v.slug !== undefined) item.slug = slugify(v.slug);
  if (v.priority !== undefined) item.priority = priorityCode(v.priority);
  if (v.domain !== undefined) item.domain = check(v.domain, DOMAINS, 'domain');
  if (v.tier !== undefined) item.tier = check(v.tier, TIERS, 'tier');
  if (v.assignee !== undefined) item.assignee = v.assignee;
  if (v.milestone !== undefined) item.milestone = v.milestone;
  if (v.status !== undefined) applyStatus(item, v.status);
}

function find(items, raw) {
  const id = normalizeId(raw);
  return items.find((i) => i.id === id) ?? fail(`${id} is not in backlog.jsonl`);
}

function itemFile(item) {
  const exact = join(TODO, `${item.id}_${item.slug}.md`);
  if (existsSync(exact)) return exact;
  const alt = readdirSync(TODO).find((f) => f.startsWith(`${item.id}_`) && f.endsWith('.md'));
  return alt ? join(TODO, alt) : null;
}

const commands = {
  'next-id'(items) { console.log(nextId(items)); },

  add(items, v) {
    if (!v.title) fail('add needs --title');
    const id = v.id ? normalizeId(v.id) : nextId(items);
    if (items.some((i) => i.id === id)) fail(`${id} already exists`);
    const item = {
      id, title: v.title, slug: slugify(v.slug ?? v.title), status: 'BACKLOG',
      priority: priorityCode(v.priority ?? 'P2'), domain: check(v.domain ?? 'Core', DOMAINS, 'domain'),
      tier: check(v.tier ?? 'propose', TIERS, 'tier'), assignee: v.assignee ?? 'Unassigned',
      milestone: v.milestone ?? 'v0.1.0', created: today(), active: DASH, updated: today(), completed: DASH,
    };
    if (v.status) applyStatus(item, v.status);
    items.push(item);
    console.log(`added ${id} (${item.slug}) -> ${item.status}`);
    return true;
  },

  edit(items, v) {
    if (!v.id) fail('edit needs --id');
    const item = find(items, v.id);
    const before = { ...item };
    applyFields(item, v);
    if (JSON.stringify(before) === JSON.stringify(item)) { console.log(`no change for ${item.id}`); return false; }
    item.updated = today();
    const changed = FIELD_ORDER.filter((k) => before[k] !== item[k] && k !== 'updated').map((k) => `${k}: ${before[k]} -> ${item[k]}`);
    console.log(`edited ${item.id}: ${changed.join('; ')}`);
    return true;
  },

  remove(items, v) {
    if (!v.id) fail('remove needs --id');
    const item = find(items, v.id);
    items.splice(items.indexOf(item), 1);
    const file = v['keep-file'] ? null : itemFile(item);
    if (file) unlinkSync(file);
    console.log(`removed ${item.id}${file ? ` and deleted ${file}` : v['keep-file'] ? ' (file kept)' : ' (no file found)'}`);
    return true;
  },

  generate() { console.log('generated backlog.md'); return 'force'; },

  list(items, v) {
    for (const i of items.filter((x) => (!v.status || x.status === v.status) && (!v.id || x.id === normalizeId(v.id)))) {
      console.log(JSON.stringify(i));
    }
  },

  // Report drift between backlog.jsonl and the WORK-ITEM files. Changes nothing.
  check(items) {
    const problems = [];
    const files = readdirSync(TODO).filter((f) => /^WORK-ITEM-\d+_.+\.md$/.test(f));
    for (const i of items) {
      const file = itemFile(i);
      if (!file) { problems.push(`${i.id}: no WORK-ITEM file on disk`); continue; }
      const text = readFileSync(file, 'utf8');
      const status = /\*\*Status\*\* \| `([A-Z_]+)`/.exec(text)?.[1];
      if (status && status !== i.status) problems.push(`${i.id}: file status ${status} differs from jsonl status ${i.status}`);
      if (!file.endsWith(`${i.id}_${i.slug}.md`)) problems.push(`${i.id}: file name does not match slug "${i.slug}"`);
    }
    for (const f of files) if (!items.some((i) => f.startsWith(`${i.id}_`))) problems.push(`${f}: file has no record in backlog.jsonl`);
    console.log(problems.length ? problems.join('\n') : 'ok: backlog.jsonl and WORK-ITEM files agree');
    process.exitCode = problems.length ? 2 : 0;
  },

  help() {
    console.log(`node todo/scripts/backlog.mjs <command> [options]

  next-id                          print the next free WORK-ITEM-### id
  add --title T [--slug S --priority P2 --domain Core --tier propose
      --assignee A --milestone v0.1.0 --status BACKLOG --id N]
  edit --id N [--title --slug --status --priority --domain --tier --assignee --milestone]
  remove --id N [--keep-file]      delete the record and the WORK-ITEM file
  generate                         rebuild backlog.md from backlog.jsonl
  list [--status S] [--id N]       print records as JSON lines
  check                            report drift between jsonl and files

Every add, edit, and remove rebuilds backlog.md. Never edit backlog.md by hand.
Status: ${STATUSES.join(' | ')}
Domain: ${DOMAINS.join(' | ')}
Tier: ${TIERS.join(' | ')}`);
  },
};

const [cmd = 'help', ...rest] = process.argv.slice(2);
if (!commands[cmd]) fail(`unknown command "${cmd}" (run help)`);
const { values } = parseArgs({ args: rest, options: OPTIONS, strict: true });
const items = readItems();
const changed = commands[cmd](items, values);
if (changed === true) writeItems(items);
if (changed === true || changed === 'force') generate(items);
