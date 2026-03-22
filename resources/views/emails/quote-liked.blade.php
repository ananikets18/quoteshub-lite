@extends('emails.layout')

@section('content')
    <h1 class="email-greeting">Someone liked your quote! ❤️</h1>

    <div class="email-content">
        <p>
            <strong>{{ $liker->name }}</strong> (@{{ $liker->username }}) just liked one of your quotes on QuotesHub.
        </p>
    </div>

    <div class="quote-card">
        <p class="quote-text">"{{ Str::limit($quote->content, 200) }}"</p>
        <p class="quote-author">— {{ $quote->author }}</p>
    </div>

    <div class="button-container">
        <a href="{{ config('app.url') }}/quotes/{{ $quote->id }}" class="email-button">
            View Your Quote
        </a>
    </div>

    <div class="info-box">
        <p>❤️ Your quote is resonating with people — keep sharing your wisdom!</p>
    </div>

    <div class="email-content">
        <p>Happy quoting! ✨</p>
        <p style="margin-top: 24px;"><strong>The QuotesHub Team</strong></p>
    </div>
@endsection
