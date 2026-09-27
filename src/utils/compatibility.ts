import { BloodType } from '../types/blood';

export interface CompatibilityInfo {
  canDonateTo: BloodType[];
  canReceiveFrom: BloodType[];
  rarityPercentage: string;
  description: string;
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
}

export const BLOOD_COMPATIBILITY: Record<BloodType, CompatibilityInfo> = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    rarityPercentage: 'حوالي 7%',
    description: 'المتبرع العام الشامل لخلايا الدم الحمراء - يُعطى لجميع الفصائل في حالات الطوارئ القصوى عندما يتعذر فحص فصيلة المصاب.',
    isUniversalDonor: true,
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    rarityPercentage: 'حوالي 37% (الأكثر شيوعاً)',
    description: 'الفصيلة الأكثر طلباً في بنوك الدم، تعطي جميع الفصائل الموجبة وتستقبل فقط من O+ و O-.',
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    rarityPercentage: 'حوالي 6%',
    description: 'فصيلة نادرة ومهمة جداً، تستقبل فقط من الفصائل السالبة المتوافقة.',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rarityPercentage: 'حوالي 34%',
    description: 'ثاني أكثر الفصائل شيوعاً، يستقبل أصحابها من أربع فصائل مختلفة.',
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    rarityPercentage: 'حوالي 2% (نادرة جداً)',
    description: 'فصيلة شحيحة في بنوك الدم، تشهد طلباً عاجلاً متكرراً لعمليات زراعة الأعضاء والنزيف الحاد.',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rarityPercentage: 'حوالي 9%',
    description: 'فصيلة هامة تسهم في توفير صفائح دموية حيوية لمرضى السرطان واللوكيميا.',
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rarityPercentage: 'أقل من 1% (الأندر على الإطلاق)',
    description: 'أندر فصيلة دم على مستوى العالم، ويُعد بلازما دم AB- و AB+ متبرعاً عاماً للبلازما لجميع المرضى.',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    rarityPercentage: 'حوالي 3%',
    description: 'المستقبل العام الشامل - يمكن لحامله استقبال دم من كافة الفصائل دون استثناء بأمان تام.',
    isUniversalRecipient: true,
  },
};

export const ALL_BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
