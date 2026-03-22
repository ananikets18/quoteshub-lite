<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class WebPushNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $title;
    public $body;
    public $url;
    public $icon;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $body, $url = '/', $icon = '/images/logo.png')
    {
        $this->title = $title;
        $this->body = $body;
        $this->url = $url;
        $this->icon = $icon;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    /**
     * Get the web push representation of the notification.
     */
    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title($this->title)
            ->icon($this->icon)
            ->body($this->body)
            ->data(['url' => $this->url]);
    }
}
