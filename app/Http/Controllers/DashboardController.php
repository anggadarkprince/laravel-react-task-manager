<?php

namespace App\Http\Controllers;

use App\Project;
use App\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Show statistic project.
     *
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $projects = $request->user()->projects()->where('is_completed', false)->count();
        $tasks = $request->user()->tasks()
            ->where([
                'projects.is_completed' => false,
                'tasks.is_completed' => false,
            ])
            ->count();
        $archived = $request->user()->projects()->where('is_completed', true)->count();

        $data = collect([
            'projects' => $projects,
            'tasks' => $tasks,
            'archived' => $archived,
        ]);
        return response()->json($data);
    }
}
