<?php

namespace App\Http\Controllers;

use App\Project;
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
            ->withCount(['tasks' => function ($query) {
                $query->where('is_completed', false);
            }])
            ->get();

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
            $query->where('is_completed', false);
        }])->find($id);

        return $project->toJson();
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

        return response()->json('Project updated!');
    }
}
