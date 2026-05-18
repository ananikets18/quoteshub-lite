@extends('layouts.app')

@section('title', 'My Collections — QuotesHub')
@section('description', 'Organize and manage your saved quote collections on QuotesHub.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 760px;" x-data="collectionsPage()">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
                <h1 class="page-title">📚 My Collections</h1>
                <p class="page-subtitle">{{ $collections->count() }} collection{{ $collections->count() !== 1 ? 's' : '' }}</p>
            </div>
            <button @click="openCreateModal()" class="btn-brand">
                <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                New Collection
            </button>
        </div>

        {{-- Flash --}}
        @if(session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') }}</div>
        @endif

        {{-- Collections grid --}}
        @if($collections->isNotEmpty())
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;">
                @foreach($collections as $col)
                    <a href="{{ route('collections.show', $col->slug) }}"
                       class="panel-card anim-fade-up"
                       style="padding:20px;text-decoration:none;transition:transform 0.2s ease,border-color 0.2s ease;"
                       onmouseover="this.style.transform='translateY(-3px)';this.style.borderColor='var(--brand-border)'"
                       onmouseout="this.style.transform='';this.style.borderColor=''">
                        {{-- Icon + visibility badge --}}
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                            <div style="width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,var(--brand-subtle),rgba(192,38,211,0.08));display:flex;align-items:center;justify-content:center;font-size:22px;border:1px solid var(--brand-border);">
                                📚
                            </div>
                            <span style="font-size:11px;font-weight:600;padding:3px 10px;border-radius:99px;{{ $col->is_public ? 'background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.3);' : 'background:rgba(100,116,139,0.12);color:#64748b;border:1px solid var(--border-muted);' }}">
                                {{ $col->is_public ? '🌐 Public' : '🔒 Private' }}
                            </span>
                        </div>

                        <div style="font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">{{ $col->name }}</div>
                        @if($col->description)
                            <div style="font-size:13px;color:#64748b;line-height:1.4;margin-bottom:10px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{ $col->description }}</div>
                        @endif
                        <div style="font-size:12px;color:#475569;margin-top:auto;">{{ $col->quotes_count }} quote{{ $col->quotes_count !== 1 ? 's' : '' }}</div>
                    </a>
                @endforeach
            </div>
        @else
            <x-empty-state
                icon="📚"
                title="No collections yet"
                message="Create your first collection to organize your favourite quotes."
            />
        @endif

        {{-- Create Collection Modal --}}
        <div x-show="showModal" x-cloak x-transition.opacity
             style="position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;"
             @keydown.escape.window="closeCreateModal()"
             @click.self="closeCreateModal()">
            <div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);" @click="closeCreateModal()"></div>

            <div class="panel-card anim-fade-up" style="position:relative;z-index:1;width:100%;max-width:440px;padding:28px;" @click.stop @click.outside="closeCreateModal()">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                    <h3 style="font-size:18px;font-weight:700;color:#f1f5f9;">New Collection</h3>
                    <button type="button" @click="closeCreateModal()" style="color:#64748b;background:none;border:none;cursor:pointer;padding:4px;" onmouseover="this.style.color='#e2e8f0'" onmouseout="this.style.color='#64748b'">
                        <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <form method="POST" action="{{ route('collections.store') }}">
                    @csrf
                    @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"; @endphp

                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Collection Name *</label>
                        <input type="text" name="name" required maxlength="100" placeholder="My Favourites"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Description (optional)</label>
                        <textarea name="description" maxlength="500" rows="2" placeholder="What's this collection about?"
                                  style="{{ $inputStyle }} resize:none;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'"></textarea>
                    </div>

                    <div style="margin-bottom:24px;display:flex;align-items:center;gap:10px;">
                        <input type="checkbox" name="is_public" id="is_public" value="1" class="w-4 h-4" style="accent-color:var(--brand);">
                        <label for="is_public" style="font-size:14px;color:#94a3b8;cursor:pointer;">Make this collection public</label>
                    </div>

                    <button type="submit" class="btn-brand" style="width:100%;justify-content:center;">Create Collection</button>
                </form>
            </div>
        </div>

    </div>
</div>

@push('scripts')
<script>
function collectionsPage() {
    return {
        showModal: {{ $errors->any() ? 'true' : 'false' }},
        openCreateModal() {
            this.showModal = true;
        },
        closeCreateModal() {
            this.showModal = false;
        }
    };
}
</script>
@endpush
@endsection