# Orpheus Ocean Operations Hub

A single-page launchpad for the Orpheus Ocean testing system. It gathers the dive checklist forms, engineering test tools and field resources in one place, so operators on deck can reach the right form in one tap from a phone or laptop.

The page is plain HTML and CSS: no JavaScript, no build step, no dependencies.

## Quick start

Open `index.html` in any browser, or host it on any static web server (GitHub Pages, Netlify, S3, etc.). Every card opens its tool in a new tab.

## What's on the hub

### Dive Checklist Forms

Complete these in order for every dive. Together they create, update and close a single dive record.

| Phase | Form | Purpose |
|---|---|---|
| 1 | Pre-Dive Checklist | Vehicle condition, weight dropper and mission data. **Creates the dive record.** |
| 2 | Pre-Launch Checklist | Deck-side checks, software pre-launch, functionality confirmation and final steps. |
| 3 | Post-Dive Report | Immediate post-dive procedure, functionality checks and notes. **Closes the dive record.** |

### Engineering & Testing

| Role | Tool | Purpose |
|---|---|---|
| Operator | Test Logger | Log individual test entries as PASS / FAIL / PARTIAL, with rosbag filenames and notes. |
| Engineer | Test Plan Builder | Build structured test plans before a dive, assigning items by category and type. |

### Resources

| Tag | Link | Purpose |
|---|---|---|
| Tides | [Plymouth Tide Tracker](https://ben-orpheus.github.io/PlymouthTideTracker/) | Live and forecast tide data for Plymouth, for planning dive timing. |
| Data | Notion Workspace | Dive Checklists, Cruises, Test Plans and Test Plan Items databases. |

## How the forms are wired

All five forms are served by **one Google Apps Script web app**. Each card links to the same deployment URL and selects the form with a `phase` query parameter:

| `phase` value | Form |
|---|---|
| `predive` | Pre-Dive Checklist |
| `prelaunch` | Pre-Launch Checklist |
| `postdive` | Post-Dive Report |
| `testing` | Test Logger |
| `testplan` | Test Plan Builder |

Records are stored in the Notion databases listed under Resources.

**If the Apps Script is redeployed as a new deployment, its URL changes.** Update all five `href` values in `index.html` to match. The base URL is repeated in each link, so a find-and-replace on the old deployment ID is the quickest way.

## Troubleshooting

**A form shows "unable to open" on a phone.** Open the link in an incognito or private window. This happens when Chrome is signed into a personal Google account alongside the Orpheus workspace account. The same note appears at the top of the hub.

## Customising

### Adding a card

Copy an existing `<a class="card">` block into the relevant section and edit it:

```html
<a class="card" href="https://example.com" target="_blank">
  <span class="card-phase phase-res">Tag</span>
  <span class="card-title">Tool Name</span>
  <span class="card-desc">One-line description of what it's for.</span>
</a>
```

### Badge colours

| Class | Colour | Used for |
|---|---|---|
| `phase-1` | Orange | Phase 1 |
| `phase-2` | Yellow | Phase 2 |
| `phase-3` | Green | Phase 3 |
| `phase-eng` | Blue | Engineering tools |
| `phase-res` | Purple | Resources |

### Theme

Colours, radius and font are CSS variables on `:root` at the top of the `<style>` block (for example `--accent` for the orange brand colour). Change them there and the whole page follows.

## Layout

Cards sit in a responsive grid (minimum 240 px per card) inside an 860 px container. Below 600 px wide, cards stack into a single column and the header and padding tighten for phone use on deck.

## Known issues

- The **Notion Workspace** card links to the generic `https://www.notion.so` home page rather than the Orpheus workspace. Replace it with the workspace or database URL so the card goes straight to the data.
- Links use `target="_blank"` without `rel="noopener"`. Modern browsers apply noopener by default, but adding it explicitly is good practice.

## Project structure

```
index.html   The hub: markup and inline CSS
README.md    This file
```
