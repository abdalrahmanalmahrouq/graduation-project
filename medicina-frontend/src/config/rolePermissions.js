// central map for nav links (keeps UI & routing in sync)
export const rolePermissions = {
  patient: [
    { path: "/", label: "الصفحة الرئيسية" },
    { path: "/about", label: "من نحن" },
    { path: "/clinics", label: "العيادات" },
    { path: "/contact", label: "اتصل بنا" },
  ],
  clinic: [
    { path: "/", label: "الصفحة الرئيسية" },
    { path: "/about", label: "من نحن" },
    { path: "/contact", label: "اتصل بنا" },
  ],
  doctor: [
    { path: "/", label: "الصفحة الرئيسية" },
    { path: "/about", label: "من نحن" },
    { path: "/contact", label: "اتصل بنا" },
  ],
  guest: [ // non-logged users
    { path: "/", label: "الصفحة الرئيسية" },
    { path: "/about", label: "من نحن" },
    { path: "/clinics", label: "العيادات" },
    { path: "/contact", label: "اتصل بنا" },
  ],
  default: [
    { path: "/", label: "الصفحة الرئيسية" },
    { path: "/about", label: "من نحن" },
    { path: "/clinics", label: "العيادات" },
    { path: "/contact", label: "اتصل بنا" },
  ],
};

