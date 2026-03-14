@extends('layouts.app')

@section('title', 'Welcome to QuotesHub — Set Up Your Account')

@section('content')
<div class="min-h-screen flex items-center justify-center px-4 py-12" style="background:var(--bg-base);" x-data="onboarding()">

    {{-- Progress bar --}}
    <div style="position:fixed;top:0;left:0;right:0;height:3px;background:var(--border-subtle);z-index:100;">
        <div :style="'width:' + ((currentStep / totalSteps) * 100) + '%;'" style="height:100%;background:linear-gradient(90deg,var(--brand),#c026d3);transition:width 0.4s ease;"></div>
    </div>

    <div style="width:100%;max-width:540px;">

        {{-- Step indicator --}}
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:32px;">
            @for($i = 1; $i <= 4; $i++)
                <div :style="currentStep >= {{ $i }} ? 'background:var(--brand);' : 'background:var(--border-muted);'"
                     style="width:8px;height:8px;border-radius:50%;transition:all 0.3s ease;"
                     :class="currentStep === {{ $i }} ? 'scale-125' : ''"></div>
            @endfor
            <span style="font-size:13px;color:#64748b;margin-left:8px;" x-text="currentStep + ' of ' + totalSteps"></span>
        </div>

        {{-- ==================== Step 1: Welcome ==================== --}}
        <div x-show="currentStep === 1" x-transition class="panel-card" style="padding:36px;text-align:center;">
            <div style="font-size:52px;margin-bottom:20px;">👋</div>
            <h1 style="font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">Welcome, {{ auth()->user()->name }}!</h1>
            <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:32px;">QuotesHub is your home for sharing and discovering inspiring quotes. Let's set up your profile in just a few steps.</p>
            <button @click="nextStep()" class="btn-brand" style="font-size:16px;padding:14px 36px;border-radius:14px;">
                Let's Get Started →
            </button>
            <div style="margin-top:16px;">
                <form method="POST" action="{{ route('onboarding.skip') }}">
                    @csrf
                    <button type="submit" style="font-size:13px;color:#475569;background:none;border:none;cursor:pointer;" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'">Skip setup for now</button>
                </form>
            </div>
        </div>

        {{-- ==================== Step 2: Bio ==================== --}}
        <div x-show="currentStep === 2" x-transition class="panel-card" style="padding:36px;">
            <div style="font-size:36px;text-align:center;margin-bottom:16px;">✍️</div>
            <h2 style="font-size:22px;font-weight:800;color:#f1f5f9;text-align:center;margin-bottom:6px;">Tell us about yourself</h2>
            <p style="font-size:14px;color:#64748b;text-align:center;margin-bottom:24px;">A short bio helps others discover you.</p>

            <form @submit.prevent="submitStep(2, { bio: bio, location: location })" style="display:flex;flex-direction:column;gap:16px;">
                @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"; @endphp
                <div>
                    <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Short Bio</label>
                    <textarea x-model="bio" rows="3" maxlength="200" placeholder="E.g. Lover of stoic philosophy and morning coffee..."
                              style="{{ $inputStyle }} resize:none;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'"></textarea>
                    <div style="text-align:right;font-size:12px;color:#475569;margin-top:4px;" x-text="bio.length + '/200'"></div>
                </div>
                <div>
                    <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Location (optional)</label>
                    <input type="text" x-model="location" placeholder="City, Country" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                </div>
                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px;">
                    <button type="button" @click="nextStep()" style="font-size:14px;color:#64748b;background:none;border:none;cursor:pointer;">Skip</button>
                    <button type="submit" class="btn-brand" :disabled="loading" x-text="loading ? 'Saving...' : 'Continue →'"></button>
                </div>
            </form>
        </div>

        {{-- ==================== Step 3: Follow Creators ==================== --}}
        <div x-show="currentStep === 3" x-transition class="panel-card" style="padding:36px;">
            <div style="font-size:36px;text-align:center;margin-bottom:16px;">👥</div>
            <h2 style="font-size:22px;font-weight:800;color:#f1f5f9;text-align:center;margin-bottom:6px;">Follow some creators</h2>
            <p style="font-size:14px;color:#64748b;text-align:center;margin-bottom:24px;">Start building your feed by following these curators.</p>

            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;">
                @foreach($creators ?? [] as $creator)
                    <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-input);border-radius:14px;border:1px solid var(--border-subtle);">
                        <img src="{{ $creator->avatar ?? '/images/default-avatar.png' }}" alt="{{ $creator->name }}"
                             style="width:46px;height:46px;border-radius:13px;object-fit:cover;border:1.5px solid var(--border-muted);flex-shrink:0;">
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:14px;font-weight:700;color:#e2e8f0;">{{ $creator->name }}</div>
                            <div style="font-size:12px;color:#64748b;">@{{ $creator->username }} · {{ number_format($creator->followers_count) }} followers</div>
                            @if($creator->bio)
                                <div style="font-size:12px;color:#475569;margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;">{{ $creator->bio }}</div>
                            @endif
                        </div>
                        <div x-data="{ followed: {{ json_encode((bool)($creator->is_following ?? false)) }} }">
                            <button @click="followed = true; axios.post('/follow/{{ $creator->id }}')"
                                    x-show="!followed"
                                    style="font-size:13px;padding:7px 16px;border-radius:10px;background:var(--brand);color:#fff;border:none;cursor:pointer;font-weight:600;white-space:nowrap;">
                                Follow
                            </button>
                            <span x-show="followed" style="font-size:13px;color:#34d399;font-weight:600;">✓ Following</span>
                        </div>
                    </div>
                @endforeach

                @if(empty($creators) || (is_countable($creators) && count($creators) === 0))
                    <p style="text-align:center;font-size:14px;color:#64748b;padding:20px;">No suggestions yet — you can follow people from their profiles!</p>
                @endif
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button @click="nextStep()" style="font-size:14px;color:#64748b;background:none;border:none;cursor:pointer;">Skip</button>
                <button @click="nextStep()" class="btn-brand">Continue →</button>
            </div>
        </div>

        {{-- ==================== Step 4: Complete ==================== --}}
        <div x-show="currentStep === 4" x-transition class="panel-card" style="padding:36px;text-align:center;">
            <div style="font-size:56px;margin-bottom:16px;">🎉</div>
            <h2 style="font-size:26px;font-weight:800;color:#f1f5f9;margin-bottom:12px;">You're all set!</h2>
            <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:32px;">Your profile is ready. Start discovering inspiring quotes or share your first one with the community.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <form method="POST" action="{{ route('onboarding.complete') }}">
                    @csrf
                    <button type="submit" class="btn-brand" style="width:100%;justify-content:center;font-size:16px;padding:14px;">
                        🚀 Go to My Feed
                    </button>
                </form>
                <a href="{{ route('quotes.create') }}" class="btn-ghost" style="display:flex;justify-content:center;font-size:14px;">
                    ✍️ Create My First Quote
                </a>
            </div>
        </div>

    </div>
</div>

@push('scripts')
<script>
function onboarding() {
    return {
        currentStep: 1,
        totalSteps: 4,
        bio: '',
        location: '',
        interests: [],
        loading: false,

        nextStep() {
            if (this.currentStep < this.totalSteps) this.currentStep++;
        },

        toggleInterest(id) {
            if (this.interests.includes(id)) {
                this.interests = this.interests.filter(i => i !== id);
            } else {
                this.interests.push(id);
            }
        },

        async submitStep(step, data) {
            this.loading = true;
            try {
                await axios.post('{{ route('onboarding.step') }}', { step, ...data });
                this.nextStep();
            } catch(e) {
                console.error(e);
                this.nextStep(); // proceed anyway
            } finally {
                this.loading = false;
            }
        }
    };
}
</script>
@endpush
@endsection