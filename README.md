# Frontend Knowledge Hub

The single place to find how our frontend works: what we shipped, how to run it,
and how we write code.

> **Readers:** browse right here on GitHub. You do not need to clone anything.
> **Writers (frontend team):** see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Start here

| I want to...                         | Go to                                    |
| ------------------------------------ | ---------------------------------------- |
| Understand a feature, or run/test it | [Feature docs](docs/features/)           |
| Know how we write and review code    | [Guidelines](docs/guidelines/)           |
| See what changed recently            | [Updates](docs/updates/)                 |
| Find a link, tool, or reference      | [Resources](docs/resources.md)           |
| Ask where something is               | [Discussions](../../discussions)         |
| Report a missing or wrong doc        | [Open an issue](../../issues/new/choose) |

## What belongs here

| Type | Lives in | Nature |
| --- | --- | --- |
| **Feature docs** | `docs/features/` | One file per feature. What it does, why, how to run it, implementation notes. |
| **Guidelines** | `docs/guidelines/` | Evergreen standards. Conventions, review rules, patterns. |
| **Updates** | `docs/updates/` | Append-only log, newest first. One line per change. |
| **Resources** | `docs/resources.md` | Links, tools, references that used to get lost in chat. |

## What does not belong here

- Credentials, passwords, API keys, tokens — **never**, not even in a private repo.
  Git history is permanent. Use the team password manager and link to it.
- Ticket-level discussion — that stays in Jira.
- Personal notes.

## Health

Every doc carries an owner and a `last_reviewed` date. Docs unreviewed for
90 days are flagged automatically by [doc-health](.github/workflows/doc-health.yml).

```bash
node scripts/check-docs.mjs
```

## Ownership

This hub is maintained by the frontend team. Anyone in engineering can read it
and open issues; frontend developers merge changes.
