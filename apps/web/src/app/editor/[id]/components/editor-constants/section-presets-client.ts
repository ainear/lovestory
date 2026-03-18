/**
 * Client-safe re-export of section-presets.
 * ComponentsTab is a "use client" component — it must not import from
 * @/server/data/ paths, which causes Next.js to bundle the file as a
 * server module, creating two React instances and triggering React #310.
 *
 * This re-export lives inside editor-constants (always client-bundled).
 */
export {
  SECTION_PRESETS,
  SECTION_PRESET_CATEGORIES,
} from "@/server/data/section-presets";

export type {
  SectionPreset,
  SectionCategory,
} from "@/server/data/section-presets";
