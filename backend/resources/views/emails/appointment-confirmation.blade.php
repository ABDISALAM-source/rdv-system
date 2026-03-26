<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirmation RDV</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0e1a; font-family: 'Segoe UI', Arial, sans-serif; color: #e0e6f0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { background: linear-gradient(135deg, #0d1b3e, #1a2a5e); border: 1px solid rgba(0,200,255,0.3); border-radius: 16px 16px 0 0; padding: 40px; text-align: center; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(0,200,255,0.1) 0%, transparent 70%); }
  .logo { font-size: 48px; margin-bottom: 16px; }
  .title { font-size: 28px; font-weight: 700; color: #00c8ff; letter-spacing: 2px; text-transform: uppercase; }
  .subtitle { font-size: 14px; color: #8899bb; margin-top: 8px; }
  .body { background: #0f1629; border: 1px solid rgba(0,200,255,0.15); border-top: none; padding: 40px; }
  .greeting { font-size: 18px; color: #00c8ff; margin-bottom: 20px; }
  .message { font-size: 15px; color: #b0bcd0; line-height: 1.8; margin-bottom: 30px; }
  .card { background: linear-gradient(135deg, rgba(0,200,255,0.05), rgba(0,100,200,0.05)); border: 1px solid rgba(0,200,255,0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .card-title { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #00c8ff; margin-bottom: 16px; border-bottom: 1px solid rgba(0,200,255,0.2); padding-bottom: 10px; }
  .field { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .field:last-child { border-bottom: none; }
  .field-label { font-size: 13px; color: #6688aa; }
  .field-value { font-size: 14px; color: #e0e6f0; font-weight: 600; }
  .urgence-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .badge-normal { background: rgba(0,200,83,0.2); color: #00C853; border: 1px solid rgba(0,200,83,0.4); }
  .badge-faible { background: rgba(255,215,0,0.2); color: #FFD700; border: 1px solid rgba(255,215,0,0.4); }
  .badge-moyen { background: rgba(255,140,0,0.2); color: #FF8C00; border: 1px solid rgba(255,140,0,0.4); }
  .badge-urgent { background: rgba(255,69,0,0.2); color: #FF4500; border: 1px solid rgba(255,69,0,0.4); }
  .badge-critique { background: rgba(255,0,0,0.2); color: #FF0000; border: 1px solid rgba(255,0,0,0.4); }
  .notice { background: rgba(0,200,83,0.1); border: 1px solid rgba(0,200,83,0.3); border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; color: #00C853; }
  .footer { background: #080d1a; border: 1px solid rgba(0,200,255,0.1); border-top: none; border-radius: 0 0 16px 16px; padding: 24px 40px; text-align: center; }
  .footer-text { font-size: 12px; color: #445566; }
  .rdv-id { font-size: 24px; font-weight: 700; color: #00c8ff; text-align: center; letter-spacing: 4px; margin: 20px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">📅</div>
    <div class="title">Système RDV</div>
    <div class="subtitle">Confirmation de votre demande</div>
  </div>
  
  <div class="body">
    <p class="greeting">Bonjour {{ $appointment->prenom }} {{ $appointment->nom }},</p>
    <p class="message">
      Nous avons bien reçu votre demande de rendez-vous et elle est actuellement <strong style="color: #FFD700;">en cours de traitement</strong>. 
      Vous recevrez un email de confirmation dès qu'elle aura été traitée par notre équipe.
    </p>

    <div class="notice">
      ✅ Votre demande a été enregistrée avec le numéro de référence :
      <div class="rdv-id">#{{ str_pad($appointment->id, 6, '0', STR_PAD_LEFT) }}</div>
    </div>

    <div class="card">
      <div class="card-title">📋 Détails de votre rendez-vous</div>
      <div class="field">
        <span class="field-label">Nom complet</span>
        <span class="field-value">{{ $appointment->prenom }} {{ $appointment->nom }}</span>
      </div>
      <div class="field">
        <span class="field-label">Email</span>
        <span class="field-value">{{ $appointment->email }}</span>
      </div>
      <div class="field">
        <span class="field-label">Téléphone</span>
        <span class="field-value">{{ $appointment->telephone }}</span>
      </div>
      <div class="field">
        <span class="field-label">Objet</span>
        <span class="field-value">{{ $appointment->objet }}</span>
      </div>
      <div class="field">
        <span class="field-label">Date souhaitée</span>
        <span class="field-value">{{ \Carbon\Carbon::parse($appointment->date_rdv)->format('d/m/Y') }}</span>
      </div>
      <div class="field">
        <span class="field-label">Heure souhaitée</span>
        <span class="field-value">{{ substr($appointment->heure_rdv, 0, 5) }}</span>
      </div>
      <div class="field">
        <span class="field-label">Niveau d'urgence</span>
        <span class="urgence-badge badge-{{ $appointment->urgence }}">{{ $appointment->urgence_label }}</span>
      </div>
    </div>

    <p class="message" style="font-size: 13px;">
      Si vous avez des questions, n'hésitez pas à nous contacter. 
      Conservez votre numéro de référence pour tout suivi.
    </p>
  </div>

  <div class="footer">
    <p class="footer-text">
      Ce message a été généré automatiquement par le Système RDV.<br>
      Merci de ne pas répondre directement à cet email.
    </p>
  </div>
</div>
</body>
</html>
