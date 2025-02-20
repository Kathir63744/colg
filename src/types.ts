export interface FormData {
    id?: string;
    createdAt?: string;
    photoUrl?: string | null;
    name: string;
    email: string;
    mobile: string;
    department: string;
    photo: string | File;
    date: string;
    objective: string;
    report: string;
    eventName: string;
    dateFrom: string;
    dateTo: string;
  }
  
  export type Section = 'home' | 'eventReport' | 'recentReports' | 'viewAllReports';
  export type FormType = 'form1' | 'form2';