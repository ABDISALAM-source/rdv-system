<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (AuthenticationException $e) {
            return response()->json(['success' => false, 'message' => 'Non authentifié.'], 401);
        });

        $this->renderable(function (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        });

        $this->renderable(function (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Ressource introuvable.'], 404);
        });
    }
}
