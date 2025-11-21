<?php

namespace App\Http\Controllers;


use App\Http\Requests\LabResultPatientRespond;
use App\Http\Requests\LabResultRequestCreate;
use App\Http\Requests\LabResultUploadDetails;
use App\Models\LabResult;
use App\Models\Notifications;
use Illuminate\Http\Request;

class LabResultController extends Controller
{
    

    // Get lab requests (all statuses)
    public function getLabRequests(Request $request) {
        $user = $request->user();
        
        $requests = LabResult::where('lab_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'requests' => $requests,
        ]);
    }

    public function createRequest(LabResultRequestCreate $request){
        $user= $request->user();
        $result=LabResult::create([
            'lab_id' => $user->id,
            'patient_id' => $request->patient_id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request created successfully',
            'result' => $result,
        ], 201);
    }

    // 2) PATIENT: accept / reject
    public function respond(LabResultPatientRespond $validator, $id) {
        $labResult = LabResult::find($id);
        
        if(!$labResult) {
            return response()->json(['success'=>false,'message'=>'Request not found.'], 404);
        }
     
        if($labResult->patient_id !== $validator->user()->id) {
            return response()->json(['success'=>false,'message'=>'You are not authorized to respond to this request.'], 403);
        }

        if($labResult->status === 'pending') {
        $decision = $validator->decision; // approved | rejected (already validated)
        $labResult->status = $decision;
        if ($decision === 'approved') $labResult->approved_at = now();
        if ($decision === 'rejected') $labResult->rejected_at = now();
        $labResult->save();
        }else {
            return response()->json(['success'=>false,'message'=>'Request is not pending.'], 422);
        }

        return response()->json([
            'success' => true,
            'message' => "Request {$decision}.",
            'data'    => $labResult,
        ]);
    }

    public function uploadDetails(LabResultUploadDetails $req, $id) {
        $labResult = LabResult::find($id);

        if (!$labResult) {
            return response()->json(['success'=>false,'message'=>'Lab result not found.'], 404);
        }

        if($labResult->examination_title !== null) {
            return response()->json(['success'=>false,'message'=>'Lab result already uploaded.'], 422);
        }

        

        $this->authorize('upload', $labResult);
        if ($labResult->status !== 'approved') {
            return response()->json(['success'=>false,'message'=>'Request not approved.'], 422);
        }   

        // store file
        $path = $req->file('file')->store('lab-results', 'public');

        $labResult->update([
            'appointment_id' => $req->appointment_id,
            'examination_title' => $req->examination_title,
            'notes'             => $req->notes,
            'file_path'         => $path,
        ]);

        // create notification
        $notification = Notifications::create([
            'user_id' => $labResult->patient_id,
            'title' => 'نتيجة الفحص المعملي تم رفعها',
            'message' => "({$labResult->lab->lab_name}) تم رفع نتيجة الفحص المعملي بنجاح من مختبر",
            'type' => 'lab_result_uploaded',
            'data' => [
                'lab_id' => $labResult->lab_id,
                'lab_name' => $labResult->lab->lab_name,
                'lab_result_id' => $labResult->id,
            ],
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lab result saved.',
            'data'    => $labResult->fresh(),
            'notification' => $notification,
        ], 201);
    }
}
