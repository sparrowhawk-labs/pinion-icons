
## pinion-icons

SVG icon component. Default: Solar Icons.

### Usage

```blade
<x-i type="icon-name" />
<x-i type="icon-name" variant="outline" class="w-5 h-5 text-primary" />
```

### Props

| Prop | Default | Description |
|------|---------|-------------|
| type | required | Icon name (Solar concept, 1234 options) |
| variant | 'bold-duotone' | `bold-duotone` / `bold` / `broken` / `line-duotone` / `linear` / `outline` / **`emoji`** / **`pixel`** |
| library | 'solar' | `solar` / `solar-extra` / `fluent-emoji` / `pixelarticons` |
| class | '' | CSS classes |

### Virtual variants (emoji / pixel)

`variant="emoji"` → Microsoft Fluent Emoji (carbon colors, does NOT respect `currentColor`). `variant="pixel"` → Pixelarticons 8-bit (monochrome, respects `currentColor`). All 1234 Solar concept names work in both.

```blade
<x-i type="heart" variant="emoji" />   {{-- colorful red heart --}}
<x-i type="heart" variant="pixel" />   {{-- monochrome pixel heart --}}
```

### solar-extra (plain close/check/plus/minus)

Solar has only ring-wrapped versions. Use `library="solar-extra"` for plain.

```blade
<x-i type="close" library="solar-extra" variant="bold" />
```

### Common Icons

```blade
{{-- Navigation --}}
<x-i type="home" />
<x-i type="user" />
<x-i type="settings" />
<x-i type="menu-kebab" />

{{-- Actions --}}
<x-i type="add" />
<x-i type="pen" />
<x-i type="trash" />
<x-i type="upload" />
<x-i type="download" />

{{-- Arrows --}}
<x-i type="alt-arrow-left" />
<x-i type="alt-arrow-right" />
<x-i type="alt-arrow-up" />
<x-i type="alt-arrow-down" />

{{-- Status --}}
<x-i type="check-circle" />
<x-i type="close-circle" />
<x-i type="info-circle" />
<x-i type="danger-triangle" />
```
