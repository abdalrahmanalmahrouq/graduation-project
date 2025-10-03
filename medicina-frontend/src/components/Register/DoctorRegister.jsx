import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom'
import AuthLayout from '../AuthLayout';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
export default function DoctorRegister() {

        const [full_name,setFullName]=useState('');
        const [email,setEmail]=useState('');
        const [phone_number,setPhoneNumber]=useState('');
        const [password,setPassword]=useState('');
        const [specialization,setSpecialization]=useState('');
        const [password_confirmation,setConfirmPassword]=useState('');
        const [message,setMessage]=useState('');
        const [errors,setErrors]=useState('');
        const navigate=useNavigate()
        const [loading,setLoading]=useState(false);

        if(localStorage.getItem('token')){
                return <Navigate to='/' />
            }




        const formSubmit=(e)=>{
                e.preventDefault();
                setLoading(true);
                setMessage('');
                const data = {
                      full_name,
                      email,
                      phone_number,
                      password,
                      password_confirmation,
                      specialization
                    };

                axios.post('/register/doctor',data)
                .then((response)=>{
                          console.log(response);
                          setLoading(false);
                          if(response.status === 200){
                            navigate('/login/doctor');
                          }
                })
                .catch((error)=>{
                        console.log(error);
                        setLoading(false);
                        if(error.response && error.response.data && error.response.data.errors){
                                setErrors(error.response.data.errors)
                        }
                        else{
                                setMessage('فشل في تسجيل الطبيب')
                        }
                });
        }
  return (
    <AuthLayout title="إنشاء حساب الطبيب" >
    <form dir='rtl' className='mt-3' onSubmit={formSubmit}>
                <div className="form-group mt-4">
                        
                        <label htmlFor="fullName">الاسم الكامل</label>
                        <input type="text" className="form-control" placeholder="Ahmad Omar" name='full_name' required 
                        onChange={(e)=>setFullName(e.target.value)}/>
                        {errors.full_name && <div className="text-sm text-danger">{errors.full_name[0]}</div>}
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input type="email" className="form-control" name='email' placeholder="example@gmail.com" required
                        onChange={(e)=>setEmail(e.target.value)} />
                        {errors.email && <div className="text-sm text-danger">{errors.email[0]}</div>}

                </div>
                <div className="form-group mt-4">
                        <label htmlFor="mobileNumber">رقم الهاتف</label>
                        <input type="text" className="form-control" placeholder="0790011222" name='phone_number' required
                        onChange={(e)=>setPhoneNumber(e.target.value)} />
                        {errors.phone_number && <div className="text-sm text-danger">{errors.phone_number[0]}</div>}

                </div>
                <div className="form-group mt-4">
                        <label htmlFor="specialization">التخصص</label>
                        <select className="form-control" name='specialization' required onChange={(e)=>setSpecialization(e.target.value)} searchable={true}>
                        <option value="">اختر التخصص</option>
                        <option value="اخصائي طب عام">اخصائي طب عام</option>
                        <option value="اخصائي طب نفسي">اخصائي طب نفسي</option>
                        <option value="اخصائي قلب">اخصائي قلب</option>
                        <option value="اخصائي عظام">اخصائي عظام</option>
                        <option value="اخصائي جلدية">اخصائي جلدية</option>
                        <option value="اخصائي جراحة">اخصائي جراحة</option>
                        <option value="اخصائي طب عقلي">اخصائي طب عقلي</option>
                        <option value="اخصائي اسنان">اخصائي اسنان</option>
                        
                      </select>
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="password">كلمة المرور</label>
                        <input type="password" className="form-control" name='password' placeholder="أدخل كلمة المرور" required
                        onChange={(e)=>setPassword(e.target.value)} />
                        {errors.password && <div className="text-sm text-danger">{errors.password[0]}</div>}

                </div>
                <div className="form-group mt-4">
                        <label htmlFor="passwordConfirmation">تأكيد كلمة المرور</label>
                        <input type="password" className="form-control" name='password_confirmation' placeholder="أعد إدخال كلمة المرور" required
                        onChange={(e)=>setConfirmPassword(e.target.value)} />
                         {errors.password_confirmation && <div className="text-sm text-danger">{errors.password_confirmation[0]}</div>}

                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? 'جاري التسجيل...' : 'تسجيل'}
             </button>
                <br />
                <div className='pb-3 mt-2'>   لديك حساب؟ <Link to='/login/doctor' className='links-buttons-underline'>تسجيل الدخول</Link></div>
</form>
    </AuthLayout>
  );
}



                        
                        