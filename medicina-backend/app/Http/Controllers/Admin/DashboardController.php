<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Insurance;
use App\Models\Doctor;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Lab;
use App\Models\LabResult;
use App\Models\AvailableAppointment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(){
        return view('admin.dashboard');
    }

    public function countEntities(){
        try{
            $insurances = Insurance::count();
            $doctors = Doctor::count();
            $patients = Patient::count();
            $clinics = Clinic::count();
            $labs = Lab::count();
            $appointments = Appointment::count();
            
            // Lab Statistics
            $totalLabResults = LabResult::count();
            $pendingLabResults = LabResult::where('status', 'pending')->count();
            $approvedLabResults = LabResult::where('status', 'approved')->count();
            $rejectedLabResults = LabResult::where('status', 'rejected')->count();
            
            // Get labs with and without results
            $labIdsWithResults = LabResult::distinct('lab_id')->pluck('lab_id')->toArray();
            $labsWithResults = Lab::whereIn('user_id', $labIdsWithResults)->count();
            $labsWithoutResults = $labs - $labsWithResults;
            
            // Available Appointments Statistics
            $totalAvailableAppointments = AvailableAppointment::count();
            $availableAppointmentsByDay = AvailableAppointment::select('day', DB::raw('count(*) as count'))
                ->groupBy('day')
                ->get()
                ->pluck('count', 'day')
                ->toArray();
            
            // Map different day formats to Arabic names
            $dayMapping = [
                'monday' => 'الإثنين', 'mon' => 'الإثنين',
                'tuesday' => 'الثلاثاء', 'tue' => 'الثلاثاء', 'tues' => 'الثلاثاء',
                'wednesday' => 'الأربعاء', 'wed' => 'الأربعاء',
                'thursday' => 'الخميس', 'thu' => 'الخميس', 'thurs' => 'الخميس',
                'friday' => 'الجمعة', 'fri' => 'الجمعة',
                'saturday' => 'السبت', 'sat' => 'السبت',
                'sunday' => 'الأحد', 'sun' => 'الأحد'
            ];
            
            $availableAppointmentsByDayFormatted = [];
            foreach ($availableAppointmentsByDay as $dayKey => $count) {
                $dayKeyLower = strtolower($dayKey);
                $arabicName = $dayMapping[$dayKeyLower] ?? ucfirst($dayKey);
                if (!isset($availableAppointmentsByDayFormatted[$arabicName])) {
                    $availableAppointmentsByDayFormatted[$arabicName] = 0;
                }
                $availableAppointmentsByDayFormatted[$arabicName] += $count;
            }
            
            // Ensure all days are represented
            $allDays = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
            foreach ($allDays as $day) {
                if (!isset($availableAppointmentsByDayFormatted[$day])) {
                    $availableAppointmentsByDayFormatted[$day] = 0;
                }
            }
            
            // Available appointments this week (if we had date-based filtering)
            // Since available appointments are recurring slots, we count all active ones
            $activeAvailableAppointments = AvailableAppointment::whereNull('deleted_at')->count();
            
            // Appointments statistics
            $totalAppointments = Appointment::count();
            $todayAppointments = Appointment::whereDate('created_at', Carbon::today())->count();
            $thisWeekAppointments = Appointment::whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->count();
            $thisMonthAppointments = Appointment::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'insurances' => $insurances,
                    'doctors' => $doctors,
                    'patients' => $patients,
                    'labs' => $labs,
                    'appointments' => $appointments,
                    'clinics' => $clinics,
                    // Lab Statistics
                    'lab_statistics' => [
                        'total_labs' => $labs,
                        'total_lab_results' => $totalLabResults,
                        'pending_lab_results' => $pendingLabResults,
                        'approved_lab_results' => $approvedLabResults,
                        'rejected_lab_results' => $rejectedLabResults,
                        'labs_with_results' => $labsWithResults,
                        'labs_without_results' => $labsWithoutResults,
                    ],
                    // Available Appointments Statistics
                    'available_appointments_statistics' => [
                        'total_available_appointments' => $totalAvailableAppointments,
                        'active_available_appointments' => $activeAvailableAppointments,
                        'by_day' => $availableAppointmentsByDayFormatted,
                    ],
                    // Additional Appointment Statistics
                    'appointment_statistics' => [
                        'total_appointments' => $totalAppointments,
                        'today_appointments' => $todayAppointments,
                        'this_week_appointments' => $thisWeekAppointments,
                        'this_month_appointments' => $thisMonthAppointments,
                    ],
                ]
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to count entities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}