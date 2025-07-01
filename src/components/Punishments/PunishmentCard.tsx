import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Clock, 
  User,
  ThumbsUp,
  Send
} from 'lucide-react';
import { PunishmentRecord, Comment } from '../../types';
import { getRankConfig } from '../../utils/ranks';
import { useAuth } from '../../contexts/AuthContext';

interface PunishmentCardProps {
  punishment: PunishmentRecord;
  onLike: (punishmentId: string) => void;
  onComment: (punishmentId: string, comment: string) => void;
}

export const PunishmentCard: React.FC<PunishmentCardProps> = ({
  punishment,
  onLike,
  onComment
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  if (!user) return null;

  const isLiked = punishment.likes.includes(user.id);
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} dakika`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} saat`;
    return `${Math.floor(minutes / 1440)} gün`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getPunishmentColor = (type: string) => {
    switch (type) {
      case 'ban': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'mute': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'kick': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getPunishmentText = (type: string) => {
    switch (type) {
      case 'ban': return 'Ban';
      case 'mute': return 'Mute';
      case 'kick': return 'Kick';
      default: return type;
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setIsCommenting(true);
      setTimeout(() => {
        onComment(punishment.id, newComment.trim());
        setNewComment('');
        setIsCommenting(false);
      }, 500);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPunishmentColor(punishment.type)}`}>
              {getPunishmentText(punishment.type).toUpperCase()}
            </span>
            {punishment.isActive && (
              <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs rounded-full">
                AKTİF
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {punishment.targetUsername}
          </h3>
          <p className="text-gray-300">{punishment.reason}</p>
        </div>
        
        <div className="text-right text-sm text-gray-400">
          <div className="flex items-center gap-1 mb-1">
            <User className="h-4 w-4" />
            <span>{punishment.staffUsername}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(punishment.timestamp)}</span>
          </div>
        </div>
      </div>

      {punishment.duration && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            ⏱️ Süre: {formatDuration(punishment.duration)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
        <button
          onClick={() => onLike(punishment.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLiked
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{punishment.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{punishment.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {punishment.comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-white">{comment.username}</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorum yaz..."
              className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              disabled={!newComment.trim() || isCommenting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              {isCommenting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};