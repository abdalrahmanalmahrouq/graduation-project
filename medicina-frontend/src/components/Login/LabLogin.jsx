import React, {useState} from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom'
import AuthLayout from '../AuthLayout';
import axios from 'axios';

export default function LabLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Check if already logged in
  if(localStorage.getItem('token')){
    return <Navigate to='/lab/account' />
  }

  const formSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = {
      email,
      password,
    };

    axios.post('/login',data)
      .then((response)=>{
        // ✅ Fetch complete profile data FIRST (without storing token yet)
        axios.get('/profile', {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        })
        .then((profileResponse) => {
          // ✅ Validate role matches the login form BEFORE storing anything
          if (profileResponse.data.role !== 'lab') {
            setMessage(`يجب تسجيل الدخول من صفحة ${profileResponse.data.role === 'patient' ? 'المريض' : profileResponse.data.role === 'clinic' ? 'العيادة' : profileResponse.data.role === 'doctor' ? 'الطبيب' : profileResponse.data.role}`);
            setLoading(false);
            return;
          }
          
          // ✅ Only store data if role is correct
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('user', JSON.stringify(profileResponse.data));
          navigate('/lab/account');
        })
        .catch((profileError) => {
          console.error('Failed to fetch profile:', profileError);
          setMessage("فشل في تحميل بيانات الملف الشخصي");
          setLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            // Validation errors
            setErrors(error.response.data.errors);
          } else if (error.response.data.message) {
            // General errors (like invalid credentials)
            setMessage(error.response.data.message);
          } else {
            setMessage("فشل في تسجيل الدخول");
          }
        } else {
          setMessage("فشل في تسجيل الدخول");
        }
      });
  }

  return (
    <AuthLayout title="تسجيل المختبر">
      <form dir="rtl" onSubmit={formSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="mt-3">البريد الإلكتروني</label>
                <input type="email" className="form-control mt-2" name="email" placeholder="example@gmail.com" required 
                onChange={(e) => setEmail(e.target.value)} />
              </div>
      
              <div className="form-group">
                <label htmlFor="password" className="mt-2">كلمة المرور</label>
                <input type="password" className="form-control mt-2" name="password" placeholder="أدخل كلمة المرور" required 
                onChange={(e) => setPassword(e.target.value)} />
                {message && <div className="text-danger pt-2 text-sm">{message}</div>}
              </div>
      
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'جاري التسجيل...' : 'تسجيل'}
              </button>
              <br />
              <div className="mt-2">
                نسيت كلمة المرور؟ <Link to="/forget/password" className="links-buttons-underline">نسيت</Link>
              </div>
              <div className="pb-3 mt-1">
                مستخدم جديد؟ <Link to="/register/lab" className="links-buttons-underline">إنشاء حساب</Link>
              </div>
            </form>
    </AuthLayout>
  );
}




