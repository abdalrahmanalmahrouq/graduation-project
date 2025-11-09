import React, { useEffect, Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ClinicsPage from "../pages/ClinicsPage";
import PatientRegisterPage from "../pages/RegisterPages/PatientRegisterPage";
import PatientLoginPage from "../pages/LoginPages/PatientLoginPage";
import AllClinicsPage from "../pages/AllClinicsPage";
import DoctorProfilePage from "../pages/DoctorProfilePage";
import AppointmentsSchedulePage from "../pages/AppointmentsSchedulePage";
import ClinicRegisterPage from "../pages/RegisterPages/ClinicRegisterPage";
import ClinicLoginPage from "../pages/LoginPages/ClinicLoginPage";
import DoctorLoginPage from "../pages/LoginPages/DoctorLoginPage";
import DoctorRegisterPage from "../pages/RegisterPages/DoctorRegisterPage";
import LabLoginPage from "../pages/LoginPages/LabLoginPage";
import LabRegisterPage from "../pages/RegisterPages/LabRegisterPage";
import ChangePasswordPage from "../pages/AccountPages/ChangePasswordPage";
import DoctorBioPage from "../pages/AccountPages/DoctorBioPage";
import SideBar from "../components/SideBar";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import RoleAccountRoute from "../components/RoleAccountRoute";
import ManageDoctorsPage from "../pages/ManageDoctorsPage";
import DoctorManagementPage from "../pages/DoctorManagementPage";
import UpComingAppointmentPage from "../pages/UpComingAppointmentPage";
import PastAppointmentPage from "../pages/PastAppointmentPage";
import ClinicAppointmentsPage from "../pages/ClinicAppointmentsPage";
import ClinicInsurancePage from "../pages/ClinicInsurancePage";
import PatientDataPage from "../pages/PatientDataPage";
import DoctorClinicsPage from "../pages/DoctorClinicsPage";
import DoctorClinicAppointmentsPage from "../pages/DoctorClinicAppointmentsPage";
import EmailVerificationSuccess from "../components/EmailVerificationSuccess";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import LabResultRequestPage from "../pages/LabResultRequestPage";
import NotificationsPage from "../pages/NotificationsPage";
import PatientLabResultsPage from "../pages/PatientLabResultsPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";

const AppRouter = () => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: true,
		});
	}, []);

	return (
		<Fragment>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />

				{/* Clinics: allow guests + patients */}
				<Route
					path="/clinics"
					element={
						<ProtectedRoute allowedRoles={["patient", "guest"]}>
							<ClinicsPage />
						</ProtectedRoute>
					}
				/>
				{/* Routes For Login And Register */}
				{/* for patient */}
				<Route path="/login/patient" element={<PatientLoginPage />} />
				<Route
					path="/register/patient"
					element={<PatientRegisterPage />}
				/>
				{/* end patient */}

				{/* for clinic */}
				<Route path="/login/clinic" element={<ClinicLoginPage />} />
				<Route
					path="/register/clinic"
					element={<ClinicRegisterPage />}
				/>
				{/* end clinic */}

				{/* for doctor */}
				<Route path="/login/doctor" element={<DoctorLoginPage />} />
				<Route
					path="/register/doctor"
					element={<DoctorRegisterPage />}
				/>
				{/* end doctor */}

				{/* for lab */}
				<Route path="/login/lab" element={<LabLoginPage />} />
				<Route path="/register/lab" element={<LabRegisterPage />} />
				{/* end lab */}
				{/* End For Login And Register */}

				<Route
					path="/clinics/:directory"
					element={
						<ProtectedRoute allowedRoles={["patient", "guest"]}>
							<AllClinicsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/doctor/profile/:id"
					element={<DoctorProfilePage />}
				/>
				<Route
					path="/doctor/appointment/schedule/:id"
					element={<AppointmentsSchedulePage />}
				/>

				{/* Upcoming Appointments: only for patients */}
				<Route
					path="/patient/upcoming-appointments"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<UpComingAppointmentPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/patient/past-appointments"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<PastAppointmentPage />
						</ProtectedRoute>
					}
				/>

				<Route path="/sidebar" element={<SideBar />} />

				<Route
					path="/email-verified"
					element={<EmailVerificationSuccess />}
				/>
				<Route
					path="/email-verification-failed"
					element={<EmailVerificationSuccess />}
				/>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route
					path="/reset-password/:token"
					element={<ResetPassword />}
				/>
				<Route path="/:role/account" element={<RoleAccountRoute />} />
				<Route
					path="/:role/change-password"
					element={
						<ProtectedRoute
							allowedRoles={[
								"patient",
								"doctor",
								"clinic",
								"lab",
							]}
						>
							<ChangePasswordPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/doctor/bio"
					element={
						<ProtectedRoute allowedRoles={["doctor"]}>
							<DoctorBioPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/doctor/clinics"
					element={
						<ProtectedRoute allowedRoles={["doctor"]}>
							<DoctorClinicsPage />
						</ProtectedRoute>
					}
				/>
                <Route
                    path="/doctor/clinics/:clinicId/appointments"
                    element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                            <DoctorClinicAppointmentsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctor/appointments/:appointmentId/medical-record"
                    element={
                        <ProtectedRoute allowedRoles={["doctor"]}>
                            <MedicalRecordPage />
                        </ProtectedRoute>
                    }
                />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="/404" element={<NotFound />} />

				<Route
					path="/manage/doctors"
					element={
						<ProtectedRoute allowedRoles={["clinic"]}>
							<ManageDoctorsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/manage/doctor/:doctorId/:clinicId"
					element={
						<ProtectedRoute allowedRoles={["clinic"]}>
							<DoctorManagementPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/clinic/appointments"
					element={
						<ProtectedRoute allowedRoles={["clinic"]}>
							<ClinicAppointmentsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/clinic/insurances"
					element={
						<ProtectedRoute allowedRoles={["clinic"]}>
							<ClinicInsurancePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/patients/by-user-id/:user_id"
					element={
                        <ProtectedRoute allowedRoles={["clinic","doctor"]}>
							<PatientDataPage />
						</ProtectedRoute>
					}
				/>
				
				{/* Lab Result Routes */}
				<Route
					path="/lab/results"
					element={
						<ProtectedRoute allowedRoles={["lab"]}>
							<LabResultRequestPage />
						</ProtectedRoute>
					}
				/>
				
				{/* Notifications Route */}
				<Route
					path="/patient/notifications"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<NotificationsPage />
						</ProtectedRoute>
					}
				/>

				{/* Patient Lab Results Route */}
				<Route
					path="/patient/lab-results"
					element={
						<ProtectedRoute allowedRoles={["patient"]}>
							<PatientLabResultsPage />
						</ProtectedRoute>
					}
				/>

				{/* Catch-all route for 404 */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Fragment>
	);
};

export default AppRouter;
