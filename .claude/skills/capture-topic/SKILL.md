---
name: capture-thought
description: Capture a fleeting thought, idea, or "what if" into topics/thought-stream.md as a timestamped one-liner for later consideration. Use when the user says things like "capture this", "jot this down", "quick thought", "idea:", "note for later", or invokes /capture-thought.
---

# Capture Thought

Append a raw, moment-in-time thought to `topics/thought-stream.md`. This is lightweight
idea parking — **not** a `TOPIC-###` file, not part of any lifecycle. Get the thought
recorded with minimal ceremony and get out of the way.

## When to use

- The user has a passing idea they want saved without stopping to flesh it out.
- Triggers: `/capture-thought`, "capture this", "jot this down", "quick thought",
  "park this idea", "note for later", a line starting with "idea:" or "what if".

## Steps

1. **Get the thought text.**
   - If the user supplied it (as skill args or in their message), use that verbatim,
     lightly cleaned: trim whitespace, collapse to a single line, keep their wording and
     voice. Do not expand, interpret, or "improve" the idea.
   - If nothing was supplied, ask: "What's the thought?" and wait.

2. **Get the timestamp.** Run `date "+%Y-%m-%d %H:%M"` (Bash tool). Use the project's
   local time. Do not guess.

3. **Append one list item** to `topics/thought-stream.md`, at the end of the file (after
   the last existing entry / the `<!-- capture-thought appends below this line -->`
   marker). Format:

   ```
   - `[YYYY-MM-DD HH:MM]` <thought text on one line>
   ```

   - If the thought is multi-sentence, keep it as one bullet — do not split into several.
   - Optional trailing tags are fine if the user gave them: append ` #tag` tokens at the
     end of the line.
   - Preserve existing file content exactly; only add the new line(s).

4. **Confirm briefly** — echo back the one-line entry that was added and the file it went
   into. One or two sentences. Do not summarize the whole file or suggest next actions
   unless asked.

## Rules

- Never create a `TOPIC-###` file, touch `topic-registry.md`, or change any topic's
  status from this skill. Promotion to a real topic is a separate, deliberate step the
  user drives.
- One invocation = one entry (unless the user explicitly lists several distinct thoughts,
  then one bullet each).
- Keep entries terse. The point is speed of capture, not completeness.
- If `topics/thought-stream.md` does not exist, create it with this header first:

  ```
  # Thought Stream

  Moment-in-time capture of raw thoughts and ideas, to be revisited later.
  Not structured topics. Added via the `capture-thought` skill.

  ---

  ## Captured

  <!-- capture-thought appends below this line -->
  ```
