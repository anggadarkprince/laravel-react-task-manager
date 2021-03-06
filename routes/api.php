<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:api'])->group(function () {
    Route::get('dashboard', 'DashboardController@index');
    Route::get('search', 'SearchController@index');
    Route::get('projects', 'ProjectController@index');
    Route::get('archive', 'ProjectController@archive');
    Route::get('archive/{id}', 'ProjectController@archiveTask');
    Route::post('projects', 'ProjectController@store');
    Route::get('projects/{id}', 'ProjectController@show');
    Route::put('projects/{project}/complete', 'ProjectController@markAsCompleted');
    Route::put('projects/{project}', 'ProjectController@update');
    Route::delete('projects/{project}', 'ProjectController@destroy');
    Route::post('tasks', 'TaskController@store');
    Route::put('tasks/{task}', 'TaskController@markAsCompleted');
    Route::delete('tasks/{task}', 'TaskController@destroy');
    Route::post('token/refresh/{user}', 'Auth\LoginController@refreshToken');
    Route::post('account', 'AccountController@update');
    Route::get('setting', 'SettingController@index');
    Route::post('setting', 'SettingController@update');
});
Auth::routes(['verify' => true]);
