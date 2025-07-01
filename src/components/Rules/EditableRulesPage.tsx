import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit3, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../utils/storage';
import { Rule } from '../../types';
import { hasPermission } from '../../utils/ranks';

export const EditableRulesPage: React.FC = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [newRule, setNewRule] = useState({
    category: '',
    title: '',
    description: '',
    rules: [''],
    color: 'blue',
    icon: '📋',
    order: 0
  });

  const defaultRules: Rule[] = [
    {
      id: '1',
      category: 'general',
      title: 'Genel Kurallar',
      description: 'Sunucuda uyulması gereken temel kurallar',
      rules: [
        'Sunucuda saygılı ve nazik davranın',
        'Küfür, hakaret ve argo kelimeler kullanmayın',
        'Spam yapmayın ve flood atmayın',
        'Reklam yapmak kesinlikle yasaktır',
        'Oyun içi ekonomiyi bozmaya çalışmayın',
        'Hile, bug abuse ve exploit kullanmayın',
        'Diğer oyuncuları rahatsız etmeyin',
        'Sunucu kurallarına uyun ve yetkililerle işbirliği yapın'
      ],
      color: 'blue',
      icon: '📋',
      order: 1
    },
    {
      id: '2',
      category: 'staff',
      title: 'Yetkili Kuralları',
      description: 'Yetkili personel için özel kurallar',
      rules: [
        'Yetkilerinizi kötüye kullanmayın',
        'Adil ve objektif davranın',
        'Kişisel çıkarlarınız için yetki kullanmayın',
        'Diğer yetkililerle saygılı iletişim kurun',
        'Ceza verirken sebep belirtin',
        'Büyük kararları üst yetkililerle görüşün',
        'Aktif olmaya çalışın ve sorumluluklarınızı yerine getirin',
        'Sunucu sırlarını paylaşmayın'
      ],
      color: 'green',
      icon: '🛡️',
      order: 2
    },
    {
      id: '3',
      category: 'chat',
      title: 'Chat Kuralları',
      description: 'Sohbet kanalları için kurallar',
      rules: [
        'Büyük harfle yazmayın (CAPS LOCK)',
        'Aynı mesajı tekrar tekrar atmayın',
        'Kişisel bilgilerinizi paylaşmayın',
        'Link paylaşımı yapmayın',
        'Politik ve dini konularda tartışma yapmayın',
        'Diğer oyuncuları taciz etmeyin',
        'Uygunsuz içerik paylaşmayın',
        'Türkçe dışında dil kullanmayın'
      ],
      color: 'purple',
      icon: '💬',
      order: 3
    }
  ];

  useEffect(() => {
    const storedRules = storage.getRules();
    if (storedRules.length === 0) {
      storage.setRules(defaultRules);
      setRules(defaultRules);
    } else {
      setRules(storedRules);
    }
  }, []);

  const handleCreateRule = () => {
    if (!user || !hasPermission(user.rank, 'edit_rules')) return;
    if (!newRule.title.trim() || !newRule.description.trim() || newRule.rules.filter(r => r.trim()).length === 0) return;

    const rule: Rule = {
      id: Date.now().toString(),
      category: newRule.category || 'custom',
      title: newRule.title.trim(),
      description: newRule.description.trim(),
      rules: newRule.rules.filter(r => r.trim()),
      color: newRule.color,
      icon: newRule.icon,
      order: newRule.order || rules.length + 1
    };

    const updatedRules = [...rules, rule].sort((a, b) => a.order - b.order);
    setRules(updatedRules);
    storage.setRules(updatedRules);
    
    setNewRule({
      category: '',
      title: '',
      description: '',
      rules: [''],
      color: 'blue',
      icon: '📋',
      order: 0
    });
    setShowRuleForm(false);
  };

  const handleUpdateRule = () => {
    if (!user || !hasPermission(user.rank, 'edit_rules') || !editingRule) return;
    if (!newRule.title.trim() || !newRule.description.trim() || newRule.rules.filter(r => r.trim()).length === 0) return;

    const updatedRule: Rule = {
      ...editingRule,
      title: newRule.title.trim(),
      description: newRule.description.trim(),
      rules: newRule.rules.filter(r => r.trim()),
      color: newRule.color,
      icon: newRule.icon,
      order: newRule.order
    };

    const updatedRules = rules.map(rule => 
      rule.id === editingRule.id ? updatedRule : rule
    ).sort((a, b) => a.order - b.order);
    
    setRules(updatedRules);
    storage.setRules(updatedRules);
    
    setEditingRule(null);
    setShowRuleForm(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (!user || !hasPermission(user.rank, 'edit_rules')) return;

    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    storage.setRules(updatedRules);
  };

  const startEdit = (rule: Rule) => {
    setEditingRule(rule);
    setNewRule({
      category: rule.category,
      title: rule.title,
      description: rule.description,
      rules: [...rule.rules],
      color: rule.color,
      icon: rule.icon,
      order: rule.order
    });
    setShowRuleForm(true);
  };

  const addRuleItem = () => {
    setNewRule({
      ...newRule,
      rules: [...newRule.rules, '']
    });
  };

  const updateRuleItem = (index: number, value: string) => {
    const updatedRules = [...newRule.rules];
    updatedRules[index] = value;
    setNewRule({
      ...newRule,
      rules: updatedRules
    });
  };

  const removeRuleItem = (index: number) => {
    if (newRule.rules.length > 1) {
      const updatedRules = newRule.rules.filter((_, i) => i !== index);
      setNewRule({
        ...newRule,
        rules: updatedRules
      });
    }
  };

  const getSectionColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
      green: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-400',
      red: 'from-red-500/10 to-red-600/10 border-red-500/30 text-red-400',
      purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-400',
      yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
      orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/30 text-orange-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (!user) return null;

  const canEdit = hasPermission(user.rank, 'edit_rules');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-orange-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">📖 Sunucu Kuralları</h2>
              <p className="text-gray-400 text-lg">ConsoleCraft sunucusunda uyulması gereken tüm kurallar</p>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => {
                setEditingRule(null);
                setNewRule({
                  category: '',
                  title: '',
                  description: '',
                  rules: [''],
                  color: 'blue',
                  icon: '📋',
                  order: rules.length + 1
                });
                setShowRuleForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              📝 Yeni Kural Bölümü
            </button>
          )}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-6">
        {rules.sort((a, b) => a.order - b.order).map(rule => (
          <div
            key={rule.id}
            className={`bg-gradient-to-r ${getSectionColor(rule.color)} border rounded-xl p-6 hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{rule.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{rule.title}</h3>
                  <p className="text-gray-300">{rule.description}</p>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(rule)}
                    className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {rule.rules.map((ruleText, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-r ${getSectionColor(rule.color)} border flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-200 group-hover:text-white transition-colors duration-200 flex-1">
                    {ruleText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {rules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Henüz Kural Yok</h3>
            <p className="text-gray-500">İlk kural bölümünü oluşturun.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Rule Modal */}
      {showRuleForm && canEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingRule ? '✏️ Kural Düzenle' : '📝 Yeni Kural Bölümü'}
              </h3>
              <button
                onClick={() => {
                  setShowRuleForm(false);
                  setEditingRule(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={newRule.title}
                    onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Kural başlığı..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                  <input
                    type="text"
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Kategori adı..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  rows={2}
                  placeholder="Kural açıklaması..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Renk</label>
                  <select
                    value={newRule.color}
                    onChange={(e) => setNewRule({ ...newRule, color: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="blue">🔵 Mavi</option>
                    <option value="green">🟢 Yeşil</option>
                    <option value="red">🔴 Kırmızı</option>
                    <option value="purple">🟣 Mor</option>
                    <option value="yellow">🟡 Sarı</option>
                    <option value="orange">🟠 Turuncu</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İkon</label>
                  <input
                    type="text"
                    value={newRule.icon}
                    onChange={(e) => setNewRule({ ...newRule, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="📋"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sıra</label>
                  <input
                    type="number"
                    value={newRule.order}
                    onChange={(e) => setNewRule({ ...newRule, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kurallar</label>
                <div className="space-y-2">
                  {newRule.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRuleItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder={`Kural ${index + 1}...`}
                      />
                      {newRule.rules.length > 1 && (
                        <button
                          onClick={() => removeRuleItem(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={addRuleItem}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Kural Ekle
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRuleForm(false);
                    setEditingRule(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={editingRule ? handleUpdateRule : handleCreateRule}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingRule ? '💾 Güncelle' : '📝 Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Warning */}
      {!canEdit && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <h4 className="text-lg font-semibold text-yellow-400">Bilgilendirme</h4>
          </div>
          <p className="text-gray-300">
            Kuralları düzenlemek için yeterli yetkiniz yok. Sadece okuma erişiminiz bulunmaktadır.
          </p>
        </div>
      )}
    </div>
  );
};