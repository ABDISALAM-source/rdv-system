<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Réponse RDV</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0e1a; font-family: 'Segoe UI', Arial, sans-serif; color: #e0e6f0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { border-radius: 16px 16px 0 0; padding: 40px; text-align: center; }
  .header-accept  { background: linear-gradient(135deg, #0d3e1b, #1a5e2a); border: 1px solid rgba(0,200,83,0.4); }
  .header-refuse  { background: linear-gradient(135deg, #3e0d0d, #5e1a1a); border: 1px solid rgba(255,0,0,0.4); }
  .logo { font-size: 56px; margin-bottom: 16px; }
  .title-accept { font-size: 28px; font-weight: 700; color: #00C853; letter-spacing: 2px; }
  .title-refuse { font-size: 28px; font-weight: 700; color: #FF4444; letter-spacing: 2px; }
  .body { background: #0f1629; border: 1px solid rgba(255,255,255,0.1); border-top: none; padding: 40px; }
  .greeting { font-size: 18px; color: #00c8ff; margin-bottom: 20px; }
  .message { font-size: 15px; color: #b0bcd0; line-height: 1.8; margin-bottom: 30px; }
  .motif-box { background: rgba(255,69,0,0.1); border: 1px solid rgba(255,69,0,0.3); border-radius: 12px; padding: 20px; margin: 20px 0; }
  .motif-title { font-size: 13px; color: #FF4500; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
  .motif-text { font-size: 14px; color: #e0e6f0; line-height: 1.7; }
  .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; }
  .card-title { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #667788; margin-bottom: 16px; }
  .field { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
  .field:last-child { border-bottom: none; }
  .field-label { color: #556677; }
  .field-value { color: #c0ccd8; font-weight: 600; }
  .footer { background: #080d1a; border: 1px solid rgba(255,255,255,0.05); border-top: none; border-radius: 0 0 16px 16px; padding: 24px; text-align: center; font-size: 12px; color: #334455; }
</style>
</head>
<body>
<div class="container">
  <div class="header {{ $action === 'accepte' ? 'header-accept' : 'header-refuse' }}">
    <div class="logo">{{ $action === 'accepte' ? '✅' : '❌' }}</div>
    @if($action === 'accepte')
      <div class="title-accept">RENDEZ-VOUS CONFIRMÉ</div>
    @else
      <div class="title-refuse">RENDEZ-VOUS REFUSÉ</div>
    @endif
  </div>

  <div class="body">
    <p class="greeting">Bonjour {{ $appointment->prenom }} {{ $appointment->nom }},</p>

    @if($action === 'accepte')
      <p class="message">
        Nous avons le plaisir de vous confirmer que votre demande de rendez-vous a été 
        <strong style="color: #00C853;">acceptée</strong>. Nous vous attendons à la date et l'heure indiquées.
      </p>
    @elseif($action === 'refuse')
      <p class="message">
        Nous avons le regret de vous informer que votre demande de rendez-vous a été 
        <strong style="color: #FF4444;">refusée</strong>. Vous pouvez soumettre une nouvelle demande pour un autre créneau.
      </p>
    @else
      <p class="message">
        Nous avons le regret de vous informer que votre demande de rendez-vous a été 
        <strong style="color: #FF4444;">refusée</strong> pour la raison suivante :
      </p>
      <div class="motif-box">
        <div class="motif-title">📌 Motif du refus</div>
        <div class="motif-text">{{ $motif }}</div>
      </div>
    @endif

    <div class="card">
      <div class="card-title">📋 Récapitulatif</div>
      <div class="field">
        <span class="field-label">Référence</span>
        <span class="field-value">#{{ str_pad($appointment->id, 6, '0', STR_PAD_LEFT) }}</span>
      </div>
      <div class="field">
        <span class="field-label">Objet</span>
        <span class="field-value">{{ $appointment->objet }}</span>
      </div>
      <div class="field">
        <span class="field-label">Date</span>
        <span class="field-value">{{ \Carbon\Carbon::parse($appointment->date_rdv)->format('d/m/Y') }}</span>
      </div>
      <div class="field">
        <span class="field-label">Heure</span>
        <span class="field-value">{{ substr($appointment->heure_rdv, 0, 5) }}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    Message automatique du Système RDV — Ne pas répondre à cet email.
  </div>
</div>
</body>
</html>
