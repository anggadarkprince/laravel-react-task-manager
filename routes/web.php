<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::pattern('path', '[a-zA-Z0-9-/]+');
Route::view('/{path?}', 'app');
Route::get('email/verify/{id}/{hash}', function () {
    return view('app');
})->name('email.verify');
Route::get('password/reset/{token}', function () {
    return view('app');
})->name('account.reset');
