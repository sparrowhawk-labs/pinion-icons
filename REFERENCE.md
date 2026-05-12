# pinion-icons Reference

SVG icon component for Laravel Blade. Supports multiple icon libraries and styles.

## Usage

```blade
{{-- Basic --}}
<x-i type="user" />

{{-- With style variant --}}
<x-i type="home" variant="outline" />

{{-- With Tailwind classes --}}
<x-i type="settings" class="w-6 h-6 text-primary" />

{{-- Different library --}}
<x-i type="arrow-right" library="heroicons" variant="solid" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | string | required | Icon name (e.g., 'user', 'home', 'settings') |
| variant | string | config default | Style variant (e.g., 'bold-duotone', 'outline') |
| library | string | config default | Icon library (e.g., 'solar', 'heroicons') |
| class | string | '' | CSS/Tailwind classes |

## Variants

Default library: **Solar Icons** (1234 concepts × 6 styles = 7404 SVGs)

### Solar styles

| Variant | Description |
|---------|-------------|
| bold-duotone | Bold with two-tone colors (default) |
| bold | Solid bold icons |
| broken | Broken line style |
| line-duotone | Line with two-tone |
| linear | Simple line icons |
| outline | Outline style |

### Virtual variants: emoji / pixel

Two extra variants swap the library under the hood — `<x-i type="heart" variant="emoji" />` renders from Fluent Emoji, `variant="pixel"` renders from Pixelarticons. All 1234 Solar concept names resolve in both (many via semantic mapping — e.g. `accessibility` → emoji `wheelchair_symbol`, pixel `human`).

| Variant | Maps to library | Source | Notes |
|---------|----------------|--------|-------|
| emoji | `fluent-emoji` | Microsoft Fluent Emoji (MIT) — Flat colour | Inline colours; does **not** respect `currentColor`. Native slug names (`cross_mark`, `red_heart`) also resolve. |
| pixel | `pixelarticons` | Pixelarticons v1.8.1 (MIT) | Monochrome 8-bit; respects `currentColor`. Native slug names (`close`, `heart`) also resolve. |

```blade
<x-i type="heart" variant="bold-duotone" />   {{-- Solar, default --}}
<x-i type="heart" variant="linear" />         {{-- Solar linear --}}
<x-i type="heart" variant="emoji" />          {{-- Fluent Emoji red heart --}}
<x-i type="heart" variant="pixel" />          {{-- Pixelarticons heart --}}
```

### solar-extra (plain close / check / plus / minus)

Solar has no background-less ✕/✓/＋/− — `solar-extra` fills that gap with the same 6 style variants.

```blade
<x-i type="close" library="solar-extra" variant="bold" />  {{-- plain ✕ --}}
<x-i type="check" library="solar-extra" variant="linear" />
```

## Configuration

Publish config to customize:

```bash
php artisan vendor:publish --tag=pinion-icons-config
```

`config/icons.php`:

```php
return [
    'default_library' => 'solar',
    'default_style' => 'bold-duotone',

    'libraries' => [
        'solar' => [
            'path' => 'resources/icons/solar',
            'styles' => ['bold-duotone', 'bold', 'broken', 'line-duotone', 'linear', 'outline'],
            'pattern' => '{name}-{style}.svg',
        ],
        'solar-extra' => [
            'path' => 'resources/icons/solar-extra',
            'styles' => ['bold-duotone', 'bold', 'broken', 'line-duotone', 'linear', 'outline'],
            'pattern' => '{name}-{style}.svg',
        ],
        'fluent-emoji' => [
            'path' => 'resources/icons/fluent-emoji',
            'styles' => [],
            'pattern' => '{name}.svg',
        ],
        'pixelarticons' => [
            'path' => 'resources/icons/pixelarticons',
            'styles' => [],
            'pattern' => '{name}.svg',
        ],
    ],
];
```

### Synthetic-variant fallback

When a library uses `{name}-{style}.svg` pattern but the styled file doesn't exist, the component falls back to `{name}.svg` in the same library. This is what lets `<x-i type="heart" variant="bold" library="fluent-emoji" />` return `heart.svg` — the single Fluent Emoji flat is reused across all style requests.

### Virtual variant resolution

When `library` is **not** explicitly passed and `variant` is `emoji` or `pixel`, the component rewrites the lookup to `fluent-emoji` / `pixelarticons`. Explicit `library="..."` always wins.

## Installation

```bash
# Install icons to project
php artisan icons:install

# Install specific library
php artisan icons:install solar

# Install all libraries
php artisan icons:install --all
```

## Examples

```blade
{{-- Navigation icons --}}
<x-i type="home" class="w-5 h-5" />
<x-i type="user" class="w-5 h-5" />
<x-i type="settings" class="w-5 h-5" />

{{-- Action icons --}}
<x-i type="add" class="w-4 h-4" />
<x-i type="trash" class="w-4 h-4 text-error" />
<x-i type="pen" class="w-4 h-4" />

{{-- Status icons --}}
<x-i type="check-circle" class="w-5 h-5 text-success" />
<x-i type="info-circle" class="w-5 h-5 text-info" />
<x-i type="danger" class="w-5 h-5 text-warning" />

{{-- Arrows --}}
<x-i type="alt-arrow-left" class="w-4 h-4" />
<x-i type="alt-arrow-right" class="w-4 h-4" />
<x-i type="alt-arrow-up" class="w-4 h-4" />
<x-i type="alt-arrow-down" class="w-4 h-4" />
```

## Adding Custom Libraries

1. Add SVG files to `resources/icons/{library}/`
2. Update `config/icons.php`:

```php
'libraries' => [
    'custom' => [
        'path' => 'resources/icons/custom',
        'styles' => ['default'],
        'pattern' => '{name}.svg',
    ],
],
```

3. Use: `<x-i type="icon-name" library="custom" />`
