#!/usr/bin/env node
// Validates doc frontmatter and reports staleness.
// No dependencies. Run: node scripts/check-docs.mjs [--strict] [--days 90]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DOC_DIRS = ['docs/features', 'docs/guidelines'];
const REQUIRED = ['owner', 'status', 'last_reviewed', 'area'];
const VALID_STATUS = ['draft', 'active', 'stale', 'archived'];

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const staleDays = Number(args[args.indexOf('--days') + 1]) || 90;

function walk(dir) {
  let out = [];
  let entries;
  try { entries = readdirSync(join(ROOT, dir)); } catch { return out; }
  for (const name of entries) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) { out = out.concat(walk(rel)); continue; }
    if (!name.endsWith('.md')) continue;
    if (name === 'README.md' || name.startsWith('_')) continue;
    out.push(rel);
  }
  return out;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return data;
}

const errors = [];
const stale = [];
const byOwner = new Map();
const byStatus = new Map();
const files = DOC_DIRS.flatMap(walk);
const today = new Date();

for (const file of files) {
  const fm = parseFrontmatter(readFileSync(join(ROOT, file), 'utf8'));
  if (!fm) { errors.push(`${file}: missing frontmatter block`); continue; }

  for (const key of REQUIRED) {
    if (!fm[key]) errors.push(`${file}: missing required field "${key}"`);
  }
  if (fm.status && !VALID_STATUS.includes(fm.status)) {
    errors.push(`${file}: status "${fm.status}" must be one of ${VALID_STATUS.join(', ')}`);
  }

  const raw = readFileSync(join(ROOT, file), 'utf8');
  if (/\[\[[^\]]+\]\]/.test(raw)) {
    errors.push(`${file}: contains [[wikilinks]] — they do not render on GitHub`);
  }

  if (fm.last_reviewed) {
    const date = new Date(fm.last_reviewed);
    if (Number.isNaN(date.getTime())) {
      errors.push(`${file}: last_reviewed "${fm.last_reviewed}" is not a YYYY-MM-DD date`);
    } else {
      const age = Math.floor((today - date) / 86400000);
      if (age > staleDays && fm.status !== 'archived') {
        stale.push({ file, age, owner: fm.owner });
      }
    }
  }

  byOwner.set(fm.owner, (byOwner.get(fm.owner) || 0) + 1);
  byStatus.set(fm.status, (byStatus.get(fm.status) || 0) + 1);
}

console.log(`\nDocs checked: ${files.length}\n`);

if (byStatus.size) {
  console.log('By status');
  for (const [k, v] of [...byStatus].sort()) console.log(`  ${k}: ${v}`);
  console.log('');
}

if (byOwner.size) {
  console.log(`Contributors: ${byOwner.size}`);
  for (const [k, v] of [...byOwner].sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log('');
}

if (stale.length) {
  console.log(`Stale — not reviewed in ${staleDays} days (${stale.length})`);
  for (const s of stale.sort((a, b) => b.age - a.age)) {
    console.log(`  ${s.age}d  ${s.file}  (${s.owner})`);
  }
  console.log('');
}

if (errors.length) {
  console.log(`Errors (${errors.length})`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log('');
  process.exit(1);
}

if (strict && stale.length) process.exit(1);
console.log('All docs valid.\n');
