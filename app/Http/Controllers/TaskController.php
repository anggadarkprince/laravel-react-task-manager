<?php

namespace App\Http\Controllers;

use App\Mail\TaskCompleted;
use App\Task;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Mail;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate(['title' => 'required']);

        try {
            $task = Task::create([
                'title' => $validatedData['title'],
                'project_id' => $request->project_id,
                'is_completed' => 0
            ]);

            return $task->toJson();
        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Create task failed, try again or contact administrator'
                ]
            ], 500);
        }
    }

    /**
     * Mark task as completed status.
     *
     * @param Task $task
     * @param Request $request
     * @return JsonResponse
     */
    public function markAsCompleted(Task $task, Request $request)
    {
        try {
            $user = $request->user();
            $task->is_completed = true;
            $task->update();

            if ($request->user()->settings()->where(['key' => 'notify_when_task_completed', 'value' => 1])->count()) {
                $email = (new MailMessage)
                    ->greeting('Task Completed')
                    ->line('Task ' . $task->title . ' is completed at ' . $task->updated_at)
                    ->line('Please review the project.')
                    ->action(Lang::get('Open Project'), url('projects/' . $task->project_id))
                    ->render();

                Mail::send([], [], function ($message) use ($user, $task, $email) {
                    $message
                        ->to($user->email)
                        ->subject(env('APP_NAME') . ' - Task ' . $task->title . ' completed')
                        ->setBody($email, 'text/html');
                });
            }

            return response()->json($task);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Completing task failed, try again or contact administrator'
                ]
            ], 500);
        }
    }


    /**
     * Delete task.
     *
     * @param Task $task
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Task $task)
    {
        return response()->json(['status' => $task->delete() ? 'success' : 'error']);
    }
}
