<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'prenom', 'email', 'telephone', 'sexe',
        'objet', 'description', 'date_rdv', 'heure_rdv',
        'urgence', 'statut', 'motif_refus', 'token', 'ip_address'
    ];

    protected $casts = [
        'date_rdv' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->token = hash('sha256', Str::random(40) . time());
        });
    }

    public function getUrgenceColorAttribute(): string
    {
        return match($this->urgence) {
            'critique' => '#FF0000',
            'urgent'   => '#FF4500',
            'moyen'    => '#FF8C00',
            'faible'   => '#FFD700',
            'normal'   => '#00C853',
            default    => '#6B7280',
        };
    }

    public function getUrgenceLabelAttribute(): string
    {
        return match($this->urgence) {
            'critique' => 'CRITIQUE',
            'urgent'   => 'URGENT',
            'moyen'    => 'MOYEN',
            'faible'   => 'FAIBLE',
            'normal'   => 'NORMAL',
            default    => 'INCONNU',
        };
    }

    public function scopePending($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeAccepted($query)
    {
        return $query->where('statut', 'accepte');
    }

    public function scopeRefused($query)
    {
        return $query->whereIn('statut', ['refuse', 'refuse_explique']);
    }

    public function scopeByUrgence($query, string $urgence)
    {
        return $query->where('urgence', $urgence);
    }
}
