import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  UserX, 
  CheckCircle, 
  Mail, 
  AlertCircle, 
  Building2, 
  Briefcase, 
  ChevronDown, 
  Filter, 
  Settings2, 
  Edit2, 
  ArrowLeft, 
  Star, 
  Phone, 
  Calendar, 
  Award, 
  TrendingUp, 
  Check, 
  Trash2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { 
  supabase, 
  dbGetDepartments, 
  dbAddDepartment, 
  dbUpdateDepartment, 
  dbDeleteDepartment, 
  dbGetTeamMembers, 
  dbAddTeamMember, 
  dbUpdateTeamMember, 
  dbDeleteTeamMember 
} from '../lib/supabaseClient';

type Role = 'Admin' | 'Editor' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Pending';
  department: string; // key matching Department ID
  rating: number; // custom professional rating out of 5
  avatarColor: string;
  phone: string;
  joinDate: string;
  performanceScore: string; // e.g. 'A+', 'A', 'B+'
  bio: string;
  tasksCompleted: number;
}

interface Department {
  id: string;
  name_en: string;
  name_ar: string;
  color: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  description_en: string;
  description_ar: string;
}

const DEFAULT_AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-650',
  'from-cyan-500 to-blue-600'
];

export function TeamWorkspace() {
  const { language, dir, t } = useTranslation();
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const [dbLoading, setDbLoading] = useState(false);

  // 1. STATE FOR DEPARTMENTS
  const [departments, setDepartments] = useState<Department[]>([
    { 
      id: 'management', 
      name_en: 'Management', 
      name_ar: 'الرئاسة والتنظيم والتنفيذي', 
      color: 'rose',
      description_en: 'Oversees strategic business directions and general management.',
      description_ar: 'الإشراف على التوجهات الاستراتيجية العامة والإدارية للمؤسسة.'
    },
    { 
      id: 'finance', 
      name_en: 'Finance', 
      name_ar: 'المالية والمحاسبة والميزانية', 
      color: 'emerald',
      description_en: 'Tracks organization expenditure, profits, and subscriptions.',
      description_ar: 'إدارة النفقات والأرباح وتدقيق الفواتير والاشتراكات.'
    },
    { 
      id: 'marketing', 
      name_en: 'Marketing', 
      name_ar: 'التسويق والدعاية والإعلام', 
      color: 'amber',
      description_en: 'Promotes brand growth, social channels, and public relations.',
      description_ar: 'تنمية حضور العلامة التجارية وإدارة قنوات التواصل والإعلام.'
    },
    { 
      id: 'engineering', 
      name_en: 'Engineering', 
      name_ar: 'التطوير الهندسي والتقني', 
      color: 'blue',
      description_en: 'Designs scalable tech models and security systems.',
      description_ar: 'تطوير البنية البرمجية والأنظمة السحابية والحلول الذكية.'
    },
    { 
      id: 'hr', 
      name_en: 'Human Resources', 
      name_ar: 'الموارد البشرية والتشغيل', 
      color: 'purple',
      description_en: 'Focuses on workplace culture, benefits, and team hiring.',
      description_ar: 'العناية بالبيئة الوظيفية، استقطاب الكفاءات وتنظيم العقود.'
    },
  ]);

  // 2. STATE FOR TEAM MEMBERS
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Sync state with Supabase dynamically
  useEffect(() => {
    if (!userId || !supabase) {
      // If offline/unconfigured, load default mock staff so local preview works beautifully!
      setMembers([
        { 
          id: '1', 
          name: 'Maher Almasry', 
          email: 'maher123almasry456@gmail.com', 
          role: 'Admin', 
          status: 'Active', 
          department: 'management', 
          rating: 4.9, 
          avatarColor: 'from-blue-500 to-indigo-600', 
          phone: '+966 50 123 4567', 
          joinDate: '2024-01-15', 
          performanceScore: 'A+', 
          bio: 'المدير التنفيذي للعمليات وإدارة الموارد التقنية والتخطيط العام.', 
          tasksCompleted: 142 
        },
        { 
          id: '2', 
          name: 'Ahmad Maroud', 
          email: 'ahmad.maroud@company.com', 
          role: 'Editor', 
          status: 'Active', 
          department: 'engineering', 
          rating: 4.7, 
          avatarColor: 'from-emerald-500 to-teal-600', 
          phone: '+966 54 888 2311', 
          joinDate: '2024-03-10', 
          performanceScore: 'A', 
          bio: 'مهندس برمجيات أول مسؤول عن البنية السحابية وإثراء تجربة المستخدم والويب الذكي.', 
          tasksCompleted: 98 
        },
        { 
          id: '3', 
          name: 'Sara Otaibi', 
          email: 'sara.otaibi@tracko.cloud', 
          role: 'Viewer', 
          status: 'Pending', 
          department: 'marketing', 
          rating: 4.5, 
          avatarColor: 'from-purple-500 to-pink-600', 
          phone: '+966 56 333 4455', 
          joinDate: '2025-05-01', 
          performanceScore: 'B+', 
          bio: 'أخصائية تسويق رقمي تتابع أداء الحملات الاعلانية على المواقع والمنصات.', 
          tasksCompleted: 12 
        },
        { 
          id: '4', 
          name: 'Omar Khalid', 
          email: 'omar.khalid@finance.co', 
          role: 'Viewer', 
          status: 'Active', 
          department: 'finance', 
          rating: 4.8, 
          avatarColor: 'from-amber-500 to-orange-600', 
          phone: '+966 55 999 0088', 
          joinDate: '2023-11-20', 
          performanceScore: 'A+', 
          bio: 'محلل مالي أول وإدارة محافظ الاستثمار وتطوير الميزانيات الدورية للشركة وبنود الاشتراك.', 
          tasksCompleted: 110 
        },
      ]);
      return;
    }

    const loadDbData = async () => {
      setDbLoading(true);
      try {
        const dbDepts = await dbGetDepartments(userId);
        const dbEmps = await dbGetTeamMembers(userId);

        if (dbDepts.length > 0) {
          setDepartments(dbDepts);
        } else {
          // Empty DB? Seed base departments to public.departments for excellent configuration
          const seedDepts: Department[] = [
            { id: 'management', name_en: 'Management', name_ar: 'الرئاسة والتنظيم والتنفيذي', color: 'rose', description_en: 'Oversees strategic business directions and general management.', description_ar: 'الإشراف على التوجهات الاستراتيجية العامة والإدارية للمؤسسة.' },
            { id: 'finance', name_en: 'Finance', name_ar: 'المالية والمحاسبة والميزانية', color: 'emerald', description_en: 'Tracks organization expenditure, profits, and subscriptions.', description_ar: 'إدارة النفقات والأرباح وتدقيق الفواتير والاشتراكات.' },
            { id: 'marketing', name_en: 'Marketing', name_ar: 'التسويق والدعاية والإعلام', color: 'amber', description_en: 'Promotes brand growth, social channels, and public relations.', description_ar: 'تنمية حضور العلامة التجارية وإدارة قنوات التواصل والإعلام.' },
            { id: 'engineering', name_en: 'Engineering', name_ar: 'التطوير الهندسي والتقني', color: 'blue', description_en: 'Designs scalable tech models and security systems.', description_ar: 'تطوير البنية البرمجية والأنظمة السحابية والحلول الذكية.' },
            { id: 'hr', name_en: 'Human Resources', name_ar: 'الموارد البشرية والتشغيل', color: 'purple', description_en: 'Focuses on workplace culture, benefits, and team hiring.', description_ar: 'العناية بالبيئة الوظيفية، استقطاب الكفاءات وتنظيم العقود.' },
          ];
          for (const d of seedDepts) {
            await dbAddDepartment(userId, d);
          }
          setDepartments(seedDepts);
        }

        // Empty members list represents clean database state (no mock data!)
        setMembers(dbEmps);
      } catch (err) {
        console.error("Failed to load/seed Supabase workspace details:", err);
      } finally {
        setDbLoading(false);
      }
    };

    loadDbData();
  }, [userId]);

  // NAVIGATION VIEW STATES
  // 'departments': overview of department square cards
  // 'department-employees': people inside a selected department
  // 'employee-detail': single employee comprehensive score review
  const [currentView, setCurrentView] = useState<'departments' | 'department-employees' | 'employee-detail'>('departments');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // SECURE CONFIRMATION SYSTEM STATE
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'department' | 'employee';
    id: string;
    title: string;
    message: string;
  } | null>(null);

  // SEARCH / FILTER STATES
  const [deptSearch, setDeptSearch] = useState('');
  const [empSearch, setEmpSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');

  // FORMS STATE: ADD DEPARTMENT
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [newDeptEn, setNewDeptEn] = useState('');
  const [newDeptAr, setNewDeptAr] = useState('');
  const [newDeptColor, setNewDeptColor] = useState<'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'>('blue');
  const [newDeptDescEn, setNewDeptDescEn] = useState('');
  const [newDeptDescAr, setNewDeptDescAr] = useState('');

  // FORMS STATE: ADD NEW EMPLOYEE
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('Viewer');
  const [newPhone, setNewPhone] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newRating, setNewRating] = useState(4.5);
  const [newPerfScore, setNewPerfScore] = useState('A');
  const [formError, setFormError] = useState('');

  // 1. ADD DEPARTMENT HANDLER
  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptEn.trim() || !newDeptAr.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال اسم القسم بالعربية والانجليزية' : 'Please fill in both English and Arabic department names.');
      return;
    }
    const id = newDeptEn.toLowerCase().replace(/\s+/g, '-');
    if (departments.some(d => d.id === id)) {
      alert(language === 'ar' ? 'هذا القسم موجود بالفعل!' : 'This department already exists.');
      return;
    }

    const newDeptObj: Department = {
      id,
      name_en: newDeptEn.trim(),
      name_ar: newDeptAr.trim(),
      color: newDeptColor,
      description_en: newDeptDescEn.trim() || 'A professional department of organization.',
      description_ar: newDeptDescAr.trim() || 'قسم مهني مخصص لتنظيم المهام وتوحيد الأهداف.'
    };

    if (userId && supabase) {
      try {
        await dbAddDepartment(userId, newDeptObj);
      } catch (err) {
        console.error("Error saving department to Supabase:", err);
      }
    }

    setDepartments(prev => [...prev, newDeptObj]);
    setNewDeptEn('');
    setNewDeptAr('');
    setNewDeptColor('blue');
    setNewDeptDescEn('');
    setNewDeptDescAr('');
    setShowAddDeptForm(false);
  };

  // 2. ADD EMPLOYEE HANDLER FOR THE SELECTED DEPARTMENT
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newName.trim() || !newEmail.trim()) {
      setFormError(language === 'ar' ? 'الرجاء تعبئة الاسم والبريد الإلكتروني.' : 'Full Name and work email are required.');
      return;
    }
    if (!newEmail.includes('@')) {
      setFormError(language === 'ar' ? 'الرجاء كتابة بريد سليم.' : 'Please write a valid email Address.');
      return;
    }

    const randomAvatarColor = DEFAULT_AVATAR_COLORS[Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)];
    const id = Date.now().toString();

    const newEmp: TeamMember = {
      id,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'Active',
      department: selectedDeptId || 'engineering',
      rating: Number(newRating) || 4.5,
      avatarColor: randomAvatarColor,
      phone: newPhone.trim() || '+966 50 000 0000',
      joinDate: new Date().toISOString().split('T')[0],
      performanceScore: newPerfScore,
      bio: newBio.trim() || (language === 'ar' ? 'موظف محترف مبدع في فريق العمل.' : 'A professional and creative team member.'),
      tasksCompleted: 0
    };

    if (userId && supabase) {
      try {
        await dbAddTeamMember(userId, newEmp);
      } catch (err) {
        console.error("Error saving team member to Supabase:", err);
      }
    }

    setMembers(prev => [...prev, newEmp]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewBio('');
    setNewRating(4.5);
    setNewPerfScore('A');
  };

  // 3. EDIT RATING DIRECT FROM PROFILE
  const handleUpdateRating = async (id: string, newVal: number) => {
    const activeVal = Math.max(0, Math.min(5, Number(newVal)));
    if (userId && supabase) {
      try {
        await dbUpdateTeamMember(id, { rating: activeVal });
      } catch (err) {
        console.error("Error updating rating on Supabase:", err);
      }
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, rating: activeVal } : m));
  };

  // 4. TRANSFER EMPLOYEE TO ANOTHER DEPARTMENT
  const handleTransferDepartment = async (id: string, newDeptId: string) => {
    if (userId && supabase) {
      try {
        await dbUpdateTeamMember(id, { department: newDeptId });
      } catch (err) {
        console.error("Error transferring department on Supabase:", err);
      }
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, department: newDeptId } : m));
  };

  // 5. UPDATE PERFORMANCE SCORE
  const handleUpdatePerf = async (id: string, score: string) => {
    if (userId && supabase) {
      try {
        await dbUpdateTeamMember(id, { performanceScore: score });
      } catch (err) {
        console.error("Error updating performance score on Supabase:", err);
      }
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, performanceScore: score } : m));
  };

  // 6. TOGGLE ROLE
  const handleToggleRole = async (id: string, role: Role) => {
    if (userId && supabase) {
      try {
        await dbUpdateTeamMember(id, { role });
      } catch (err) {
        console.error("Error updating role on Supabase:", err);
      }
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  // 7. TOGGLE STATUS
  const handleToggleStatus = async (id: string) => {
    const member = members.find(m => m.id === id);
    if (member) {
      const nextStatus = member.status === 'Active' ? 'Pending' : 'Active';
      if (userId && supabase) {
        try {
          await dbUpdateTeamMember(id, { status: nextStatus });
        } catch (err) {
          console.error("Error toggling status on Supabase:", err);
        }
      }
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    }
  };

  // 8. DELETE MEMBER (DIRECT ACTION)
  const handleDeleteMemberAction = async (id: string) => {
    if (userId && supabase) {
      try {
        await dbDeleteTeamMember(id);
      } catch (err) {
        console.error("Error deleting team member from Supabase:", err);
      }
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selectedEmployeeId === id) {
      setCurrentView('department-employees');
      setSelectedEmployeeId(null);
    }
  };

  // 9. DELETE DEPARTMENT (DIRECT ACTION)
  const handleDeleteDepartmentAction = async (deptId: string) => {
    if (userId && supabase) {
      try {
        await dbDeleteDepartment(deptId);
      } catch (err) {
        console.error("Error deleting department from Supabase:", err);
      }
    }
    setDepartments(prev => prev.filter(d => d.id !== deptId));
    setMembers(prev => prev.filter(m => m.department !== deptId));
    if (selectedDeptId === deptId) {
      setSelectedDeptId(null);
      setCurrentView('departments');
    }
  };

  // 10. TRIGGER FOR CONFIRMATION
  const triggerDeleteDept = (deptId: string, deptName: string) => {
    const staffCount = getEmployeeCountByDept(deptId);
    setConfirmModal({
      isOpen: true,
      type: 'department',
      id: deptId,
      title: language === 'ar' ? 'تأكيد حذف القسم بالكامل؟' : 'Confirm Department Deletion?',
      message: language === 'ar' 
        ? `هل أنت متأكد من رغبتك في حذف قسم "${deptName}"؟ سيتم إزالة القسم وتصفية هويات كافة الموظفين التابعين له (${staffCount} موظفاً) نهائياً من قاعدة بيانات المنصة.`
        : `Are you sure you want to delete the "${deptName}" department? This will also permanently delete all associated staff members (${staffCount} employees).`
    });
  };

  const triggerDeleteMember = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'employee',
      id,
      title: language === 'ar' ? 'تأكيد فصل وحذف الموظف؟' : 'Confirm Employee Deletion?',
      message: language === 'ar'
        ? `هل أنت متأكد من رغبتك في الاستغناء عن خدمات الموظف "${name}" وحذف سجله الوظيفي وملفه بالكامل من قاعدة بيانات المنصة؟`
        : `Are you sure you want to permanently delete "${name}" from the company core org roster?`
    });
  };

  // COMPUTED: DEPARTMENTS SEARCH
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const query = deptSearch.toLowerCase();
      const matchEn = dept.name_en.toLowerCase().includes(query) || dept.description_en.toLowerCase().includes(query);
      const matchAr = dept.name_ar.includes(query) || dept.description_ar.includes(query);
      return matchEn || matchAr;
    });
  }, [departments, deptSearch]);

  // COMPUTED: TEAM MEMBERS FOR THE ACTIVE DEPARTMENT
  const activeDeptEmployees = useMemo(() => {
    if (!selectedDeptId) return [];
    return members.filter(m => m.department === selectedDeptId);
  }, [members, selectedDeptId]);

  // COMPUTED: SEARCH & FILTER EMPLOYEES INSIDE ACTIVE DEPARTMENT
  const filteredEmployeesInsideDept = useMemo(() => {
    return activeDeptEmployees.filter(emp => {
      const query = empSearch.toLowerCase();
      const matchSearch = emp.name.toLowerCase().includes(query) || emp.email.toLowerCase().includes(query);
      const matchRole = roleFilter === 'ALL' || emp.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [activeDeptEmployees, empSearch, roleFilter]);

  // SINGLE SELECTED EMPLOYEE OBJECT
  const currentEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return members.find(m => m.id === selectedEmployeeId) || null;
  }, [members, selectedEmployeeId]);

  // COUNTER BY DEPT HELPER
  const getEmployeeCountByDept = (deptId: string) => {
    return members.filter(m => m.department === deptId).length;
  };

  const getDeptColorClass = (color: string) => {
    switch (color) {
      case 'rose': return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200 dark:border-rose-900/40 text-rose-500';
      case 'emerald': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-900/40 text-emerald-500';
      case 'amber': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200 dark:border-amber-900/40 text-amber-500';
      case 'blue': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200 dark:border-blue-900/40 text-blue-500';
      case 'purple': return 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 border-purple-200 dark:border-purple-900/40 text-purple-500';
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-200 dark:border-indigo-900/40 text-indigo-500';
      default: return 'bg-slate-50 dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-850 text-slate-400';
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 pb-32 md:pb-12 max-w-7xl mx-auto space-y-8" dir={dir}>
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 relative">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            {language === 'ar' ? 'هيكل وأعضاء الفريق' : 'Organization & Team Org Chart'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl">
            {language === 'ar' 
              ? 'تصفح الاقسام المختلفة للمؤسسة كمربعات، وتفحص موظفيها واطلع على التقارير السنوية ومستوى الانتاجية بدقة متناهية.' 
              : 'Browse corporate business branches or departments, review staff ratings, assign tasks, and track permissions easily.'}
          </p>
        </div>
        
        {/* Rapid stats */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <div className="px-4 py-2 text-center rounded-lg">
            <span className="block text-2xl font-black text-slate-800 dark:text-white">{members.length}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-500">{language === 'ar' ? 'المقاعد المعينة' : 'Total Employees'}</span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800 my-2" />
          <div className="px-4 py-2 text-center rounded-lg">
            <span className="block text-2xl font-black text-blue-600 dark:text-blue-500">{departments.length}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-500">{language === 'ar' ? 'قسم مسجل' : 'Departments'}</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 1: DEPARTMENTS GRID (SQUARE CARDS) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {currentView === 'departments' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Departments */}
            <div className="relative w-full md:max-w-md">
              <input 
                type="text" 
                placeholder={language === 'ar' ? 'ابحث عن قسم بالاسم، الوصف أو الرمز ماليًا او تقنيًا...' : 'Search departments by name or description...'}
                value={deptSearch}
                onChange={e => setDeptSearch(e.target.value)}
                className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
              />
              <Filter className="w-4.5 h-4.5 text-slate-400 absolute top-3.5 ltr:left-3.5 rtl:right-3.5" />
            </div>

            {/* Trigger Add Dept form */}
            <button
              onClick={() => setShowAddDeptForm(!showAddDeptForm)}
              className="w-full md:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>{language === 'ar' ? 'تأسيس قسم جديد' : 'Establish New Department'}</span>
            </button>
          </div>

          {/* Form to establishing custom department */}
          {showAddDeptForm && (
            <div className="p-6 bg-slate-50 dark:bg-[#0f172a]/60 border border-blue-500/20 rounded-2xl animate-in fade-in duration-300">
              <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                {language === 'ar' ? 'بيانات القسم الجديد المراد إنشاؤه' : 'Establish Corporate Org Department'}
              </h3>
              
              <form onSubmit={handleAddDept} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'ar' ? 'الاسم بالإنجليزية *' : 'Department Name (EN) *'}</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sales, DevOps"
                    value={newDeptEn}
                    onChange={e => setNewDeptEn(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'ar' ? 'الاسم بالعربية *' : 'Department Name (AR) *'}</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: المبيعات، الشحن واللوجستية"
                    value={newDeptAr}
                    onChange={e => setNewDeptAr(e.target.value)}
                    className="w-full text-sm px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'ar' ? 'اللون التعبيري' : 'Color Representation'}</label>
                  <select
                    value={newDeptColor}
                    onChange={e => setNewDeptColor(e.target.value as any)}
                    className="w-full text-sm px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="blue">Blue (الازرق التقني)</option>
                    <option value="emerald">Emerald (الأخضر المالي)</option>
                    <option value="rose">Rose (الوردي التنفيذي)</option>
                    <option value="amber">Amber (العسلي التسويقي)</option>
                    <option value="purple">Purple (البنفسجي التشغيلي)</option>
                    <option value="indigo">Indigo (الأرجواني العام)</option>
                  </select>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (EN)'}</label>
                    <textarea 
                      placeholder="Core goals, scope and work targets..."
                      value={newDeptDescEn}
                      onChange={e => setNewDeptDescEn(e.target.value)}
                      className="w-full text-sm p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none h-20 resize-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'ar' ? 'الوصف بالعربية' : 'Description (AR)'}</label>
                    <textarea 
                      placeholder="وصف مبسط لأهداف القسم، المهام المحددة والمخرجات المطلوبة..."
                      value={newDeptDescAr}
                      onChange={e => setNewDeptDescAr(e.target.value)}
                      className="w-full text-sm p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none h-20 resize-none text-right font-sans"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDeptForm(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg transition-transform"
                  >
                    {language === 'ar' ? 'حفظ القسم' : 'Save Department'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments Grid of Squares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map(dept => {
              const staffCount = getEmployeeCountByDept(dept.id);
              const colorClasses = getDeptColorClass(dept.color);
              
              return (
                <div
                  key={dept.id}
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    setCurrentView('department-employees');
                  }}
                  className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[190px]"
                >
                  {/* Color decorative top stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    dept.color === 'rose' ? 'bg-rose-500' :
                    dept.color === 'emerald' ? 'bg-emerald-500' :
                    dept.color === 'amber' ? 'bg-amber-500' :
                    dept.color === 'blue' ? 'bg-blue-500' :
                    dept.color === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'
                  }`} />

                  <div className="space-y-3 pt-2">
                    {/* Icon + Staff Count Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl border ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[2]}`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-black rounded-full border border-slate-200 dark:border-slate-700">
                          <Users className="w-3.5 h-3.5" />
                          <span>{staffCount} {language === 'ar' ? 'موظفين' : 'Staff'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDeleteDept(dept.id, language === 'ar' ? dept.name_ar : dept.name_en);
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
                          title={language === 'ar' ? 'حذف القسم' : 'Delete Department'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Department Title */}
                    <div>
                      <h3 className="text-lg font-black text-slate-850 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-450 transition-colors">
                        {language === 'ar' ? dept.name_ar : dept.name_en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 h-8 leading-relaxed">
                        {language === 'ar' ? dept.description_ar : dept.description_en}
                      </p>
                    </div>
                  </div>

                  {/* Footer link trigger */}
                  <div className="flex items-center justify-between text-xs font-bold pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-blue-600 dark:text-blue-400">
                    <span>{language === 'ar' ? 'استعراض الهيكل والموظفين' : 'Explore Staff'}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" />
                  </div>
                </div>
              );
            })}

            {filteredDepartments.length === 0 && (
              <div className="col-span-full py-16 bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                <Building2 className="w-12 h-12 mx-auto opacity-30 mb-4" />
                <p className="font-bold">{language === 'ar' ? 'عذراً، لم نجد أي أقسام تطابق بحثك.' : 'No departments match your search inquiry.'}</p>
                <button
                  onClick={() => setDeptSearch('')}
                  className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 underline"
                >
                  {language === 'ar' ? 'عرض الكل' : 'Reset query'}
                </button>
              </div>
            )}
          </div>

        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 2: DEPARTMENT EMPLOYEES LIST (SMALL CARDS) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {currentView === 'department-employees' && selectedDeptId && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Back to departments bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('departments');
                setSelectedDeptId(null);
                setEmpSearch('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 text-xs font-black rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-850 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{language === 'ar' ? 'الرجوع للأقسام الرئيسية' : 'Back to Departments'}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {language === 'ar' ? 'النافذة الفرعية للموظفين والتقييم' : 'Underlying Teammate workspace'}
            </span>
          </div>

          {/* Department Head Profile Info */}
          {(() => {
            const currentDept = departments.find(d => d.id === selectedDeptId);
            if (!currentDept) return null;
            const colorClasses = getDeptColorClass(currentDept.color);
            return (
              <div className={`p-6 rounded-2xl border ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      currentDept.color === 'rose' ? 'bg-rose-500' :
                      currentDept.color === 'emerald' ? 'bg-emerald-500' :
                      currentDept.color === 'amber' ? 'bg-amber-500' :
                      currentDept.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                      {language === 'ar' ? currentDept.name_ar : currentDept.name_en}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {language === 'ar' ? currentDept.description_ar : currentDept.description_en}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'مجموع الكوادر الوظيفية:' : 'Staff Allocation:'} <span className="font-black text-blue-600 dark:text-blue-400 text-lg ml-1.5">{activeDeptEmployees.length}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => triggerDeleteDept(currentDept.id, language === 'ar' ? currentDept.name_ar : currentDept.name_en)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-450 text-xs font-black rounded-xl border border-rose-550/25 transition-all cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'حذف القسم بالكامل' : 'Delete Department'}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Filtering controls and adding employee */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* List and search column */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-xs md:max-w-sm">
                  <input 
                    type="text" 
                    placeholder={language === 'ar' ? 'ابحث عن موظف بالاسم أو الإيميل...' : 'Search staff in this branch...'}
                    value={empSearch}
                    onChange={e => setEmpSearch(e.target.value)}
                    className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/30'}"
                  />
                  <Filter className="w-4 h-4 text-slate-400 absolute top-3 ltr:left-3 rtl:right-3" />
                </div>

                {/* Role Pill filters */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  {(['ALL', 'Admin', 'Editor', 'Viewer'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        roleFilter === role 
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {role === 'ALL' ? (language === 'ar' ? 'الكل' : 'All') : role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employee small cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredEmployeesInsideDept.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployeeId(emp.id);
                      setCurrentView('employee-detail');
                    }}
                    className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 transform flex items-center justify-between gap-3 group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${emp.avatarColor} text-white flex items-center justify-center font-bold shadow-sm shrink-0`}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Inner details */}
                      <div>
                        <h4 className="font-extrabold text-slate-850 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {emp.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{emp.email}</p>
                        
                        {/* Rating row with stars */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(emp.rating) ? 'fill-current' : 'opacity-20'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 font-mono">({emp.rating.toFixed(1)})</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge and action triggers */}
                    <div className="flex flex-col items-end gap-2 shrink-0 z-10">
                      {/* Role */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                        emp.role === 'Admin' 
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                          : emp.role === 'Editor'
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-105 dark:border-blue-900/30'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}>
                        <Shield className="w-2.5 h-2.5" />
                        {emp.role}
                      </span>

                      {/* Status & Delete */}
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDeleteMember(emp.id, emp.name);
                          }}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
                          title={language === 'ar' ? 'حذف الموظف' : 'Delete Employee'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Cover visual arrow */}
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 absolute right-3 rtl:left-3 rtl:right-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 rtl:-translate-x-1" />
                  </div>
                ))}

                {filteredEmployeesInsideDept.length === 0 && (
                  <div className="col-span-full py-12 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-10 h-10 mx-auto opacity-20 mb-3" />
                    <p className="font-bold text-sm">{language === 'ar' ? 'لم نجد أي موظفين تطابق البحث أو الصلاحية.' : 'No members found matching filters.'}</p>
                    <button
                      onClick={() => { setEmpSearch(''); setRoleFilter('ALL'); }}
                      className="mt-2 text-xs text-blue-600 underline font-bold"
                    >
                      {language === 'ar' ? 'عرض كافة موظفي القسم' : 'Reset filters'}
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Form addition column */}
            <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
              
              <div className="flex gap-2 items-center pb-3 border-b border-slate-150 dark:border-slate-800">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-extrabold text-slate-850 dark:text-white">
                  {language === 'ar' ? 'توظيف عضو جديد' : 'Onboard New Staff'}
                </h4>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-500/10 text-rose-600 text-xs rounded-xl flex items-center gap-2 border border-rose-550/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'الاسم الثنائي للموظف *' : 'Employee Name *'}</label>
                  <input 
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Tariq Fadel"
                    className="w-full text-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'البريد الإلكتروني المخصص *' : 'Work Email *'}</label>
                  <input 
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full text-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'رقم الهاتف المباشر للاتصال' : 'Mobile Number'}</label>
                  <input 
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="w-full text-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'رتبة الصلاحية' : 'Privilege Role'}</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as Role)}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Viewer">Viewer (مشاهد)</option>
                      <option value="Editor">Editor (محرر)</option>
                      <option value="Admin">Admin (مدير)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'التقييم الأولي' : 'Initial Rating'}</label>
                    <select
                      value={newRating}
                      onChange={e => setNewRating(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none cursor-pointer font-mono"
                    >
                      <option value="5.0">⭐ 5.0</option>
                      <option value="4.8">⭐ 4.8</option>
                      <option value="4.5">⭐ 4.5</option>
                      <option value="4.0">⭐ 4.0</option>
                      <option value="3.5">⭐ 3.5</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'رتبة الكفاءة السنوية' : 'Annual Grade'}</label>
                  <select
                    value={newPerfScore}
                    onChange={e => setNewPerfScore(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                  >
                    <option value="A+">A+ (ممتاز جداً مرتفع)</option>
                    <option value="A">A (ممتاز)</option>
                    <option value="B+">B+ (جيد جداً مرتفع)</option>
                    <option value="B">B (جيد جداً)</option>
                    <option value="C">C (مرضي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">{language === 'ar' ? 'نبذة مهنية عن تخصصه' : 'Teammate Bio'}</label>
                  <textarea
                    placeholder="Responsibility, coding stack, languages..."
                    value={newBio}
                    onChange={e => setNewBio(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none h-16 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all h-11 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تعدين وتوظيف الكادر' : 'Assign & Complete Onboarding'}</span>
                </button>
              </form>

            </div>

          </div>

        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* VIEW 3: DETAILED EMPLOYEE VIEW (PROFILE SUMMARY PAGE) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {currentView === 'employee-detail' && currentEmployee && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('department-employees');
                setSelectedEmployeeId(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 text-xs font-black rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-850 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{language === 'ar' ? 'رجوع لقائمة موظفي القسم' : 'Back to Employee List'}</span>
            </button>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {language === 'ar' ? 'الملف الشخصي الموحد والمصادق' : 'Certified Dossier Ledger'}
            </span>
          </div>

          {/* Detailed Employee Profile Card */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg relative">
            
            {/* Top decorative gradient banner */}
            <div className={`h-28 bg-gradient-to-r ${currentEmployee.avatarColor} opacity-90 relative`} />

            {/* Float Avatar Overlap */}
            <div className="absolute top-16 left-6 rtl:right-6 rtl:left-auto">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentEmployee.avatarColor} border-4 border-white dark:border-[#0f172a] shadow-md flex items-center justify-center text-white text-3xl font-black`}>
                {currentEmployee.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Contents */}
            <div className="pt-16 pb-8 px-6 space-y-8">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-850 dark:text-white capitalize">
                      {currentEmployee.name}
                    </h3>
                    
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${currentEmployee.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                      {currentEmployee.status === 'Active' ? (language === 'ar' ? 'نشط بالمنصة' : 'Active') : (language === 'ar' ? 'معلق / بانتظار تفعيل' : 'Pending')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono mt-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 opacity-60" />
                    <span>{currentEmployee.email}</span>
                  </p>
                </div>

                {/* Performance score float badge */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-3 rounded-xl shadow-inner text-right md:-translate-y-6">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest">{language === 'ar' ? 'تقييم الكفاءة' : 'Performance'}</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{currentEmployee.performanceScore}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Professional Dossier columns & grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* General Bio and metrics */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Biography */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      {language === 'ar' ? 'النبذة المهنية للموظف' : 'Teammate Biography'}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      {currentEmployee.bio}
                    </p>
                  </div>

                  {/* Key Stats Portfolio Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="p-4 bg-slate-50/40 dark:bg-slate-900/25 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <Phone className="w-5 h-5 text-indigo-500" />
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'هاتف التواصل المباشر' : 'Contact Direct'}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{currentEmployee.phone}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/40 dark:bg-slate-900/25 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'تاريخ الانضمام الرسمي' : 'Enrollment Date'}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{currentEmployee.joinDate}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/40 dark:bg-slate-900/25 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'المهام والاشتراكات المنجزة' : 'Activities Handled'}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{currentEmployee.tasksCompleted} {language === 'ar' ? 'مهمة وتعديل' : 'Completed'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Operational Settings: Move Department, change role, adjust active status */}
                  <div className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-slate-50/30 dark:bg-[#080d1a] space-y-4">
                    
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Settings2 className="w-4 h-4 text-blue-500" />
                      {language === 'ar' ? 'تعديل الإقامة والمهام الإدارية للموظف' : 'Reassign Corporate Seat & Permissions'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Move Dept */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400">{language === 'ar' ? 'نقل الموظف لقسم آخر' : 'Transfer Department'}</label>
                        <select
                          value={currentEmployee.department}
                          onChange={e => handleTransferDepartment(currentEmployee.id, e.target.value)}
                          className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer"
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{language === 'ar' ? d.name_ar : d.name_en}</option>
                          ))}
                        </select>
                      </div>

                      {/* Modify Permissions Level */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400">{language === 'ar' ? 'الرتبة والصلاحيات' : 'Role Authorization'}</label>
                        <select
                          value={currentEmployee.role}
                          onChange={e => handleToggleRole(currentEmployee.id, e.target.value as Role)}
                          className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer"
                        >
                          <option value="Viewer">Viewer (مشاهدة فقط للتقارير المكتوبة)</option>
                          <option value="Editor">Editor (محرر - إضافة عوائد وتغيير النسب)</option>
                          <option value="Admin">Admin (وصول كامل لكل المنظومة)</option>
                        </select>
                      </div>

                      {/* Performance rating selector */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400">{language === 'ar' ? 'كود الفئة التقييمية' : 'Performance Category grade'}</label>
                        <select
                          value={currentEmployee.performanceScore}
                          onChange={e => handleUpdatePerf(currentEmployee.id, e.target.value)}
                          className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer font-mono"
                        >
                          <option value="A+">A+ (مستوى نموذجي فائق)</option>
                          <option value="A">A (ممتاز وقوي)</option>
                          <option value="B+">B+ (متميز وبانتظار ترقية)</option>
                          <option value="B">B (متوسط الكفاءة)</option>
                          <option value="C">C (يحتاج مراجعة مهنية)</option>
                        </select>
                      </div>

                      {/* Toggle active / pending status */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400">{language === 'ar' ? 'تجميد / إعادة تنشيط الموظف بالمنصة' : 'Teammate Status Toggle'}</label>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(currentEmployee.id)}
                          className={`w-full py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            currentEmployee.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/30'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${currentEmployee.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                          <span>
                            {currentEmployee.status === 'Active' ? (language === 'ar' ? 'الموظف نشط (اضغط للتعليق)' : 'Teammate Active (Click to freeze)') : (language === 'ar' ? 'الموظف معلق (اضغط للتنشيط)' : 'Teammate Suspended (Click to wake)')}
                          </span>
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Rating Interactive Card (Right Columns) */}
                <div className="md:col-span-1 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl text-center space-y-6">
                  
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-black tracking-widest text-slate-400 block">{language === 'ar' ? 'تقييم المدير المسؤول' : 'Corporate Core Rating'}</span>
                    
                    <div className="flex flex-col items-center py-4 bg-white dark:bg-[#0c1222] rounded-2xl border border-slate-150 dark:border-slate-800 shadow-inner">
                      <span className="text-5xl font-black text-slate-850 dark:text-white font-mono">{currentEmployee.rating.toFixed(1)}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{language === 'ar' ? 'من أصل 5.0 نقاط' : 'out of 5.0 points'}</span>

                      <div className="flex text-amber-500 mt-3.5 gap-1 shadow-xs bg-amber-500/5 px-2.5 py-1 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(currentEmployee.rating) ? 'fill-current text-amber-500' : 'opacity-20 text-slate-400'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating dynamic slider to immediately persist and update values */}
                  <div className="space-y-4 pt-2 text-right">
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400">
                      {language === 'ar' ? 'تعديل التقييم المهني للموظف:' : 'Adjust Employee Score:'}
                    </label>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-400 font-mono">
                        <span>1.0</span>
                        <span className="text-blue-500">{currentEmployee.rating.toFixed(1)} / 5.0</span>
                        <span>5.0</span>
                      </div>
                      <input 
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={currentEmployee.rating}
                        onChange={e => handleUpdateRating(currentEmployee.id, Number(e.target.value))}
                        className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed leading-normal text-center bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                      {language === 'ar' 
                        ? 'تعديل التقييم يرفع من منسوب كفاءة القسم الإجمالية وتقارير الأداء السنوية فورياً.' 
                        : 'Adjusting rating alters overall branch efficiency aggregate and annual reports instantly.'}
                    </p>
                  </div>

                  {/* Delete Employee permanently trigger */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => triggerDeleteMember(currentEmployee.id, currentEmployee.name)}
                      className="w-full py-3 bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-600 text-xs font-extrabold rounded-xl transition-all border border-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>{language === 'ar' ? 'فصل الموظف نهائياً' : 'Deprecate & Delete Record'}</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* CUSTOM SECURE CONFIRMATION MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in" 
            onClick={() => setConfirmModal(null)}
          />
          
          {/* Modal Container */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 text-right rtl:text-right ltr:text-left">
            <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center">
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {confirmModal.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            {/* Warning note */}
            <div className={`mt-4 p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-450 rounded-xl text-xs flex gap-2 items-center ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>
                {language === 'ar' 
                  ? 'يرجى الحذر! هذا الإجراء نهائي ولا يمكن التراجع عنه لاحقاً.' 
                  : 'Warning: This action is permanent and cannot be undone afterward.'}
              </span>
            </div>

            {/* Actions */}
            <div className={`mt-6 flex justify-end gap-3 ${language === 'ar' ? 'flex-row-reverse z-10' : 'flex-row z-15'}`}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black rounded-lg transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء وتراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.type === 'department') {
                    handleDeleteDepartmentAction(confirmModal.id);
                  } else {
                    handleDeleteMemberAction(confirmModal.id);
                  }
                  setConfirmModal(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shadow-rose-600/10"
              >
                {language === 'ar' ? 'تأكيد الحذف نهائياً' : 'Yes, Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
