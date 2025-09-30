import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom'
import AuthLayout from '../AuthLayout';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
export default function ClinicRegister() {

        const[clinic_name,setClinicName]=useState('');
        const [email,setEmail]=useState('');
        const [phone_number,setPhoneNumber]=useState('');
        const [address,setAddress]=useState('');
        const [password,setPassword]=useState('');
        const [password_confirmation,setConfirmPassword]=useState('');
        const [message, setMessage] = useState('');
        const navigate = useNavigate();
        const [errors, setErrors] = useState({});
        const [loading,setLoading]=useState(false);

        if(localStorage.getItem('token')){
                return <Navigate to='/' />
            }



        const formSubmit = (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setMessage('');
                    const data = {
                      clinic_name,
                      email,
                      phone_number,
                      address,
                      password,
                      password_confirmation
                    };
                
                      axios.post('/register/clinic',data)
                        .then((response)=>{
                          console.log(response);
                          setLoading(false);
                
                          if(response.status === 200){
                            navigate('/login/clinic');
                          }
                
                        })
                        .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        if (error.response && error.response.data && error.response.data.errors) {
                        setErrors(error.response.data.errors);
                        } else {
                        setMessage("فشل في تسجيل العيادة");
                        }
                        });
        }

  return (
    <AuthLayout title="إنشاء حساب العيادة" >
     <form dir='rtl' className='mt-3' onSubmit={formSubmit}>
                <div className="form-group mt-4">
                        
                        <label htmlFor="fullName">اسم العيادة</label>
                        <input type="text" className="form-control" placeholder="alzayedclinic" name='clinic_name' required
                        onChange={(e)=>setClinicName(e.target.value)} />
                        {errors.clinic_name && <small className="text-danger">{errors.clinic_name[0]}</small>}
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input type="email" className="form-control" name='email' placeholder="example@gmail.com" required 
                        onChange={(e)=>setEmail(e.target.value)}/>
                        {errors.email && <small className="text-danger">{errors.email[0]}</small>}
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="mobileNumber">رقم الهاتف</label>
                        <input type="text" className="form-control" placeholder="0790011222" name='phone_number' required 
                        onChange={(e)=>setPhoneNumber(e.target.value)}/>
                        {errors.phone_number && <small className="text-danger">{errors.phone_number[0]}</small>}
                </div>
                
                <div className="form-group mt-4">
                        <label htmlFor="address">العنوان</label>
                        <input type="text" className="form-control" placeholder="amman" name='address' required 
                        onChange={(e)=>setAddress(e.target.value)}/>
                        {errors.address && <small className="text-danger">{errors.address[0]}</small>}
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="password">كلمة المرور</label>
                        <input type="password" className="form-control" name='password' placeholder="أدخل كلمة المرور" required
                        onChange={(e)=>setPassword(e.target.value)} />
                        {errors.password && <small className="text-danger">{errors.password[0]}</small>}
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="passwordConfirmation">تأكيد كلمة المرور</label>
                        <input type="password" className="form-control" name='password_confirmation' placeholder="أعد إدخال كلمة المرور" required 
                        onChange={(e)=>setConfirmPassword(e.target.value)}/>
                        {errors.password_confirmation && <small className="text-danger">{errors.password_confirmation[0]}</small>}
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? 'جاري التسجيل...' : 'تسجيل'}
             </button>
                <br />
                <div className='pb-3 mt-2'>   لديك حساب؟ <Link to='/login/clinic' className='links-buttons-underline'>تسجيل الدخول</Link></div>
</form>
    </AuthLayout>
  );
}


