import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import CountUp from 'react-countup';
import axios from 'axios';
import Loading from '../Loading';
import { motion } from 'framer-motion';
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [patientsCount, setPatientsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [insurancesCount, setInsurancesCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [nameInsurancesCompanies, setNameInsurancesCompanies] = useState([]);
  const [idInsurancesCompanies, setIdInsurancesCompanies] = useState([]);
  const [namePatients, setNamePatients] = useState([]);
  const [idPatients, setIdPatients] = useState([]);
  const [phonePatients, setPhonePatients] = useState([]);
  const [profileImagePatients, setProfileImagePatients] = useState([]);
  const clinicName = JSON.parse(localStorage.getItem('user')).profile.clinic_name;

  useEffect(() => {
    fetchUsersCount()
    fetchFiveInsurancesCompanies()
    fetchFivePatients()
    
  }, []);

  const fetchUsersCount = async () => {
    try {
      const response = await axios.get('/clinic/dashboard');
      const data = response.data.data;
      setPatientsCount(data.patientsCount);
      setDoctorsCount(data.doctorsCount);
      setInsurancesCount(data.insurancesCount);
      setAppointmentsCount(data.appointmentsCount);
    } catch (error) {
      console.error('Error fetching users count:', error);
    }
    finally{
      setLoading(false);
    }
  };

  const fetchFiveInsurancesCompanies = async () => {
    try {
      const response = await axios.get('/clinic/get-five-insurances-companies');
      const data = response.data.data;
      setNameInsurancesCompanies(data.map(insurance => insurance.name));
      setIdInsurancesCompanies(data.map(insurance => insurance.insurance_id));
    }catch(error){
      console.error('Error fetching five insurances companies:', error);
    }
    finally{
      setLoading(false);
    }
  };

  const fetchFivePatients = async () => {
    try { 
      const response = await axios.get('/clinic/get-five-patients');
      const data = response.data.data;
      setNamePatients(data.map(patient => patient.full_name));
      setIdPatients(data.map(patient => patient.user_id));
      setPhonePatients(data.map(patient => patient.phone_number));
      setProfileImagePatients(data.map(patient => patient.user.profile_image));
    }catch(error){
      console.error('Error fetching five patients:', error);
    }
    finally{
      setLoading(false);
    }
  };

  const deviceData = [
    { name: 'المرضى', value: patientsCount, color: 'var(--default-color)' },
    { name: 'الاطباء', value: doctorsCount, color: '#10B981' },
    { name: 'شركات التأمين', value: insurancesCount, color: 'var(--accent-color)' }
  ];

  const conversionData = [
    { month: 'Jan', rate: 2.3 },
    { month: 'Feb', rate: 2.8 },
    { month: 'Mar', rate: 3.1 },
    { month: 'Apr', rate: 3.5 },
    { month: 'May', rate: 3.2 },
    { month: 'Jun', rate: 3.8 }
  ];

  
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title"> لوحة تحكم العيادة</h1>
        <p className="dashboard-subtitle">
        <span className="wave">👋</span> أهلاً وسهلاً بك في لوحة التحكم الخاصة بـ <strong>{clinicName}</strong>،  
        نتمنى لك يوماً مثمراً مليئاً بالنجاح .
        </p>
      </header>
      
      {
        loading ? (
          <Loading />
        ) : (
          <div>
          {/* Key Metrics */}
          <div className="dashboard-stats">
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-title">المرضى المسجلين</p>
              <h3 className="dashboard-stat-value pt-3"><CountUp end={patientsCount} duration={0.7} /></h3>
              <p className="dashboard-trend up">عدد المرضى المسجلين في العيادة</p>
            </div>
    
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-title">الاطباء المسجلين</p>
              <h3 className="dashboard-stat-value pt-3"><CountUp end={doctorsCount} duration={0.7} /></h3>
              <p className="dashboard-trend up">عدد الاطباء المسجلين في العيادة</p>
            </div>
    
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-title">المواعيد</p>
              <h3 className="dashboard-stat-value pt-3"><CountUp end={appointmentsCount} duration={0.7} /></h3>
              <p className="dashboard-trend up">عدد المواعيد المحجوزة في العيادة</p>
            </div>
    
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-title">شركات التأمين</p>
              <h3 className="dashboard-stat-value pt-3"><CountUp end={insurancesCount} duration={0.7} /></h3>
              <p className="dashboard-trend up">عدد شركات التأمين المسجلة في العيادة</p>
            </div>
          </div>
    
          {/* Charts */}
          <div className="dashboard-charts">
          <motion.div className="dashboard-table-card mt-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay:0,
              ease:'easeInOut',
           }}
          >
            <h3 className="dashboard-table-title">  مرضى مسجلين في العيادة </h3>
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                   
                    <th>صورة المريض</th>
                    <th>معرف المريض</th>
                    <th>اسم المريض</th>
                    <th>رقم الهاتف</th>
                    
                  </tr>
                </thead>
                <tbody>
                    {namePatients.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          لا يوجد مرضى مسجلين في العيادة
                        </td>
                      </tr>
                    ) : (
                            namePatients.map((name, index) => (
                              <tr key={index}>
                                <td>
                                  <img
                                    src={
                                      profileImagePatients[index]
                                        ? `/storage/${profileImagePatients[index]}`
                                        : "/default-profile.png"
                                    }
                                    alt="Profile"
                                    className="doctor-all-appointments-card__avatar"
                                  />
                                </td>
                                <td>{idPatients[index]}</td>
                                <td>{name}</td>
                                <td>{phonePatients[index]}</td>
                              </tr>
                            ))
                          )}
</tbody>
              </table>
            </div>
          </motion.div>
    
            <motion.div className="dashboard-chart-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
             
              transition={{ 
                duration: 1,
                delay:0,
                ease:'easeInOut',
             }}
            >
              <h3 className="dashboard-chart-title">توزيع المرضى و الاطباء و شركات التأمين</h3>
              <div className="dashboard-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            </div>
    
          {/* Conversion Line Chart */}
          {/* <motion.div className="dashboard-chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="dashboard-chart-title">Monthly Conversion Rate</h3>
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 5]} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Conversion Rate']} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div> */}
    
          {/* Top Pages Table */}
          <motion.div className="dashboard-table-card mt-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay:0.5,
              ease:'easeInOut',
           }}
          >
            <h3 className="dashboard-table-title"> خمس شركات تأمين مسجلة في العيادة </h3>
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                   
                    <th>رقم شركة التأمين</th>
                    <th>اسم شركة التأمين</th>
                  </tr>
                </thead>
                <tbody>
                  {nameInsurancesCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="2">لا يوجد شركات تأمين مسجلة في العيادة</td>
                    </tr>
                  ) : (
                    nameInsurancesCompanies.map((name, index) => (
                      <tr key={index}>
                        <td>{idInsurancesCompanies[index]}</td>
                        <td>{name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
        )
      }

      
    </div>
  );
}
