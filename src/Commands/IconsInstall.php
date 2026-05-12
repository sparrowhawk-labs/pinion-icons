<?php

namespace SparrowhawkLabs\PinionIcons\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class IconsInstall extends Command
{
    protected $signature = 'icons:install {library?} {--all} {--claude : Add reference to CLAUDE.md}';

    protected $description = 'Install icon SVG files from vendor packages to project';

    public function handle()
    {
        $this->info('pinion-icons Installation');
        $this->newLine();

        $libraries = config('icons.libraries');

        if ($this->option('all')) {
            foreach (array_keys($libraries) as $library) {
                $this->installLibrary($library);
            }
        } elseif ($libraryName = $this->argument('library')) {
            $this->installLibrary($libraryName);
        } else {
            $defaultLibrary = config('icons.default_library');
            $this->installLibrary($defaultLibrary);
        }

        // Ask about CLAUDE.md
        $addToClaude = $this->option('claude');

        if (!$addToClaude) {
            $addToClaude = $this->confirm('Add icon reference to CLAUDE.md?', true);
        }

        if ($addToClaude) {
            $this->addToClaudeMd();
        }

        $this->newLine();
        $this->info('✓ pinion-icons installed successfully!');
        $this->line('  Documentation: vendor/sparrowhawk-labs/pinion-icons/REFERENCE.md');

        return Command::SUCCESS;
    }

    protected function installLibrary(string $libraryName): void
    {
        $libraries = config('icons.libraries');

        if (!isset($libraries[$libraryName])) {
            $this->error("Library '{$libraryName}' not found in config/icons.php");
            return;
        }

        $config = $libraries[$libraryName];
        $sourcePath = base_path($config['source'] ?? '');
        $destPath = base_path($config['destination'] ?? $config['path'] ?? '');

        if (!$sourcePath || !File::exists($sourcePath)) {
            $this->warn("Source path not found: {$sourcePath}");
            $this->line("  Skipping icon copy. Icons will be loaded from package.");
            return;
        }

        $this->info("Installing {$libraryName} icons...");

        if (File::exists($destPath)) {
            File::deleteDirectory($destPath);
        }
        File::makeDirectory($destPath, 0755, true);

        $files = File::glob($sourcePath . '/*.svg');
        $copied = 0;

        foreach ($files as $file) {
            $filename = basename($file);
            File::copy($file, $destPath . '/' . $filename);
            $copied++;
        }

        $this->info("✓ Copied {$copied} SVG files to {$destPath}");
    }

    protected function addToClaudeMd(): void
    {
        $claudeMdPath = base_path('CLAUDE.md');
        $snippetPath = dirname(__DIR__, 2) . '/CLAUDE_SNIPPET.md';

        if (!File::exists($snippetPath)) {
            $this->warn('CLAUDE_SNIPPET.md not found in package.');
            return;
        }

        $snippet = File::get($snippetPath);
        $marker = '## pinion-icons';

        if (File::exists($claudeMdPath)) {
            $existing = File::get($claudeMdPath);
            if (str_contains($existing, $marker)) {
                $this->line('  CLAUDE.md already contains pinion-icons reference.');
                return;
            }
            File::append($claudeMdPath, "\n" . $snippet);
        } else {
            File::put($claudeMdPath, "# Project Guidelines\n" . $snippet);
        }

        $this->info('✓ Added pinion-icons reference to CLAUDE.md');
    }
}
