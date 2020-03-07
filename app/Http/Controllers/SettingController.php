<?php

namespace App\Http\Controllers;

use App\Setting;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Get setting by authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $settings = $request->user()->settings->mapWithKeys(function ($item) {
            return [$item['key'] => $item['value']];
        });

        return response()->json($settings);
    }

    /**
     * Update account data.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request)
    {
        $user = $request->user();

        try {
            $notifyTaskCompleted = Setting::firstOrNew([
                'user_id' => $user->id,
                'key' => 'notify_when_task_completed'
            ]);
            $notifyTaskCompleted->value = $request->post('notify_when_task_completed');
            $notifyTaskCompleted->save();

            $notifyProjectCreated = Setting::firstOrNew([
                'user_id' => $user->id,
                'key' => 'notify_when_new_project_created'
            ]);
            $notifyProjectCreated->value = $request->post('notify_when_new_project_created');
            $notifyProjectCreated->save();

            return response()->json($user->settings->mapWithKeys(function ($item) {
                return [$item['key'] => $item['value']];
            }));

        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Something went wrong, try again or contact administrator'
                ]
            ], 500);
        }
    }
}
