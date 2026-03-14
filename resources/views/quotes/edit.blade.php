@extends('layouts.app')

@section('title', 'Edit Quote — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 660px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;gap:14px;">
            <a href="{{ route('quotes.show', $quote) }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 class="page-title">✏️ Edit Quote</h1>
                <p class="page-subtitle">Update your quote</p>
            </div>
        </div>

        {{-- Errors --}}
        @if($errors->any())
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm" style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);color:#f87171;">
                <ul class="list-disc list-inside space-y-1">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif

        <form method="POST" action="{{ route('quotes.update', $quote) }}" x-data="editQuote()">
            @csrf
            @method('PUT')

            {{-- Quote content --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">The Quote</div>

                <div style="position:relative;margin-bottom:8px;">
                    <span style="position:absolute;left:16px;top:14px;font-family:'Playfair Display',serif;font-size:32px;color:var(--brand);opacity:0.6;line-height:1;">"</span>
                    <textarea
                        name="content"
                        id="content"
                        x-model="content"
                        rows="5"
                        required
                        minlength="10"
                        maxlength="500"
                        style="width:100%;padding:14px 16px 14px 44px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:14px;font-family:'Playfair Display',serif;font-size:17px;color:#f1f5f9;line-height:1.65;resize:vertical;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >{{ old('content', $quote->content) }}</textarea>
                </div>
                <div style="display:flex;justify-content:flex-end;font-size:12px;color:#475569;">
                    <span :style="content.length > 480 ? 'color:#f87171' : ''"><span x-text="content.length"></span> / 500</span>
                </div>
            </div>

            {{-- Attribution --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Attribution</div>

                @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"; @endphp

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <div>
                        <label for="author" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Author *</label>
                        <input id="author" type="text" name="author" value="{{ old('author', $quote->author) }}" required maxlength="100"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                    <div>
                        <label for="source" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Source (optional)</label>
                        <input id="source" type="text" name="source" value="{{ old('source', $quote->source) }}" maxlength="200"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                </div>
            </div>

            {{-- Categories --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Categories (optional)</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    @foreach($categories as $cat)
                        @php $checked = in_array($cat->id, old('category_ids', $quote->categories->pluck('id')->toArray())); @endphp
                        <label style="cursor:pointer;">
                            <input type="checkbox" name="category_ids[]" value="{{ $cat->id }}"
                                   {{ $checked ? 'checked' : '' }}
                                   class="hidden peer" @change="toggleCategory({{ $cat->id }})">
                            <span class="category-pill" style="cursor:pointer;"
                                  :style="selectedCategories.includes({{ $cat->id }}) ? 'background:rgba(141,52,233,0.25);border-color:var(--brand);color:#d8b4fe;' : ''">
                                {{ $cat->icon ?? '' }} {{ $cat->name }}
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- Actions --}}
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                {{-- Delete --}}
                <form method="POST" action="{{ route('quotes.destroy', $quote) }}" onsubmit="return confirm('Delete this quote permanently?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn-ghost" style="border-color:rgba(239,68,68,0.4);color:#f87171;font-size:13px;padding:8px 16px;">
                        <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        Delete Quote
                    </button>
                </form>

                <div style="display:flex;gap:10px;">
                    <a href="{{ route('quotes.show', $quote) }}" class="btn-ghost">Cancel</a>
                    <button type="submit" class="btn-brand">
                        <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function editQuote() {
    return {
        content: `{{ old('content', $quote->content) }}`,
        selectedCategories: {{ json_encode(array_map('intval', old('category_ids', $quote->categories->pluck('id')->toArray()))) }},
        toggleCategory(id) {
            if (this.selectedCategories.includes(id)) {
                this.selectedCategories = this.selectedCategories.filter(c => c !== id);
            } else if (this.selectedCategories.length < 3) {
                this.selectedCategories.push(id);
            }
        }
    };
}
</script>
@endpush
@endsection