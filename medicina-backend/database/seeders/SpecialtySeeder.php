<?php

namespace Database\Seeders;

use App\Enums\SpecialtyCategory;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialties = [
            // ========== INTERNAL MEDICINE AND SUBSPECIALTIES ==========
            [
                'name_en' => 'General Internal Medicine',
                'name_ar' => 'الطب الباطني العام',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Comprehensive care for adult medical conditions and internal organs',
                'description_ar' => 'رعاية شاملة للحالات الطبية للبالغين والأعضاء الداخلية',
            ],
            [
                'name_en' => 'Cardiology',
                'name_ar' => 'أمراض القلب',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Heart and cardiovascular system disorders',
                'description_ar' => 'أمراض القلب والجهاز القلبي الوعائي',
            ],
            [
                'name_en' => 'Endocrinology',
                'name_ar' => 'الغدد الصماء والسكري',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Hormones, diabetes, and endocrine system disorders',
                'description_ar' => 'الهرمونات والسكري واضطرابات الغدد الصماء',
            ],
            [
                'name_en' => 'Gastroenterology',
                'name_ar' => 'الجهاز الهضمي والكبد',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Digestive system, liver, and gastrointestinal disorders',
                'description_ar' => 'الجهاز الهضمي والكبد والاضطرابات المعوية',
            ],
            [
                'name_en' => 'Pulmonology',
                'name_ar' => 'أمراض الصدر والرئة',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Respiratory system and lung disorders',
                'description_ar' => 'الجهاز التنفسي وأمراض الرئة',
            ],
            [
                'name_en' => 'Nephrology',
                'name_ar' => 'أمراض الكلى',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Kidney diseases and dialysis',
                'description_ar' => 'أمراض الكلى والغسيل الكلوي',
            ],
            [
                'name_en' => 'Hematology',
                'name_ar' => 'أمراض الدم',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Blood disorders and diseases',
                'description_ar' => 'اضطرابات وأمراض الدم',
            ],
            [
                'name_en' => 'Oncology',
                'name_ar' => 'علاج الأورام',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Cancer diagnosis and treatment',
                'description_ar' => 'تشخيص وعلاج السرطان',
            ],
            [
                'name_en' => 'Rheumatology',
                'name_ar' => 'أمراض الروماتيزم والمفاصل',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Joint, muscle, and autoimmune disorders',
                'description_ar' => 'أمراض المفاصل والعضلات والمناعة الذاتية',
            ],
            [
                'name_en' => 'Infectious Diseases',
                'name_ar' => 'الأمراض المعدية',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Viral, bacterial, and parasitic infections',
                'description_ar' => 'العدوى الفيروسية والبكتيرية والطفيلية',
            ],
            [
                'name_en' => 'Allergy & Immunology',
                'name_ar' => 'الحساسية والمناعة',
                'category' => SpecialtyCategory::INTERNAL_MEDICINE,
                'description_en' => 'Allergic conditions and immune system disorders',
                'description_ar' => 'حالات الحساسية واضطرابات الجهاز المناعي',
            ],

            // ========== GENERAL SURGERY AND SUBSPECIALTIES ==========
            [
                'name_en' => 'General Surgery',
                'name_ar' => 'الجراحة العامة',
                'category' => SpecialtyCategory::GENERAL_SURGERY,
                'description_en' => 'Surgical treatment of various conditions',
                'description_ar' => 'العلاج الجراحي لحالات متنوعة',
            ],
            [
                'name_en' => 'Vascular Surgery',
                'name_ar' => 'جراحة الأوعية الدموية',
                'category' => SpecialtyCategory::GENERAL_SURGERY,
                'description_en' => 'Surgery of blood vessels and circulatory system',
                'description_ar' => 'جراحة الأوعية الدموية والدورة الدموية',
            ],
            [
                'name_en' => 'Cardiothoracic Surgery',
                'name_ar' => 'جراحة القلب والصدر',
                'category' => SpecialtyCategory::GENERAL_SURGERY,
                'description_en' => 'Heart and chest surgical procedures',
                'description_ar' => 'العمليات الجراحية للقلب والصدر',
            ],
            [
                'name_en' => 'Plastic & Reconstructive Surgery',
                'name_ar' => 'الجراحة التجميلية والترميمية',
                'category' => SpecialtyCategory::GENERAL_SURGERY,
                'description_en' => 'Cosmetic and reconstructive surgical procedures',
                'description_ar' => 'العمليات التجميلية والترميمية',
            ],
            [
                'name_en' => 'Bariatric Surgery',
                'name_ar' => 'جراحة السمنة',
                'category' => SpecialtyCategory::GENERAL_SURGERY,
                'description_en' => 'Weight loss and metabolic surgery',
                'description_ar' => 'جراحة فقدان الوزن والتمثيل الغذائي',
            ],

            // ========== ORTHOPEDIC SURGERY ==========
            [
                'name_en' => 'Orthopedic Surgery',
                'name_ar' => 'جراحة العظام',
                'category' => SpecialtyCategory::ORTHOPEDIC_SURGERY,
                'description_en' => 'Musculoskeletal system surgery',
                'description_ar' => 'جراحة الجهاز العضلي الهيكلي',
            ],
            [
                'name_en' => 'Sports Medicine',
                'name_ar' => 'طب الرياضة',
                'category' => SpecialtyCategory::ORTHOPEDIC_SURGERY,
                'description_en' => 'Treatment of sports-related injuries',
                'description_ar' => 'علاج الإصابات الرياضية',
            ],
            [
                'name_en' => 'Spine Surgery',
                'name_ar' => 'جراحة العمود الفقري',
                'category' => SpecialtyCategory::ORTHOPEDIC_SURGERY,
                'description_en' => 'Surgical treatment of spine disorders',
                'description_ar' => 'العلاج الجراحي لاضطرابات العمود الفقري',
            ],

            // ========== PEDIATRICS ==========
            [
                'name_en' => 'Pediatrics',
                'name_ar' => 'طب الأطفال',
                'category' => SpecialtyCategory::PEDIATRICS,
                'description_en' => 'Medical care for infants, children, and adolescents',
                'description_ar' => 'الرعاية الطبية للرضع والأطفال والمراهقين',
            ],
            [
                'name_en' => 'Pediatric Cardiology',
                'name_ar' => 'قلب الأطفال',
                'category' => SpecialtyCategory::PEDIATRICS,
                'description_en' => 'Heart conditions in children',
                'description_ar' => 'أمراض القلب عند الأطفال',
            ],
            [
                'name_en' => 'Pediatric Surgery',
                'name_ar' => 'جراحة الأطفال',
                'category' => SpecialtyCategory::PEDIATRICS,
                'description_en' => 'Surgical care for children',
                'description_ar' => 'الرعاية الجراحية للأطفال',
            ],
            [
                'name_en' => 'Neonatology',
                'name_ar' => 'حديثي الولادة',
                'category' => SpecialtyCategory::PEDIATRICS,
                'description_en' => 'Care for newborns, especially premature babies',
                'description_ar' => 'رعاية حديثي الولادة وخاصة الخدج',
            ],

            // ========== OBSTETRICS & GYNECOLOGY ==========
            [
                'name_en' => 'Obstetrics & Gynecology',
                'name_ar' => 'النساء والتوليد',
                'category' => SpecialtyCategory::OBSTETRICS_GYNECOLOGY,
                'description_en' => 'Women\'s reproductive health, pregnancy, and childbirth',
                'description_ar' => 'صحة المرأة الإنجابية والحمل والولادة',
            ],
            [
                'name_en' => 'Maternal-Fetal Medicine',
                'name_ar' => 'طب الأم والجنين',
                'category' => SpecialtyCategory::OBSTETRICS_GYNECOLOGY,
                'description_en' => 'High-risk pregnancy management',
                'description_ar' => 'إدارة الحمل عالي الخطورة',
            ],
            [
                'name_en' => 'Reproductive Endocrinology',
                'name_ar' => 'الغدد الصماء الإنجابية والعقم',
                'category' => SpecialtyCategory::OBSTETRICS_GYNECOLOGY,
                'description_en' => 'Fertility and hormonal disorders',
                'description_ar' => 'الخصوبة والاضطرابات الهرمونية',
            ],
            [
                'name_en' => 'Gynecologic Oncology',
                'name_ar' => 'أورام النساء',
                'category' => SpecialtyCategory::OBSTETRICS_GYNECOLOGY,
                'description_en' => 'Female reproductive system cancers',
                'description_ar' => 'سرطانات الجهاز التناسلي الأنثوي',
            ],

            // ========== FAMILY MEDICINE ==========
            [
                'name_en' => 'Family Medicine',
                'name_ar' => 'طب الأسرة',
                'category' => SpecialtyCategory::FAMILY_MEDICINE,
                'description_en' => 'Comprehensive healthcare for all ages',
                'description_ar' => 'الرعاية الصحية الشاملة لجميع الأعمار',
            ],

            // ========== EMERGENCY MEDICINE ==========
            [
                'name_en' => 'Emergency Medicine',
                'name_ar' => 'طب الطوارئ',
                'category' => SpecialtyCategory::EMERGENCY_MEDICINE,
                'description_en' => 'Acute and emergency medical care',
                'description_ar' => 'الرعاية الطبية الطارئة والحادة',
            ],
            [
                'name_en' => 'Critical Care Medicine',
                'name_ar' => 'العناية المركزة',
                'category' => SpecialtyCategory::EMERGENCY_MEDICINE,
                'description_en' => 'Intensive care for critically ill patients',
                'description_ar' => 'العناية المركزة للمرضى في حالة حرجة',
            ],

            // ========== ANESTHESIOLOGY ==========
            [
                'name_en' => 'Anesthesiology',
                'name_ar' => 'التخدير والعناية المركزة',
                'category' => SpecialtyCategory::ANESTHESIOLOGY,
                'description_en' => 'Anesthesia and pain management',
                'description_ar' => 'التخدير وإدارة الألم',
            ],
            [
                'name_en' => 'Pain Management',
                'name_ar' => 'إدارة الألم',
                'category' => SpecialtyCategory::ANESTHESIOLOGY,
                'description_en' => 'Chronic and acute pain treatment',
                'description_ar' => 'علاج الألم المزمن والحاد',
            ],

            // ========== DERMATOLOGY ==========
            [
                'name_en' => 'Dermatology',
                'name_ar' => 'الأمراض الجلدية',
                'category' => SpecialtyCategory::DERMATOLOGY,
                'description_en' => 'Skin, hair, and nail conditions',
                'description_ar' => 'أمراض الجلد والشعر والأظافر',
            ],
            [
                'name_en' => 'Pediatric Dermatology',
                'name_ar' => 'جلدية الأطفال',
                'category' => SpecialtyCategory::DERMATOLOGY,
                'description_en' => 'Skin conditions in children',
                'description_ar' => 'الأمراض الجلدية عند الأطفال',
            ],
            [
                'name_en' => 'Cosmetic Dermatology',
                'name_ar' => 'الجلدية التجميلية',
                'category' => SpecialtyCategory::DERMATOLOGY,
                'description_en' => 'Aesthetic and cosmetic skin treatments',
                'description_ar' => 'العلاجات الجلدية التجميلية',
            ],

            // ========== OPHTHALMOLOGY ==========
            [
                'name_en' => 'Ophthalmology',
                'name_ar' => 'طب وجراحة العيون',
                'category' => SpecialtyCategory::OPHTHALMOLOGY,
                'description_en' => 'Eye diseases and vision care',
                'description_ar' => 'أمراض العين ورعاية البصر',
            ],
            [
                'name_en' => 'Retina & Vitreous',
                'name_ar' => 'شبكية العين والجسم الزجاجي',
                'category' => SpecialtyCategory::OPHTHALMOLOGY,
                'description_en' => 'Retinal diseases and surgery',
                'description_ar' => 'أمراض وجراحة الشبكية',
            ],
            [
                'name_en' => 'Pediatric Ophthalmology',
                'name_ar' => 'عيون الأطفال',
                'category' => SpecialtyCategory::OPHTHALMOLOGY,
                'description_en' => 'Children\'s eye conditions',
                'description_ar' => 'أمراض عيون الأطفال',
            ],
            [
                'name_en' => 'Cornea & External Diseases',
                'name_ar' => 'القرنية والأمراض الخارجية',
                'category' => SpecialtyCategory::OPHTHALMOLOGY,
                'description_en' => 'Corneal conditions and transplants',
                'description_ar' => 'أمراض القرنية وزراعتها',
            ],

            // ========== PSYCHIATRY ==========
            [
                'name_en' => 'Psychiatry',
                'name_ar' => 'الطب النفسي',
                'category' => SpecialtyCategory::PSYCHIATRY,
                'description_en' => 'Mental health and psychiatric disorders',
                'description_ar' => 'الصحة النفسية والاضطرابات النفسية',
            ],
            [
                'name_en' => 'Child & Adolescent Psychiatry',
                'name_ar' => 'الطب النفسي للأطفال والمراهقين',
                'category' => SpecialtyCategory::PSYCHIATRY,
                'description_en' => 'Mental health care for children and teens',
                'description_ar' => 'الرعاية النفسية للأطفال والمراهقين',
            ],
            [
                'name_en' => 'Addiction Medicine',
                'name_ar' => 'طب الإدمان',
                'category' => SpecialtyCategory::PSYCHIATRY,
                'description_en' => 'Substance abuse and addiction treatment',
                'description_ar' => 'علاج إدمان المخدرات والكحول',
            ],

            // ========== RADIOLOGY ==========
            [
                'name_en' => 'Diagnostic Radiology',
                'name_ar' => 'الأشعة التشخيصية',
                'category' => SpecialtyCategory::RADIOLOGY,
                'description_en' => 'Medical imaging and diagnostics',
                'description_ar' => 'التصوير الطبي والتشخيص',
            ],
            [
                'name_en' => 'Interventional Radiology',
                'name_ar' => 'الأشعة التداخلية',
                'category' => SpecialtyCategory::RADIOLOGY,
                'description_en' => 'Image-guided minimally invasive procedures',
                'description_ar' => 'الإجراءات طفيفة التوغل الموجهة بالصور',
            ],
            [
                'name_en' => 'Nuclear Medicine',
                'name_ar' => 'الطب النووي',
                'category' => SpecialtyCategory::RADIOLOGY,
                'description_en' => 'Radioactive substances for diagnosis and treatment',
                'description_ar' => 'المواد المشعة للتشخيص والعلاج',
            ],

            // ========== NEUROLOGY ==========
            [
                'name_en' => 'Neurology',
                'name_ar' => 'طب الأعصاب',
                'category' => SpecialtyCategory::NEUROLOGY,
                'description_en' => 'Nervous system disorders',
                'description_ar' => 'اضطرابات الجهاز العصبي',
            ],
            [
                'name_en' => 'Neurosurgery',
                'name_ar' => 'جراحة الأعصاب',
                'category' => SpecialtyCategory::NEUROLOGY,
                'description_en' => 'Surgical treatment of nervous system conditions',
                'description_ar' => 'العلاج الجراحي لحالات الجهاز العصبي',
            ],
            [
                'name_en' => 'Pediatric Neurology',
                'name_ar' => 'أعصاب الأطفال',
                'category' => SpecialtyCategory::NEUROLOGY,
                'description_en' => 'Neurological conditions in children',
                'description_ar' => 'الحالات العصبية عند الأطفال',
            ],

            // ========== UROLOGY ==========
            [
                'name_en' => 'Urology',
                'name_ar' => 'جراحة المسالك البولية',
                'category' => SpecialtyCategory::UROLOGY,
                'description_en' => 'Urinary tract and male reproductive system',
                'description_ar' => 'الجهاز البولي والتناسلي الذكري',
            ],
            [
                'name_en' => 'Pediatric Urology',
                'name_ar' => 'مسالك بولية الأطفال',
                'category' => SpecialtyCategory::UROLOGY,
                'description_en' => 'Urological conditions in children',
                'description_ar' => 'حالات المسالك البولية عند الأطفال',
            ],

            // ========== ENT ==========
            [
                'name_en' => 'Otolaryngology (ENT)',
                'name_ar' => 'أنف وأذن وحنجرة',
                'category' => SpecialtyCategory::ENT,
                'description_en' => 'Ear, nose, and throat disorders',
                'description_ar' => 'اضطرابات الأذن والأنف والحنجرة',
            ],
            [
                'name_en' => 'Head & Neck Surgery',
                'name_ar' => 'جراحة الرأس والرقبة',
                'category' => SpecialtyCategory::ENT,
                'description_en' => 'Surgical treatment of head and neck conditions',
                'description_ar' => 'العلاج الجراحي لحالات الرأس والرقبة',
            ],
            [
                'name_en' => 'Audiology',
                'name_ar' => 'السمعيات',
                'category' => SpecialtyCategory::ENT,
                'description_en' => 'Hearing and balance disorders',
                'description_ar' => 'اضطرابات السمع والتوازن',
            ],

            // ========== DENTISTRY ==========
            [
                'name_en' => 'General Dentistry',
                'name_ar' => 'طب الأسنان العام',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Comprehensive oral health and dental care',
                'description_ar' => 'رعاية صحة الفم والأسنان الشاملة',
            ],
            [
                'name_en' => 'Orthodontics',
                'name_ar' => 'تقويم الأسنان',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Teeth alignment and bite correction',
                'description_ar' => 'محاذاة الأسنان وتصحيح العضة',
            ],
            [
                'name_en' => 'Oral & Maxillofacial Surgery',
                'name_ar' => 'جراحة الفم والوجه والفكين',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Surgical treatment of oral and facial conditions',
                'description_ar' => 'العلاج الجراحي لحالات الفم والوجه',
            ],
            [
                'name_en' => 'Endodontics',
                'name_ar' => 'علاج جذور الأسنان',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Root canal treatment and dental pulp diseases',
                'description_ar' => 'علاج قنوات الجذور وأمراض لب الأسنان',
            ],
            [
                'name_en' => 'Periodontics',
                'name_ar' => 'أمراض اللثة',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Gum diseases and dental implants',
                'description_ar' => 'أمراض اللثة وزراعة الأسنان',
            ],
            [
                'name_en' => 'Pediatric Dentistry',
                'name_ar' => 'طب أسنان الأطفال',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Dental care for children',
                'description_ar' => 'رعاية أسنان الأطفال',
            ],
            [
                'name_en' => 'Prosthodontics',
                'name_ar' => 'تركيبات الأسنان',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Dental prosthetics and restoration',
                'description_ar' => 'التركيبات واستعادة الأسنان',
            ],
            [
                'name_en' => 'Cosmetic Dentistry',
                'name_ar' => 'طب الأسنان التجميلي',
                'category' => SpecialtyCategory::DENTISTRY,
                'description_en' => 'Aesthetic dental treatments',
                'description_ar' => 'العلاجات التجميلية للأسنان',
            ],
        ];

        foreach ($specialties as $specialty) {
            Specialty::updateOrCreate(
                [
                    'name_en' => $specialty['name_en'],
                ],
                [
                    'name_ar' => $specialty['name_ar'],
                    'category' => $specialty['category']->value,
                    'description_en' => $specialty['description_en'],
                    'description_ar' => $specialty['description_ar'],
                    'is_active' => true,
                ]
            );
        }
    }
}
