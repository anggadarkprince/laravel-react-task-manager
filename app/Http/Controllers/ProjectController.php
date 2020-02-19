<?php

namespace App\Http\Controllers;

use App\Project;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Show incomplete project
     * @return mixed
     */
    public function index()
    {
        $projects = Project::where('is_completed', false)
            ->orderBy('created_at', 'desc')
            ->withCount([
                'tasks AS all_task_count',
                'tasks' => function ($query) {
                    $query->where('is_completed', false);
                }
            ])
            ->get();

        return $projects->toJson();
    }

    /**
     * Show completed project
     * @return mixed
     */
    public function archive()
    {
        $projects = Project::where('is_completed', true)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return $projects->toJson();
    }

    /**
     * Save new project.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        try {
            $project = Project::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
            ]);

            return response()->json($project);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Something went wrong, try again or contact administrator'
                ]
            ], 500);
        }
    }

    /**
     * Show single project with task within.
     *
     * @param $id
     * @return string
     */
    public function show($id)
    {
        $project = Project::with(['tasks' => function ($query) {
            //$query->where('is_completed', false);
            $query->orderBy('is_completed', 'asc');
        }])->find($id);

        return $project->toJson();
    }

    /**
     * Show single project with task within.
     *
     * @param $id
     * @return string
     */
    public function archiveTask($id)
    {
        $project = Project::with(['tasks'])->find($id);

        return $project->toJson();
    }

    /**
     * Update project data.
     *
     * @param Request $request
     * @param Project $project
     * @return JsonResponse
     */
    public function update(Project $project, Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        try {
            $project->update($request->all());
            return response()->json($project);
        } catch (QueryException $e) {
            return response()->json([
                'errors' => [
                    'general' => 'Something went wrong, try again or contact administrator'
                ]
            ], 500);
        }
    }

    /**
     * Mark project as completed.
     *
     * @param Project $project
     * @return JsonResponse
     */
    public function markAsCompleted(Project $project)
    {
        $project->is_completed = true;
        $project->update();

        return response()->json($project);
    }

    /**
     * Delete project.
     *
     * @param Project $project
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Project $project)
    {
        return response()->json(['status' => $project->delete() ? 'success' : 'error']);
    }
}
