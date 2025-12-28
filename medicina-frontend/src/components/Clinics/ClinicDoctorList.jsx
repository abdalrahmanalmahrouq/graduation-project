import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img/profpic.png";
import axios from "axios";
import Loading from "../Loading";

// Helper constants
const DAYS = [
	"saturday",
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
];
const DAY_LABELS = {
	saturday: "السبت",
	sunday: "الأحد",
	monday: "الاثنين",
	tuesday: "الثلاثاء",
	wednesday: "الأربعاء",
	thursday: "الخميس",
	friday: "الجمعة",
};

// --- Doctor Card Component (Unchanged) ---
const DoctorCard = ({ doctor, onManage, onDelete }) => {
	const navigate = useNavigate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [isDeleting, setIsDeleting] = useState(false);

	const profileImage = doctor.profile_image_url || defaultImage;

	const handleManage = async () => {
		try {
			const profileResponse = await axios.get("/profile");
			const clinicId = profileResponse.data.id;
			navigate(`/manage/doctor/${doctor.id}`);
		} catch (error) {
			console.error("Error getting clinic ID:", error);
			navigate(`/manage/doctor/${doctor.id}`);
		}
	};

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		setIsDeleting(true);
		try {
			await axios.delete("/clinics/delete-doctor-from-clinic", {
				data: { doctor_id: doctor.doctorId },
			});
			onDelete(doctor.doctorId);
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting doctor:", error);
			alert("فشل في حذف الطبيب. يرجى المحاولة مرة أخرى.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="doctor-card">
				<button
					className="doctor-delete-btn"
					onClick={handleDeleteClick}
					title="حذف الطبيب"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<div className="doctor-image-container">
					<div className="relative">
						<img
							src={profileImage}
							alt={doctor.name}
							className="doctor-image"
							onError={(e) => {
								e.target.src = defaultImage;
							}}
						/>
						<div className="doctor-status">
							<div className="doctor-status-dot"></div>
						</div>
					</div>
				</div>
				<h3 className="add-doctor-name">{doctor.name}</h3>
				<p className="doctor-specialty">
					{doctor.specialty || doctor.clinic}
				</p>
				<button onClick={handleManage} className="doctor-manage-btn">
					إدارة الطبيب
				</button>
			</div>

			{showDeleteModal && (
				<div className="delete-modal-overlay">
					<div className="delete-modal">
						<div className="delete-modal-header">
							<div className="delete-modal-icon">
								<svg
									className="w-8 h-8 text-red-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<h3 className="delete-modal-title">تأكيد الحذف</h3>
						</div>
						<div className="delete-modal-body">
							<p className="delete-modal-message">
								هل أنت متأكد من أنك تريد حذف الطبيب{" "}
								<strong>{doctor.name}</strong>؟
							</p>
						</div>
						<div className="delete-modal-actions">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="delete-modal-cancel-btn"
								disabled={isDeleting}
							>
								إلغاء
							</button>
							<button
								onClick={handleConfirmDelete}
								className="delete-modal-confirm-btn"
								disabled={isDeleting}
							>
								{isDeleting ? "جاري الحذف..." : "حذف"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// --- Add Button Component (Unchanged) ---
const AddDoctorButton = ({ onAdd }) => {
	return (
		<div className="add-doctor-button" onClick={onAdd}>
			<div className="add-doctor-icon">
				<svg
					className="w-10 h-10 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</div>
			<span className="add-doctor-text">إضافة طبيب</span>
			<span className="add-doctor-subtitle">انقر لإضافة طبيب جديد</span>
		</div>
	);
};

// --- NEW REFACTORED ADD DOCTOR DIALOG ---
const AddDoctorDialog = ({ isOpen, onClose, onAddDoctor }) => {
	const [step, setStep] = useState(1); // Step 1: ID, Step 2: Schedule
	const [doctorId, setDoctorId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [foundDoctorName, setFoundDoctorName] = useState("");
	const [showRestorePrompt, setShowRestorePrompt] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({});
	// Initialize schedule: all days null
	const [schedule, setSchedule] = useState(
		DAYS.reduce((acc, day) => ({ ...acc, [day]: null }), {})
	);
	const mainErrorRef = useRef(null);

	// Reset state when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setStep(1);
			setDoctorId("");
			setError("");
			setFieldErrors({});
			setSchedule(
				DAYS.reduce((acc, day) => ({ ...acc, [day]: null }), {})
			);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			setFoundDoctorName("");
		}
	}, [isOpen]);

	// Scroll to main error div when ANY validation errors occur
	useEffect(() => {
		if (Object.keys(fieldErrors).length > 0 && mainErrorRef.current) {
			setTimeout(() => {
				mainErrorRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 200);
		}
	}, [fieldErrors]);

	// Toggle a day ON/OFF
	const handleDayToggle = (day) => {
		setSchedule((prev) => {
			// If currently has data, turn it off (null)
			if (prev[day]) return { ...prev, [day]: null };

			// Otherwise, turn it on with defaults
			return {
				...prev,
				[day]: {
					start_time: "09:00",
					end_time: "17:00",
					break_start: "13:00",
					break_end: "14:00",
				},
			};
		});
	};

	// Update specific time field
	const handleTimeChange = (day, field, value) => {
		setSchedule((prev) => ({
			...prev,
			[day]: { ...prev[day], [field]: value },
		}));
	};

	const handleNextStep = async () => {
		if (!doctorId.trim()) {
			setError("يرجى إدخال رقم الطبيب");
			return;
		}
		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post("/clinics/check-doctor", {
				doctor_id: doctorId,
			});
			const { status, data } = response.data;
			if (status === "trashed") {
				// CASE: Doctor exists but soft deleted -> Show Restore Prompt
				setFoundDoctorName(data.full_name);
				setShowRestorePrompt(true);
			} else if (status === "active") {
				// CASE: Already active
				setError("هذا الطبيب موجود بالفعل في العيادة.");
			} else {
				// CASE: New Doctor -> Go to Schedule
				setFoundDoctorName(data.full_name);
				setStep(2);
			}
		} catch (err) {
			console.error(err);
			// 5. Handle Errors (Doctor not found)
			if (err.response && err.response.status === 404) {
				setError(
					"لم يتم العثور على طبيب بهذا الرقم. يرجى التحقق من الـ ID."
				);
			} else {
				setError("حدث خطأ أثناء التحقق من بيانات الطبيب.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// --- ACTION: RESTORE DOCTOR ---
	const handleRestore = async () => {
		setIsLoading(true);
		try {
			// Send request to restore. Backend handles logic to keep old schedule.
			const response = await axios.post("/clinics/add-doctor", {
				doctor_id: doctorId,
				weekly_schedule: schedule, // Sending default/empty, backend should ignore/handle
			});

			const newDoctor = {
				id: Date.now(),
				name: foundDoctorName,
				clinic: response.data.data?.specialization || "غير محدد",
				img: defaultImage,
				profile_image_url: null,
				specialty: response.data.data?.specialization,
				doctorId: doctorId,
				clinicId: response.data.data?.clinic_id,
			};

			onAddDoctor(newDoctor);
			onClose();
		} catch (error) {
			console.error(error);
			setError("فشل في استعادة الطبيب");
		} finally {
			setIsLoading(false);
		}
	};

	// --- ACTION: ADD NEW DOCTOR (WITH SCHEDULE) ---
	const handleSubmit = async () => {
		setIsLoading(true);
		setFieldErrors({});
		try {
			const response = await axios.post("/clinics/add-doctor", {
				doctor_id: doctorId,
				weekly_schedule: schedule,
			});

			const newDoctor = {
				id: Date.now(),
				name: foundDoctorName,
				clinic: response.data.data?.specialization || "غير محدد",
				img: defaultImage,
				profile_image_url: null,
				specialty: response.data.data?.specialization,
				doctorId: doctorId,
				clinicId: response.data.data?.clinic_id,
			};

			onAddDoctor(newDoctor);
			onClose();
		} catch (error) {
			console.error(error);
			const errorData = error.response?.data;

			// Process field-specific errors (both overlap and break_time)
			if (
				errorData?.invalid_days &&
				Array.isArray(errorData.invalid_days)
			) {
				const errors = {};
				errorData.invalid_days.forEach((item) => {
					const key = `${item.day}_${item.field}`;
					errors[key] = item.reason;
				});
				setFieldErrors(errors);
			}

			setError(errorData?.message || "فشل في إضافة الطبيب");
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modern-modal-overlay">
			<div className="modern-modal-content">
				{/* Header */}
				<div className="modern-modal-header">
					<h2 className="modern-modal-title">
						{showRestorePrompt
							? "استعادة طبيب"
							: step === 1
							? "إضافة طبيب - الخطوة 1"
							: "تحديد الجدول - الخطوة 2"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Step Indicator */}
				<div className="step-indicator mt-4">
					<div
						className={`step-dot ${step >= 1 ? "active" : ""}`}
					></div>
					<div
						className={`step-dot ${step >= 2 ? "active" : ""}`}
					></div>
				</div>

				{/* Body */}
				<div className="modern-modal-body">
					{error && (
						<div
							ref={mainErrorRef}
							className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium"
						>
							{error}
						</div>
					)}
					{showRestorePrompt ? (
						// --- RESTORE UI ---
						<div className="text-center py-6 animate-fadeIn">
							<div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								الطبيب موجود سابقاً
							</h3>
							<p className="text-gray-600 mb-4">
								تم العثور على <strong>{foundDoctorName}</strong>{" "}
								في سجلات العيادة المحذوفة.
								<br />
								هل تريد استعادة الطبيب مع جدوله الزمني السابق؟
							</p>
						</div>
					) : step === 1 ? (
						// --- STEP 1: DOCTOR ID ---
						<div className="py-8">
							<label className="block text-gray-700 font-bold mb-2">
								رقم تعريف الطبيب (ID)
							</label>
							<input
								type="text"
								value={doctorId}
								onChange={(e) => setDoctorId(e.target.value)}
								className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
								placeholder="أدخل رقم الطبيب (مثال: bfe8101)"
								autoFocus
							/>
							<p className="text-sm text-gray-500 mt-2">
								سيتم البحث عن الطبيب في النظام وإضافته إلى
								عيادتك.
							</p>
						</div>
					) : (
						// --- STEP 2: SCHEDULE ---
						<div className="schedule-container">
							<p className="text-sm text-gray-600 mb-2">
								قم بتفعيل الأيام التي يعمل بها الطبيب{" "}
								<span className="font-bold text-brand">
									{foundDoctorName}
								</span>{" "}
								وحدد ساعات العمل والاستراحة.
							</p>

							{DAYS.map((day) => {
								const isWorking = schedule[day] !== null;

								// Find error for this day (any field: overlap or break_time)
								const dayError = Object.keys(fieldErrors).find(
									(key) => key.startsWith(`${day}_`)
								);
								const isOverlapError =
									dayError?.endsWith("_schedule_overlap");

								return (
									<div
										key={day}
										className={`day-row ${
											isWorking ? "active" : ""
										} ${
											isOverlapError
												? "bg-red-100 border-2 border-red-400"
												: ""
										}`}
									>
										{/* Day Header & Toggle */}
										<div className="day-header">
											<div className="day-label">
												<label className="toggle-switch">
													<input
														type="checkbox"
														className="toggle-input"
														checked={isWorking}
														onChange={() =>
															handleDayToggle(day)
														}
													/>
													<span className="toggle-slider"></span>
												</label>
												<span>{DAY_LABELS[day]}</span>
											</div>
											<span
												className={`text-sm ${
													isWorking
														? "text-blue-600"
														: "text-gray-400"
												}`}
											>
												{isWorking ? "يعمل" : "عطلة"}
											</span>
										</div>

										{/* Time Inputs (Only if working) */}
										{isWorking && (
											<>
												<div className="time-inputs-grid">
													<div className="time-field">
														<label className="time-label">
															بداية الدوام
														</label>
														<input
															type="time"
															className={`time-input ${
																fieldErrors[
																	`${day}_start_time`
																]
																	? "border-2 border-red-500 bg-red-50"
																	: ""
															}`}
															value={
																schedule[day]
																	.start_time
															}
															onChange={(e) =>
																handleTimeChange(
																	day,
																	"start_time",
																	e.target
																		.value
																)
															}
														/>
													</div>
													<div className="time-field">
														<label className="time-label">
															نهاية الدوام
														</label>
														<input
															type="time"
															className={`time-input ${
																fieldErrors[
																	`${day}_end_time`
																]
																	? "border-2 border-red-500 bg-red-50"
																	: ""
															}`}
															value={
																schedule[day]
																	.end_time
															}
															onChange={(e) =>
																handleTimeChange(
																	day,
																	"start_time",
																	e.target
																		.value
																)
															}
														/>
													</div>
													<div className="time-field">
														<label className="time-label">
															بداية الاستراحة
														</label>
														<input
															type="time"
															className={`time-input ${
																fieldErrors[
																	`${day}_break_start`
																]
																	? "border-2 border-red-500 bg-red-50"
																	: ""
															}`}
															value={
																schedule[day]
																	.break_start
															}
															onChange={(e) =>
																handleTimeChange(
																	day,
																	"break_start",
																	e.target
																		.value
																)
															}
														/>
													</div>
													<div className="time-field">
														<label className="time-label">
															نهاية الاستراحة
														</label>
														<input
															type="time"
															className={`time-input ${
																fieldErrors[
																	`${day}_break_end`
																]
																	? "border-2 border-red-500 bg-red-50"
																	: ""
															}`}
															value={
																schedule[day]
																	.break_end
															}
															onChange={(e) =>
																handleTimeChange(
																	day,
																	"break_end",
																	e.target
																		.value
																)
															}
														/>
													</div>
												</div>
												{dayError && (
													<div
														className={`p-3 mt-2 rounded ${
															isOverlapError
																? "bg-red-100 border-r-4 border-red-600"
																: "bg-red-50 border-r-4 border-red-500"
														}`}
													>
														<p
															className={`text-sm font-medium ${
																isOverlapError
																	? "text-red-800"
																	: "text-red-700"
															}`}
														>
															⚠️{" "}
															{
																fieldErrors[
																	dayError
																]
															}
														</p>
													</div>
												)}
											</>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="modern-modal-footer">
					<button
						onClick={onClose}
						className="btn-secondary"
						disabled={isLoading}
					>
						إلغاء
					</button>

					{showRestorePrompt ? (
						<button
							onClick={handleRestore}
							className="btn-primary bg-amber-500 hover:bg-amber-600"
							disabled={isLoading}
						>
							{isLoading
								? "جاري الاستعادة..."
								: "نعم، استعادة الطبيب"}
						</button>
					) : step === 1 ? (
						<button
							onClick={handleNextStep}
							className="btn-primary"
							disabled={!doctorId.trim() || isLoading}
						>
							{isLoading ? "جاري البحث..." : "التالي"}
						</button>
					) : (
						<button
							onClick={handleSubmit}
							className="btn-primary"
							disabled={isLoading}
						>
							{isLoading ? "جاري الحفظ..." : "حفظ وإضافة"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

// --- Main Doctor List Page (Unchanged logic) ---
const ClinicDoctorList = () => {
	const [doctors, setDoctors] = useState([]);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchClinicDoctors();
	}, []);

	const fetchClinicDoctors = async () => {
		try {
			const response = await axios.get("/clinics/get-doctors");
			const clinicDoctors = response.data.data.map((doctor) => ({
				id: doctor.doctor_id,
				name: doctor.full_name,
				clinic: doctor.specialization,
				img: doctor.profile_image_url || defaultImage,
				profile_image_url: doctor.profile_image_url,
				specialty: doctor.specialization,
				doctorId: doctor.user_id,
				clinicId: doctor.clinic_id,
			}));
			setDoctors(clinicDoctors);
		} catch (error) {
			console.error("Error fetching clinic doctors:", error);
			setDoctors([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleManage = (doctor) => {
		console.log("Managing doctor:", doctor);
	};

	const handleAdd = () => setIsAddDialogOpen(true);

	const handleAddDoctor = (newDoctor) => {
		setDoctors((prevDoctors) => [...prevDoctors, newDoctor]);
		fetchClinicDoctors(); // Refresh to ensure data consistency
	};

	const handleDeleteDoctor = (doctorId) => {
		setDoctors((prevDoctors) =>
			prevDoctors.filter((doctor) => doctor.doctorId !== doctorId)
		);
	};

	if (isLoading) return <Loading />;

	if (doctors.length === 0) {
		return (
			<div className="doctor-list-empty">
				<div className="empty-state-container">
					<div className="empty-state-icon">
						<svg
							className="w-16 h-16 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h3 className="empty-state-title">
						لا يوجد أطباء في الوقت الحالي
					</h3>
					<p className="empty-state-message">
						يمكنك إضافة أطباء جدد باستخدام زر "إضافة طبيب" أدناه
					</p>
					<AddDoctorButton onAdd={handleAdd} />
				</div>
				<AddDoctorDialog
					isOpen={isAddDialogOpen}
					onClose={() => setIsAddDialogOpen(false)}
					onAddDoctor={handleAddDoctor}
				/>
			</div>
		);
	}

	return (
		<div className="doctor-list-grid">
			{doctors.map((doctor) => (
				<DoctorCard
					key={doctor.id}
					doctor={doctor}
					onManage={handleManage}
					onDelete={handleDeleteDoctor}
				/>
			))}
			<AddDoctorButton onAdd={handleAdd} />
			<AddDoctorDialog
				isOpen={isAddDialogOpen}
				onClose={() => setIsAddDialogOpen(false)}
				onAddDoctor={handleAddDoctor}
			/>
		</div>
	);
};

export default ClinicDoctorList;
