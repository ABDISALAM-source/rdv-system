<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Mail\AppointmentResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::query();

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }
        if ($request->urgence) {
            $query->where('urgence', $request->urgence);
        }
        if ($request->date_from) {
            $query->where('date_rdv', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('date_rdv', '<=', $request->date_to);
        }

        $appointments = $query->orderBy('urgence', 'desc')
            ->orderBy('date_rdv', 'asc')
            ->orderBy('heure_rdv', 'asc')
            ->get()
            ->map(fn($a) => $this->formatAppointment($a));

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    public function pending(): JsonResponse
    {
        $appointments = Appointment::pending()
            ->orderByRaw("FIELD(urgence, 'critique', 'urgent', 'moyen', 'faible', 'normal')")
            ->orderBy('date_rdv')
            ->orderBy('heure_rdv')
            ->get()
            ->map(fn($a) => $this->formatAppointment($a));

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    public function accepted(): JsonResponse
    {
        $appointments = Appointment::accepted()
            ->orderBy('date_rdv')
            ->orderBy('heure_rdv')
            ->get()
            ->map(fn($a) => $this->formatAppointment($a));

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    public function refused(): JsonResponse
    {
        $appointments = Appointment::refused()
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn($a) => $this->formatAppointment($a));

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total'          => Appointment::count(),
                'en_attente'     => Appointment::where('statut', 'en_attente')->count(),
                'accepte'        => Appointment::where('statut', 'accepte')->count(),
                'refuse'         => Appointment::whereIn('statut', ['refuse', 'refuse_explique'])->count(),
                'reporte'        => Appointment::where('statut', 'reporte')->count(),
                'critique'       => Appointment::where('urgence', 'critique')->where('statut', 'en_attente')->count(),
                'urgent'         => Appointment::where('urgence', 'urgent')->where('statut', 'en_attente')->count(),
            ]
        ]);
    }

    public function accept(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['statut' => 'accepte']);

        try {
            Mail::to($appointment->email)->send(new AppointmentResponse($appointment, 'accepte'));
        } catch (\Exception $e) {
            \Log::error('Email error: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous accepté. Le client a été notifié par email.',
            'data'    => $this->formatAppointment($appointment->fresh())
        ]);
    }

    public function refuse(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['statut' => 'refuse', 'motif_refus' => null]);

        try {
            Mail::to($appointment->email)->send(new AppointmentResponse($appointment, 'refuse'));
        } catch (\Exception $e) {
            \Log::error('Email error: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous refusé. Le client a été notifié.',
            'data'    => $this->formatAppointment($appointment->fresh())
        ]);
    }

    public function refuseWithExplanation(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'motif' => 'required|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::findOrFail($id);
        $appointment->update([
            'statut'      => 'refuse_explique',
            'motif_refus' => $request->motif
        ]);

        try {
            Mail::to($appointment->email)->send(new AppointmentResponse($appointment, 'refuse_explique', $request->motif));
        } catch (\Exception $e) {
            \Log::error('Email error: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous refusé avec explication. Le client a été notifié.',
            'data'    => $this->formatAppointment($appointment->fresh())
        ]);
    }

    public function report(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['statut' => 'reporte']);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous reporté.',
            'data'    => $this->formatAppointment($appointment->fresh())
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Appointment::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Rendez-vous supprimé.']);
    }

    private function formatAppointment(Appointment $a): array
    {
        return [
            'id'           => $a->id,
            'nom'          => $a->nom,
            'prenom'       => $a->prenom,
            'email'        => $a->email,
            'telephone'    => $a->telephone,
            'sexe'         => $a->sexe,
            'objet'        => $a->objet,
            'description'  => $a->description,
            'date_rdv'     => $a->date_rdv->format('Y-m-d'),
            'heure_rdv'    => substr($a->heure_rdv, 0, 5),
            'urgence'      => $a->urgence,
            'urgence_color'=> $a->urgence_color,
            'urgence_label'=> $a->urgence_label,
            'statut'       => $a->statut,
            'motif_refus'  => $a->motif_refus,
            'created_at'   => $a->created_at->format('Y-m-d H:i'),
        ];
    }
}
