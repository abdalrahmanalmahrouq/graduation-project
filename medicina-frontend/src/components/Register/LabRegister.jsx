import { Link } from 'react-router-dom'
import AuthLayout from '../AuthLayout';

export default function LabRegister() {
  return (
    <AuthLayout title="إنشاء حساب المختبر">
    <form dir='rtl' className='mt-3'>
                <div className="form-group mt-4">
                        
                        <label htmlFor="fullName">الاسم الكامل</label>
                        <input type="text" className="form-control" placeholder="MedLab" name='fullName' required />
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input type="email" className="form-control" name='email' placeholder="example@gmail.com" required />
                        <small id="emailHelp" className="form-text text-muted"></small>
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="mobileNumber">رقم الهاتف</label>
                        <input type="text" className="form-control" placeholder="0790011222" name='mobileNumber' required />
                </div>
                
                <div className="form-group mt-4">
                        <label htmlFor="address">العنوان</label>
                        <input type="text" className="form-control" placeholder="amman" name='address' required />
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="password">كلمة المرور</label>
                        <input type="password" className="form-control" name='password' placeholder="أدخل كلمة المرور" required />
                </div>
                <div className="form-group mt-4">
                        <label htmlFor="passwordConfirmation">تأكيد كلمة المرور</label>
                        <input type="password" className="form-control" name='passwordConfirmation' placeholder="أعد إدخال كلمة المرور" required />
                </div>
                
                <button className='btn btn-primary mt-2'>  <Link to='' className='links-buttons'  >تسجيل</Link> </button>
                <br />
                <div className='pb-3 mt-2'>   لديك حساب؟ <Link to='/login/lab' className='links-buttons-underline'>تسجيل الدخول</Link></div>
</form>
    </AuthLayout>
  );
}



                        
                        
                        
                        