@extends('layouts.app')

@section('title', '"' . Str::limit($quote->content, 60) . '" — QuotesHub')
@section('description', 'Quote by ' . $quote->author . ': ' . Str::limit($quote->content, 140))

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 680px;">

            {{-- Back button --}}
            <a href="{{ url()->previous() }}"
               class="inline-flex items-center gap-2 mb-6"
               style="font-size:14px;font-weight:500;color:#64748b;text-decoration:none;transition:color 0.2s ease;"
               onmouseover="this.style.color='#a78bfa'"
               onmouseout="this.style.color='#64748b'">
                <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back
            </a>

            {{-- Main quote card (large) --}}
            <x-quote-card :quote="$quote" size="large" />

            {{-- Stats row --}}
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;">
                @foreach([
                    ['❤️', $quote->likes_count, 'Likes'],
                    ['💾', $quote->saves_count, 'Saves'],
                    ['👁️', $quote->views_count, 'Views'],
                ] as $stat)
                    <div class="panel-card" style="padding:16px;text-align:center;">
                        <div style="font-size:22px;margin-bottom:4px;">{{ $stat[0] }}</div>
                        <div style="font-size:22px;font-weight:800;color:#f1f5f9;">{{ $stat[1] }}</div>
                        <div style="font-size:12px;color:#64748b;">{{ $stat[2] }}</div>
                    </div>
                @endforeach
            </div>

            {{-- Author + meta --}}
            <div class="panel-card" style="margin-top:16px;">
                <div class="panel-card-header">About the Quote</div>
                <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Author</span>
                        <span style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $quote->author }}</span>
                    </div>
                    @if($quote->source)
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Source</span>
                            <span style="font-size:14px;color:#94a3b8;font-style:italic;">{{ $quote->source }}</span>
                        </div>
                    @endif
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Posted by</span>
                        <a href="{{ route('profile.show', $quote->user->username) }}"
                           style="font-size:14px;font-weight:600;color:#a78bfa;text-decoration:none;transition:opacity 0.2s ease;"
                           onmouseover="this.style.opacity='0.7'"
                           onmouseout="this.style.opacity='1'">
                            {{ $quote->user->name }}
                        </a>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Date</span>
                        <span style="font-size:14px;color:#94a3b8;">{{ $quote->created_at->format('F j, Y') }}</span>
                    </div>
                </div>
            </div>

            {{-- Categories & Tags --}}
            @if($quote->categories->count() > 0 || ($quote->tags && $quote->tags->count() > 0))
                <div class="panel-card" style="margin-top:16px;">
                    @if($quote->categories->count() > 0)
                        <div style="padding:16px 20px 12px;">
                            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;margin-bottom:10px;">Categories</div>
                            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                @foreach($quote->categories as $category)
                                    <a href="{{ route('category.show', $category->slug) }}" class="category-pill" style="font-size:13px;padding:5px 14px;">
                                        {{ $category->icon ?? '' }} {{ $category->name }}
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    @endif
                    @if($quote->tags && $quote->tags->count() > 0)
                        <div style="padding:12px 20px 16px; border-top: 1px solid var(--border-subtle);">
                            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;margin-bottom:10px;">Tags</div>
                            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                @foreach($quote->tags as $tag)
                                    <span style="font-size:12px;padding:4px 12px;border-radius:99px;background:rgba(100,116,139,0.1);color:#94a3b8;border:1px solid rgba(100,116,139,0.2);">
                                        #{{ is_object($tag) ? $tag->name : $tag }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            @endif

            {{-- Owner/Admin actions --}}
            @if(auth()->check() && (auth()->id() === $quote->user_id || auth()->user()->is_admin))
                <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
                    @if(auth()->id() === $quote->user_id)
                        <a href="{{ route('quotes.edit', $quote) }}" class="btn-ghost">
                            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit Quote
                        </a>
                    @endif
                    <form method="POST" action="{{ route('quotes.destroy', $quote) }}"
                          onsubmit="return confirm('Delete this quote? This cannot be undone.');">
                        @csrf
                        @method('DELETE')
                        <button type="submit"
                                class="btn-ghost"
                                style="border-color:rgba(239,68,68,0.4);color:#f87171;">
                            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </form>
                </div>
            @endif

            {{-- Related quotes --}}
            @if($relatedQuotes ?? false)
                <div style="margin-top:32px;">
                    <div style="font-size:16px;font-weight:800;color:#f1f5f9;margin-bottom:16px;letter-spacing:-0.3px;">More Like This</div>
                    <div style="display:flex;flex-direction:column;gap:14px;">
                        @foreach($relatedQuotes as $relatedQuote)
                            <x-quote-card :quote="$relatedQuote" />
                        @endforeach
                    </div>
                </div>
            @endif

        </div>
    </div>
</div>
@endsection