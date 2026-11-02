# Build Docs

This directory of documentation are requirements, plans, and specifications for building `tosh`.

## Index

| Directory | Content |
| :--- | :--- |
| [`docs/`](docs/README.md) | Master specification of the document system and its five document domains. |
| [`project-mgr/`](project-mgr/README.md) | Project manager: PRD, FSD, epics, milestones, release gates, and the [Work Tracking System](project-mgr/wts/README.md). |
| `cli/` | The distributed binary and its command surface. |
| `mcp/` | The bundled MCP server that exposes document tools to LLMs. |
| `rest-api/` | The bundled local REST daemon for third-party UIs. |
| [`static-ui/`](static-ui/README.md) | Zero-build M3 web-component templates that render every document domain. |

## Rules

- All documents represent the current state of the design.
- History must only be tracked in the revisions section at the bottom of each document.
- All language must be void of references to past decisions. 
