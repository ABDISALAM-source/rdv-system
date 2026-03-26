<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Mail\AppointmentConfirmation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|max:150',
            'telephone'  => 'required|string|max:20',
            'sexe'       => 'required|in:homme,femme,autre',
            'objet'      => 'required|string|max:255',
            'description'=> 'nullable|string|max:1000',
            'date_rdv'   => 'required|date|after_or_equal:today',
            'heure_rdv'  => 'required|date_format:H:i',
            'urgence'    => 'required|in:normal,faible,moyen,urgent,critique',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        // Vérifier si le créneau est disponible
        $exists = Appointment::where('date_rdv', $request->date_rdv)
            ->where('heure_rdv', $request->heure_rdv . ':00')
            ->whereIn('statut', ['en_attente', 'accepte'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.'
            ], 409);
        }

        $appointment = Appointment::create([
            ...$request->only(['nom', 'prenom', 'email', 'telephone', 'sexe', 'objet', 'description', 'date_rdv', 'urgence']),
            'heure_rdv'  => $request->heure_rdv . ':00',
            'statut'     => 'en_attente',
            'ip_address' => $request->ip(),
        ]);

        $emailSent = false;

        // Envoyer email de confirmation
        try {
            Mail::to($appointment->email)->send(new AppointmentConfirmation($appointment));
            $emailSent = true;
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas bloquer la création
            \Log::error('Email error: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => $emailSent
                ? 'Votre rendez-vous a été enregistré avec succès. Un email de confirmation vous a été envoyé.'
                : 'Votre rendez-vous a été enregistré avec succès, mais l\'email de confirmation n\'a pas pu être envoyé pour le moment.',
            'data'    => [
                'id'         => $appointment->id,
                'token'      => $appointment->token,
                'email_sent' => $emailSent,
            ]
        ], 201);
    }

    public function unavailableSlots(Request $request): JsonResponse
    {
        $month = $request->get('month', now()->month);
        $year  = $request->get('year', now()->year);

        $slots = Appointment::whereYear('date_rdv', $year)
            ->whereMonth('date_rdv', $month)
            ->whereIn('statut', ['en_attente', 'accepte'])
            ->select('date_rdv', 'heure_rdv')
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->date_rdv)->format('Y-m-d'))
            ->map(fn($items) => $items->pluck('heure_rdv')->map(fn($h) => substr($h, 0, 5))->values());

        return response()->json([
            'success' => true,
            'data'    => $slots
        ]);
    }

    public function checkSlot(Request $request): JsonResponse
    {
        $exists = Appointment::where('date_rdv', $request->date)
            ->where('heure_rdv', $request->heure . ':00')
            ->whereIn('statut', ['en_attente', 'accepte'])
            ->exists();

        return response()->json([
            'available' => !$exists
        ]);
    }
}
