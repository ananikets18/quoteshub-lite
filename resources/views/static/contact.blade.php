@extends('layouts.app')

@section('title', 'Contact Us — QuotesHub')
@section('description', 'Get in touch with the QuotesHub team. We\'d love to hear from you.')

@section('content')
<div class="app-main">
    <div style="max-width:640px;margin:0 auto;padding:40px 20px 80px;">

        <div style="text-align:center;margin-bottom:48px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,var(--brand-subtle),rgba(59,130,246,0.1));border:1px solid var(--brand-border);margin-bottom:20px;">
                <span style="font-size:30px;">📬</span>
            </div>
            <h1 style="font-size:32px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;margin-bottom:12px;">Contact Us</h1>
            <p style="font-size:15px;color:#94a3b8;line-height:1.6;">Have a question, suggestion or spotted an issue? We'd love to hear from you.</p>
        </div>

        {{-- Quick links --}}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:36px;">
            @foreach([
                ['⚠️', 'Report an issue', 'Bug, content problem, or abuse report', route('guidelines')],
                ['💡', 'Feature request', 'Suggest an idea to improve QuotesHub', '#contact-form'],
                ['🔒', 'Privacy concern', 'Questions about your data or privacy', route('privacy')],
                ['📋', 'Guidelines', 'View community rules and policies', route('guidelines')],
            ] as [$icon, $title, $desc, $href])
                <a href="{{ $href }}" class="panel-card" style="padding:16px;text-decoration:none;display:block;transition:transform 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
                    <div style="font-size:22px;margin-bottom:8px;">{{ $icon }}</div>
                    <div style="font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:2px;">{{ $title }}</div>
                    <div style="font-size:12px;color:#64748b;">{{ $desc }}</div>
                </a>
            @endforeach
        </div>

        {{-- Contact form --}}
        <div id="contact-form" class="panel-card" style="padding:28px;">
            <div style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:20px;">Send us a message</div>

            @if(session('contact_success'))
                <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:14px;padding:14px 16px;margin-bottom:20px;color:#34d399;font-size:14px;font-weight:500;">
                    ✓ Message sent! We'll get back to you within 2-3 business days.
                </div>
            @endif

            @php $inputStyle = "width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border-muted);border-radius:12px;font-size:15px;color:#e2e8f0;outline:none;transition:border-color 0.2s ease;"; @endphp

            <form action="{{ route('contact') }}" method="POST">
                @csrf
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
                    <div>
                        <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Name</label>
                        <input type="text" name="name" value="{{ old('name', auth()->user()?->name) }}" required placeholder="Your name" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                    <div>
                        <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Email</label>
                        <input type="email" name="email" value="{{ old('email', auth()->user()?->email) }}" required placeholder="your@email.com" style="{{ $inputStyle }}" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Subject</label>
                    <select name="subject" style="{{ $inputStyle }}">
                        <option value="general">General inquiry</option>
                        <option value="bug">Bug report</option>
                        <option value="feature">Feature request</option>
                        <option value="privacy">Privacy concern</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-size:13px;font-weight:600;color:#94a3b8;margin-bottom:8px;">Message</label>
                    <textarea name="message" rows="5" required placeholder="Tell us more..." style="{{ $inputStyle }} resize:vertical;" onfocus="this.style.borderColor='var(--brand)'" onblur="this.style.borderColor='var(--border-muted)'">{{ old('message') }}</textarea>
                </div>
                <button type="submit" class="btn-brand" style="width:100%;justify-content:center;padding:13px;">
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    Send Message
                </button>
            </form>

            <p style="text-align:center;margin-top:20px;font-size:13px;color:#475569;">We typically respond within 2-3 business days.</p>
        </div>

    </div>
</div>
@endsection