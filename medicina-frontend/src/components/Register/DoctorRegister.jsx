import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Authentication/AuthLayout";
import PasswordInput from "../Authentication/PasswordInput";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function DoctorRegister() {
	const [full_name, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [consultation_duration, setConsultaionDuration] = useState("");
	const [password, setPassword] = useState("");
	const [password_confirmation, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	if (localStorage.getItem("token")) {
		return <Navigate to="/" />;
	}

	const formSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		const data = {
			full_name,
			email,
			phone_number,
			specialty,
			consultation_duration,
			password,
			password_confirmation,
		};

		axios
			.post("/register/doctor", data)
			.then((response) => {
				console.log(response);
				setLoading(false);
				if (response.status === 200) {
					navigate("/login/doctor");
				}
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				if (
					error.response &&
					error.response.data &&
					error.response.data.errors
				) {
					setErrors(error.response.data.errors);
				} else {
					setMessage("فشل في تسجيل الطبيب");
				}
			});
	};
	return (
		<AuthLayout title="إنشاء حساب الطبيب">
			<form dir="rtl" className="mt-3" onSubmit={formSubmit}>
				<div className="form-group mt-4">
					<label htmlFor="fullName">الاسم الكامل</label>
					<input
						type="text"
						className="form-control"
						placeholder="Ahmad Omar"
						name="full_name"
						required
						onChange={(e) => setFullName(e.target.value)}
					/>
					{errors.full_name && (
						<div className="text-sm text-danger">
							{errors.full_name[0]}
						</div>
					)}
				</div>
				<div className="form-group mt-4">
					<label htmlFor="email">البريد الإلكتروني</label>
					<input
						type="email"
						className="form-control"
						name="email"
						placeholder="example@gmail.com"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
					{errors.email && (
						<div className="text-sm text-danger">
							{errors.email[0]}
						</div>
					)}
				</div>
				<div className="form-group mt-4">
					<label htmlFor="mobileNumber">رقم الهاتف</label>
					<input
						type="text"
						className="form-control"
						placeholder="0790011222"
						name="phone_number"
						required
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
					{errors.phone_number && (
						<div className="text-sm text-danger">
							{errors.phone_number[0]}
						</div>
					)}
				</div>
				<div className="form-group mt-4">
					<label htmlFor="specialty">التخصص</label>
					<select
						className="form-control"
						name="specialty"
						required
						onChange={(e) => setSpecialty(e.target.value)}
					>
						<option value="اخصائي اطفال">اخصائي اطفال</option>
						<option value="اخصائي عيون">اخصائي عيون</option>
						<option value="اخصائي قلب">اخصائي قلب</option>
						<option value="اخصائي عظام">اخصائي عظام</option>
						<option value="اخصائي جلدية">اخصائي جلدية</option>
						<option value="اخصائي باطنية">اخصائي باطنية</option>
						<option value="اخصائي طب نسائية">
							اخصائي طب نسائية
						</option>
						<option value="اخصائي اسنان">اخصائي اسنان</option>
						<option value="اخصائي جهاز تنفسي">
							اخصائي جهاز تنفسي
						</option>
						<option value="اخصائي جهاز هضمي">
							اخصائي جهاز هضمي
						</option>
						<option value="اخصائي انف اذن و حنجرة">
							اخصائي انف اذن و حنجرة
						</option>
						<option value="اخصائي اعصاب">اخصائي اعصاب</option>
					</select>
				</div>

				<div className="form-group mt-4">
					<label htmlFor="consultation_duration">
						{" "}
						مدة الاستشارة
					</label>
					<input
						type="number"
						min={10}
						max={60}
						step={5}
						className="form-control"
						placeholder="30 (الوقت بالدقيقة)"
						name="consultation_duration"
						required
						onChange={(e) => setConsultaionDuration(e.target.value)}
					/>
					{errors.consultation_duration && (
						<div className="text-sm text-danger">
							{errors.consultation_duration[0]}
						</div>
					)}
				</div>

				<PasswordInput
					label="كلمة المرور"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="أدخل كلمة المرور"
					error={errors.password}
					required
					className="mt-4"
				/>
				<PasswordInput
					label="تأكيد كلمة المرور"
					name="password_confirmation"
					value={password_confirmation}
					onChange={(e) => setConfirmPassword(e.target.value)}
					placeholder="أعد إدخال كلمة المرور"
					error={errors.password_confirmation}
					required
					className="mt-4"
				/>

				<button
					type="submit"
					className="btn btn-primary"
					disabled={loading}
				>
					{loading ? "جاري التسجيل..." : "تسجيل"}
				</button>
				<br />
				<div className="pb-3 mt-2">
					{" "}
					لديك حساب؟{" "}
					<Link
						to="/login/doctor"
						className="links-buttons-underline"
					>
						تسجيل الدخول
					</Link>
				</div>
			</form>
		</AuthLayout>
	);
}
