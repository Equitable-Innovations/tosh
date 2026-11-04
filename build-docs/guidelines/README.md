# Programming Guidelines

This directory lists the programming guidelines that apply to the code of `tosh`. Each guideline is one short rule.
When two guidelines conflict, the guideline that comes earlier in this list wins.

## Guidelines

### Simplicity

1. KISS (Keep It Simple): Choose the simplest design that works.
2. YAGNI (You Are Not Going To Need It): Do not build a feature before you need it.
3. Avoid premature optimization: Make the code correct and clear first. Make it fast only after you measure a problem.
4. Prefer less code: Each line is a line that can have a bug.

### Structure

5. DRY (Do not Repeat Yourself): Keep each piece of knowledge in one place.
6. Single responsibility: Give each function, class, and module one reason to change.
7. Separation of concerns: Keep different concerns, such as data, logic, and display, in different parts of the code.
8. Low coupling: Make each part depend on as few other parts as possible.
9. High cohesion: Keep related code together.
10. Law of Demeter: Talk only to your direct neighbors. Do not reach through one object to get to another.
11. Composition over inheritance: Build behavior from small parts. Do not build deep class trees.

### SOLID

12. Open/closed: Add new behavior by adding code. Do not edit working code.
13. Liskov substitution: A subtype must work everywhere its parent type works.
14. Interface segregation: Make small interfaces. Do not force a caller to depend on methods that it does not use.
15. Dependency inversion: Depend on abstractions, not on concrete details.

### Naming and Readability

16. Use clear names: A name must tell the reader what the thing is or does.
17. Write code for the reader: People read code more often than people write it.
18. Keep functions small: A function does one thing.
19. Limit function parameters: Use a few parameters. Group related values into one object.
20. Avoid deep nesting: Use early returns to keep the main path flat.
21. Avoid magic numbers: Give each constant a name.
22. Comment the why: Code shows what happens. A comment explains why it happens.
23. Follow one style: Use the same format and naming rules in the whole project. Use a formatter to enforce them.

### Correctness

24. Fail fast: Report an error at the point where it first occurs.
25. Validate input at the boundary: When data enters the system from outside, make sure that the data is valid.
26. Do not hide errors: Never swallow an exception without a reason.
27. Make illegal states impossible: Use types and structure so that invalid data cannot exist.
28. Prefer immutable data: Do not change a value after you create it unless you must.
29. Avoid global mutable state: Pass dependencies in. Do not read them from a shared global.
30. Command-query separation: A function either changes state or returns data. It must not do both.
31. Write pure functions where you can: The same input must give the same output with no side effects.

### Testing

32. Test behavior: Write automated tests for every important behavior.
33. Keep tests fast and independent: One test must not depend on another test.
34. Fix the cause: When you find a bug, add a test that fails, and then fix the bug.

### Process

35. Make small changes: Small commits and small pull requests are easy to review and easy to undo.
36. Refactor often: Leave the code cleaner than you found it.
37. Review all code: A second person must read each change before it merges.
38. Automate repeated work: Use scripts and continuous integration for builds and tests, and for rules that the code must meet.
39. Handle security from the start: Never trust input, never store secrets in code, and give each part the least access it needs.
40. Document decisions and interfaces: Write down public interfaces and the reasons for large design choices.

### Agentic Development

When an LLM agent writes or changes code, these guidelines apply. They come from the public comments of Andrej
Karpathy about the mistakes of LLM coding agents. The community turned them into four rules.

41. Think before coding: State your assumptions. If a request has more than one meaning, ask. Do not pick one meaning
    and continue.
42. Simplicity first: Write the least code that solves the problem. Add no feature, option, or abstraction that nobody
    asked for.
43. Surgical changes: Change only what the task needs. Do not edit, reformat, or remove code and comments that the task
    does not touch.
44. Goal-driven execution: Define the success criteria before you start. Write a test that fails, and then make the test
    pass. Repeat until the criteria are met.

## Revisions

| Date | Change | Source |
| :--- | :--- | :--- |
| 2026-11-04 | Added the first list of programming guidelines. | User request |
| 2026-11-04 | Added the Agentic Development section (guidelines 41 to 44). | User request |
