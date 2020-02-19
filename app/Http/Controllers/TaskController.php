<?php

namespace App\Http\Controllers;

use App\Task;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
     * @return JsonResponse
     */
    public function markAsCompleted(Task $task)
    {
        try {
            $task->is_completed = true;
            $task->update();

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
