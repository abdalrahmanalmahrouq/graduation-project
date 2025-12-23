import React,{useEffect,useState} from 'react';
import { Link,useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../Authentication/AuthLayout';
import PasswordInput from '../Authentication/PasswordInput';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
export default function PatientRegister() {

        
        // state variables

        const [full_name,setFullName]=useState('');
        const [email,setEmail]=useState('');
        const [phone_number,setPhoneNumber]=useState('');
        const [date_of_birth,setDate]=useState('');
        const [address,setAddress]=useState('');
        const [insurance,setInsurance]=useState('');
        const [password,setPassword]=useState('');
        const [password_confirmation,setConfirmPassword]=useState('');
        const [message, setMessage] = useState('');
        const navigate = useNavigate();
        const location = useLocation();
        const [errors, setErrors] = useState({});
        const [loading,setLoading]=useState(false);
        const [insuranceOptions, setInsuranceOptions] = useState([]);
        const [isLoadingInsurances, setIsLoadingInsurances] = useState(false);
        const [insuranceFetchError, setInsuranceFetchError] = useState('');

        useEffect(() => {
            let isMounted = true;

            const fetchInsurances = async () => {
                setIsLoadingInsurances(true);
                setInsuranceFetchError('');

                try {
                    const response = await axios.get('/insurances');
                    if (!isMounted) {
                        return;
                    }

                    const rawOptions = Array.isArray(response.data?.data) ? response.data.data : [];
                    const normalizedOptions = rawOptions.map((option) => {
                        if (typeof option === 'string') {
                            return { insurance_id: option, name: option };
                        }
                        return option;
                    });
                    setInsuranceOptions(normalizedOptions);
                } catch (error) {
                    if (!isMounted) {
                        return;
                    }
                    console.error('Failed to fetch insurance options:', error);
                    setInsuranceOptions([]);
                    setInsuranceFetchError('تعذّر تحميل شركات التأمين، حاول مرة أخرى لاحقاً.');
                } finally {
                    if (isMounted) {
                        setIsLoadingInsurances(false);
                    }
                }
            };

            fetchInsurances();

            return () => {
                isMounted = false;
            };
        }, []);


        if(localStorage.getItem('token')){
                return <Navigate to='/' />
            }


        const formSubmit = (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage('');
            const data = {
              full_name,
              email,
              phone_number,
              date_of_birth,
              address,
              insurance,
              password,
              password_confirmation
            };
        
              axios.post('/register/patient',data)
                .then((response)=>{
                  console.log(response);
                  setLoading(false);
                  if(response.status === 200){
                    const params = new URLSearchParams(location.search);
                    const redirect = params.get('redirect');
                    const target = redirect ? `/login/patient?redirect=${encodeURIComponent(redirect)}` : '/login/patient';
                    navigate(target);
                  }
        
                })
                .catch((error) => {
                console.log(error);
                setLoading(false);
                if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
                } else {
                setMessage("فشل في تسجيل المريض");
                }
                });
            }
        

        return (
        <AuthLayout title="إنشاء حساب المريض">
                <form dir='rtl' className='mt-3' onSubmit={formSubmit}>
                        <div className="form-group mt-4">
                                
                                <label htmlFor="fullName">الاسم الكامل</label>
                                <input type="text" className="form-control" placeholder="Khalid Mohesn" name='full_name' required
                                onChange={(e)=>setFullName(e.target.value)} />
                                {errors.full_name && <small className="text-danger">{errors.full_name[0]}</small>}
                        </div>
                        <div className="form-group mt-4">
                                <label htmlFor="email">البريد الإلكتروني</label>
                                <input type="email" className="form-control" name='email' placeholder="example@gmail.com" required
                                onChange={(e)=>setEmail(e.target.value)} />
                                <small id="emailHelp" className="form-text text-muted"></small>
                                {errors.email && <small className="text-danger">{errors.email[0]}</small>}
                        </div>
                        <div className="form-group mt-4">
                                <label htmlFor="mobileNumber">رقم الهاتف</label>
                                <input type="text" className="form-control" placeholder="0790011222" name='phone_number' required
                                onChange={(e)=>setPhoneNumber(e.target.value)} />
                                {errors.phone_number && <small className="text-danger">{errors.phone_number[0]}</small>}
                        </div>
                        <div className="form-group mt-4">
                                <label htmlFor="birthDate">تاريخ الميلاد</label>
                                <input type="date" className="form-control" name='date_of_birth' required
                                onChange={(e)=>setDate(e.target.value)} />
                                {errors.date_of_birth && <small className="text-danger">{errors.date_of_birth[0]}</small>}
                        </div>
                        <div className="form-group mt-4">
                                <label htmlFor="address">العنوان</label>
                                <input type="text" className="form-control" placeholder="amman" name='address' required
                                onChange={(e)=>setAddress(e.target.value)} />
                                {errors.address && <small className="text-danger">{errors.address[0]}</small>}
                        </div>
                         <div className="form-group mt-4">
                                <label htmlFor="insurance">التأمين</label>
                                <select 
                                className="form-control" 
                                id="insurance"
                                name="insurance"
                                value={insurance}
                                onChange={(e)=>setInsurance(e.target.value)}
                                disabled={isLoadingInsurances}
                                >
                                        <option value="">اختر شركة التأمين</option>
                                        {insuranceOptions.map((option) => (
                                                <option key={option.insurance_id ?? option.name} value={option.name}>
                                                        {option.name}
                                                </option>
                                        ))}
                                </select>
                                {isLoadingInsurances && <small className="text-muted">جارٍ تحميل شركات التأمين...</small>}
                                {insuranceFetchError && <small className="text-danger d-block mt-1">{insuranceFetchError}</small>}
                                {errors.insurance && <small className="text-danger d-block mt-1">{errors.insurance[0]}</small>}
                        </div>
                        <PasswordInput
                                label="كلمة المرور"
                                name="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور"
                                error={errors.password}
                                required
                                className="mt-4"
                        />
                        <PasswordInput
                                label="تأكيد كلمة المرور"
                                name="password_confirmation"
                                value={password_confirmation}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                placeholder="أعد إدخال كلمة المرور"
                                error={errors.password_confirmation}
                                required
                                className="mt-4"
                        />
                        
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'جاري التسجيل...' : 'تسجيل'}
                        </button>
                        <br />
            <div className='pb-3 mt-2'>
              لديك حساب؟{' '}
              <Link
                to={`/login/patient${location.search ? location.search : ''}`}
                className='links-buttons-underline '
              >
                تسجيل الدخول
              </Link>
            </div>
        </form>
        </AuthLayout>
        );
}



                        
                        

                   
