@extends('layouts.app')

@section('title', 'Settings — QuotesHub')
@section('description', 'Manage your QuotesHub account settings, privacy preferences, and notifications.')

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 700px;" x-data="settingsPage()">

        {{-- Header --}}
        <div class="page-header">
            <h1 class="page-title">⚙️ Settings</h1>
            <p class="page-subtitle">Manage your account and preferences</p>
        </div>

        {{-- Status flash --}}
        @if(session('status') === 'profile-updated' || session('success'))
            <div class="anim-fade-up mb-4 px-4 py-3 rounded-2xl text-sm font-medium" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;">✓ {{ session('success') ?? 'Settings saved successfully!' }}</div>
        @endif

        {{-- Tab navigation --}}
        <div style="display:flex;gap:6px;margin-bottom:24px;background:var(--bg-elevated);padding:6px;border-radius:16px;border:1px solid var(--border-subtle);">
            @foreach(['profile' => '👤 Profile', 'privacy' => '🔒 Privacy', 'notifications' => '🔔 Notifications', 'account' => '🗑️ Account'] as $tab => $label)
                <button @click="activeTab = '{{ $tab }}'"
                        :style="activeTab === '{{ $tab }}' ? 'background:var(--brand);color:#fff;box-shadow:0 4px 16px var(--brand-glow);' : 'color:#64748b;'"
                        style="flex:1;padding:9px 8px;border-radius:11px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all 0.2s ease;white-space:nowrap;">
                    {{ $label }}
                </button>
            @endforeach
        </div>

        {{-- PROFILE TAB --}}
        <div x-show="activeTab === 'profile'" x-transition>
            <form method="POST" action="{{ route('profile.update') }}" enctype="multipart/form-data">
                @csrf @method('PATCH')
                @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"; @endphp

                <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
                        <img id="avatar-preview" src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}" alt="Avatar"
                             style="width:64px;height:64px;border-radius:16px;object-fit:cover;border:2px solid var(--border-muted);">
                        <div>
                            <label for="avatar" class="btn-ghost" style="cursor:pointer;display:inline-flex;font-size:13px;padding:8px 14px;">📷 Change Photo</label>
                            <input id="avatar" type="file" name="avatar" accept="image/*" class="hidden" onchange="previewAvatar(this)">
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                        <div>
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Name</label>
                            <input type="text" name="name" value="{{ old('name', auth()->user()->name) }}" required style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                        <div>
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Username</label>
                            <input type="text" name="username" value="{{ old('username', auth()->user()->username) }}" required style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                    </div>
                    <div style="margin-bottom:14px;">
                        <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Bio</label>
                        <textarea name="bio" rows="3" maxlength="200" style="{{ $inputStyle }} resize:vertical;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">{{ old('bio', auth()->user()->bio) }}</textarea>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                        <div>
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Location</label>
                            <input type="text" name="location" value="{{ old('location', auth()->user()->location) }}" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                        <div>
                            <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Website</label>
                            <input type="url" name="website" value="{{ old('website', auth()->user()->website) }}" placeholder="https://..." style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                        </div>
                    </div>
                </div>
                <div style="display:flex;justify-content:flex-end;">
                    <button type="submit" class="btn-brand">Save Profile</button>
                </div>
            </form>
        </div>

        {{-- PRIVACY TAB --}}
        <div x-show="activeTab === 'privacy'" x-transition>
            <form method="POST" action="{{ route('settings.privacy.update') }}" x-data="{ privacy: {{ json_encode($privacy) }} }">
                @csrf
                <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                    <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Privacy Controls</div>

                    @foreach([
                        ['profile_is_private', 'Private Account', 'Only approved followers can see your quotes and profile'],
                        ['show_email', 'Show Email on Profile', 'Let others see your email address on your public profile'],
                        ['show_activity_status', 'Show Activity Status', 'Let others see when you were last active'],
                    ] as [$key, $label, $desc])
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;margin-top:2px;">{{ $desc }}</div>
                        </div>
                        <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
                            <input type="checkbox" name="{{ $key }}" value="1" x-model="privacy.{{ $key }}" {{ ($privacy[$key] ?? false) ? 'checked' : '' }}
                                   style="opacity:0;width:0;height:0;position:absolute;">
                            <span :style="privacy.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'"
                                  style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                            <span :style="privacy.{{ $key }} ? 'left:22px;' : 'left:2px;'"
                                  style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                        </label>
                    </div>
                    @endforeach
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <a href="{{ route('settings.blocked-users') }}" class="btn-ghost" style="font-size:13px;">
                        🚫 Manage Blocked Users
                    </a>
                    <button type="submit" class="btn-brand">Save Privacy Settings</button>
                </div>
            </form>
        </div>

        {{-- NOTIFICATIONS TAB --}}
        <div x-show="activeTab === 'notifications'" x-transition>
            <form method="POST" action="{{ route('profile.notification-preferences.update') }}" x-data="{ prefs: {{ json_encode($preferences->toArray()) }} }">
                @csrf
                <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                    <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Notification Types</div>
                    @foreach([
                        ['new_follower', '👤 New Follower', 'When someone starts following you'],
                        ['quote_liked', '❤️ Quote Liked', 'When someone likes your quote'],
                        ['quote_saved', '🔖 Quote Saved', 'When someone saves your quote'],
                        ['achievement_unlocked', '🏆 Achievements', 'When you unlock new achievements'],
                        ['admin_warning', '⚠️ Admin Messages', 'Important messages from admins'],
                    ] as [$key, $label, $desc])
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                        </div>
                        <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
                            <input type="checkbox" name="{{ $key }}" value="1" x-model="prefs.{{ $key }}" {{ ($preferences->$key ?? true) ? 'checked' : '' }} style="opacity:0;width:0;height:0;position:absolute;">
                            <span :style="prefs.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'"
                                  style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                            <span :style="prefs.{{ $key }} ? 'left:22px;' : 'left:2px;'"
                                  style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                        </label>
                    </div>
                    @endforeach
                </div>

                <div class="panel-card anim-fade-up" style="padding:24px;margin-bottom:16px;">
                    <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Delivery Methods</div>
                    @foreach([
                        ['in_app_notifications', '📲 In-App Notifications', 'Show notifications inside QuotesHub'],
                        ['email_notifications', '📧 Email Notifications', 'Receive notifications by email'],
                    ] as [$key, $label, $desc])
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;{{ !$loop->last ? 'border-bottom:1px solid var(--border-subtle);' : '' }}">
                        <div>
                            <div style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $label }}</div>
                            <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                        </div>
                        <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
                            <input type="checkbox" name="{{ $key }}" value="1" x-model="prefs.{{ $key }}" {{ ($preferences->$key ?? false) ? 'checked' : '' }} style="opacity:0;width:0;height:0;position:absolute;">
                            <span :style="prefs.{{ $key }} ? 'background:var(--brand);' : 'background:var(--border-muted);'"
                                  style="position:absolute;inset:0;border-radius:99px;transition:background 0.2s ease;"></span>
                            <span :style="prefs.{{ $key }} ? 'left:22px;' : 'left:2px;'"
                                  style="position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s ease;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></span>
                        </label>
                    </div>
                    @endforeach
                </div>
                <div style="display:flex;justify-content:flex-end;">
                    <button type="submit" class="btn-brand">Save Notification Settings</button>
                </div>
            </form>
        </div>

        {{-- ACCOUNT TAB --}}
        <div x-show="activeTab === 'account'" x-transition>
            <div class="panel-card anim-fade-up" style="padding:24px;border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.03);margin-bottom:16px;">
                <div style="font-size:13px;font-weight:700;color:#f87171;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">⚠️ Danger Zone</div>
                <p style="font-size:14px;color:#94a3b8;margin-bottom:20px;line-height:1.5;">Once you delete your account, all your data including quotes, followers, and collections will be permanently removed. This action cannot be undone.</p>
                <button @click="showDeleteModal = true" class="btn-ghost" style="border-color:rgba(239,68,68,0.4);color:#f87171;font-size:14px;">
                    🗑️ Delete My Account
                </button>
            </div>

            {{-- Delete confirm modal --}}
            <div x-show="showDeleteModal" x-transition
                 style="position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;"
                 @click.self="showDeleteModal=false">
                <div style="position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);"></div>
                <div class="panel-card" style="position:relative;z-index:1;width:100%;max-width:440px;padding:28px;border-color:rgba(239,68,68,0.3);">
                    <h3 style="font-size:18px;font-weight:700;color:#f87171;margin-bottom:8px;">Delete Account</h3>
                    <p style="font-size:14px;color:#94a3b8;margin-bottom:20px;">This is permanent. Type <strong style="color:#f1f5f9;">DELETE</strong> and enter your password to confirm.</p>
                    <form method="POST" action="{{ route('settings.account.delete') }}">
                        @csrf @method('DELETE')
                        @php $dStyle = "width:100%;padding:11px 14px;background:var(--bg-input);border:1px solid rgba(239,68,68,0.3);border-radius:12px;font-size:14px;color:#e2e8f0;outline:none;margin-bottom:12px;"; @endphp
                        <input type="text" name="confirmation" placeholder='Type "DELETE"' required style="{{ $dStyle }}">
                        <input type="password" name="password" placeholder="Your password" required style="{{ $dStyle }}">
                        <div style="display:flex;gap:10px;justify-content:flex-end;">
                            <button type="button" @click="showDeleteModal=false" class="btn-ghost">Cancel</button>
                            <button type="submit" class="btn-brand" style="background:#ef4444;box-shadow:0 4px 16px rgba(239,68,68,0.3);">Delete Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</div>

@push('scripts')
<script>
function settingsPage() {
    return {
        activeTab: '{{ session('status') === 'profile-updated' ? 'profile' : 'profile' }}',
        showDeleteModal: false,
    };
}
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('avatar-preview').src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
@endpush
@endsection