export type JobCategory =
  | 'Result'
  | 'Admit Card'
  | 'Latest Jobs'
  | 'Answer Key'
  | 'Syllabus'
  | 'Admission';

export type JobStatus = 'pending' | 'approved' | 'rejected';

export interface JobPost {
  id: string;
  title: string;
  shortTitle?: string;
  category: JobCategory;
  department: string;
  postDate: string;
  postedDate?: string; // Standard format YYYY-MM-DD for python scrapers & live dynamic updates
  lastDate?: string;
  shortInfo: string;
  status: JobStatus;
  state?: string; // e.g. 'UP', 'Bihar', 'Rajasthan', 'MP', 'Delhi', 'All India'
  isHot?: boolean;
  totalPosts?: string;
  
  // Important Dates
  importantDates: {
    applicationBegin?: string;
    lastDateApply?: string;
    lastDatePayFee?: string;
    examDate?: string;
    admitCardDate?: string;
    resultDate?: string;
    answerKeyDate?: string;
  };

  // Application Fee
  applicationFee: {
    generalObcEws?: string;
    scStPh?: string;
    allCategoryFemale?: string;
    paymentMode?: string;
  };

  // Age Limit
  ageLimit: {
    asOnDate?: string;
    minAge?: string;
    maxAge?: string;
    extraRules?: string;
  };

  // Vacancy & Eligibility
  vacancyDetails: Array<{
    postName: string;
    totalPosts: string;
    eligibility: string;
    maleVacancy?: string;
    femaleVacancy?: string;
    categoryWiseSeats?: {
        gen?: string;
        obc?: string;
        sc?: string;
        st?: string;
        ews?: string;
    };
  }>;

  selectionProcess?: string;

  // Salary & Syllabus
  salaryDetails?: string;
  syllabusDetails?: string;

  // Important Links
  links: {
    applyOnline?: string;
    downloadNotification?: string;
    officialWebsite?: string;
    downloadAdmitCard?: string;
    downloadResult?: string;
    downloadAnswerKey?: string;
    downloadSyllabus?: string;
    officialSource?: string;
  };

  createdAt: string;
}

export interface MarqueeUpdate {
  id: string;
  text: string;
  link?: string;
  active: boolean;
}
