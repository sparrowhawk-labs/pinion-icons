# Pinion Icons

[![Latest Version on Packagist](https://img.shields.io/packagist/v/sparrowhawk-labs/pinion-icons.svg?style=flat-square)](https://packagist.org/packages/sparrowhawk-labs/pinion-icons)
[![Total Downloads](https://img.shields.io/packagist/dt/sparrowhawk-labs/pinion-icons.svg?style=flat-square)](https://packagist.org/packages/sparrowhawk-labs/pinion-icons)
[![License](https://img.shields.io/packagist/l/sparrowhawk-labs/pinion-icons.svg?style=flat-square)](LICENSE)
[![PHP Version](https://img.shields.io/packagist/php-v/sparrowhawk-labs/pinion-icons.svg?style=flat-square)](composer.json)

A unified icon system for Laravel Blade. One `<x-i>` component, four built-in libraries, and a swap-the-variant trick that lets you switch between Solar line art, Fluent emoji, and 8-bit pixel art without changing the call site.

By [Sparrowhawk Labs](https://sparrowhawk-labs.dev) — part of the `pinion-*` series.

## Features

- **7,404 Solar Icons** — 1,234 concepts across 6 stroke variants (bold-duotone, bold, broken, line-duotone, linear, outline)
- **`solar-extra`** — plain `close` / `check` / `plus` / `minus` that Solar omits, in the same 6 variants
- **Virtual variants** — `variant="emoji"` swaps in Fluent Emoji; `variant="pixel"` swaps in Pixelarticons. Same concept names resolve in all libraries.
- **Direct SVG inlining** — no runtime HTTP, no JS, no font, no sprite map. Attributes merge into the rendered `<svg>` so Tailwind `class="w-5 h-5 text-primary"` Just Works.
- **Synthetic-variant fallback** — single-style libraries (Fluent Emoji, Pixelarticons) reuse the same SVG for every `variant=` request.
- **Zero configuration** — install, render. Publish the config only if you want to add libraries or change defaults.

## Installation

```bash
composer require sparrowhawk-labs/pinion-icons
```

Laravel auto-discovers the service provider. No further wiring needed.

## Quick start

```blade
{{-- Default: Solar bold-duotone --}}
<x-i type="home" class="w-6 h-6" />

{{-- Pick a stroke variant --}}
<x-i type="heart" variant="linear" class="w-6 h-6 text-red-500" />

{{-- Swap libraries with virtual variants --}}
<x-i type="heart" variant="emoji" class="w-8 h-8" />   {{-- Fluent Emoji --}}
<x-i type="heart" variant="pixel" class="w-8 h-8" />   {{-- Pixelarticons --}}

{{-- Explicit library --}}
<x-i type="close" library="solar-extra" variant="bold" class="w-4 h-4" />
```

## Component API

| Prop      | Type   | Default               | Description                                              |
|-----------|--------|-----------------------|----------------------------------------------------------|
| `type`    | string | required              | Icon concept name (e.g., `home`, `heart`, `alt-arrow-right`) |
| `variant` | string | `bold-duotone`        | Stroke style (`bold`, `linear`, …) or virtual (`emoji`, `pixel`) |
| `library` | string | `solar`               | Icon library (`solar`, `solar-extra`, `fluent-emoji`, `pixelarticons`) |
| `class`   | string | —                     | CSS classes applied to the rendered `<svg>` |

Any other HTML attribute passes through to the rendered `<svg>`.

## Libraries

| Library          | Style | currentColor | Notes |
|------------------|-------|--------------|-------|
| `solar`          | 6 variants × 1,234 concepts | ✓ | Default. The full Solar Icon Set. |
| `solar-extra`    | 6 variants | ✓ | Plain `close` / `check` / `plus` / `minus` that Solar wraps in rings. |
| `fluent-emoji`   | single (flat) | ✗ (baked colors) | Microsoft Fluent Emoji, Flat colour. |
| `pixelarticons`  | single (8-bit) | ✓ | Pixelarticons v1.8.1, 24×24 monochrome. |

Fluent Emoji and Pixelarticons resolve all 1,234 Solar concept names — many via semantic mapping (e.g., `accessibility` → emoji `wheelchair_symbol`, pixel `human`). Native slug names (`red_heart`, `close`) also work.

## Configuration

Defaults can be overridden via `.env`:

```env
ICON_DEFAULT_LIBRARY=solar
ICON_DEFAULT_STYLE=bold-duotone
```

To add libraries, publish the config:

```bash
php artisan vendor:publish --tag=pinion-icons-config
```

Then edit `config/icons.php`. See [REFERENCE.md](REFERENCE.md) for the full library schema and synthetic-variant fallback rules.

## Installing icon files locally (optional)

By default, the component reads SVGs directly from the vendor directory. If you want them inside your project (for build pipelines or CDN serving), publish them:

```bash
php artisan icons:install            # default library only
php artisan icons:install solar      # specific library
php artisan icons:install --all      # all libraries
```

Add `--claude` to also write a `## pinion-icons` reference block into your project's `CLAUDE.md`.

## Documentation

- **[REFERENCE.md](REFERENCE.md)** — full API, virtual variant rules, synthetic-variant fallback, adding custom libraries.
- **[CLAUDE_SNIPPET.md](CLAUDE_SNIPPET.md)** — drop-in `## pinion-icons` block for Claude Code project guides.

## Pinion series

Pinion Icons is part of the [Sparrowhawk Labs](https://sparrowhawk-labs.dev) `pinion-*` series — Laravel UI plugins built around shared design language. A *pinion* is a primary flight feather: the stroke that lets a hawk steer.

- **`sparrowhawk-labs/pinion-icons`** *(this package)*
- `sparrowhawk-labs/pinion-ui` *(coming soon — Blade/Livewire component library, hard-requires `pinion-icons`)*
- `sparrowhawk-labs/sparrowhawk` *(framework core, in design)*

## License

MIT — see [LICENSE](LICENSE).

## Credits

- [Solar Icon Set](https://github.com/480-Design/Solar-Icon-Set) by 480 Design (MIT)
- [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft (MIT)
- [Pixelarticons](https://github.com/halfmage/pixelarticons) by Gerrit Halfmann (MIT)
- Maintained by [Akihiko Takai](https://github.com/akihiko-takai) at [Sparrowhawk Labs](https://sparrowhawk-labs.dev)
