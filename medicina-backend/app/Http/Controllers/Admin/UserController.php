<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserController extends Controller
{
    public function index()
    {
        $page = request('page', 1);
        $perPage = 10;

        // Get doctors with relationship
        $doctors = User::where('role', 'doctor')
            ->with('doctor:id,user_id,phone_number,full_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'role' => 'doctor',
                    'name' => optional($user->doctor)->full_name ?? 'N/A',
                    'email' => $user->email,
                    'phone_number' => optional($user->doctor)->phone_number ?? 'N/A',
                    'address' => 'N/A', // Doctors don't have address
                    'created_at' => $user->created_at,
                ];
            });

        // Get patients with relationship
        $patients = User::where('role', 'patient')
            ->with('patient:id,user_id,phone_number,address,full_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'role' => 'patient',
                    'name' => optional($user->patient)->full_name ?? 'N/A',
                    'email' => $user->email,
                    'phone_number' => optional($user->patient)->phone_number ?? 'N/A',
                    'address' => optional($user->patient)->address ?? 'N/A',
                    'created_at' => $user->created_at,
                ];
            });

        // Get clinics with relationship
        $clinics = User::where('role', 'clinic')
            ->with('clinic:id,user_id,phone_number,address,clinic_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'role' => 'clinic',
                    'name' => optional($user->clinic)->clinic_name ?? 'N/A',
                    'email' => $user->email,
                    'phone_number' => optional($user->clinic)->phone_number ?? 'N/A',
                    'address' => optional($user->clinic)->address ?? 'N/A',
                    'created_at' => $user->created_at,
                ];
            });

        // Get labs with relationship
        $labs = User::where('role', 'lab')
            ->with('lab:id,user_id,phone_number,address,lab_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'role' => 'lab',
                    'name' => optional($user->lab)->lab_name ?? 'N/A',
                    'email' => $user->email,
                    'phone_number' => optional($user->lab)->phone_number ?? 'N/A',
                    'address' => optional($user->lab)->address ?? 'N/A',
                    'created_at' => $user->created_at,
                ];
            });

        // Merge all users and sort by created_at
        $allUsers = $doctors->merge($patients)->merge($clinics)->merge($labs)
            ->sortByDesc('created_at')
            ->values();

        // Paginate manually
        $total = $allUsers->count();
        $items = $allUsers->forPage($page, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return view('admin.users.index', ['allUsers' => $paginator]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return redirect()->back()->with('error', 'User not found');
        }
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully');
    }
}
