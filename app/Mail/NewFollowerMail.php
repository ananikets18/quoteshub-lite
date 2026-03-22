<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewFollowerMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $followedUser,
        public User $follower
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->follower->name} is now following you on QuotesHub!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-follower',
            with: [
                'followedUser' => $this->followedUser,
                'follower'     => $this->follower,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
