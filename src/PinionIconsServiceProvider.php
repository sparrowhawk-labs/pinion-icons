<?php

namespace SparrowhawkLabs\PinionIcons;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use SparrowhawkLabs\PinionIcons\Commands\IconsInstall;
use SparrowhawkLabs\PinionIcons\View\Components\Icon;

class PinionIconsServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/resources/config/icons.php',
            'icons'
        );
    }

    public function boot()
    {
        // Config publication
        $this->publishes([
            __DIR__ . '/resources/config/icons.php' => config_path('icons.php'),
        ], 'pinion-icons-config');

        // Load views from package
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'pinion-icons');

        // Commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                IconsInstall::class,
            ]);
        }

        // Register <x-i> component
        Blade::component('i', Icon::class);
    }
}
