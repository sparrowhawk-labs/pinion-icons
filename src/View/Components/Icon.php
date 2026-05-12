<?php

namespace SparrowhawkLabs\PinionIcons\View\Components;

use Illuminate\View\Component;

class Icon extends Component
{
    public string $type;
    public ?string $variant;
    public ?string $library;

    public function __construct(
        string $type,
        ?string $variant = null,
        ?string $library = null
    ) {
        $this->type = $type;
        $this->variant = $variant;
        $this->library = $library;
    }

    public function render()
    {
        return view('pinion-icons::components.i');
    }
}
