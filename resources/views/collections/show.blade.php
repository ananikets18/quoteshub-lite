@extends('layouts.app')

@section('title', $collection->name . ' — QuotesHub')
@section('description', $collection->description ?? 'A curated collection of quotes on QuotesHub by ' . $collection->user->name)

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 720px;" x-data="collectionShow()">

        {{-- Back --}}
        <a href="{{ auth()->check() ? route('collections.index') : url()->previous() }}"
           style="display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;color:#64748b;text-decoration:none;margin-bottom:20px;transition:color 0.2s ease;"
           onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back
        </a>

        {{-- Collection header --}}
        <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:28px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:16px;flex:1;">
                    <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--brand-subtle),rgba(192,38,211,0.08));display:flex;align-items:center;justify-content:center;font-size:26px;border:1px solid var(--brand-border);flex-shrink:0;">📚</div>
                    <div>
                        <h1 style="font-size:22px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;margin-bottom:4px;">{{ $collection->name }}</h1>
                        @if($collection->description)
                            <p style="font-size:14px;color:#94a3b8;line-height:1.5;margin-bottom:8px;">{{ $collection->description }}</p>
                        @endif
                        <div style="display:flex;align-items:center;gap:12px;font-size:13px;color:#64748b;">
                            <span>{{ $quotes->total() }} quotes</span>
                            <span>·</span>
                            <a href="{{ route('profile.show', $collection->user->username) }}" style="color:#a78bfa;text-decoration:none;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">by {{ $collection->user->name }}</a>
                            <span>·</span>
                            <span>{{ $collection->is_public ? '🌐 Public' : '🔒 Private' }}</span>
                        </div>
                    </div>
                </div>

                {{-- Owner actions --}}
                @if($isOwner)
                    <div style="display:flex;gap:8px;">
                        <button @click="openEdit()" class="btn-ghost" style="font-size:13px;padding:8px 14px;">
                            <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Edit
                        </button>
                        <form method="POST" action="{{ route('collections.destroy', $collection->slug) }}"
                              onsubmit="return confirm('Delete this collection? Quotes will not be deleted.');">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn-ghost" style="font-size:13px;padding:8px 14px;border-color:rgba(239,68,68,0.3);color:#f87171;">
                                <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                Delete
                            </button>
                        </form>
                    </div>
                @endif
            </div>
        </div>

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        {{-- Quotes --}}
        <div class="flex flex-col gap-4 stagger">
            @forelse($quotes as $quote)
                <div style="position:relative;">
                    <x-quote-card :quote="$quote" />
                    @if($isOwner)
                        <form method="POST" action="{{ route('collections.removeQuote', [$collection->slug, $quote]) }}"
                              style="position:absolute;top:12px;right:12px;">
                            @csrf @method('DELETE')
                            <button type="submit" title="Remove from collection"
                                    style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#f87171;border-radius:8px;padding:4px 8px;cursor:pointer;font-size:11px;font-weight:600;"
                                    onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.12)'">
                                Remove
                            </button>
                        </form>
                    @endif
                </div>
            @empty
                <x-empty-state icon="📚" title="This collection is empty" message="{{ $isOwner ? 'Save quotes to this collection by tapping the bookmark icon on any quote.' : 'No quotes in this collection yet.' }}" />
            @endforelse
        </div>

        @if($quotes->hasPages())
            <div class="mt-8 flex justify-center">{{ $quotes->links() }}</div>
        @endif

        {{-- Edit Modal --}}
        @if($isOwner)
              <div x-show="showEdit" x-cloak x-transition.opacity
                 style="position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;"
                  @keydown.escape.window="closeEdit()"
                  @click.self="closeEdit()">
                 <div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);" @click="closeEdit()"></div>
                 <div class="panel-card" style="position:relative;z-index:1;width:100%;max-width:440px;padding:28px;" @click.stop @click.outside="closeEdit()">
                    <h3 style="font-size:18px;font-weight:700;color:#f1f5f9;margin-bottom:20px;">Edit Collection</h3>
                    <form method="POST" action="{{ route('collections.update', $collection->slug) }}">
                        @csrf @method('PATCH')
                        @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;"; @endphp
                        <div style="margin-bottom:14px;">
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Name</label>
                            <input type="text" name="name" value="{{ $collection->name }}" required style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                        <div style="margin-bottom:14px;">
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Description</label>
                            <textarea name="description" rows="2" style="{{ $inputStyle }} resize:none;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">{{ $collection->description }}</textarea>
                        </div>
                        <div style="margin-bottom:20px;display:flex;align-items:center;gap:10px;">
                            <input type="checkbox" name="is_public" id="edit_is_public" value="1" {{ $collection->is_public ? 'checked' : '' }} style="accent-color:var(--brand);">
                            <label for="edit_is_public" style="font-size:14px;color:#94a3b8;cursor:pointer;">Public collection</label>
                        </div>
                        <div style="display:flex;gap:10px;justify-content:flex-end;">
                            <button type="button" @click="closeEdit()" class="btn-ghost">Cancel</button>
                            <button type="submit" class="btn-brand">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        @endif

    </div>
</div>

@push('scripts')
<script>
function collectionShow() {
    return {
        showEdit: false,
        openEdit() {
            this.showEdit = true;
        },
        closeEdit() {
            this.showEdit = false;
        }
    };
}
</script>
@endpush
@endsection