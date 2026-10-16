import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { profileService } from '../../api/profileService';
import { User } from '../../types';
import { validateUrl, validatePhoneNumber } from '../../utils/validation';

interface EditFormData {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  location: string;
  phoneNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  currentJobTitle: string;
  currentCompany: string;
  yearsOfExperience: string;
  availabilityStatus: string;
}

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { formData, errors, handleChange, setFieldValue, setFieldError } = useForm<EditFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phoneNumber: user?.phoneNumber || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    currentJobTitle: user?.currentJobTitle || '',
    currentCompany: user?.currentCompany || '',
    yearsOfExperience: user?.yearsOfExperience?.toString() || '',
    availabilityStatus: user?.availabilityStatus || 'AVAILABLE',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>(user?.profilePhotoUrl || '');

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setFieldValue('firstName', data.firstName);
        setFieldValue('lastName', data.lastName);
        setFieldValue('headline', data.headline || '');
        setFieldValue('bio', data.bio || '');
        setFieldValue('location', data.location || '');
        setFieldValue('phoneNumber', data.phoneNumber || '');
        setFieldValue('linkedinUrl', data.linkedinUrl || '');
        setFieldValue('githubUrl', data.githubUrl || '');
        setFieldValue('portfolioUrl', data.portfolioUrl || '');
        setFieldValue('currentJobTitle', data.currentJobTitle || '');
        setFieldValue('currentCompany', data.currentCompany || '');
        setFieldValue('yearsOfExperience', data.yearsOfExperience?.toString() || '');
        setFieldValue('availabilityStatus', data.availabilityStatus || 'AVAILABLE');
        if (data.profilePhotoUrl) {
          setPhotoPreview(data.profilePhotoUrl);
        }
      } catch (err) {
        console.error('Failed to load profile for editing:', err);
      }
    };

    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!formData.firstName.trim()) {
      setFieldError('firstName', 'First name is required');
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      setFieldError('lastName', 'Last name is required');
      isValid = false;
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      setFieldError('phoneNumber', 'Please enter a valid phone number');
      isValid = false;
    }

    if (formData.linkedinUrl && !validateUrl(formData.linkedinUrl)) {
      setFieldError('linkedinUrl', 'Please enter a valid URL');
      isValid = false;
    }

    if (formData.githubUrl && !validateUrl(formData.githubUrl)) {
      setFieldError('githubUrl', 'Please enter a valid URL');
      isValid = false;
    }

    if (formData.portfolioUrl && !validateUrl(formData.portfolioUrl)) {
      setFieldError('portfolioUrl', 'Please enter a valid URL');
      isValid = false;
    }

    return isValid;
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      try {
        const result = await profileService.uploadProfilePhoto(file);
        setSuccessMessage('Profile photo updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await profileService.updateProfile({
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : undefined,
      });
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setFieldError('general', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Photo</label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-xl object-cover border-4 border-gray-200" />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">No photo</div>
                  )}
                </div>
                <div>
                  <label className="block mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <span className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer">
                      Upload Photo
                    </span>
                  </label>
                  <p className="text-sm text-gray-500">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. Full-stack developer passionate about startups"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title</label>
                    <input
                      type="text"
                      name="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    min={0}
                    max={80}
                    placeholder="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <p className="mt-1 text-xs text-gray-500">{formData.bio.length}/500 characters</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.linkedinUrl && <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/yourprofile"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.githubUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.portfolioUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.portfolioUrl && <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl}</p>}
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="AVAILABLE">Available for new opportunities</option>
                <option value="LOOKING">Currently looking</option>
                <option value="OPEN_TO_OPPORTUNITIES">Open to opportunities</option>
                <option value="UNAVAILABLE">Not available</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
