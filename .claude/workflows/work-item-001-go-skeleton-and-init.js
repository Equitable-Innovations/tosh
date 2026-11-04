export const meta = {
  name: 'work-item-001-go-skeleton-and-init',
  description:
    'Build the Go skeleton and the tosh init command for WORK-ITEM-001. A writer agent and a reviewer agent converge each unit in ledger order.',
}

// This script only coordinates agents. It cannot read files, run commands, or ask a question.
// Each agent reads the files, runs the commands, and returns data that matches a schema.
// The ledger is the source of truth. A rerun skips every unit that the ledger marks as verified.
//
// Input (args), all optional:
//   strategyAccepted: true   The human accepted the solution strategy.
//   approver: "name"         The name of that human. It is required with strategyAccepted.

const LEDGER_FILE = 'build-work/WORK-ITEM-001_intent-ledger.json'
const STRATEGY_FILE = 'build-work/WORK-ITEM-001_solution-strategy.md'
const WRITER_ROLE = 'agent:go-engineer'
const REVIEWER_ROLE = 'agent:code-reviewer'
const MAX_RETRIES = 2
const TIMESTAMP_COMMAND = 'date -u +%Y-%m-%dT%H:%M:%SZ'

const COMMON_RULES = [
  'Work in the repository at the current directory. The host is Windows.',
  'Run shell commands with Git Bash.',
  'Follow the programming guidelines in build-docs/guidelines/README.md.',
  'Do not change any file in build-docs, topics, todo, or build-work, unless this prompt says that you must.',
  'Do not push to a remote.',
  'Do not make a git commit, unless this prompt says that you must.',
  'Ignore the untracked file "AI Native SDLC Playbook_designv2.pdf". Do not stage it.',
].join('\n')

// ---------- Schemas ----------

const LEDGER_SCHEMA = {
  type: 'object',
  required: ['state', 'gates', 'subIntents'],
  properties: {
    state: { type: 'string' },
    gates: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'verdict'],
        properties: { name: { type: 'string' }, verdict: { type: 'string' } },
      },
    },
    subIntents: {
      type: 'array',
      items: {
        type: 'object',
        required: ['subIntentId', 'title', 'state', 'dependsOn', 'units'],
        properties: {
          subIntentId: { type: 'string' },
          title: { type: 'string' },
          state: { type: 'string' },
          dependsOn: { type: 'array', items: { type: 'string' } },
          units: {
            type: 'array',
            items: {
              type: 'object',
              required: ['unitId', 'title', 'state', 'executionWave', 'targetScope'],
              properties: {
                unitId: { type: 'string' },
                title: { type: 'string' },
                state: { type: 'string' },
                executionWave: { type: 'number' },
                targetScope: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
}

const WRITER_SCHEMA = {
  type: 'object',
  required: ['status', 'summary'],
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    summary: { type: 'string' },
    blockingDefect: { type: 'string' },
  },
}

const COMMAND_RESULT_SCHEMA = {
  type: 'object',
  required: ['command', 'exitCode', 'output'],
  properties: {
    command: { type: 'string' },
    exitCode: { type: 'number' },
    output: { type: 'string' },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['verdict', 'commandResults', 'findings'],
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fail'] },
    commandResults: { type: 'array', items: COMMAND_RESULT_SCHEMA },
    findings: { type: 'array', items: { type: 'string' } },
    manualItems: { type: 'array', items: { type: 'string' } },
  },
}

const RECORD_SCHEMA = {
  type: 'object',
  required: ['updated'],
  properties: {
    updated: { type: 'boolean' },
    commit: { type: 'string' },
    note: { type: 'string' },
  },
}

// ---------- Helpers ----------

// The spec file names follow the ledger identifiers.
// Example: unit_001_module_and_main becomes unit-001_module-and-main.
function specPath(id) {
  const parts = id.split('_')
  const isSubIntent = parts[0] === 'sub'
  const head = isSubIntent ? `sub-intent-${parts[2]}` : `${parts[0]}-${parts[1]}`
  const rest = parts.slice(isSubIntent ? 3 : 2).join('-')
  return `build-work/WORK-ITEM-001_${head}_${rest}_spec.md`
}

function findingsBlock(findings) {
  if (findings.length === 0) return ''
  const lines = findings.map(f => `- ${f}`).join('\n')
  return `The reviewer rejected your last attempt. Fix each finding:\n${lines}\n`
}

const LEDGER_EDIT_RULES = [
  `Edit the file ${LEDGER_FILE}. Keep it pure JSON.`,
  'Keep the layout and the two-space indent. Change only the fields that this prompt names.',
  `Get the current time with this command: ${TIMESTAMP_COMMAND}`,
  'Set timestamps.updatedAt to the current time.',
  'Recompute metricsRollup.verifiedUnits and metricsRollup.verifiedSubIntents. Count the items whose state is verified.',
  'Leave the other metrics unchanged.',
  'Make sure that the file is still valid JSON.',
].join('\n')

// ---------- Prompts ----------

function writerPrompt(sub, unit, findings) {
  return [
    `You are ${WRITER_ROLE}. You write one unit of WORK-ITEM-001.`,
    COMMON_RULES,
    'Read these files first:',
    `- ${specPath(unit.unitId)} (the unit specification)`,
    `- ${specPath(sub.subIntentId)} (the sub-intent specification)`,
    `- ${STRATEGY_FILE}`,
    'Follow the unit specification exactly. Change only the files in its target scope.',
    'If the unit specification requires a failing test first, write the tests and run them.',
    'Make sure that the tests fail for the right reason. Then write the code.',
    'Some files can already exist from an earlier run. Read them and continue from there.',
    'Do not change a test to make it pass. Fix the code.',
    'If a defect outside the target scope blocks you, stop. Set status to blocked and describe the defect.',
    'Before you finish, run the commands of section 4 of the unit specification. Fix every failure.',
    'Do not make a git commit. The recorder makes the commit.',
    findingsBlock(findings),
    'Reply with a short summary of what you changed.',
  ].join('\n')
}

function reviewerPrompt(unit) {
  return [
    `You are ${REVIEWER_ROLE}. You have a fresh context. You did not write this code.`,
    COMMON_RULES,
    'Do not change any file. You only read files and run commands.',
    `Read ${specPath(unit.unitId)}.`,
    'Run every command in section 4, the verification contract, one at a time.',
    'Record the exact exit code and the literal output of each command.',
    'Run the commands on the working tree. The changes are not committed yet.',
    'Run git status --porcelain to list the changed files.',
    'Make sure that the changed files are only the files in the target scope of the unit.',
    'Make sure that every acceptance criterion in section 7 holds.',
    'Make sure that every edge case test in section 5 exists and passes.',
    'Set the verdict to pass only if every command ends as expected and every criterion holds.',
    'Otherwise set the verdict to fail. Write one finding for each problem. Name the file and the fix.',
  ].join('\n')
}

function subIntentGatePrompt(sub) {
  return [
    `You are ${REVIEWER_ROLE}. You decide the verification gate of ${sub.subIntentId}.`,
    COMMON_RULES,
    'Do not change any file. You only read files and run commands.',
    `Read section 6 of ${specPath(sub.subIntentId)}.`,
    'Run every command in that section, one at a time, on the working tree.',
    'Record the exact exit code and the literal output of each command.',
    'Make sure that no command prints the text "panic:" on standard error.',
    'Set the verdict to pass only if every command ends as expected.',
    'List each manual item of the section in manualItems. Do not try to run a manual item.',
    'Otherwise set the verdict to fail. Write one finding for each problem.',
  ].join('\n')
}

function startPrompt(approver, gateAlreadyPassed) {
  const gateStep = gateAlreadyPassed
    ? ''
    : `Set the gate strategy-acceptance to verdict pass, approver "${approver}", and decidedAt to the current time.`
  return [
    'You are the recorder. You update the ledger. You make no git commit.',
    COMMON_RULES,
    LEDGER_EDIT_RULES,
    'Set the top-level state to converging.',
    'If timestamps.convergingAt is null, set it to the current time.',
    gateStep,
  ].join('\n')
}

function unitRecordPrompt(sub, unit, attempt) {
  const message = `feat: ${unit.title} (${unit.unitId}, WORK-ITEM-001)`
  return [
    'You are the recorder. You update the ledger and make one git commit.',
    COMMON_RULES,
    LEDGER_EDIT_RULES,
    `In the unit ${unit.unitId} of ${sub.subIntentId}, make these changes:`,
    '- Set state to verified.',
    '- Set validationVerdict to pass.',
    `- Set retries to ${attempt}.`,
    '- Set hold to null.',
    `- Set identities.writer to ${WRITER_ROLE} and identities.approver to ${REVIEWER_ROLE}.`,
    `Stage these paths, and only the ones that exist: ${unit.targetScope.join(', ')}, ${LEDGER_FILE}.`,
    'Do not use git add -A. Make sure that no other path is staged.',
    `Make one commit with this message: ${message}`,
    'Reply with the commit hash.',
  ].join('\n')
}

function unitHoldPrompt(sub, unit, attempt, reason) {
  return [
    'You are the recorder. You update the ledger. You make no git commit.',
    COMMON_RULES,
    LEDGER_EDIT_RULES,
    `In the unit ${unit.unitId} of ${sub.subIntentId}, make these changes:`,
    '- Set state to converging.',
    '- Set validationVerdict to fail.',
    `- Set retries to ${attempt}.`,
    `- Set hold to this text: ${reason}`,
    `In ${sub.subIntentId}, set hold to the same text.`,
  ].join('\n')
}

function subIntentRecordPrompt(sub) {
  return [
    'You are the recorder. You update the ledger and make one git commit.',
    COMMON_RULES,
    LEDGER_EDIT_RULES,
    `In ${sub.subIntentId}, make these changes:`,
    '- Set state to verified.',
    '- Set hold to null.',
    '- In its gate, set verdict to pass and decidedAt to the current time.',
    `Stage only ${LEDGER_FILE}. Make sure that no other path is staged.`,
    `Make one commit with this message: docs: record verification of ${sub.subIntentId} for WORK-ITEM-001`,
    'Reply with the commit hash.',
  ].join('\n')
}

function subIntentHoldPrompt(sub, reason) {
  return [
    'You are the recorder. You update the ledger. You make no git commit.',
    COMMON_RULES,
    LEDGER_EDIT_RULES,
    `In ${sub.subIntentId}, set hold to this text: ${reason}`,
    'In its gate, set verdict to fail and decidedAt to the current time.',
  ].join('\n')
}

// ---------- Steps ----------

// Run the writer and the reviewer until the unit passes or the retries run out.
async function convergeUnit(sub, unit) {
  let findings = []
  let lastReason = 'The unit did not pass review.'

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    log(`${unit.unitId}: attempt ${attempt + 1} of ${MAX_RETRIES + 1}. The writer starts.`)
    const written = await agent(writerPrompt(sub, unit, findings), {
      schema: WRITER_SCHEMA,
      label: `${unit.unitId} writer ${attempt + 1}`,
    })
    if (!written) return { verified: false, attempt, reason: 'The writer agent stopped.' }
    if (written.status === 'blocked') {
      return { verified: false, attempt, reason: `The writer is blocked. ${written.blockingDefect ?? written.summary}` }
    }

    log(`${unit.unitId}: the reviewer starts.`)
    const review = await agent(reviewerPrompt(unit), {
      schema: REVIEW_SCHEMA,
      label: `${unit.unitId} reviewer ${attempt + 1}`,
    })
    if (!review) return { verified: false, attempt, reason: 'The reviewer agent stopped.' }
    if (review.verdict === 'pass') return { verified: true, attempt }

    findings = review.findings
    lastReason = `The reviewer rejected the unit. ${findings.join(' ')}`
    log(`${unit.unitId}: the reviewer found ${findings.length} problem(s).`)
  }

  return { verified: false, attempt: MAX_RETRIES, reason: lastReason }
}

// ---------- Main ----------

phase('Load the ledger')
const ledger = await agent(
  [
    `Read the file ${LEDGER_FILE}. Change nothing.`,
    'Return the top-level state, every gate with its verdict, and every sub-intent in file order.',
    'For each sub-intent, return its units in file order.',
  ].join('\n'),
  { schema: LEDGER_SCHEMA, label: 'Read the ledger' },
)
if (!ledger) return { status: 'stopped', reason: 'The ledger agent returned no result.' }

const feasibility = ledger.gates.find(g => g.name === 'feasibility')
if (feasibility?.verdict !== 'pass') {
  return { status: 'stopped', reason: 'The feasibility gate does not have the verdict pass.' }
}

const strategyGate = ledger.gates.find(g => g.name === 'strategy-acceptance')
const gateAlreadyPassed = strategyGate?.verdict === 'pass'
const approver = typeof args?.approver === 'string' ? args.approver : ''
const humanAccepted = args?.strategyAccepted === true && approver !== ''

if (!gateAlreadyPassed && !humanAccepted) {
  log('A human must accept the solution strategy before the work starts.')
  return {
    status: 'waiting_for_human',
    gate: 'strategy-acceptance',
    action:
      'Read build-work/WORK-ITEM-001_solution-strategy.md. Then run this workflow again with strategyAccepted set to true and approver set to your name.',
  }
}

phase('Start convergence')
const started = await agent(startPrompt(approver, gateAlreadyPassed), {
  schema: RECORD_SCHEMA,
  label: 'Record the start',
})
if (!started?.updated) return { status: 'stopped', reason: 'The recorder cannot update the ledger.' }

const verifiedSubIntents = new Set(ledger.subIntents.filter(s => s.state === 'verified').map(s => s.subIntentId))
const manualItems = []
const verifiedUnits = []

for (const sub of ledger.subIntents) {
  if (verifiedSubIntents.has(sub.subIntentId)) {
    log(`${sub.subIntentId} is already verified. The workflow skips it.`)
    continue
  }

  const missing = sub.dependsOn.filter(id => !verifiedSubIntents.has(id))
  if (missing.length > 0) {
    return { status: 'stopped', reason: `${sub.subIntentId} depends on ${missing.join(', ')}, which is not verified.` }
  }

  const units = [...sub.units].sort((a, b) => a.executionWave - b.executionWave)
  for (const unit of units) {
    if (unit.state === 'verified') {
      log(`${unit.unitId} is already verified. The workflow skips it.`)
      continue
    }

    phase(`${unit.unitId}`)
    const outcome = await convergeUnit(sub, unit)

    if (!outcome.verified) {
      await agent(unitHoldPrompt(sub, unit, outcome.attempt, outcome.reason), {
        schema: RECORD_SCHEMA,
        label: `${unit.unitId} hold`,
      })
      return {
        status: 'held',
        unit: unit.unitId,
        reason: outcome.reason,
        verifiedUnits,
        action:
          'Read the reason. Fix the cause or add a remediation unit. Then run this workflow again. The uncommitted files of the unit stay in the working tree.',
      }
    }

    const recorded = await agent(unitRecordPrompt(sub, unit, outcome.attempt), {
      schema: RECORD_SCHEMA,
      label: `${unit.unitId} record`,
    })
    if (!recorded?.updated) {
      return { status: 'stopped', reason: `The recorder cannot commit ${unit.unitId}.`, verifiedUnits }
    }
    verifiedUnits.push({ unit: unit.unitId, commit: recorded.commit ?? null })
  }

  phase(`${sub.subIntentId} gate`)
  const gate = await agent(subIntentGatePrompt(sub), {
    schema: REVIEW_SCHEMA,
    label: `${sub.subIntentId} gate`,
  })
  if (gate?.verdict !== 'pass') {
    const reason = gate ? gate.findings.join(' ') : 'The gate agent stopped.'
    await agent(subIntentHoldPrompt(sub, reason), { schema: RECORD_SCHEMA, label: `${sub.subIntentId} hold` })
    return {
      status: 'held',
      subIntent: sub.subIntentId,
      reason,
      verifiedUnits,
      action: 'Fix the cause or add a remediation unit. Then run this workflow again.',
    }
  }

  const gateRecord = await agent(subIntentRecordPrompt(sub), {
    schema: RECORD_SCHEMA,
    label: `${sub.subIntentId} record`,
  })
  if (!gateRecord?.updated) {
    return { status: 'stopped', reason: `The recorder cannot commit the gate of ${sub.subIntentId}.`, verifiedUnits }
  }
  verifiedSubIntents.add(sub.subIntentId)
  manualItems.push(...(gate.manualItems ?? []))
}

return {
  status: 'converged_waiting_for_human',
  verifiedUnits,
  manualItems,
  remainingGate: 'release-authorization',
  humanSteps: [
    'Run git diff --quiet 24a304e -- build-docs topics and record the result (INV-003).',
    'Rehearse the rollback on a scratch branch with git revert --no-commit.',
    'Open the pull request and read the first CI run.',
    'Review and merge the pull request, then set the release-authorization gate.',
  ],
}
