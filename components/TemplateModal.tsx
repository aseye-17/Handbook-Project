import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { 
  X, 
  User, 
  MapPin, 
  Zap, 
  Package, 
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  Settings
} from 'lucide-react-native';
import { IdeaTemplate, TemplateField, PREDEFINED_TEMPLATES } from '@/types/templates';

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (templateId: string, data: Record<string, any>) => Promise<boolean>;
  customTemplates?: IdeaTemplate[];
}

const ICON_MAP = {
  User,
  MapPin,
  Zap,
  Package,
  FileText,
  Settings,
};

export default function TemplateModal({ 
  visible, 
  onClose, 
  onSave,
  customTemplates = [] 
}: TemplateModalProps) {
  const [step, setStep] = useState<'selection' | 'form' | 'customBuilder'>('selection');
  const [selectedTemplate, setSelectedTemplate] = useState<IdeaTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const allTemplates = [...PREDEFINED_TEMPLATES, ...customTemplates];

  useEffect(() => {
    if (selectedTemplate) {
      calculateProgress();
    }
  }, [formData, selectedTemplate]);

  const calculateProgress = () => {
    if (!selectedTemplate) return;
    
    const requiredFields = selectedTemplate.fields.filter(field => field.required);
    const completedFields = requiredFields.filter(field => 
      formData[field.id] && formData[field.id].toString().trim() !== ''
    );
    
    const newProgress = requiredFields.length > 0 
      ? (completedFields.length / requiredFields.length) * 100 
      : 100;
    
    setProgress(newProgress);
  };

  const handleTemplateSelect = (template: IdeaTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setErrors({});
    setStep('form');
    
    // Initialize collapsed sections
    const sections = [...new Set(template.fields.map(f => f.section).filter(Boolean))];
    const initialCollapsed: Record<string, boolean> = {};
    sections.forEach(section => {
      initialCollapsed[section!] = false;
    });
    setCollapsedSections(initialCollapsed);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = (): boolean => {
    if (!selectedTemplate) return false;
    
    const newErrors: Record<string, string> = {};
    
    selectedTemplate.fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id].toString().trim() === '')) {
        newErrors[field.id] = 'THIS FIELD IS REQUIRED';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!selectedTemplate || !validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await onSave(selectedTemplate.id, formData);
      if (success) {
        handleClose();
      } else {
        Alert.alert('ERROR', 'FAILED TO SAVE IDEA. PLEASE TRY AGAIN.');
      }
    } catch (error) {
      Alert.alert('ERROR', 'FAILED TO SAVE IDEA. CHECK CONNECTION.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('selection');
    setSelectedTemplate(null);
    setFormData({});
    setErrors({});
    setCollapsedSections({});
    setProgress(0);
    onClose();
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderTemplateCard = (template: IdeaTemplate) => {
    const IconComponent = ICON_MAP[template.icon as keyof typeof ICON_MAP] || FileText;
    
    return (
      <TouchableOpacity
        key={template.id}
        style={styles.templateCard}
        onPress={() => handleTemplateSelect(template)}
      >
        <View style={styles.templateIcon}>
          <IconComponent color="#000000" size={32} strokeWidth={3} />
        </View>
        <Text style={styles.templateName}>{template.name}</Text>
        <Text style={styles.templateDescription}>{template.description}</Text>
        {template.isCustom && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>CUSTOM</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderField = (field: TemplateField) => {
    const hasError = !!errors[field.id];
    
    return (
      <View key={field.id} style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Text style={[styles.fieldLabel, field.required && styles.requiredField]}>
            {field.name}{field.required && ' *'}
          </Text>
          {field.tooltip && (
            <Text style={styles.fieldTooltip}>{field.tooltip}</Text>
          )}
        </View>
        
        <View style={[
          styles.inputContainer,
          hasError && styles.inputContainerError
        ]}>
          {field.type === 'textarea' ? (
            <TextInput
              style={[styles.textareaInput, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor="#666"
              value={formData[field.id] || ''}
              onChangeText={(value) => handleInputChange(field.id, value)}
              multiline
              textAlignVertical="top"
            />
          ) : field.type === 'number' ? (
            <TextInput
              style={[styles.textInput, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor="#666"
              value={formData[field.id]?.toString() || ''}
              onChangeText={(value) => handleInputChange(field.id, parseInt(value) || '')}
              keyboardType="numeric"
            />
          ) : (
            <TextInput
              style={[styles.textInput, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor="#666"
              value={formData[field.id] || ''}
              onChangeText={(value) => handleInputChange(field.id, value)}
            />
          )}
        </View>
        
        {hasError && (
          <Text style={styles.errorText}>{errors[field.id]}</Text>
        )}
      </View>
    );
  };

  const renderFormSection = (section: string, fields: TemplateField[]) => {
    const isCollapsed = collapsedSections[section];
    
    return (
      <View key={section} style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section)}
        >
          <Text style={styles.sectionTitle}>{section}</Text>
          {isCollapsed ? (
            <ChevronRight color="#000000" size={20} strokeWidth={3} />
          ) : (
            <ChevronDown color="#000000" size={20} strokeWidth={3} />
          )}
        </TouchableOpacity>
        
        {!isCollapsed && (
          <View style={styles.sectionContent}>
            {fields.map(renderField)}
          </View>
        )}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.backdrop} />
      <View style={[
        styles.modal,
        step === 'form' && styles.modalExpanded
      ]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'selection' ? 'CHOOSE TEMPLATE' : 
             step === 'form' ? selectedTemplate?.name : 
             'CREATE TEMPLATE'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X color="#000000" size={20} strokeWidth={3} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar (Form Step) */}
        {step === 'form' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% COMPLETE</Text>
          </View>
        )}

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 'selection' && (
            <>
              <View style={styles.templatesGrid}>
                {allTemplates.map(renderTemplateCard)}
                
                {/* Blank Idea Option */}
                <TouchableOpacity
                  style={styles.templateCard}
                  onPress={() => handleTemplateSelect({
                    id: 'blank',
                    name: 'BLANK IDEA',
                    description: 'FREEFORM TEXT',
                    icon: 'FileText',
                    isCustom: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    fields: [{
                      id: 'content',
                      name: 'CONTENT',
                      type: 'textarea',
                      required: true,
                      placeholder: 'WRITE YOUR IDEA...',
                      tooltip: 'FREEFORM IDEA CONTENT'
                    }]
                  })}
                >
                  <View style={styles.templateIcon}>
                    <FileText color="#000000" size={32} strokeWidth={3} />
                  </View>
                  <Text style={styles.templateName}>BLANK IDEA</Text>
                  <Text style={styles.templateDescription}>FREEFORM TEXT</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.createCustomButton}
                onPress={() => setStep('customBuilder')}
              >
                <Plus color="#DAA520" size={20} strokeWidth={3} />
                <Text style={styles.createCustomText}>CREATE CUSTOM TEMPLATE</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'form' && selectedTemplate && (
            <View style={styles.formContainer}>
              {/* Group fields by section */}
              {(() => {
                const sections = [...new Set(selectedTemplate.fields.map(f => f.section).filter(Boolean))];
                const fieldsWithoutSection = selectedTemplate.fields.filter(f => !f.section);
                
                return (
                  <>
                    {fieldsWithoutSection.map(renderField)}
                    {sections.map(section => 
                      renderFormSection(
                        section!, 
                        selectedTemplate.fields.filter(f => f.section === section)
                      )
                    )}
                  </>
                );
              })()}
            </View>
          )}

          {step === 'customBuilder' && (
            <View style={styles.builderContainer}>
              <Text style={styles.builderTitle}>CUSTOM TEMPLATE BUILDER</Text>
              <Text style={styles.builderSubtitle}>COMING SOON - CREATE YOUR OWN TEMPLATES</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        {step === 'form' && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                isLoading && styles.saveButtonLoading
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'SAVING...' : 'SAVE IDEA'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    margin: 24,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#8B4513',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  modalExpanded: {
    maxWidth: 600,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeButton: {
    backgroundColor: '#DAA520',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 8,
  },
  progressContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DAA520',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'right',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 16,
    alignItems: 'center',
    width: '47%',
    minHeight: 120,
    position: 'relative',
    shadowColor: '#8B4513',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  templateIcon: {
    backgroundColor: '#DAA520',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 8,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  templateDescription: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  customBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  customBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  createCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  createCustomText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DAA520',
    marginLeft: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formContainer: {
    gap: 20,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DAA520',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionContent: {
    gap: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  requiredField: {
    color: '#FF4D4F',
  },
  fieldTooltip: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
    borderColor: '#000000',
  },
  inputContainerError: {
    borderColor: '#FF4D4F',
  },
  textInput: {
    fontSize: 14,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  textareaInput: {
    fontSize: 14,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF4D4F',
  },
  errorText: {
    fontSize: 10,
    color: '#FF4D4F',
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 3,
    borderTopColor: '#000000',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#000000',
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  saveButtonLoading: {
    opacity: 0.8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  builderContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  builderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  builderSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});