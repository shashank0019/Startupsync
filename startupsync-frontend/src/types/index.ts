export interface Experience {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Skill {
  name: string;
  category?: string;
  level?: string;
}

// Authentication Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  profilePhotoUrl?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  availabilityStatus: string;
  profileCompletionPercentage: number;
  headline?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  createdAt: string;
  updatedAt: string;
  experiences?: Experience[];
  educations?: Education[];
  projects?: Project[];
  skills?: Skill[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Startup Types
export interface Startup {
  id: string;
  name: string;
  description: string;
  tagline: string;
  logoUrl?: string;
  founder: User;
  industry: string;
  fundingStage: string;
  status: string;
  teamSizeNeeded?: number;
  location: string;
  websiteUrl?: string;
  isRemote: boolean;
  requiredSkillIds: string[];
  visibility: string;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStartupRequest {
  name: string;
  description: string;
  tagline: string;
  industry: string;
  fundingStage: string;
  location: string;
  teamSizeNeeded?: number;
  isRemote: boolean;
  websiteUrl?: string;
  requiredSkillIds: string[];
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  startup?: Startup;
  leader: User;
  members: TeamMember[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  user?: User;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePhotoUrl?: string;
  position?: string;
  role: string;
  joinedAt: string;
  status?: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  startupId?: string;
}

// Chat Types
export interface ChatRoom {
  id: string;
  name: string;
  members: User[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  chatRoomId: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreateMessageRequest {
  content: string;
  chatRoomId: string;
}

// Notification Types
export interface Notification {
  id: string;
  recipient: User;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

// Application Types
export interface Application {
  id: string;
  applicant: User;
  startup: Startup;
  status: string;
  coverLetter: string;
  appliedAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  startupId: string;
  coverLetter: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalStartups: number;
  totalApplications: number;
  totalTeams: number;
  activeUsers: number;
  userGrowthRate: number;
  startupGrowthRate: number;
  averageTeamSize: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message: string;
  status: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
