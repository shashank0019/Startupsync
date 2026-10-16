import React, { useEffect, useState, useCallback } from 'react';
import { invitationService, Invitation } from '../../api/invitationService';
import { Mail, Check, X, Clock, User, Building2, Calendar, Send, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const statusStyle: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: Clock },
  ACCEPTED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: Check },
  DECLINED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: X },
  EXPIRED: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: Clock },
};

export const InvitationsPage: React.FC = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState<'received' | 'sent'>('received');
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const isFounder = user?.role === 'FOUNDER' || user?.role === 'STARTUP_FOUNDER' || user?.role === 'ADMIN';

  const loadInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await invitationService.getMyInvitations();
      setInvitations(result.content);
      
      if (isFounder) {
        // Load sent invitations for founders
        try {
          const sentResult = await invitationService.getPending();
          setSentInvitations(sentResult.content);
        } catch (err) {
          console.error('Failed to load sent invitations:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load invitations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isFounder]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleAccept = async (id: string) => {
    try {
      await invitationService.accept(id);
      loadInvitations();
    } catch (err) {
      console.error('Accept failed:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await invitationService.reject(id);
      loadInvitations();
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  const filtered = filter === 'ALL' 
    ? (view === 'received' ? invitations : sentInvitations)
    : (view === 'received' ? invitations : sentInvitations).filter((i) => i.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invitations</h1>
          <p className="text-slate-500 mt-1">Manage startup team invitations</p>
        </div>
      </div>

      {/* View Toggle */}
      {isFounder && (
        <div className="flex gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setView('received')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === 'received' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Mail className="h-4 w-4 inline mr-2" />
            Received
          </button>
          <button
            onClick={() => setView('sent')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === 'sent' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Send className="h-4 w-4 inline mr-2" />
            Sent
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-slate-200 pb-4">
        {['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== 'ALL' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100">
                {(view === 'received' ? invitations : sentInvitations).filter((i) => i.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Mail className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600 font-medium">
            {view === 'received' ? 'No invitations yet' : 'No sent invitations'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => {
            const style = statusStyle[inv.status] || statusStyle.PENDING;
            const Icon = style.icon;
            
            return (
              <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Startup/User Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {view === 'received' ? (
                          inv.startup?.name?.charAt(0) || 'S'
                        ) : (
                          inv.invitedUser?.firstName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">
                          {view === 'received' ? inv.startup?.name : `${inv.invitedUser?.firstName} ${inv.invitedUser?.lastName}`}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {view === 'received' ? inv.startup?.industry : inv.invitedUser?.email}
                        </p>
                        {inv.message && (
                          <p className="text-sm text-slate-600 mt-3 line-clamp-2 bg-slate-50 p-3 rounded-lg">
                            {inv.message}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{inv.createdAt && new Date(inv.createdAt).toLocaleDateString()}</span>
                          </div>
                          {inv.expiresAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Expires {new Date(inv.expiresAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                      <Icon size={12} /> {inv.status}
                    </span>
                    
                    <div className="flex gap-2 w-full lg:flex-col">
                      {view === 'received' && inv.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAccept(inv.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                          >
                            <Check size={16} /> Accept
                          </button>
                          <button
                            onClick={() => handleReject(inv.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 transition"
                          >
                            <X size={16} /> Decline
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedInvitation(inv);
                          setShowDrawer(true);
                        }}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition"
                      >
                        <Eye size={16} /> View Details
                      </button>
                      <button
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition"
                      >
                        <Mail size={16} /> Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invitation Details Drawer */}
      {showDrawer && selectedInvitation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Invitation Details</h3>
              <button
                onClick={() => {
                  setShowDrawer(false);
                  setSelectedInvitation(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {view === 'received' ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedInvitation.startup?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{selectedInvitation.startup?.name}</h4>
                      <p className="text-sm text-slate-500">{selectedInvitation.startup?.industry}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        <Building2 className="h-3 w-3" />
                        <span>Startup</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Invited By</h5>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold">
                        {selectedInvitation.invitedBy?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {selectedInvitation.invitedBy?.firstName} {selectedInvitation.invitedBy?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    {selectedInvitation.invitedUser?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {selectedInvitation.invitedUser?.firstName} {selectedInvitation.invitedUser?.lastName}
                    </h4>
                    <p className="text-sm text-slate-500">{selectedInvitation.invitedUser?.email}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <User className="h-3 w-3" />
                      <span>Candidate</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedInvitation.message && (
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Message</h5>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{selectedInvitation.message}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Sent</h5>
                  <p className="text-sm text-slate-600">
                    {selectedInvitation.createdAt && new Date(selectedInvitation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedInvitation.expiresAt && (
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Expires</h5>
                    <p className="text-sm text-slate-600">
                      {new Date(selectedInvitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    setSelectedInvitation(null);
                  }}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationsPage;
