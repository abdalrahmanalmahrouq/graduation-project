<?php

namespace App\Http\Controllers;

use App\Models\LabResult;
use App\Models\MedicalRecord;
use App\Models\Notifications;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    /**
     * Get patient data by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPatientByUserId($user_id)
    {
        try {
            $patient = Patient::with('user')->where('user_id', $user_id)->first();

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found'
                ], 404);
            }

            // Format the patient data
            $patientData = [
                'id' => $patient->id,
                'user_id' => $patient->user_id,
                'full_name' => $patient->full_name,
                'phone_number' => $patient->phone_number,
                'date_of_birth' => $patient->date_of_birth,
                'address' => $patient->address,
                'user' => $patient->user ? [
                    'id' => $patient->user->id,
                    'email' => $patient->user->email,
                    'profile_image_url' => $patient->user->profile_image_url,
                ] : null,
            ];

            return response()->json([
                'success' => true,
                'patient' => $patientData
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching patient data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching patient data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPatientLabResults(){
        try{
        $userId=auth()->id();
        $labResults=LabResult::where('patient_id',$userId)
        ->where('status','approved')
        ->with('lab:user_id,lab_name')
        ->with('lab.user:id,profile_image')
        ->orderBy('created_at','desc')
        ->get();
            return response()->json([
                'success' => true,
                'labResults' => $labResults->map(function ($result) {
                    return [
                        'id' => $result->id,
                        'lab_name' => $result->lab->lab_name,
                        'title' => $result->examination_title,
                        'notes' => $result->notes,
                        'file_path' => $result->file_url,
                        'created_at' => $result->created_at,
                        'updated_at' => $result->updated_at,
                        'status' => $result->status,
                        'appointment_id' => $result->appointment_id,
                        'lab_id' => $result->lab_id,
                        'profile_image_url' => $result->lab->user->profile_image_url ?? null,
                    ];
                })
            ], 200);
        }catch(\Exception $e){
            Log::error('Error fetching patient lab results: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching patient lab results',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   public function getPatientMedicalRecords()
    {
        try {
            $userId = auth()->id();

            // 1. Fetch Records with DEEP Relationships
            // We traverse: Record -> Appointment -> Slot (Time) -> Contract -> Clinic
            $medicalRecords = MedicalRecord::where('patient_id', $userId)
                ->with([
                    // A. Appointment Basic Info
                    'appointment:id,appointment_id,appointment_date,status',

                    // B. The Time Slot (Template) - Gets starting_time/ending_time
                    'appointment.availableAppointment:id,clinic_doctor_id,starting_time,ending_time',

                    // C. The Clinic (via the deep chain)
                    'appointment.availableAppointment.clinicDoctor.clinic:user_id,clinic_name',
                    
                    // D. Clinic Profile Image (via User table)
                    'appointment.availableAppointment.clinicDoctor.clinic.user:id,profile_image',

                    // E. The Doctor (Directly linked in MedicalRecord)
                    'doctor:user_id,full_name',
                    'doctor.user:id,profile_image',

                    // F. Lab Results
                    'labResult:id,appointment_id,examination_title,notes,file_path,status'
                ])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // 2. Transform the Data (Crucial Step)
            // The database structure is deep/nested, but your Frontend expects flat data.
            // We map the data to look like the OLD structure so your Frontend doesn't break.
            $medicalRecords->getCollection()->transform(function ($record) {
                
                // Shortcuts to deep objects
                $appointment = $record->appointment;
                $slot = $appointment->availableAppointment ?? null;
                $clinic = $slot?->clinicDoctor?->clinic ?? null;
                $clinicUser = $clinic?->user ?? null;

                // 3. Inject the missing data back into the 'appointment' object
                if ($appointment) {
                    // Restore Time
                    $appointment->starting_time = $slot?->starting_time;
                    $appointment->ending_time = $slot?->ending_time;
                    
                    // Restore Clinic
                    if ($clinic) {
                        // Manually construct the clinic object the frontend expects
                        $appointment->clinic = [
                            'user_id' => $clinic->user_id,
                            'clinic_name' => $clinic->clinic_name,
                            'user' => [
                                'id' => $clinicUser?->id,
                                'profile_image' => $clinicUser?->profile_image
                            ]
                        ];
                    }
                    
                    // Clean up the helper objects from the response (Optional, keeps JSON clean)
                    unset($appointment->availableAppointment);
                }

                return $record;
            });

            return response()->json([
                'success' => true,
                'medicalRecords' => $medicalRecords
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching patient medical records: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching patient medical records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get notifications for patients
    public function getPatientNotifications(Request $request) {
        $user = $request->user();
        
        $labNotifications = LabResult::where('patient_id', $user->id)
            ->where('status', 'pending')
            ->select('id','lab_id','status','created_at')
            ->with('lab:user_id,lab_name')
            ->orderBy('created_at', 'desc')
            ->get();

        $labNotificationsDone = LabResult::where('patient_id', $user->id)
        ->whereIn('status', ['approved','rejected'])
        ->select('id','lab_id','status','approved_at','rejected_at')
        ->with('lab:user_id,lab_name')
        ->orderBy('created_at', 'desc')
        ->get();    

        $unread = Notifications::where('user_id',$user->id)
        ->where('is_read',0)
        ->orderBy('created_at','desc')
        ->get();    


        $read = Notifications::where('user_id',$user->id)
        ->where('is_read',1)
        ->orderBy('created_at','desc')
        ->get();    

        
        return response()->json([
            'success' => true,
            'labNotifications' => $labNotifications,
            'labNotificationsDone' => $labNotificationsDone,
            'unreadNotifications' => $unread,
            'readNotifications' => $read
        ]);
    }

    public function markAsRead($id){
        $notification = Notifications::find($id);
        $user = auth()->id();
        if(!$notification){
            return response()->json([
                'success' => false,
                'message' => "Notification not found "
            ],404);
        }

        if($user !== $notification->user_id){
            return response()->json([
                'success' => false,
                'message' => 'you are not authorized to read this notification'
            ],403);
        }
        $notification -> is_read = 1;
        $notification -> save();

        return response()->json([
            'success' => true
        ]);

    }
}
