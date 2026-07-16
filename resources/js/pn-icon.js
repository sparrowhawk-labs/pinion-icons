/**
 * <pn-icon> — tune-reactive icon Web Component (Light DOM).
 *
 * Renders the SVG variant mapped to the active pinion-ui tune (`data-tune` on
 * an ancestor, falling back to <html>) and re-renders when the tune changes.
 * Exactly ONE svg lives in the DOM per icon at any time.
 *
 * Usage (emitted by Blade `<x-i type="pen" auto />`, or hand-written):
 *
 *   <pn-icon name="pen" auto class="size-6">…SSR-inlined initial svg…</pn-icon>
 *
 * Attributes:
 *   - name     (required) concept name, key into the registered icon data
 *   - auto     opt-in tune tracking; without it the element never re-renders
 *   - variant  explicit variant — wins over the tune map (element stays static)
 *   - library  informational passthrough; resolution is registry-by-name
 *   - anything else (class, style, aria-*, …) is copied onto the rendered <svg>
 *
 * Icon data is bundled at build time (bin/build-icon-data.mjs) and registered
 * explicitly — no runtime HTTP, no global registry object:
 *
 *   import PnIcon from '.../pinion-icons/resources/js/pn-icon.js';
 *   import iconData from './pn-icon-data.js';
 *   PnIcon.register(iconData);
 */

/**
 * Per-tune default variant map — the single source of truth (decided
 * 2026-06-25; do not duplicate in Blade). `pixel` is served by the
 * pixelarticons library, every other variant is a Solar stroke style.
 */
export const TUNE_VARIANT_MAP = {
    default: 'bold-duotone',
    soft: 'bold-duotone',
    minimal: 'linear',
    corporate: 'linear',
    tech: 'linear',
    sharp: 'bold',
    brutal: 'bold',
    editorial: 'outline',
    luxury: 'line-duotone',
    pixel: 'pixel',
    draft: 'broken',
};

export const DEFAULT_VARIANT = TUNE_VARIANT_MAP.default;

/** Attributes that configure <pn-icon> itself and must NOT be copied to the svg. */
const CONTROL_ATTRS = ['name', 'auto', 'variant', 'library', 'data-resolved-variant', 'style'];

/** name -> { variant: svgString } */
const registry = new Map();

/** Connected auto instances that the shared observer re-syncs. */
const instances = new Set();

/**
 * ONE module-level MutationObserver shared by every instance (never one per
 * element). Observes documentElement + subtree for data-tune flips and fans
 * the change out to all registered auto icons.
 */
let observer = null;

function ensureObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(() => {
        for (const el of instances) el.syncToTune();
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-tune'],
        subtree: true,
    });
}

export class PnIcon extends HTMLElement {
    /**
     * Merge bundled icon data ({ name: { variant: svgString } }) into the
     * registry and re-sync already-connected icons (register() may run after
     * SSR markup has connected).
     */
    static register(data) {
        for (const [name, variants] of Object.entries(data)) {
            registry.set(name, { ...(registry.get(name) || {}), ...variants });
        }
        for (const el of instances) el.syncToTune();
    }

    connectedCallback() {
        if (!this.hasAttribute('auto')) return;
        instances.add(this);
        ensureObserver();
        this.syncToTune();
    }

    disconnectedCallback() {
        instances.delete(this);
    }

    /** Explicit variant attr wins; otherwise nearest [data-tune] mapped through TUNE_VARIANT_MAP. */
    resolveVariant() {
        const explicit = this.getAttribute('variant');
        if (explicit) return explicit;
        const scope = this.closest('[data-tune]') || document.documentElement;
        const tune = scope.getAttribute('data-tune') || 'default';
        return TUNE_VARIANT_MAP[tune] || DEFAULT_VARIANT;
    }

    /**
     * Re-render if the resolved variant differs from what is currently in the
     * DOM (`data-resolved-variant`, seeded by SSR so the initial paint is
     * free and JS-optional). Missing data keeps the current svg — never blank.
     */
    syncToTune() {
        const variant = this.resolveVariant();
        if (variant === this.getAttribute('data-resolved-variant')) return;
        const svgString = registry.get(this.getAttribute('name'))?.[variant];
        if (!svgString) return;
        this.innerHTML = svgString;
        const svg = this.querySelector('svg');
        if (svg) {
            for (const { name, value } of this.attributes) {
                if (!CONTROL_ATTRS.includes(name) && !name.startsWith('data-')) {
                    svg.setAttribute(name, value);
                }
            }
        }
        this.setAttribute('data-resolved-variant', variant);
    }
}

if (typeof customElements !== 'undefined' && !customElements.get('pn-icon')) {
    customElements.define('pn-icon', PnIcon);
}

export function register(data) {
    PnIcon.register(data);
}

export default PnIcon;
