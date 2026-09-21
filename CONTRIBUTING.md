# How to contribute

Writing a doc should take **15 minutes**, not an afternoon. If it is taking
longer, you are writing too much — cut it down.

## The rule

> A feature is not done until its feature doc exists.

This is part of our Definition of Done in Jira. The doc link goes in the Jira
ticket.

## Adding a feature doc

1. Copy `docs/features/_TEMPLATE.md`
2. Name it after the feature in kebab-case: `dx-billing-support.md`
3. Fill the frontmatter and the sections. Delete sections that do not apply.
4. Open a PR. One frontend teammate approves. Merge.

You can do all of this in the GitHub web editor — press `.` in the repo, or use
**Add file → Create new file**. No clone required.

## Frontmatter (required on every doc)

```yaml
---
owner: your-github-username
status: active          # draft | active | stale | archived
last_reviewed: 2026-09-20
area: billing           # billing | jobs | aica | selection | platform | shared
jira: JBV1-48615        # optional
---
```

`node scripts/check-docs.mjs` validates this, and CI runs it on every PR.

## Writing rules

- **Plain English.** Short sentences. The reader is a developer who has never
  touched this feature.
- **Link, do not copy.** Point to Jira, Figma, and Bitbucket rather than pasting
  their contents. Copied content goes stale silently.
- **Standard Markdown only.** `[text](path.md)` and `![alt](../images/foo.png)`.
  No `[[wikilinks]]` — they do not render on GitHub.
- **Images sparingly.** Every screenshot is a binary committed forever. Prefer a
  Figma link. If you must, put it in `docs/images/` with a descriptive name.
- **No credentials.** Ever. Link to the password manager instead.

## Keeping docs alive

- When you change a feature, update its doc in the same sprint, and add the doc
  link to the Jira ticket.
- **Doc duty rotates** across the frontend team. The person on duty
  triages open doc issues and clears the staleness report.
- **Monthly freshness sweep**: 20 minutes in the team meeting. Run the health
  check, then for each stale doc — update it, reassign it, or delete it.
  Deleting a doc nobody needs is a good outcome, not a failure.
