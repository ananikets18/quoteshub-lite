<?php

namespace App\Mail;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuoteLikedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User  $quoteOwner,
        public User  $liker,
        public Quote $quote
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->liker->name} liked your quote on QuotesHub!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote-liked',
            with: [
                'quoteOwner' => $this->quoteOwner,
                'liker'      => $this->liker,
                'quote'      => $this->quote,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
