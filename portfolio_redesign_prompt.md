# Portfolio Redesign Prompt — "Spotlight" Interaction System

> **How to use this file:** Paste this entire document into your AI coding agent (Claude Code, Cursor, Google AI Studio, etc.) along with your current repo. Attach the reference screenshots (the new fuller layout) and your current site screenshots so the agent can see both states. The agent should treat this as the full spec — implement everything below, not just the copy/paste sections.

---

## 1. Project Context

- **Stack:** React 19 + Vite + TypeScript + Tailwind CSS + Supabase
- **Current state:** A working dark-themed portfolio (hero, about, education/experience, projects, skills, certificates) already exists and is live.
- **Goal of this task:** Evolve the current site into the fuller reference layout (more complete Projects grid, an Expertise section, a Certifications grid, an "Appreciate this portfolio" reaction widget, and a contact form footer) **and** add a cohesive hover/motion language across the site — specifically a "spotlight" effect that makes the element under the cursor come alive while everything else around it quietly recedes.
- **Known open issues to fix while you're in these files** (carry these fixes into the new design, don't just restyle around them):
  - Education timeline section needs proper styling/spacing once real Experience entries replace the placeholder ones.
  - Social/brand icons (GitHub, LinkedIn, Email) are currently inconsistent — replace with a single consistent icon set (e.g. `lucide-react` or `react-icons`) at uniform size/stroke weight.
  - Certificate image upload to Supabase is blocked by an RLS policy — fix the storage bucket policy so authenticated/anon uploads for certificate images succeed (write policy scoped appropriately) before wiring the new Certifications grid to real images.

---

## 2. Design Tokens

Don't reuse generic AI-template defaults (cream+terracotta, near-black+single neon accent, or newspaper hairline grids) just because they're easy — the current site already has a real identity (indigo/violet glow on near-black). **Refine that identity, don't replace it.**

**Color**
| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0A0A0F` | page background |
| `--bg-surface` | `#13131C` | card / panel background |
| `--bg-surface-hover` | `#1A1A26` | card background on hover |
| `--accent-violet` | `#7C5CFC` | primary accent, gradient start |
| `--accent-indigo` | `#5B5FEF` | gradient end, links, focus rings |
| `--text-primary` | `#F5F5F7` | headings, primary copy |
| `--text-secondary` | `#9A9AB0` | body copy, muted labels |
| `--border-subtle` | `rgba(255,255,255,0.08)` | default card border |
| `--border-active` | `rgba(124,92,252,0.55)` | hovered/focused card border |

**Type**
- Display/headings: a bold geometric sans (`Sora`, `Space Grotesk`, or `Clash Display`) — this is what currently gives "Asfi Ahamed" its punch on the hero. Keep it.
- Body: a clean humanist sans (`Inter` or `Manrope`) at 16px base, `text-secondary` color, 1.6 line-height.
- Labels/eyebrows (e.g. "ABOUT", "SELECTED WORK", "BACKGROUND"): uppercase, `text-xs`, letter-spacing `0.15em`, `accent-indigo`, with a small icon or dot before the text.

**Shape & elevation**
- Card radius: `1.25rem` (rounded-2xl).
- Default card: 1px `border-subtle`, no shadow, background `bg-surface`.
- Hovered card: `border-active`, soft violet glow shadow (`0 20px 45px -15px rgba(124,92,252,0.35)`), background lifts to `bg-surface-hover`, translateY(-4px to -6px).

---

## 3. Page Structure (target content/sections)

Build/restructure into these sections in order. Use the fuller reference screenshot as the content source of truth (it already has more real sections than the live site):

1. **Hero** — avatar/name in nav, nav links (About / Education / Projects / Skills / Certificates), CV download, Contact button. Headline name, role subtitle, university line, "View Projects" (filled gradient pill) + "Get in Touch" (outline pill) buttons, social icon row (GitHub / LinkedIn / Email), portrait photo in a rounded panel with ambient violet glow behind it.
2. **About** — eyebrow label "ABOUT", 2-column layout: bio copy on the left, portrait/photo panel on the right (or stacked on mobile).
3. **Background (Education + Experience)** — eyebrow label "BACKGROUND", two-column vertical timelines side by side: Education (degree → A/Levels → O/Levels) and Experience. Each entry: date range, title, institution/org, 1–3 bullet highlights.
4. **Projects** — eyebrow "SELECTED WORK", heading "Projects" + subtitle. Card grid (2 columns desktop, 1 mobile). Each card: category badge top-left (e.g. `AI / RAG`, `DATA SCIENCE`, `FULL-STACK`, `BACKEND`, `HARDWARE`), year/status top-right (`2025`, `2026`, `Ongoing`), bold title, 2–3 line description, tech-tag pills, and a footer link (`Explore →`, `View on GitHub ↗`, or a `Coming Soon` status dot for unfinished ones).
5. **Expertise** — eyebrow "EXPERTISE", 4-column list layout (no card borders, just clean stacked text groups): Frameworks & Tools, Languages, AI/ML, Databases.
6. **Certifications** — eyebrow "CERTIFICATIONS", small card grid: cert name + issuing platform (Kaggle, NVIDIA, AWS Academy, etc.).
7. **Appreciate** — eyebrow "APPRECIATE", centered: "Did you enjoy my portfolio?", a tappable heart button with a live count ("X people have appreciated this portfolio"), and a row of quick-react chips (Great work / Impressive / Inspiring / Love it) where the selected chip stays visually highlighted. Wire the count + selected reaction to Supabase so it persists.
8. **Contact / footer** — "Let's work together." heading, contact form (name, email, message → gradient "Send Message" button), plus direct contact details (email, phone, location) and repeated social links in the footer.

---

## 4. The Signature Interaction: "Spotlight on Hover"

This is the one thing that should make the new site feel alive instead of static — and it's the part a static screenshot can't show you, so the spec below is explicit on purpose.

### 4a. Portrait image — brighten/glow on hover
At rest, the portrait sits slightly muted so the *hover* state reads as a genuine reveal, not just a hover-state for hover's sake.

```css
.portrait-frame {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
}

.portrait-frame::before {
  /* ambient glow behind the photo */
  content: "";
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle, var(--accent-violet) 0%, transparent 70%);
  opacity: 0.25;
  filter: blur(40px);
  transition: opacity 450ms ease;
  z-index: -1;
}

.portrait-frame img {
  filter: brightness(0.82) saturate(0.9) contrast(1.02);
  transform: scale(1);
  transition: filter 450ms ease, transform 450ms ease;
}

.portrait-frame:hover img {
  filter: brightness(1.05) saturate(1.1) contrast(1.05);
  transform: scale(1.03);
}

.portrait-frame:hover::before {
  opacity: 0.55;
}
```

### 4b. Project card grid — hovered card lifts, siblings recede
The effect you described — "hover one card and you can see the difference between it and the nearby cards" — is sibling dimming: the card under the cursor brightens/elevates while every other card in the same grid quietly dims and slightly shrinks, so the eye is pulled to exactly one card at a time.

Use a **JS-driven approach** (more reliable across browsers than CSS `:has()` alone) by tracking a `hoveredId` in the grid's parent state:

```tsx
// ProjectsGrid.tsx
import { useState } from "react";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
         onMouseLeave={() => setHoveredId(null)}>
      {projects.map((p) => {
        const isHovered = hoveredId === p.id;
        const isDimmed = hoveredId !== null && !isHovered;
        return (
          <article
            key={p.id}
            onMouseEnter={() => setHoveredId(p.id)}
            className={[
              "rounded-2xl border p-6 transition-all duration-300 ease-out",
              "bg-[var(--bg-surface)] border-[var(--border-subtle)]",
              isHovered &&
                "scale-[1.02] -translate-y-1.5 border-[var(--border-active)] bg-[var(--bg-surface-hover)] shadow-[0_20px_45px_-15px_rgba(124,92,252,0.35)]",
              isDimmed && "opacity-55 scale-[0.985] saturate-75",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* card content */}
          </article>
        );
      })}
    </div>
  );
}
```

Tune the numbers, but keep the relationship: **hovered card scales up + lifts + brightens; siblings scale down slightly + drop opacity to ~0.5–0.6**. Transition duration should stay in the 250–350ms range — fast enough to feel responsive, slow enough not to flicker.

### 4c. Education / Experience timeline — same language, timeline-flavored
Apply the identical dim/elevate pattern to each timeline entry (Education items and Experience items each get their own `hoveredId` state, scoped per column so hovering an Education entry doesn't dim Experience entries and vice versa):

- Hovered entry: text shifts to full `text-primary` brightness, its timeline dot fills solid and gets a soft glow ring, a thin left border in `accent-indigo` appears.
- Non-hovered entries in the same column: text dims to `text-secondary` at slightly lower opacity (~0.6), timeline dot stays a hollow/muted outline.
- Keep the connecting vertical line itself constant (don't dim the line, only the entry content) so the timeline structure never looks broken.

```tsx
function TimelineColumn({ items }: { items: TimelineItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div className="relative" onMouseLeave={() => setHoveredId(null)}>
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />
      {items.map((item) => {
        const isHovered = hoveredId === item.id;
        const isDimmed = hoveredId !== null && !isHovered;
        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            className={[
              "relative pl-8 py-4 transition-all duration-300",
              isDimmed && "opacity-60",
            ].filter(Boolean).join(" ")}
          >
            <span
              className={[
                "absolute left-0 top-5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300",
                isHovered
                  ? "bg-[var(--accent-indigo)] border-[var(--accent-indigo)] shadow-[0_0_12px_rgba(91,95,239,0.7)]"
                  : "bg-transparent border-white/30",
              ].join(" ")}
            />
            {/* date / title / org / bullets, using text-primary when isHovered else text-secondary */}
          </div>
        );
      })}
    </div>
  );
}
```

### 4d. Shared rules across all three
- Respect `prefers-reduced-motion`: wrap transitions so users with that setting get instant or near-instant state changes instead of animated ones.
- Keyboard users need the same affordance: apply the "hovered" visual state on `:focus-visible` too (cards, timeline entries, and the portrait if it's interactive/clickable), not just on mouse hover.
- Don't dim anything below ~0.5 opacity — it should read as "receded," not "disabled."

---

## 5. Component Implementation Checklist

- [ ] Replace all social icons with one consistent icon library, uniform size (e.g. 20px) and stroke width.
- [ ] Fix the Supabase storage RLS policy blocking certificate image uploads.
- [ ] Build out real Experience entries (replace "New Exp / Comp" placeholders).
- [ ] Build the Expertise section as plain stacked lists (no card borders) under 4 column headers.
- [ ] Build Certifications as a card grid (name + issuing platform, optional logo).
- [ ] Build the Appreciate widget: heart toggle + live count + 4 reaction chips, persisted via Supabase.
- [ ] Build the contact form (name, email, message) wired to send via Supabase/edge function or existing email service.
- [ ] Apply the spotlight hover pattern (§4) to: Projects grid, Education timeline, Experience timeline, and the hero/about portrait.
- [ ] Verify mobile: spotlight dimming effects should be disabled or replaced with a simpler tap-state on touch devices (no `:hover` reliance there), since there's no real cursor to "leave."

---

## 6. Acceptance Criteria

1. Hovering a project card visibly distinguishes it from its neighbors — neighbors dim/shrink slightly, the hovered card lifts and brightens. Moving the mouse away returns the whole grid to its resting state smoothly.
2. The same dim/elevate language is visible in the Education and Experience timelines, scoped independently per column.
3. The hero/about portrait is visibly more muted at rest and visibly brighter + glowing on hover, with a smooth (~450ms) transition.
4. Keyboard-only navigation reaches the same visual states via focus.
5. `prefers-reduced-motion: reduce` removes/shortens the transitions site-wide.
6. No layout shift is introduced by the hover transforms (use `transform`/`opacity`/`filter` only, never properties that affect layout like `width`/`margin`).
