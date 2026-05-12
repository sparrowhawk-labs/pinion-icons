<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Library & Style
    |--------------------------------------------------------------------------
    */

    'default_library' => env('ICON_DEFAULT_LIBRARY', 'solar'),
    'default_style' => env('ICON_DEFAULT_STYLE', 'bold-duotone'),

    /*
    |--------------------------------------------------------------------------
    | Icon Libraries
    |--------------------------------------------------------------------------
    |
    | Define icon libraries with their source paths and available styles.
    | Source can be a vendor package path or custom directory.
    |
    */

    'libraries' => [
        'solar' => [
            'path' => 'vendor/sparrowhawk-labs/pinion-icons/resources/icons/solar',
            'styles' => [
                'bold-duotone',
                'bold',
                'broken',
                'line-duotone',
                'linear',
                'outline',
            ],
            'pattern' => '{name}-{style}.svg',
        ],

        // Solar を補完する自作シンプルアイコン集（close / check / plus / minus 等の plain forms）。
        // Solar と同じ 6 styles を共有。
        'solar-extra' => [
            'path' => 'vendor/sparrowhawk-labs/pinion-icons/resources/icons/solar-extra',
            'styles' => [
                'bold-duotone',
                'bold',
                'broken',
                'line-duotone',
                'linear',
                'outline',
            ],
            'pattern' => '{name}-{style}.svg',
        ],

        // Microsoft Fluent Emoji (Flat variant, MIT)。カラー固定で currentColor は反映されない。
        // variant 指定不要（1 icon 1 file）。PoC: 25 concepts のみ。
        'fluent-emoji' => [
            'path' => 'vendor/sparrowhawk-labs/pinion-icons/resources/icons/fluent-emoji',
            'styles' => [],
            'pattern' => '{name}.svg',
        ],

        // Pixelarticons v1.8.1 (MIT)。24×24 viewBox、currentColor 対応。
        // variant 指定不要。PoC: 25 concepts のみ。
        'pixelarticons' => [
            'path' => 'vendor/sparrowhawk-labs/pinion-icons/resources/icons/pixelarticons',
            'styles' => [],
            'pattern' => '{name}.svg',
        ],
    ],

];
