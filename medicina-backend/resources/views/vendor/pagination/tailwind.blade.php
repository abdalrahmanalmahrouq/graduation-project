@if ($paginator->hasPages())
    {{-- Custom pagination container with brand background --}}
    <nav role="navigation" aria-label="Pagination Navigation" 
         class="flex items-center justify-center py-3 rounded-lg mt-4">

        <div class="hidden sm:flex items-center space-x-1">

            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <span class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" 
                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-medicina-brand border border-medicina-brand rounded-md hover:bg-medicina-brand/90 transition">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </a>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three dots" separator --}}
                @if (is_string($element))
                    <span class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400">{{ $element }}</span>
                @endif

                {{-- Array of links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <span class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-medicina-brand border border-medicina-brand rounded-md">
                                {{ $page }}
                            </span>
                        @else
                            <a href="{{ $url }}" 
                               class="inline-flex items-center px-3 py-2 text-sm font-medium text-medicina-brand bg-white border border-medicina-brand rounded-md hover:bg-medicina-brand hover:text-white transition">
                                {{ $page }}
                            </a>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" 
                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-medicina-brand border border-medicina-brand rounded-md hover:bg-medicina-brand/90 transition">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                </a>
            @else
                <span class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                </span>
            @endif
        </div>
    </nav>
@endif
