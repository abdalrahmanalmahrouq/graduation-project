// components/AuthLogin.jsx
import authimg from '../assets/img/authimage.png'
export default function AuthLogin({ children, title }) {
  return (
    <div data-aos="fade-up" data-aos-delay="200" className="min-h-screen flex justify-center items-center auth-background">
  <div className="flex flex-col md:flex-row w-full max-w-5xl p-6 mt-14 gap-x-8 ">
    {/* Side image or illustration */}
    <div className="hidden lg:flex flex-1 items-start justify-center  rounded-3xl ">
      {/* optional image or info */}
        <img src={authimg} alt="" className="w-[500px] h-[500px] object-contain max-w-none" />
    </div>

    {/* Form box */}
    <div className="flex flex-col justify-center items-center flex-1 form-box">
      <div className="w-full max-w-[400px] px-4 sm:px-6">
        <h3 className="form-title text-center">{title}</h3>
        {children}
      </div>
    </div>
  </div>
</div>

  );
}
