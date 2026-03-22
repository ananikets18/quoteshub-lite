@props([
    'quote',
    'showActions' => true,
    'showUser'    => true,
    'size'        => 'default'
])

<article
    @if($showActions && auth()->check())
        x-data="quoteCard(@js($quote))"
    @endif
    class="quote-card-new anim-fade-up"
    aria-label="Quote by {{ $quote->author }}"
    @if($showActions && auth()->check())
        x-show="!dismissed"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0 -translate-y-2"
    @endif
>
    <div class="quote-card-body">
        {{-- Header: who shared --}}
        @if($showUser && $quote->user)
            <div class="quote-card-header">
                <a href="{{ route('profile.show', $quote->user->username) }}" class="flex-shrink-0">
                    <img src="{{ $quote->user->avatar ?? '/images/default-avatar.png' }}"
                         alt="{{ $quote->user->name }}"
                         class="quote-card-avatar">
                </a>
                <div class="flex-1 min-w-0">
                    <a href="{{ route('profile.show', $quote->user->username) }}"
                       class="quote-card-user-name block hover:opacity-80 transition-opacity truncate">
                        {{ $quote->user->name }}
                    </a>
                    <div class="quote-card-user-handle truncate">{{ '@' . $quote->user->username }}</div>
                </div>
                <span class="quote-card-time">{{ $quote->created_at->diffForHumans() }}</span>
            </div>
        @endif

        {{-- Quote text --}}
        <a href="{{ route('quotes.show', $quote) }}" class="block no-underline">
            <p class="quote-card-text {{ $size === 'large' ? 'text-2xl' : '' }}">
                {{ $quote->content }}
            </p>
        </a>

        {{-- Author / source --}}
        <div class="quote-card-author">
            <a href="{{ route('author.show', urlencode($quote->author)) }}"
               class="quote-card-author-name"
               style="text-decoration:none;transition:opacity 0.2s ease;"
               onmouseover="this.style.opacity='0.7'"
               onmouseout="this.style.opacity='1'">— {{ $quote->author }}</a>
            @if($quote->source)
                <span class="quote-card-author-dot"></span>
                <span class="quote-card-source">{{ $quote->source }}</span>
            @endif
        </div>
    </div>

    {{-- Categories --}}
    @if($quote->categories && $quote->categories->count() > 0)
        <div class="quote-card-categories">
            @foreach($quote->categories->take(3) as $category)
                <a href="{{ route('category.show', $category->slug) }}" class="category-pill">
                    {{ $category->icon ?? '' }} {{ $category->name }}
                </a>
            @endforeach
        </div>
    @endif

    {{-- Action bar --}}
    @if($showActions)
        <div class="quote-card-actions">
            @auth
                {{-- Like --}}
                <button @click="toggleLike" :disabled="loading" class="action-btn"
                        :class="liked ? 'liked' : ''" title="Like this quote">
                    <svg :class="liked ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span x-text="likesCount" class="text-xs font-semibold"></span>
                </button>

                {{-- Save --}}
                <button @click="toggleSave" :disabled="loading" class="action-btn"
                        :class="saved ? 'saved' : ''" title="Save this quote">
                    <svg :class="saved ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                    <span x-text="savesCount" class="text-xs font-semibold"></span>
                </button>

                {{-- Add to Collection --}}
                <div class="relative" x-data="collectionPicker({{ $quote->id }})">
                    <button @click="toggle()" class="action-btn" title="Add to collection"
                            :class="inAny ? 'saved' : ''">
                        <svg style="width:17px;height:17px;" :class="inAny ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                    </button>

                    {{-- Dropdown --}}
                    <div x-show="open" @click.away="open=false" x-transition
                         style="position:absolute;bottom:calc(100% + 8px);left:0;z-index:50;min-width:200px;
                                background:var(--bg-elevated);border:1px solid var(--border-muted);
                                border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,0.45);overflow:hidden;">
                        <div style="padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;
                                    letter-spacing:0.08em;color:#64748b;border-bottom:1px solid var(--border-subtle);">
                            Add to Collection
                        </div>
                        <div x-show="loadingCollections" style="padding:12px 14px;font-size:13px;color:#64748b;">
                            Loading…
                        </div>
                        <template x-for="col in collections" :key="col.id">
                            <button @click="toggleCollection(col)"
                                    class="collection-picker-item"
                                    :class="isInCollection(col.id) ? 'in-collection' : ''">
                                <svg x-show="isInCollection(col.id)" style="width:13px;height:13px;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                                <span x-show="!isInCollection(col.id)" style="width:13px;flex-shrink:0;"></span>
                                <span x-text="col.name" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
                            </button>
                        </template>
                        <div x-show="!loadingCollections && collections.length === 0"
                             style="padding:14px 16px;font-size:13px;color:#64748b;line-height:1.5;">
                            No collections yet.<br>
                            <a href="{{ route('collections.index') }}" style="color:#a78bfa;text-decoration:none;font-weight:600;">Create one →</a>
                        </div>
                    </div>
                </div>

                {{-- Share --}}
                <button @click="shareQuote" class="action-btn" title="Share">
                    <svg class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                </button>

            @else
                {{-- Guest --}}
                <a href="{{ route('login') }}" class="action-btn" title="Sign in to like">
                    <svg class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span class="text-xs font-semibold">{{ $quote->likes_count }}</span>
                </a>
                <a href="{{ route('login') }}" class="action-btn" title="Sign in to save">
                    <svg class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                    <span class="text-xs font-semibold">{{ $quote->saves_count }}</span>
                </a>
            @endauth

            <span class="action-spacer"></span>

            {{-- Views --}}
            <span class="action-btn" style="cursor:default;gap:4px;" title="Views">
                <svg style="width:15px;height:15px;" class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span class="text-xs" style="color:#475569;">{{ $quote->views_count }}</span>
            </span>

            {{-- Not Interested (auth, non-show pages only) --}}
            @auth
                @if($size !== 'large')
                    <button @click="markNotInterested({{ $quote->id }})" class="action-btn"
                            title="Not interested"
                            style="opacity:0.35;transition:opacity 0.2s;"
                            onmouseenter="this.style.opacity='0.85'"
                            onmouseleave="this.style.opacity='0.35'">
                        <svg style="width:15px;height:15px;" class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                        </svg>
                    </button>
                @endif
            @endauth

            {{-- Report (auth only, not own quotes) --}}
            @auth
                @if(auth()->id() !== $quote->user_id)
                    <button onclick="document.getElementById('report-modal-{{ $quote->id }}')?.showModal()"
                            class="action-btn" title="Report"
                            style="opacity:0.4;transition:opacity 0.2s;"
                            onmouseenter="this.style.opacity='0.8'"
                            onmouseleave="this.style.opacity='0.4'">
                        <svg style="width:15px;height:15px;" class="fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </button>
                @endif
            @endauth
        </div>
    @endif
</article>
