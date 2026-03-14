@extends('layouts.app')

@section('title', 'Edit Profile — QuotesHub')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 660px;">

        {{-- Header --}}
        <div class="page-header" style="display:flex;align-items:center;gap:14px;margin-bottom:28px;">
            <a href="{{ route('profile.show', auth()->user()->username) }}" style="color:#64748b;display:flex;" onmouseover="this.style.color='#a78bfa'" onmouseout="this.style.color='#64748b'">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </a>
            <div>
                <h1 class="page-title">Edit Profile</h1>
                <p class="page-subtitle">Update your public profile information</p>
            </div>
        </div>

        {{-- Status messages --}}
        @if (session('status') === 'profile-updated')
            <div class="anim-fade-up mb-6 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ Profile updated successfully!</div>
        @endif
        @if ($errors->any())
            <div class="mb-6 px-4 py-3 rounded-2xl text-sm" style="background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.3);color:#f87171;">
                <ul class="list-disc list-inside space-y-1">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif

        <form method="POST" action="{{ route('profile.update') }}" enctype="multipart/form-data">
            @csrf
            @method('PATCH')

            {{-- Avatar & cover section --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Profile Photo</div>
                <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
                    <img id="avatar-preview" src="{{ $user->avatar ?? '/images/default-avatar.png' }}" alt="Avatar"
                         style="width:72px;height:72px;border-radius:18px;object-fit:cover;border:2px solid var(--border-muted);">
                    <div>
                        <label for="avatar" class="btn-ghost" style="cursor:pointer;display:inline-flex;font-size:13px;padding:8px 16px;">
                            <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            Change Photo
                        </label>
                        <input id="avatar" type="file" name="avatar" accept="image/*" class="hidden"
                               onchange="previewImage(this, 'avatar-preview')">
                        <p style="font-size:12px;color:#475569;margin-top:6px;">JPG, PNG, GIF · Max 2MB</p>
                    </div>
                </div>
            </div>

            {{-- Basic info --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:20px;">Basic Information</div>

                @php
                    $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;";
                    $labelStyle = "display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;";
                @endphp

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="sm:grid-cols-2">
                    <div>
                        <label for="name" style="{{ $labelStyle }}">Display Name</label>
                        <input id="name" type="text" name="name" value="{{ old('name', $user->name) }}" required maxlength="100"
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                    <div>
                        <label for="username" style="{{ $labelStyle }}">Username</label>
                        <div style="position:relative;">
                            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#64748b;font-size:15px;">@</span>
                            <input id="username" type="text" name="username" value="{{ old('username', $user->username) }}" required maxlength="30"
                                   style="{{ $inputStyle }} padding-left:28px;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                    </div>
                </div>

                <div style="margin-top:16px;">
                    <label for="bio" style="{{ $labelStyle }}">Bio</label>
                    <textarea id="bio" name="bio" rows="3" maxlength="200" placeholder="Tell the world a little about yourself..."
                              style="{{ $inputStyle }} resize:vertical;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">{{ old('bio', $user->bio) }}</textarea>
                    <div style="text-align:right;font-size:12px;color:#475569;margin-top:4px;">Max 200 characters</div>
                </div>
            </div>

            {{-- Contact & links --}}
            <div class="panel-card anim-fade-up" style="margin-bottom:16px;padding:24px;">
                <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:20px;">Links & Location</div>

                <div style="display:flex;flex-direction:column;gap:14px;">
                    <div>
                        <label for="email" style="{{ $labelStyle }}">Email</label>
                        <input id="email" type="email" name="email" value="{{ old('email', $user->email) }}" required
                               style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        @if(!$user->hasVerifiedEmail())
                            <p style="font-size:12px;color:#f59e0b;margin-top:4px;">⚠️ Email not verified. <a href="{{ route('verification.send') }}" style="color:var(--brand);" onclick="event.preventDefault();document.getElementById('resend-form').submit();">Resend link</a></p>
                            <form id="resend-form" method="POST" action="{{ route('verification.send') }}" class="hidden">@csrf</form>
                        @endif
                    </div>
                    <div>
                        <label for="location" style="{{ $labelStyle }}">Location</label>
                        <input id="location" type="text" name="location" value="{{ old('location', $user->location) }}" maxlength="100"
                               placeholder="City, Country" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                    <div>
                        <label for="website" style="{{ $labelStyle }}">Website</label>
                        <input id="website" type="url" name="website" value="{{ old('website', $user->website) }}"
                               placeholder="https://yourwebsite.com" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                </div>
            </div>

            {{-- Save button --}}
            <div style="display:flex;justify-content:flex-end;gap:12px;">
                <a href="{{ route('profile.show', $user->username) }}" class="btn-ghost">Cancel</a>
                <button type="submit" class="btn-brand">
                    <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById(previewId).src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
@endpush
@endsection