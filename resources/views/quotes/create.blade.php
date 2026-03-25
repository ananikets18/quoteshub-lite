@extends('layouts.app')

@section('title', 'Create Quote — QuotesHub')
@section('description', 'Share an inspiring quote with the QuotesHub community.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 660px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;gap:14px;">
            <a href="{{ url()->previous() }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 class="page-title">✍️ Create Quote</h1>
                <p class="page-subtitle">Share wisdom with the community</p>
            </div>
        </div>

        {{-- Rate limit warning --}}
        @if(($rateLimitInfo['remaining'] ?? 10) <= 2)
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm" style="background:rgba(245,158,11,0.10);border:1px solid rgba(245,158,11,0.3);color:#fbbf24;">
                ⏳ You have {{ $rateLimitInfo['remaining'] }} quote{{ $rateLimitInfo['remaining'] !== 1 ? 's' : '' }} remaining this hour.
            </div>
        @endif

        {{-- Errors --}}
        @if($errors->any())
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm" style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);color:#f87171;">
                <ul class="list-disc list-inside space-y-1">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif

        <form method="POST" action="{{ route('quotes.store') }}" x-data="createQuote()">
            @csrf

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
                        placeholder="Enter the quote text here..."
                        style="width:100%;padding:14px 16px 14px 44px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:14px;font-family:'Playfair Display',serif;font-size:17px;color:var(--text-primary, #f1f5f9);line-height:1.65;resize:vertical;outline:none;transition:border-color 0.2s ease;"
                        onfocus="this.style.borderColor='var(--brand)'"
                        onblur="this.style.borderColor='var(--border-muted)'"
                    >{{ old('content') }}</textarea>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#475569;">
                    <span x-show="content.length > 0">Min 10 characters</span>
                    <span :style="content.length > 480 ? 'color:#f87171' : ''"><span x-text="content.length"></span> / 500</span>
                </div>
            </div>

            {{-- Attribution --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Attribution</div>

                @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:var(--text-primary, #e2e8f0);outline:none;transition:border-color 0.2s ease;"; @endphp

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <div>
                        <label for="author" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Author <span style="color:#f87171;">*</span></label>
                        <input id="author" type="text" name="author" value="{{ old('author') }}" required maxlength="100"
                               placeholder="e.g. Marcus Aurelius"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                    <div>
                        <label for="source" style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Source <span style="color:#475569;font-weight:400;">(optional)</span></label>
                        <input id="source" type="text" name="source" value="{{ old('source') }}" maxlength="200"
                               placeholder="e.g. Meditations, Book 2"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                </div>
            </div>

            {{-- Categories --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:24px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Categories <span style="font-weight:400;text-transform:none;color:#475569;">(optional — up to 3)</span></div>
                <p style="font-size:12px;color:#475569;margin-bottom:16px;">Helps others discover your quote</p>

                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    @foreach($categories as $cat)
                        <label style="cursor:pointer;">
                            <input type="checkbox" name="category_ids[]" value="{{ $cat->id }}"
                                   {{ in_array($cat->id, old('category_ids', [])) ? 'checked' : '' }}
                                   class="hidden peer" @change="toggleCategory({{ $cat->id }})">
                            <span class="category-pill" style="cursor:pointer;transition:all 0.15s ease;"
                                  :style="selectedCategories.includes({{ $cat->id }}) ? 'background:rgba(141,52,233,0.25);border-color:var(--brand);color:#d8b4fe;' : ''">
                                {{ $cat->icon ?? '' }} {{ $cat->name }}
                            </span>
                        </label>
                    @endforeach
                </div>
                <div x-show="selectedCategories.length >= 3" style="font-size:12px;color:#f59e0b;margin-top:10px;">ℹ️ Maximum 3 categories selected.</div>
            </div>

            {{-- Submit --}}
            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <a href="{{ url()->previous() }}" class="btn-ghost">Cancel</a>
                <button type="submit" class="btn-brand" :disabled="content.length < 10">
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    Publish Quote
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function createQuote() {
    return {
        content: '{{ old('content', '') }}',
        selectedCategories: {{ json_encode(array_map('intval', old('category_ids', []))) }},

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