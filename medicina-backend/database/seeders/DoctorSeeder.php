<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\User;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get doctor users and create matching doctor records
        $doctorUsers = User::where('role', 'doctor')->get();

        foreach ($doctorUsers as $user) {
            $doctorData = [];
            
            // Match doctor data based on email
            switch ($user->email) {
                // ================================
                //      DOCTOR DATA SEEDER
                // ================================

                case 'fatima@example.com':
                    $doctorData = [
                        'user_id' => $user->id,
                        'full_name' => 'Dr. Fatima Hassan',
                        'phone_number' => '0798002301',
                        'specialization' => 'اخصائي اطفال',
                        'bio' => 'د. فاطمة حسن متخصصة في طب الأطفال بخبرة واسعة في متابعة نمو الأطفال وتشخيص الأمراض الشائعة. تتميز بأسلوب لطيف مع الأطفال وحرص كبير على التواصل مع الأهل لضمان رعاية صحية متكاملة.',
                        'consultation_duration' => 25,
                    ];
                    break;

                case 'omar@example.com':
                $doctorData = [
                    'user_id' => $user->id,
                    'full_name' => 'Dr. Omar hussain',
                    'phone_number' => '0798002302',
                    'specialization' => 'اخصائي قلب',
                    'bio' => 'د. عمر حسين متخصص في أمراض القلب بخبرة واسعة في تشخيص وعلاج أمراض القلب المختلفة. يتميز بأسلوب مهني وإنساني في التعامل مع المرضى.',
                    'consultation_duration' => 25,
                ];
                break;
                case 'ali@example.com':
                $doctorData = [
                    'user_id' => $user->id,
                    'full_name' => 'Dr. Ali Saleh',
                    'phone_number' => '0798002303',
                    'specialization' => 'اخصائي اعصاب',
                    'bio' => 'د. علي صالح متخصص في أمراض الأعصاب بخبرة واسعة في تشخيص وعلاج الأمراض العصبية المختلفة. يتميز بأسلوب مهني وإنساني في التعامل مع المرضى.',
                    'consultation_duration' => 25,
                ];
                break;

                // case 'sami44@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Sami Khaled',
                //         'phone_number' => '0798441201',
                //         'specialization' => 'اخصائي اطفال',
                //         'bio' => 'د. سامي خالد يمتلك خبرة تفوق 10 سنوات في طب الأطفال، ويهتم بعلاج الربو، الحساسية، ومشاكل المناعة عند الأطفال. يقدم رعاية مميزة تجمع بين المهنية والإنسانية.',
                //         'consultation_duration' => 40,
                //     ];
                //     break;

                // case 'lina82@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Lina Saeed',
                //         'phone_number' => '0798821402',
                //         'specialization' => 'اخصائي اطفال',
                //         'bio' => 'د. لينا سعيد خبيرة في الأمراض التنفسية والهضمية عند الأطفال، وتحرص على تقديم استشارات دقيقة للأمهات لمتابعة صحة أطفالهن.',
                //         'consultation_duration' => 15,
                //     ];
                //     break;

                // --------------------------------
                // Ophthalmology - عيون
                // --------------------------------

                // case 'mahmoud11@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Mahmoud Khaleel',
                //         'phone_number' => '0798111101',
                //         'specialization' => 'اخصائي عيون',
                //         'bio' => 'د. محمود خليل متخصص في علاج مشاكل الإبصار، الحول، وجفاف العين. يقدم خدمات تشخيص دقيقة باستخدام أحدث الأجهزة الطبية.',
                //         'consultation_duration' => 20,
                //     ];
                //     break;

                // case 'rana37@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Rana Mohsen',
                //         'phone_number' => '0798373702',
                //         'specialization' => 'اخصائي عيون',
                //         'bio' => 'د. رنا محسن تحمل خبرة عميقة في علاج أمراض الشبكية وتصحيح النظر. تتعامل مع المرضى باهتمام كبير لضمان أفضل نتائج.',
                //         'consultation_duration' => 30,
                //     ];
                //     break;

                // case 'ahmad58@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ahmad Yasin',
                //         'phone_number' => '0798584203',
                //         'specialization' => 'اخصائي عيون',
                //         'bio' => 'د. أحمد ياسين متخصص في فحص النظر والعمليات البسيطة للعيون، ويتميز بدقته وشغفه بتقديم رعاية صحية مثالية.',
                //         'consultation_duration' => 50,
                //     ];
                //     break;

                // --------------------------------
                // Cardiology - قلب
                // --------------------------------

                // case 'omar07@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Omar Suliman',
                //         'phone_number' => '0798070701',
                //         'specialization' => 'اخصائي قلب',
                //         'bio' => 'د. عمر سليمان متخصص في طب وجراحة القلب، ويملك خبرة طويلة في تشخيص اضطرابات القلب وعلاجها باستخدام أحدث التقنيات.',
                //         'consultation_duration' => 35,
                //     ];
                //     break;

                // case 'nour92@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Nour Hammad',
                //         'phone_number' => '0798929202',
                //         'specialization' => 'اخصائي قلب',
                //         'bio' => 'د. نور حماد تتمتع بخبرة في علاج أمراض الشرايين وضغط الدم، وتعمل على تقديم استشارات دقيقة للمرضى لضمان صحة قلبية أفضل.',
                //         'consultation_duration' => 45,
                //     ];
                //     break;

                // case 'hala16@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Hala Adnan',
                //         'phone_number' => '0798161603',
                //         'specialization' => 'اخصائي قلب',
                //         'bio' => 'د. هلا عدنان خبيرة في متابعة حالات القلب المزمنة واضطرابات النبض، وتقدم رعاية شاملة باستخدام خطط علاجية محدثة.',
                //         'consultation_duration' => 55,
                //     ];
                //     break;

                // --------------------------------
                // Orthopedics - عظام
                // --------------------------------

                // case 'firas88@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Firas Ali',
                //         'phone_number' => '0798888101',
                //         'specialization' => 'اخصائي عظام',
                //         'bio' => 'د. فراس علي متخصص في إصابات العظام والكسور وعلاج آلام المفاصل. يمتلك خبرة واسعة في جراحة العظام والعلاج التحفظي.',
                //         'consultation_duration' => 45,
                //     ];
                //     break;

                // case 'tasneem41@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Tasneem Sameer',
                //         'phone_number' => '0798414102',
                //         'specialization' => 'اخصائي عظام',
                //         'bio' => 'د. تسنيم سمير متخصصة في علاج آلام الظهر والعمود الفقري والانزلاق الغضروفي باستخدام أحدث طرق التقييم والعلاج.',
                //         'consultation_duration' => 20,
                //     ];
                //     break;

                // case 'khaled05@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Khaled Waleed',
                //         'phone_number' => '0798050503',
                //         'specialization' => 'اخصائي عظام',
                //         'bio' => 'د. خالد وليد لديه خبرة كبيرة في تشخيص وعلاج مشاكل العظام عند البالغين والأطفال، ويتميز بدقة عالية في متابعة الحالات.',
                //         'consultation_duration' => 30,
                //     ];
                //     break;

                // --------------------------------
                // Dermatology - جلدية
                // --------------------------------

                // case 'mustafa74@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Mustafa Zaid',
                //         'phone_number' => '0798747401',
                //         'specialization' => 'اخصائي جلدية',
                //         'bio' => 'د. مصطفى زيد متخصص في الأمراض الجلدية وعلاج حب الشباب والصدفية والإكزيما، ويقدم علاجات ليزر متقدمة.',
                //         'consultation_duration' => 25,
                //     ];
                //     break;

                // case 'maria66@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Maria Ziad',
                //         'phone_number' => '0798666602',
                //         'specialization' => 'اخصائي جلدية',
                //         'bio' => 'د. ماريا زياد خبيرة في التجميل الطبي وعلاج تصبغات الوجه وتساقط الشعر وتقدم حلولًا فعالة باستخدام أجهزة الليزر الحديثة.',
                //         'consultation_duration' => 40,
                //     ];
                //     break;

                // case 'dina53@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Dina Nasir',
                //         'phone_number' => '0798535303',
                //         'specialization' => 'اخصائي جلدية',
                //         'bio' => 'د. دينا ناصر متخصصة في تشخيص الأمراض الجلدية المزمنة وعلاج الحساسية الجلدية وتقديم علاجات حديثة للبشرة.',
                //         'consultation_duration' => 55,
                //     ];
                //     break;

                // --------------------------------
                // Internal Medicine - باطنية
                // --------------------------------

                // case 'yousef29@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Yousef Hamed',
                //         'phone_number' => '0798292901',
                //         'specialization' => 'اخصائي باطنية',
                //         'bio' => 'د. يوسف حامد متخصص في علاج الأمراض الباطنية والسكري وضغط الدم، ويقدم خطط علاجية دقيقة مبنية على أحدث بروتوكولات الطب الداخلي.',
                //         'consultation_duration' => 35,
                //     ];
                //     break;

                // case 'salma81@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Salma Qasem',
                //         'phone_number' => '0798818102',
                //         'specialization' => 'اخصائي باطنية',
                //         'bio' => 'د. سلمى قاسم متخصصة في أمراض الجهاز الهضمي، وتتابع حالات القولون المزمن والارتجاع المريئي وتقدم تشخيصًا دقيقًا للحالات.',
                //         'consultation_duration' => 45,
                //     ];
                //     break;

                // case 'ibrahim15@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ibrahim Saqr',
                //         'phone_number' => '0798151503',
                //         'specialization' => 'اخصائي باطنية',
                //         'bio' => 'د. إبراهيم صقر لديه خبرة واسعة في طب الباطنية وعلاج الالتهابات المزمنة ومشاكل الكلى، ويتميز بمهارته في متابعة الحالات المعقدة.',
                //         'consultation_duration' => 60,
                //     ];
                //     break;

                // --------------------------------
                // Gynecology - طب نسائية
                // --------------------------------

                // case 'hassan60@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Hassan Nidal',
                //         'phone_number' => '0798606001',
                //         'specialization' => 'اخصائي طب نسائية',
                //         'bio' => 'د. حسن نضال متخصص في طب النساء والولادة ويقدم رعاية شاملة للحامل ومتابعة دقيقة لفترة ما قبل وبعد الولادة.',
                //         'consultation_duration' => 20,
                //     ];
                //     break;

                // case 'ward99@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ward Assim',
                //         'phone_number' => '0798999902',
                //         'specialization' => 'اخصائي طب نسائية',
                //         'bio' => 'د. ورد عاصم متخصصة في متابعة الحمل والخصوبة وتقديم العلاجات الهرمونية الحديثة، بالإضافة إلى عمليات المناظير.',
                //         'consultation_duration' => 50,
                //     ];
                //     break;

                // case 'reem42@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Reem Abed',
                //         'phone_number' => '0798424203',
                //         'specialization' => 'اخصائي طب نسائية',
                //         'bio' => 'د. ريم عبد لديها خبرة طويلة في رعاية صحة المرأة وإجراء الفحوصات الدورية وتشخيص الأمراض النسائية.',
                //         'consultation_duration' => 30,
                //     ];
                //     break;

                // --------------------------------
                // Dentistry - اسنان
                // --------------------------------

                // case 'saif33@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Saif Rashid',
                //         'phone_number' => '0798333301',
                //         'specialization' => 'اخصائي اسنان',
                //         'bio' => 'د. سيف راشد متخصص في تجميل الأسنان، تركيب القشور، وعلاج اللثة باستخدام أحدث التقنيات.',
                //         'consultation_duration' => 35,
                //     ];
                //     break;

                // case 'hanan25@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Hanan Alaa',
                //         'phone_number' => '0798252502',
                //         'specialization' => 'اخصائي اسنان',
                //         'bio' => 'د. حنان علاء خبيرة في طب أسنان الأطفال وعلاج التسوس باستخدام طرق حديثة وغير مؤلمة.',
                //         'consultation_duration' => 15,
                //     ];
                //     break;

                // case 'adel49@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Adel Yazen',
                //         'phone_number' => '0798494903',
                //         'specialization' => 'اخصائي اسنان',
                //         'bio' => 'د. عادل يزن متخصص في تقويم الأسنان ويقدم خطط علاجية دقيقة باستخدام أجهزة حديثة لتحسين الابتسامة.',
                //         'consultation_duration' => 45,
                //     ];
                //     break;

                // --------------------------------
                // Respiratory - جهاز تنفسي
                // --------------------------------

                // case 'tareq67@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Tareq Majdi',
                //         'phone_number' => '0798676701',
                //         'specialization' => 'اخصائي جهاز تنفسي',
                //         'bio' => 'د. طارق مجدي متخصص في الأمراض الصدرية وعلاج الربو والحساسية التنفسية، ويقدم خطط علاج دقيقة للمرضى ذوي الحالات المزمنة.',
                //         'consultation_duration' => 25,
                //     ];
                //     break;

                // case 'maya93@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Maya Rami',
                //         'phone_number' => '0798939302',
                //         'specialization' => 'اخصائي جهاز تنفسي',
                //         'bio' => 'د. مايا رامي خبيرة في علاج التهابات الرئة وحالات ضيق التنفس، وتتميز بمتابعتها الدقيقة لحالات الجهاز التنفسي.',
                //         'consultation_duration' => 40,
                //     ];
                //     break;

                // case 'rabia12@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Rabia Suleiman',
                //         'phone_number' => '0798121203',
                //         'specialization' => 'اخصائي جهاز تنفسي',
                //         'bio' => 'د. رابية سليمان متخصصة في مشاكل الجهاز التنفسي واضطرابات النوم التنفسية، وتقدم علاجات فعالة لحالات انسداد الشعب الهوائية.',
                //         'consultation_duration' => 60,
                //     ];
                //     break;

                // --------------------------------
                // Gastroenterology - جهاز هضمي
                // --------------------------------

                // case 'issam21@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Issam Radi',
                //         'phone_number' => '0798212101',
                //         'specialization' => 'اخصائي جهاز هضمي',
                //         'bio' => 'د. عصام راضي متخصص في أمراض الكبد والقولون والمناظير الهضمية، ويقدم تشخيصات دقيقة باستخدام أحدث التقنيات.',
                //         'consultation_duration' => 35,
                //     ];
                //     break;

                // case 'kareem19@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Kareem Qadi',
                //         'phone_number' => '0798191902',
                //         'specialization' => 'اخصائي جهاز هضمي',
                //         'bio' => 'د. كريم قاضي متخصص في علاج التهابات المعدة وارتجاع المريء ومتلازمة القولون العصبي، ويتميز بأسلوب علاجي مبني على الأدلة.',
                //         'consultation_duration' => 50,
                //     ];
                //     break;

                // case 'farah01@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Farah Ali',
                //         'phone_number' => '0798010103',
                //         'specialization' => 'اخصائي جهاز هضمي',
                //         'bio' => 'د. فرح علي خبيرة في أمراض الجهاز الهضمي العلوي والسفلي، وتتابع الحالات المزمنة بدقة لضمان أفضل النتائج.',
                //         'consultation_duration' => 20,
                //     ];
                //     break;

                // --------------------------------
                // ENT - انف اذن وحنجرة
                // --------------------------------

                // case 'majid39@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Majid Omar',
                //         'phone_number' => '0798393901',
                //         'specialization' => 'اخصائي انف اذن و حنجرة',
                //         'bio' => 'د. ماجد عمر متخصص في علاج التهابات الأذن والجيوب الأنفية واضطرابات السمع، ويقدم علاجات دقيقة باستخدام أحدث الأجهزة.',
                //         'consultation_duration' => 45,
                //     ];
                //     break;

                // case 'tamara84@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Tamara Mohsen',
                //         'phone_number' => '0798848402',
                //         'specialization' => 'اخصائي انف اذن و حنجرة',
                //         'bio' => 'د. تمارا محسن خبيرة في مشاكل الحنجرة والصوت وحساسية الأنف، وتقدم علاجات مخصصة للمرضى لضمان أفضل تحسن.',
                //         'consultation_duration' => 30,
                //     ];
                //     break;

                // case 'ayman52@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ayman Othman',
                //         'phone_number' => '0798525203',
                //         'specialization' => 'اخصائي انف اذن و حنجرة',
                //         'bio' => 'د. أيمن عثمان متخصص في جراحة الأنف والجيوب الأنفية ويقدم حلولًا فعّالة لحالات انسداد الأنف وتشوهات الحاجز الأنفي.',
                //         'consultation_duration' => 55,
                //     ];
                //     break;

                // --------------------------------
                // Neurology - اعصاب
                // --------------------------------

                // case 'ali91@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ali Ghassan',
                //         'phone_number' => '0798919101',
                //         'specialization' => 'اخصائي اعصاب',
                //         'bio' => 'د. علي غسان متخصص في أمراض الأعصاب والدماغ، ويقدم علاجات لاضطرابات الأعصاب الطرفية والصداع المزمن والصرع.',
                //         'consultation_duration' => 40,
                //     ];
                //     break;

                // case 'ziad46@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Ziad Mohammad',
                //         'phone_number' => '0798464602',
                //         'specialization' => 'اخصائي اعصاب',
                //         'bio' => 'د. زياد محمد متخصص في أمراض الأعصاب العضلية، ويقدم تقييمات دقيقة للحالات المعقدة المتعلقة بالدماغ والجهاز العصبي.',
                //         'consultation_duration' => 25,
                //     ];
                //     break;

                // case 'najwa70@example.com':
                //     $doctorData = [
                //         'user_id' => $user->id,
                //         'full_name' => 'Dr. Najwa Ahmad',
                //         'phone_number' => '0798707003',
                //         'specialization' => 'اخصائي اعصاب',
                //         'bio' => 'د. نجوى احمد خبيرة في معالجة أمراض الأعصاب الطرفية والتنكس العصبي، وتقدم خطط علاج شاملة تعتمد على تقييمات دقيقة.',
                //         'consultation_duration' => 50,
                //     ];
                //     break;

            }
            
            if (!empty($doctorData)) {
                Doctor::create($doctorData);
            }
        }

     
       
    }
}
