import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../api/profileService';
import { authService } from '../../api/authService';
import { User } from '../../types';
import { getInitials, formatDate } from '../../utils/validation';
import { getAvailabilityColor } from '../../utils/helpers';
import { Briefcase, GraduationCap, Code, BarChart3, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading, setUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    const currentUser = user || authService.getCurrentUser();

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await profileService.getProfile();
        setProfile(data);
        setUser(data);
      } catch (err: any) {
        if (currentUser) {
          setProfile(currentUser);
        } else {
          setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      setProfile(currentUser);
    }

    loadProfile();
  }, [user, authLoading, setUser]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800 font-medium">{error}</p>
          <Link to="/profile/edit" className="mt-4 inline-block text-brand-600 font-semibold hover:underline">
            Create your profile →
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-slate-900">Set up your profile</h2>
        <p className="text-slate-500 mt-2">Add your bio, skills, and links to get discovered by founders.</p>
        <Link
          to="/profile/edit"
          className="mt-6 inline-flex px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const completionPercentage = profile.profileCompletionPercentage || 0;
  const completionColor =
    completionPercentage < 50 ? 'bg-red-500' : completionPercentage < 80 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="animate-fade-in">
      <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl"></div>

      <div className="max-w-4xl mx-auto -mt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-6">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl.startsWith('http') ? profile.profilePhotoUrl : `http://localhost:8080${profile.profilePhotoUrl}`}
                    alt={profile.firstName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-2xl font-bold">{getInitials(profile.firstName, profile.lastName)}</span>
                  </div>
                )}

                <div className="pt-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.headline && <p className="text-lg text-gray-700 mt-1">{profile.headline}</p>}
                  {(profile.currentJobTitle || profile.currentCompany) && (
                    <p className="text-gray-600 mt-1">
                      {[profile.currentJobTitle, profile.currentCompany].filter(Boolean).join(' at ')}
                      {profile.yearsOfExperience != null && profile.yearsOfExperience > 0 && (
                        <span className="text-gray-400"> · {profile.yearsOfExperience} yrs experience</span>
                      )}
                    </p>
                  )}
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(profile.availabilityStatus)}`}
                    >
                      {profile.availabilityStatus?.replace(/_/g, ' ')}
                    </span>
                    {profile.isEmailVerified && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        ✓ Email Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/profile/edit"
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Profile Completion</h3>
              <span className="text-sm font-bold text-gray-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${completionColor} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500">Profile Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500">Applications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500">Invitations</p>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Code size={18} /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center rounded-md bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {profile.experiences && profile.experiences.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Briefcase size={18} /> Experience
              </h3>
              <div className="space-y-4">
                {profile.experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-slate-200 pl-4">
                    <h4 className="font-semibold text-slate-900">{exp.jobTitle}</h4>
                    <p className="text-sm text-slate-600">{exp.companyName}</p>
                    {exp.startDate && exp.endDate && (
                      <p className="text-xs text-slate-500 mt-1">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {profile.educations && profile.educations.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <GraduationCap size={18} /> Education
              </h3>
              <div className="space-y-4">
                {profile.educations.map((edu, index) => (
                  <div key={index} className="border-l-2 border-slate-200 pl-4">
                    <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                    <p className="text-sm text-slate-600">{edu.schoolName}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-xs text-slate-500 mt-1">{edu.fieldOfStudy}</p>
                    )}
                    {edu.startDate && edu.endDate && (
                      <p className="text-xs text-slate-500 mt-1">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3 size={18} /> Projects
              </h3>
              <div className="space-y-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <p className="text-sm text-slate-600 mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{profile.location}</p>
                  </div>
                </div>
              )}
              {profile.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900 font-medium">{profile.phoneNumber}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-slate-100 transition">
                  <span className="text-2xl">🔗</span>
                  <div><p className="text-sm text-gray-600">LinkedIn</p></div>
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <span className="text-2xl">🐙</span>
                  <div><p className="text-sm text-gray-600">GitHub</p></div>
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 transition">
                  <span className="text-2xl">🌐</span>
                  <div><p className="text-sm text-gray-600">Portfolio</p></div>
                </a>
              )}
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-slate-400" />
              Member since <span className="font-semibold text-gray-900">{formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
