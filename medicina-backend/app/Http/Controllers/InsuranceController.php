<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\InsuranceService;

class InsuranceController extends Controller
{
    protected $insuranceService;

    public function __construct(InsuranceService $insuranceService)
    {
        $this->insuranceService = $insuranceService;
    }

    /**
     * Get all insurance companies
     */
    public function index()
    {
        try {
            $insurances = $this->insuranceService->getAllInsurances();

            return response()->json([
                'success' => true,
                'data' => $insurances,
                'message' => 'Insurance companies retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve insurance companies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get insurances for authenticated clinic
     */
    public function getInsurancesForClinic()
    {
        try {
            $insurances = $this->insuranceService->getInsurancesForClinic(auth()->user()->clinic);

            return response()->json([
                'success' => true,
                'data' => $insurances,
                'message' => 'Insurances retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve insurances',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add insurance to clinic
     */
    public function addInsurancesForClinic(Request $request)
    {
        try {
            $request->validate([
                'insurance_id' => 'required|exists:insurances,insurance_id',
            ]);

            $result = $this->insuranceService->addInsuranceForClinic(auth()->user()->clinic, $request->insurance_id);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['success'] ? 200 : 409);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add insurance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Soft delete insurance from clinic
     */
    public function deleteInsuranceForClinic(Request $request)
    {
        try {
            $request->validate([
                'insurance_id' => 'required|exists:insurances,insurance_id',
            ]);

            $result = $this->insuranceService->deleteInsuranceForClinic(auth()->user()->clinic, $request->insurance_id);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['success'] ? 200 : 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove insurance',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
