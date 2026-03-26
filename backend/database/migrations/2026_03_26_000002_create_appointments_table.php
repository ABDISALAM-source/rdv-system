<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 150)->index();
            $table->string('telephone', 20);
            $table->string('sexe', 20);
            $table->string('objet', 255);
            $table->text('description')->nullable();
            $table->date('date_rdv')->index();
            $table->time('heure_rdv');
            $table->string('urgence', 20)->default('normal')->index();
            $table->string('statut', 30)->default('en_attente')->index();
            $table->text('motif_refus')->nullable();
            $table->string('token', 64)->unique();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
