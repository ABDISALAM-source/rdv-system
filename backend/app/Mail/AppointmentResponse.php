<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentResponse extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public string $action,
        public ?string $motif = null
    ) {}

    public function envelope(): Envelope
    {
        $subjects = [
            'accepte'        => '✅ Votre rendez-vous a été accepté - #' . $this->appointment->id,
            'refuse'         => '❌ Votre rendez-vous a été refusé - #' . $this->appointment->id,
            'refuse_explique'=> '❌ Votre rendez-vous a été refusé - #' . $this->appointment->id,
        ];

        return new Envelope(
            subject: $subjects[$this->action] ?? 'Réponse concernant votre rendez-vous',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-response',
        );
    }
}
