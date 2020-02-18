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
        $tasks = Task::where('is_completed', false)->count();
        $archived = Project::where('is_completed', true)->count();

        $data = collect([
            'projects' => $projects,
            'tasks' => $tasks,
            'archived' => $archived,
        ]);
        return $data->toJson();
    }
}
