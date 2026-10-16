import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { startupService } from '../../api/startupService';
import { Upload, Rocket, X, Plus } from 'lucide-react';

interface CreateStartupFormData {
  name: string;
  logoUrl: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  industry: string;
  fundingStage: string;
  status: string;
  location: string;
  isRemote: boolean;
  teamSizeNeeded: string;
  websiteUrl: string;
  requiredSkills: string;
  visibility: string;
}

export const CreateStartupPage: React.FC = () => {
  const navigate = useNavigate();
  const { formData, errors, handleChange, setFieldError } = useForm<CreateStartupFormData>({
    name: '',
    logoUrl: '',
    tagline: '',
    description: '',
    mission: '',
    vision: '',
    industry: '',
    fundingStage: 'IDEA',
    status: 'DRAFT',
    location: '',
    isRemote: false,
    teamSizeNeeded: '',
    websiteUrl: '',
    requiredSkills: '',
    visibility: 'PUBLIC',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [customSkills, setCustomSkills] = useState<string[]>([]);

  const addCustomSkill = (skill: string) => {
    if (skill.trim() && !customSkills.includes(skill.trim())) {
      setCustomSkills([...customSkills, skill.trim()]);
    }
  };

  const removeCustomSkill = (skill: string) => {
    setCustomSkills(customSkills.filter(s => s !== skill));
  };

  const handleSaveDraft = async () => {
    if (!formData.name.trim()) {
      setFieldError('name', 'Startup name is required');
      return;
    }
    setIsLoading(true);
    try {
      const skillIds = [...formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s), ...customSkills];
      const createData = {
        ...formData,
        status: 'DRAFT',
        requiredSkillIds: skillIds,
        teamSizeNeeded: formData.teamSizeNeeded ? parseInt(formData.teamSizeNeeded) : undefined,
      };
      const result = await startupService.createStartup(createData);
      setSuccessMessage('Draft saved successfully!');
      setTimeout(() => navigate(`/startup-workspace/${result.id}`), 1500);
    } catch (error: any) {
      setFieldError('general', error.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const skillIds = [...formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s), ...customSkills];
      const createData = {
        ...formData,
        status: 'ACTIVE',
        requiredSkillIds: skillIds,
        teamSizeNeeded: formData.teamSizeNeeded ? parseInt(formData.teamSizeNeeded) : undefined,
      };
      const result = await startupService.createStartup(createData);
      setSuccessMessage('Startup published successfully!');
      setTimeout(() => navigate(`/startup-workspace/${result.id}`), 1500);
    } catch (error: any) {
      setFieldError('general', error.response?.data?.message || 'Failed to publish startup');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!formData.name.trim()) {
      setFieldError('name', 'Startup name is required');
      isValid = false;
    }

    if (!formData.tagline.trim()) {
      setFieldError('tagline', 'Tagline is required');
      isValid = false;
    }

    if (!formData.description.trim()) {
      setFieldError('description', 'Description is required');
      isValid = false;
    }

    if (!formData.industry) {
      setFieldError('industry', 'Industry is required');
      isValid = false;
    }

    if (!formData.location.trim()) {
      setFieldError('location', 'Location is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const skillIds = formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const createData = {
        name: formData.name,
        logoUrl: formData.logoUrl,
        tagline: formData.tagline,
        description: formData.description,
        mission: formData.mission,
        vision: formData.vision,
        industry: formData.industry,
        fundingStage: formData.fundingStage,
        status: formData.status,
        location: formData.location,
        isRemote: formData.isRemote,
        teamSizeNeeded: formData.teamSizeNeeded ? parseInt(formData.teamSizeNeeded) : undefined,
        websiteUrl: formData.websiteUrl || undefined,
        requiredSkillIds: skillIds,
        visibility: formData.visibility,
      };

      const result = await startupService.createStartup(createData);
      setSuccessMessage('Startup created successfully!');
      setTimeout(() => navigate(`/startup-workspace/${result.id}`), 1500);
    } catch (error: any) {
      console.error('Error creating startup:', error);
      setFieldError('general', error.response?.data?.message || 'Failed to create startup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create Startup</h1>
          <p className="text-gray-600 mt-2">Launch your startup journey on StartupSync</p>
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
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startup Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        placeholder="Enter logo URL"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter a URL for your startup logo</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., TechVenture"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline *</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="One-line description of your startup"
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.tagline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tagline && <p className="mt-1 text-sm text-red-600">{errors.tagline}</p>}
                  <p className="mt-1 text-xs text-gray-500">{formData.tagline.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your startup, your vision, and what makes you unique..."
                    rows={6}
                    maxLength={2000}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  <p className="mt-1 text-xs text-gray-500">{formData.description.length}/2000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                  <textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    placeholder="What is your startup's mission?"
                    rows={3}
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">{formData.mission.length}/2000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                  <textarea
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    placeholder="What is your startup's vision for the future?"
                    rows={3}
                    maxLength={2000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">{formData.vision.length}/2000</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Startup Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Startup Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                  <select
                    name="fundingStage"
                    value={formData.fundingStage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="IDEA">Idea</option>
                    <option value="SEED">Seed</option>
                    <option value="SERIES_A">Series A</option>
                    <option value="SERIES_B">Series B</option>
                    <option value="SERIES_C">Series C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="INVITE_ONLY">Invite Only</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />

            {/* Location & Team */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Location & Team</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Fully Remote</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size Needed</label>
                  <input
                    type="number"
                    name="teamSizeNeeded"
                    value={formData.teamSizeNeeded}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Skills Required */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Required</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <textarea
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    placeholder="List skills separated by commas (e.g., React, Node.js, UI Design, Marketing)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Common skills: Java, React, Spring Boot, UI/UX, Marketing, Finance</p>
                </div>

                {/* Custom Skills Tags */}
                {customSkills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {customSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeCustomSkill(skill)}
                            className="hover:text-blue-900"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Custom Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom skill"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add custom skill"]') as HTMLInputElement;
                      if (input) {
                        addCustomSkill(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <hr />

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handlePublish();
                }}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Rocket size={18} />
                {isLoading ? 'Publishing...' : 'Publish Startup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
