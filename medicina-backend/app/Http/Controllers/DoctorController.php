<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DoctorController extends Controller
{
    // Get all doctors by specialization for the frontend directory page
    public function getDoctorsBySpecialization(Request $request, $specialization)
{
            // Use the path parameter OR request body
            $specialization = $specialization ?? $request->specialization;

            // 1. Normalize input
            $input = trim(mb_strtolower($specialization));
            $input = str_replace(['أ', 'إ', 'آ'], 'ا', $input);

            // 2. Map all common Arabic/English variations → search synonyms
            $specializationMapping = [
                // Pediatrics
                'pediatrics' => ['pediatrics', 'pediatric', 'طب اطفال', 'اخصائي اطفال', 'اطفال'],
                'اخصائي اطفال' => ['pediatrics', 'اخصائي اطفال', 'اطفال'],
                'اطفال' => ['pediatrics', 'اخصائي اطفال', 'اطفال'],
                'طب اطفال' => ['pediatrics', 'اخصائي اطفال', 'اطفال'],

                // Cardiology
                'cardiology' => ['cardiology', 'قلب', 'اخصائي قلب'],
                'قلب' => ['cardiology', 'قلب', 'اخصائي قلب'],
                'اخصائي قلب' => ['cardiology', 'قلب', 'اخصائي قلب'],

                // Neurology
                'neurology' => ['neurology', 'اعصاب', 'طبيب اعصاب', 'اخصائي اعصاب'],
                'اعصاب' => ['neurology', 'اعصاب', 'طبيب اعصاب', 'اخصائي اعصاب'],
                'طبيب اعصاب' => ['neurology', 'اعصاب', 'طبيب اعصاب', 'اخصائي اعصاب'],
                'اخصائي اعصاب' => ['neurology', 'اعصاب', 'طبيب اعصاب', 'اخصائي اعصاب'],

                // Dermatology
                'dermatology' => ['dermatology', 'جلدية', 'طبيب جلدية', 'اخصائي جلدية'],
                'جلدية' => ['dermatology', 'جلدية', 'طبيب جلدية', 'اخصائي جلدية'],
                'طبيب جلدية' => ['dermatology', 'جلدية', 'طبيب جلدية', 'اخصائي جلدية'],
                'اخصائي جلدية' => ['dermatology', 'جلدية', 'طبيب جلدية', 'اخصائي جلدية'],

                // Dentistry
                'dentistry' => ['dentistry', 'اسنان', 'طبيب اسنان', 'اخصائي اسنان'],
                'اسنان' => ['dentistry', 'اسنان', 'طبيب اسنان', 'اخصائي اسنان'],
                'طبيب اسنان' => ['dentistry', 'اسنان', 'طبيب اسنان', 'اخصائي اسنان'],
                'اخصائي اسنان' => ['dentistry', 'اسنان', 'طبيب اسنان', 'اخصائي اسنان'],

                // Ophthalmology
                'ophthalmology' => ['ophthalmology', 'عيون', 'طبيب عيون', 'اخصائي عيون'],
                'عيون' => ['ophthalmology', 'عيون', 'طبيب عيون', 'اخصائي عيون'],
                'طبيب عيون' => ['ophthalmology', 'عيون', 'طبيب عيون', 'اخصائي عيون'],
                'اخصائي عيون' => ['ophthalmology', 'عيون', 'طبيب عيون', 'اخصائي عيون'],

                // Gynecology
                'gynecology' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],
                'نساء' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],
                'طبيب نساء' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],
                'اخصائي نساء' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],
                'طب نسائية' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],
                'اخصائي طب نسائية' => ['gynecology', 'نساء', 'طبيب نساء', 'اخصائي نساء', 'طب نسائية', 'اخصائي طب نسائية'],

                // Orthopedics
                'orthopedics' => ['orthopedics', 'orthopedic', 'عظام', 'طبيب عظام', 'اخصائي عظام'],
                'orthopedic' => ['orthopedics', 'orthopedic', 'عظام', 'طبيب عظام', 'اخصائي عظام'],
                'عظام' => ['orthopedics', 'orthopedic', 'عظام', 'طبيب عظام', 'اخصائي عظام'],
                'طبيب عظام' => ['orthopedics', 'orthopedic', 'عظام', 'طبيب عظام', 'اخصائي عظام'],
                'اخصائي عظام' => ['orthopedics', 'orthopedic', 'عظام', 'طبيب عظام', 'اخصائي عظام'],

                // Pulmonology
                'pulmonology' => ['pulmonology', 'جهاز تنفسي', 'طبيب صدر', 'اخصائي جهاز تنفسي'],
                'جهاز تنفسي' => ['pulmonology', 'جهاز تنفسي', 'طبيب صدر', 'اخصائي جهاز تنفسي'],
                'طبيب صدر' => ['pulmonology', 'جهاز تنفسي', 'طبيب صدر', 'اخصائي جهاز تنفسي'],
                'اخصائي جهاز تنفسي' => ['pulmonology', 'جهاز تنفسي', 'طبيب صدر', 'اخصائي جهاز تنفسي'],

                // ENT
                'ent' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],
                'انف' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],
                'اذن' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],
                'انف اذن حنجرة' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],
                'انف اذن و حنجرة' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],
                'اخصائي انف اذن و حنجرة' => ['ent', 'انف', 'اذن', 'حنجرة', 'انف اذن حنجرة', 'انف اذن و حنجرة', 'اخصائي انف اذن و حنجرة'],

                // Gastroenterology (digestive)
                'gastroenterology' => ['gastroenterology', 'جهاز هضمي', 'هضمي', 'باطنية', 'اخصائي باطنية'],
                'digestive' => ['gastroenterology', 'جهاز هضمي', 'هضمي', 'باطنية', 'اخصائي باطنية'],
                'هضمي' => ['gastroenterology', 'جهاز هضمي', 'هضمي', 'باطنية', 'اخصائي باطنية'],
                'باطنية' => ['gastroenterology', 'جهاز هضمي', 'هضمي', 'باطنية', 'اخصائي باطنية'],
                'اخصائي باطنية' => ['gastroenterology', 'جهاز هضمي', 'هضمي', 'باطنية', 'اخصائي باطنية'],

                // Internal Medicine
                'internalmedicine' => ['internal medicine', 'طب عام', 'طبيب عام', 'اخصائي طب عام'],
                'طب عام' => ['internal medicine', 'طب عام', 'طبيب عام', 'اخصائي طب عام'],
                'طبيب عام' => ['internal medicine', 'طب عام', 'طبيب عام', 'اخصائي طب عام'],
                'اخصائي طب عام' => ['internal medicine', 'طب عام', 'طبيب عام', 'اخصائي طب عام'],
            ];

            // 3. Resolve synonyms (fallback: only input)
            $searchTerms = $specializationMapping[$input] ?? [$input];

            // Normalize each search term
            $searchTerms = array_map(function ($term) {
                $term = trim(mb_strtolower($term));
                return str_replace(['أ', 'إ', 'آ'], 'ا', $term);
            }, $searchTerms);

            // 4. Query: match ANY Arabic/English version stored in DB
            $doctors = Doctor::whereHas('clinics')  // this will make sure that the doctor is not deleted from clinic
            ->whereHas('user', function($q) {
                $q->whereNull('deleted_at');
            })  //this will make sure that the doctor is not deleted 
            ->where(function ($query) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $query->orWhereRaw("REPLACE(LOWER(specialization), 'أ', 'ا') LIKE ?", ["%{$term}%"]);
                }
            })  // this will make the query also search if the doctor specialization saved in arabic 
            ->with([
                'user:id,profile_image',
                'clinics:id,clinic_name,address,user_id'
            ])
            ->get();

            // 5. Transform output
            $doctorsData = $doctors->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->full_name,
                    'specialization' => $doctor->specialization,
                    'profile_image_url' => $doctor->user->profile_image_url ?? null,
                    'clinics' => $doctor->clinics->map(function ($clinic) {
                        return [
                            'id' => $clinic->user_id,
                            'name' => $clinic->clinic_name,
                            'address' => $clinic->address,
                        ];
                    }),
                ];
            });

            return response()->json([
                'success' => true,
                'doctors' => $doctorsData,
            ]);
}


    // Get doctor profile for the frontend profile page so the patient can see the doctor's profile and clinics associated with the doctor
    public function getDoctorProfile(Request $request, $id){
        // Get doctor with their user data and associated clinics
        $doctor = Doctor::where('id', $id)
            ->with([
                'user:id,profile_image', // Get user profile image
                'clinics:id,clinic_name,address,user_id' // Get associated clinics with address
            ])
            
            ->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        // Get clinic IDs where the doctor works
        $clinicIds = $doctor->clinics->pluck('user_id');

        // Get clinics with their insurance information
        $clinics = Clinic::whereIn('user_id', $clinicIds)
            ->with(['insurances:insurance_id,name','user:id,profile_image'])
            ->get(['id', 'clinic_name', 'address', 'user_id']);

        // Transform the data to include profile image URL, clinic names, and insurances
        $doctorData = [
            'id' => $doctor->user_id,
            'name' => $doctor->full_name,
            'specialization' => $doctor->specialization,
            'phone_number' => $doctor->phone_number,
            'bio' => $doctor->bio,
            'profile_image_url' => $doctor->user->profile_image_url ?? null,
            'clinics' => $clinics->map(function ($clinic) {
                return [
                    'id' => $clinic->user_id,
                    'name' => $clinic->clinic_name,
                    'address' => $clinic->address,
                    'profile_image_url'=>$clinic->user->profile_image_url ?? null,
                    'insurances' => $clinic->insurances->map(function ($insurance) {
                        return [
                            'id' => $insurance->insurance_id,
                            'name' => $insurance->name
                        ];
                    })
                ];
            })
        ];

        return response()->json([
            'success' => true,
            'doctor' => $doctorData
        ]);
    }

    public function getClinics(Request $request){
        $user=auth()->user();
        $doctor=$user->doctor;
        
        $clinics=$doctor->clinics()
        ->whereHas('user', function ($query) {
            $query->whereNull('deleted_at');
        })
        ->with('user:id,email,profile_image')
        ->get(['clinics.user_id', 'clinics.clinic_name', 'clinics.address', 'clinics.phone_number']);

        $clinics->each(function ($clinic) {
            if ($clinic->user && $clinic->user->profile_image) {
                $clinic->profile_image_url = $clinic->user->profile_image_url;
            } else {
                $clinic->profile_image_url = null;
            }
        });
        return response()->json([
            'success' => true,
            'clinics' => $clinics
        ], 200);
    }
    // Add bio for authenticated doctor
    public function addBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio added successfully.'], 200);
    }

    // Get bio for authenticated doctor
    public function getBio(Request $request){
        $doctor=auth()->user()->doctor;
        return response()->json(['bio' => $doctor->bio], 200);
    }

    // Update bio for authenticated doctor
    public function updateBio(Request $request){
        $request->validate([
            'bio' => 'required|string',
        ]);
        $doctor=auth()->user()->doctor;
        $doctor->bio=$request->bio;
        $doctor->save();
        return response()->json(['message' => 'Bio updated successfully.'], 200);
    }

    public function getAllPatientsAppointmentsWithMedicalRecord(Request $request)
    {
        try {
            $doctorId = auth()->id();

            // 1. Start from Appointment Model (easier than defining complex joins on Doctor)
            $appointments = Appointment::query()
                
                // FILTER: Only appointments belonging to THIS Doctor
                // Chain: Appointment -> Slot -> Contract -> Doctor
                ->whereHas('availableAppointment.clinicDoctor', function ($q) use ($doctorId) {
                    $q->where('doctor_id', $doctorId);
                })

                // FILTER: Active Patients only (Soft Delete Check)
                ->whereHas('patient.user', fn($u) => $u->whereNull('deleted_at'))

                // FILTER: Active Clinics only (Deep Soft Delete Check)
                // Chain: Slot -> Contract -> Clinic -> User
                ->whereHas('availableAppointment.clinicDoctor.clinic.user', fn($u) => $u->whereNull('deleted_at'))

                // EAGER LOAD: Get all the data
                ->with([
                    'patient:user_id,full_name',
                    'patient.user:id,profile_image',
                    'medicalRecord',
                    'medicalRecord.labResults',
                    
                    // Deep Load the Clinic Info so we can show "Clinic Name"
                    'availableAppointment:id,clinic_doctor_id,day,starting_time,ending_time',
                    'availableAppointment.clinicDoctor.clinic:user_id,clinic_name'
                ])
                ->orderBy('appointment_date', 'desc')
                ->get();

            // 2. Transform Data for Frontend
            // We need to move the deep 'clinic' data back to the top level
            // so your Frontend can still access `appointment.clinic.clinic_name`
            $appointments->transform(function ($appt) {
                // Shortcut to the deep data
                $slot = $appt->availableAppointment;
                $clinic = $slot?->clinicDoctor?->clinic;

                // A. Inject Time & Day directly into the Appointment object
                // This makes it compatible with your old Frontend code
                if ($slot) {
                    $appt->day = $slot->day;
                    $appt->starting_time = $slot->starting_time;
                    $appt->ending_time = $slot->ending_time;
                }

                // B. Inject Clinic directly
                if ($clinic) {
                    $appt->setRelation('clinic', $clinic);
                }
                
                // C. Cleanup: Remove the helper object to keep JSON clean
                unset($appt->availableAppointment);
                
                return $appt;
            });

            return response()->json([
                'success' => true,
                'appointments' => $appointments
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching all patients appointments with medical record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching all patients appointments with medical record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
