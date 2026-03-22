<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AchievementUnlockedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User   $user,
        public string $achievementName,
        public string $achievementDescription
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🏆 You unlocked a new achievement on QuotesHub!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.achievement-unlocked',
            with: [
                'user'                   => $this->user,
                'achievementName'        => $this->achievementName,
                'achievementDescription' => $this->achievementDescription,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
