<?php

namespace App\Http\Controllers;

use App\Project;
use App\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Show statistic project
     * @return mixed
     */
    public function index()
    {
        $projects = Project::where('is_completed', false)->count();
        $tasks = Task::join('projects', 'projects.id', '=', 'tasks.project_id')
            ->where([
                'projects.is_completed' => false,
                'tasks.is_completed' => false,
            ])
            ->count();
        $archived = Project::where('is_completed', true)->count();

        $data = collect([
            'projects' => $projects,
            'tasks' => $tasks,
            'archived' => $archived,
        ]);
        return response()->json($data);
    }
}
