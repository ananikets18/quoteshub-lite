<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email? : The email address to send test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify SMTP configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? $this->ask('Enter email address to send test email to');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address!');
            return 1;
        }

        $this->info('Sending test email to: ' . $email);
        $this->info('Using mailer: ' . config('mail.default'));
        $this->info('SMTP Host: ' . config('mail.mailers.smtp.host'));
        $this->info('SMTP Port: ' . config('mail.mailers.smtp.port'));
        $this->newLine();

        try {
            Mail::raw('This is a test email from QuotesHub. If you received this, your email configuration is working correctly!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('QuotesHub - Test Email');
            });

            $this->info('✅ Test email sent successfully!');
            $this->newLine();
            
            if (config('mail.default') === 'log') {
                $this->warn('⚠️  Mail driver is set to "log"');
                $this->warn('Emails are being written to: storage/logs/laravel.log');
                $this->warn('To send real emails, update MAIL_MAILER in .env file');
            } else {
                $this->info('Check your inbox at: ' . $email);
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Please check your .env file configuration:');
            $this->warn('- MAIL_MAILER');
            $this->warn('- MAIL_HOST');
            $this->warn('- MAIL_PORT');
            $this->warn('- MAIL_USERNAME');
            $this->warn('- MAIL_PASSWORD');
            $this->warn('- MAIL_ENCRYPTION');
            
            return 1;
        }
    }
}
