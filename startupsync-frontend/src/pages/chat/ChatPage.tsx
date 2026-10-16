import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  Send, 
  X,
  Hash,
  Users,
  User,
  Settings,
  Circle,
  CheckCheck
} from 'lucide-react';
import { chatService } from '../../api/chatService';
import { ChatRoom, Message } from '../../types';
import { getWsBaseUrl, useStomp } from '../../hooks/useStomp';
import { formatTime, getInitials } from '../../utils/validation';

export const ChatPage: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'startup' | 'team' | 'recent'>('recent');
  const [isLoading, setIsLoading] = useState(false);


  const { isConnected, publish, subscribe } = useStomp({
    endpoint: `${getWsBaseUrl()}/ws/chat`,
  });

  useEffect(() => {
    loadChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (!selectedRoom) return;
    const sub = subscribe(`/topic/chat/${selectedRoom.id}`, (body) => {
      const msg = body as Message;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => sub.unsubscribe();
  }, [selectedRoom, subscribe]);

  const loadChatRooms = async () => {
    try {
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms);
      if (rooms.length > 0) setSelectedRoom(rooms[0]);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const loadMessages = async (roomId: string) => {
    setIsLoading(true);
    try {
      const response = await chatService.getMessages(roomId, 0, 50);
      setMessages(response.content || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    const content = newMessage.trim();
    setNewMessage('');

    if (isConnected) {
      publish(`/app/chat/${selectedRoom.id}/send`, {
        chatRoomId: selectedRoom.id,
        content,
      });
    } else {
      try {
        const message = await chatService.sendMessage({ content, chatRoomId: selectedRoom.id });
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const filteredRooms = chatRooms.filter(room => {
    if (searchQuery) {
      return room.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="h-screen bg-slate-50 flex">
      {/* LEFT PANEL - Conversations */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">Messages</h1>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'recent', label: 'Recent', icon: Circle },
            { id: 'direct', label: 'Direct', icon: User },
            { id: 'startup', label: 'Startups', icon: Hash },
            { id: 'team', label: 'Teams', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-brand-600 text-brand-600 bg-brand-50' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} className="mx-auto mb-1" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full px-4 py-3 border-b border-slate-100 text-left hover:bg-slate-50 transition group ${
                selectedRoom?.id === room.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{room.name}</h3>
                    {room.lastMessage && (
                      <span className="text-xs text-slate-500">{formatTime(room.lastMessage.createdAt)}</span>
                    )}
                  </div>
                  {room.lastMessage && (
                    <p className="text-sm text-slate-600 truncate">{room.lastMessage.content}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Create Chat Button */}
        <div className="p-4 border-t border-slate-200">
          <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition flex items-center justify-center gap-2">
            <Plus size={18} />
            New Conversation
          </button>
        </div>
      </div>

      {/* CENTER CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold">
                  {selectedRoom.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">{selectedRoom.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Circle size={8} className="text-green-500 fill-green-500" />
                    <span>{selectedRoom.members.length} members online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Phone size={20} className="text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Video size={20} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <MoreVertical size={20} className="text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(msg.sender.firstName, msg.sender.lastName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </h4>
                      <span className="text-xs text-slate-500">{formatTime(msg.createdAt)}</span>
                      <CheckCheck size={14} className="text-blue-500" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-slate-200 max-w-2xl">
                      <p className="text-slate-700">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Composer */}
            <div className="bg-white border-t border-slate-200 px-6 py-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition">
                  <Plus size={20} className="text-slate-600" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button type="button" className="p-1 hover:bg-slate-200 rounded transition">
                      <Smile size={18} className="text-slate-500" />
                    </button>
                    <button type="button" className="p-1 hover:bg-slate-200 rounded transition">
                      <Paperclip size={18} className="text-slate-500" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
              {!isConnected && (
                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                  <Circle size={8} className="animate-pulse" />
                  Connecting to real-time chat…
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="h-24 w-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to StartupSync Chat</h3>
              <p className="text-slate-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL - User Details */}
      {showRightPanel && selectedRoom && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Chat Details</h3>
            <button onClick={() => setShowRightPanel(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-2xl mb-3">
                {selectedRoom.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-bold text-slate-900 text-lg">{selectedRoom.name}</h4>
              <p className="text-sm text-slate-500">{selectedRoom.members.length} members</p>
            </div>
          </div>

          <div className="p-6 border-b border-slate-200">
            <h5 className="font-semibold text-slate-900 mb-4">Members</h5>
            <div className="space-y-3">
              {selectedRoom.members.slice(0, 5).map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                      {member.firstName?.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-slate-500">{member.role || 'Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-slate-200">
            <h5 className="font-semibold text-slate-900 mb-4">Shared Files</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                  <Paperclip size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">project_specs.pdf</p>
                  <p className="text-xs text-slate-500">2.4 MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h5 className="font-semibold text-slate-900 mb-4">Shared Links</h5>
            <div className="space-y-2">
              <span className="block text-sm text-brand-600 hover:underline truncate cursor-pointer">
                https://startupsync.app/project/123
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
