---
name: capture-topic
description: Capture a candidate topic (something that needs discussion, a design question, or a decision to make) into topics/thought-stream.md as a timestamped one-liner, so it can later be promoted to a TOPIC-### file. Use when the user says "capture a topic", "topic:", "we need to discuss", "open question", "note for later", or invokes /capture-topic. For plain ideas (a feature or improvement to build), use capture-idea instead.
---

# Capture Topic

Append a raw, moment-in-time topic seed to `topics/thought-stream.md`. This is lightweight
parking for something that needs discussion or a decision. It is **not** a `TOPIC-###` file
and is not part of any lifecycle. The user can later promote the entry into a real
`TOPIC-###` file. Get it recorded with minimal ceremony and get out of the way.

## Topic or idea

- A topic is a question, a debate, or a decision to make. Example: "Should the wiki use
  one XHTML file per page or one per section?" Use this skill.
- An idea is a suggestion to build or change something. Example: "We could add a dark
  theme to the static UI." Use `capture-idea`. It writes to `topics/idea-stream.md`.
- If it is unclear, ask the user one short question: "Topic or idea?"

## When to use

- The user raises something that needs discussion and wants it saved without stopping to
  flesh it out.
- Triggers: `/capture-topic`, "capture a topic", "topic:", "we need to discuss",
  "open question", "note for later".

## Steps

1. **Get the topic text.**
   - If the user supplied it (as skill args or in their message), use that verbatim,
     lightly cleaned: trim whitespace, collapse to a single line, keep their wording and
     voice. Do not expand, interpret, or "improve" it.
   - If nothing was supplied, ask: "What is the topic?" and wait.

2. **Get the timestamp.** Run `date "+%Y-%m-%d %H:%M"` (Bash tool). Use the project's
   local time. Do not guess.

3. **Append one list item** to `topics/thought-stream.md`, at the end of the file (after
   the last existing entry / the `<!-- capture-topic appends below this line -->`
   marker). Format:

   ```
   - `[YYYY-MM-DD HH:MM]` <topic text on one line>
   ```

   - If the text is multi-sentence, keep it as one bullet. Do not split it into several.
   - Optional trailing tags are fine if the user gave them: append ` #tag` tokens at the
     end of the line.
   - Preserve existing file content exactly. Only add the new line(s).

4. **Confirm briefly.** Echo back the one-line entry that was added and the file it went
   into. One or two sentences. Do not summarize the whole file or suggest next actions
   unless asked.

## Rules

- Never create a `TOPIC-###` file, touch `topic-registry.md`, or change any topic's
  status from this skill. Promotion to a real topic is a separate, deliberate step the
  user drives.
- Never write ideas to `topics/idea-stream.md` from this skill. That file belongs to
  `capture-idea`.
- One invocation = one entry (unless the user explicitly lists several distinct topics,
  then one bullet each).
- Keep entries terse. The point is speed of capture, not completeness.
- If `topics/thought-stream.md` does not exist, create it with this header first:

  ```
  # Thought Stream

  Moment-in-time capture of raw topic seeds, to be revisited later.
  Not structured topics. Added via the `capture-topic` skill.

  ---

  ## Captured

  <!-- capture-topic appends below this line -->
  ```
