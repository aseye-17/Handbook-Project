export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'dropdown' | 'date';
  required: boolean;
  placeholder?: string;
  tooltip?: string;
  options?: string[]; // For dropdown fields
  section?: string; // For grouping fields
}

export interface IdeaTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaData {
  id: string;
  templateId: string;
  title: string;
  data: Record<string, any>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const PREDEFINED_TEMPLATES: IdeaTemplate[] = [
  {
    id: 'character',
    name: 'CHARACTER',
    description: 'NAME, AGE, BACKSTORY, MOTIVATIONS',
    icon: 'User',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'name',
        name: 'NAME',
        type: 'text',
        required: true,
        placeholder: 'CHARACTER NAME',
        tooltip: 'THE CHARACTER\'S FULL NAME',
        section: 'BASIC INFO'
      },
      {
        id: 'age',
        name: 'AGE',
        type: 'number',
        required: false,
        placeholder: '25',
        tooltip: 'CHARACTER\'S AGE IN YEARS',
        section: 'BASIC INFO'
      },
      {
        id: 'appearance',
        name: 'APPEARANCE',
        type: 'textarea',
        required: false,
        placeholder: 'DESCRIBE PHYSICAL APPEARANCE...',
        tooltip: 'PHYSICAL DESCRIPTION AND DISTINCTIVE FEATURES',
        section: 'PHYSICAL'
      },
      {
        id: 'personality',
        name: 'PERSONALITY',
        type: 'textarea',
        required: true,
        placeholder: 'DESCRIBE PERSONALITY TRAITS...',
        tooltip: 'KEY PERSONALITY TRAITS AND CHARACTERISTICS',
        section: 'PSYCHOLOGICAL'
      },
      {
        id: 'backstory',
        name: 'BACKSTORY',
        type: 'textarea',
        required: false,
        placeholder: 'CHARACTER\'S HISTORY AND BACKGROUND...',
        tooltip: 'IMPORTANT EVENTS THAT SHAPED THE CHARACTER',
        section: 'BACKGROUND'
      },
      {
        id: 'goals',
        name: 'GOALS',
        type: 'textarea',
        required: false,
        placeholder: 'WHAT DOES THE CHARACTER WANT?',
        tooltip: 'CHARACTER\'S PRIMARY OBJECTIVES AND DESIRES',
        section: 'MOTIVATION'
      },
      {
        id: 'motivations',
        name: 'MOTIVATIONS',
        type: 'textarea',
        required: false,
        placeholder: 'WHY DO THEY WANT IT?',
        tooltip: 'DRIVING FORCES BEHIND CHARACTER\'S ACTIONS',
        section: 'MOTIVATION'
      },
      {
        id: 'conflicts',
        name: 'CONFLICTS',
        type: 'textarea',
        required: false,
        placeholder: 'INTERNAL AND EXTERNAL CONFLICTS...',
        tooltip: 'OBSTACLES AND CHALLENGES THE CHARACTER FACES',
        section: 'CONFLICT'
      },
      {
        id: 'relationships',
        name: 'RELATIONSHIPS',
        type: 'textarea',
        required: false,
        placeholder: 'KEY RELATIONSHIPS WITH OTHER CHARACTERS...',
        tooltip: 'IMPORTANT CONNECTIONS TO OTHER CHARACTERS',
        section: 'RELATIONSHIPS'
      }
    ]
  },
  {
    id: 'setting',
    name: 'SETTING',
    description: 'LOCATION, ATMOSPHERE, CONTEXT',
    icon: 'MapPin',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'name',
        name: 'NAME',
        type: 'text',
        required: true,
        placeholder: 'SETTING NAME',
        tooltip: 'NAME OF THE LOCATION OR SETTING',
        section: 'BASIC INFO'
      },
      {
        id: 'description',
        name: 'DESCRIPTION',
        type: 'textarea',
        required: true,
        placeholder: 'DESCRIBE THE SETTING...',
        tooltip: 'DETAILED DESCRIPTION OF THE LOCATION',
        section: 'DESCRIPTION'
      },
      {
        id: 'keyFeatures',
        name: 'KEY FEATURES',
        type: 'textarea',
        required: false,
        placeholder: 'NOTABLE LANDMARKS, BUILDINGS, FEATURES...',
        tooltip: 'IMPORTANT PHYSICAL FEATURES AND LANDMARKS',
        section: 'FEATURES'
      },
      {
        id: 'atmosphere',
        name: 'ATMOSPHERE',
        type: 'textarea',
        required: false,
        placeholder: 'MOOD, FEELING, AMBIANCE...',
        tooltip: 'THE EMOTIONAL TONE AND FEELING OF THE PLACE',
        section: 'ATMOSPHERE'
      },
      {
        id: 'historicalContext',
        name: 'HISTORICAL CONTEXT',
        type: 'textarea',
        required: false,
        placeholder: 'HISTORY, PAST EVENTS, SIGNIFICANCE...',
        tooltip: 'HISTORICAL BACKGROUND AND SIGNIFICANCE',
        section: 'CONTEXT'
      }
    ]
  },
  {
    id: 'plotPoint',
    name: 'PLOT POINT',
    description: 'EVENT, IMPACT, RELEVANCE',
    icon: 'Zap',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'eventDescription',
        name: 'EVENT DESCRIPTION',
        type: 'textarea',
        required: true,
        placeholder: 'DESCRIBE WHAT HAPPENS...',
        tooltip: 'DETAILED DESCRIPTION OF THE EVENT OR PLOT POINT',
        section: 'EVENT'
      },
      {
        id: 'impact',
        name: 'IMPACT',
        type: 'textarea',
        required: false,
        placeholder: 'HOW DOES THIS AFFECT THE STORY?',
        tooltip: 'CONSEQUENCES AND EFFECTS ON THE STORY',
        section: 'CONSEQUENCES'
      },
      {
        id: 'charactersInvolved',
        name: 'CHARACTERS INVOLVED',
        type: 'textarea',
        required: false,
        placeholder: 'WHICH CHARACTERS ARE PRESENT?',
        tooltip: 'CHARACTERS WHO PARTICIPATE IN THIS EVENT',
        section: 'PARTICIPANTS'
      },
      {
        id: 'chapterRelevance',
        name: 'CHAPTER/SCENE RELEVANCE',
        type: 'text',
        required: false,
        placeholder: 'CHAPTER 5, SCENE 2',
        tooltip: 'WHERE THIS EVENT OCCURS IN THE STORY',
        section: 'PLACEMENT'
      }
    ]
  },
  {
    id: 'object',
    name: 'OBJECT/ITEM',
    description: 'NAME, SIGNIFICANCE, HISTORY',
    icon: 'Package',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'name',
        name: 'NAME',
        type: 'text',
        required: true,
        placeholder: 'OBJECT NAME',
        tooltip: 'NAME OF THE OBJECT OR ITEM',
        section: 'BASIC INFO'
      },
      {
        id: 'description',
        name: 'DESCRIPTION',
        type: 'textarea',
        required: true,
        placeholder: 'DESCRIBE THE OBJECT...',
        tooltip: 'PHYSICAL DESCRIPTION AND APPEARANCE',
        section: 'DESCRIPTION'
      },
      {
        id: 'significance',
        name: 'SIGNIFICANCE',
        type: 'textarea',
        required: false,
        placeholder: 'WHY IS THIS OBJECT IMPORTANT?',
        tooltip: 'IMPORTANCE TO THE STORY OR CHARACTERS',
        section: 'IMPORTANCE'
      },
      {
        id: 'history',
        name: 'HISTORY',
        type: 'textarea',
        required: false,
        placeholder: 'ORIGIN, PAST OWNERS, EVENTS...',
        tooltip: 'BACKGROUND AND HISTORY OF THE OBJECT',
        section: 'BACKGROUND'
      }
    ]
  }
];