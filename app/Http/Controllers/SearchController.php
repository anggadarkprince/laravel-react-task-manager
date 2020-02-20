<?php

namespace App\Http\Controllers;

use App\Project;
use App\Task;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Show statistic project
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {
        $projects = Project::where('name', 'like', "%{$request->get('q')}%")->take(10)->get();
        $tasks = Task::where('title', 'like', "%{$request->get('q')}%")->with(['project'])->take(10)->get();

        $data = collect([
            'projects' => $projects,
            'tasks' => $tasks,
        ]);
        return response()->json($data);
    }
}
