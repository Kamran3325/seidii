import React, { useState, useEffect } from 'react';
import { NotebookPen, Plus, X, Search, Tag, Calendar, Edit3, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { Note } from '../../types';

export const NotebookPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    isPrivate: false
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (user) {
      const allNotes = storage.getNotes();
      const userNotes = allNotes.filter(note => 
        note.createdBy === user.id || !note.isPrivate
      );
      setNotes(userNotes);
    }
  }, [user]);

  const handleCreateNote = () => {
    if (!user || !newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrivate: newNote.isPrivate
    };

    const allNotes = storage.getNotes();
    const updatedNotes = [note, ...allNotes];
    storage.setNotes(updatedNotes);
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', tags: [], isPrivate: false });
    setShowNoteForm(false);
  };

  const handleUpdateNote = () => {
    if (!user || !editingNote || !newNote.title.trim() || !newNote.content.trim()) return;

    const updatedNote: Note = {
      ...editingNote,
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags,
      updatedAt: new Date().toISOString(),
      isPrivate: newNote.isPrivate
    };

    const allNotes = storage.getNotes();
    const updatedAllNotes = allNotes.map(note => 
      note.id === editingNote.id ? updatedNote : note
    );
    storage.setNotes(updatedAllNotes);
    
    setNotes(notes.map(note => 
      note.id === editingNote.id ? updatedNote : note
    ));
    
    setEditingNote(null);
    setNewNote({ title: '', content: '', tags: [], isPrivate: false });
    setShowNoteForm(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!user) return;

    const allNotes = storage.getNotes();
    const updatedAllNotes = allNotes.filter(note => note.id !== noteId);
    storage.setNotes(updatedAllNotes);
    
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const addTag = () => {
    if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      isPrivate: note.isPrivate
    });
    setShowNoteForm(true);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NotebookPen className="h-8 w-8 text-purple-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">📓 Not Defteri</h2>
              <p className="text-gray-400 text-lg">Kişisel notlarınız ve hatırlatmalarınız</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEditingNote(null);
              setNewNote({ title: '', content: '', tags: [], isPrivate: false });
              setShowNoteForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            📝 Yeni Not
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Not ara..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tüm Etiketler</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>🏷️ {tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-200 group hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-200">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString('tr-TR')}</span>
                  {note.isPrivate && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                      🔒 Özel
                    </span>
                  )}
                </div>
              </div>
              
              {note.createdBy === user.id && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => startEdit(note)}
                    className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-gray-300 mb-4 line-clamp-3">
              {note.content}
            </p>
            
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30"
                  >
                    🏷️ {tag}
                  </span>
                ))}
              </div>
            )}
            
            {note.updatedAt !== note.createdAt && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  Son güncelleme: {new Date(note.updatedAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {filteredNotes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <NotebookPen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Not Bulunamadı</h3>
            <p className="text-gray-500">Henüz not oluşturmadınız veya arama kriterlerinize uygun not yok.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Note Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingNote ? '✏️ Not Düzenle' : '📝 Yeni Not'}
              </h3>
              <button
                onClick={() => {
                  setShowNoteForm(false);
                  setEditingNote(null);
                  setNewNote({ title: '', content: '', tags: [], isPrivate: false });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Not başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İçerik</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={8}
                  placeholder="Not içeriği..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Etiketler</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Etiket ekle..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-all duration-200"
                  >
                    <Tag className="h-4 w-4" />
                  </button>
                </div>
                
                {newNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newNote.tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
                      >
                        🏷️ {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newNote.isPrivate}
                  onChange={(e) => setNewNote({ ...newNote, isPrivate: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-300">
                  🔒 Bu notu sadece ben görebilir
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowNoteForm(false);
                    setEditingNote(null);
                    setNewNote({ title: '', content: '', tags: [], isPrivate: false });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={editingNote ? handleUpdateNote : handleCreateNote}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingNote ? '💾 Güncelle' : '📝 Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};