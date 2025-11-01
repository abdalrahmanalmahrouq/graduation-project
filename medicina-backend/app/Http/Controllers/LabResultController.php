<?php

namespace App\Http\Controllers;


use App\Http\Requests\LabResultPatientRespond;
use App\Http\Requests\LabResultRequestCreate;
use App\Http\Requests\LabResultUploadDetails;
use App\Models\LabResult;
use Illuminate\Http\Request;

class LabResultController extends Controller
{
    // Get notifications for patient (pending requests)
    public function getPatientNotifications(Request $request) {
        $user = $request->user();
        
        $notifications = LabResult::where('patient_id', $user->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
        ]);
    }

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
    public function respond(LabResultPatientRespond $validator, LabResult $labResult) {
        $this->authorize('respond', $labResult);

        $decision = $validator->decision; // approved | rejected (already validated)
        $labResult->status = $decision;
        if ($decision === 'approved') $labResult->approved_at = now();
        if ($decision === 'rejected') $labResult->rejected_at = now();
        $labResult->save();

        return response()->json([
            'success' => true,
            'message' => "Request {$decision}.",
            'data'    => $labResult,
        ]);
    }

    public function uploadDetails(LabResultUploadDetails $req, LabResult $labResult) {
        $this->authorize('upload', $labResult);

        if ($labResult->status !== 'approved') {
            return response()->json(['success'=>false,'message'=>'Request not approved.'], 422);
        }

        // store file
        $path = $req->file('file')->store('lab-results', 'public');

        $labResult->update([
            'examination_title' => $req->examination_title,
            'notes'             => $req->notes,
            'file_path'         => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lab result saved.',
            'data'    => $labResult->fresh(),
        ]);
    }
}
