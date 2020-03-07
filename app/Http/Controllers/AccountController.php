<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    /**
     * Update account data.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required',
            'current_password' => ['required', 'password'],
        ]);
        $validator->sometimes('password', 'min:8|confirmed', function ($input) {
            return (strlen($input->password) > 0);
        });
        $validator->validate();

        $user = $request->user();

        try {
            $data = $request->only(['name', 'email', 'password']);
            $data['password'] = Hash::make($data['password']);
            $user->update($data);
            return response()->json($user);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Something went wrong, try again or contact administrator'
                ]
            ], 500);
        }
    }

}
