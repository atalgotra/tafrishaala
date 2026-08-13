export interface VerifiedContactInfo {
  phoneDisplay: string;
  phoneHref: string;
  emailDisplay: string;
  emailHref: string;
  location: string;
}

export interface ConversionAction {
  id: string;
  label: string;
  href?: string;
  targetId?: string;
  variant: 'primary' | 'secondary' | 'contact';
}

export const VERIFIED_CONTACT_DATA: VerifiedContactInfo = {
  phoneDisplay: '+91 120 691 6903',
  phoneHref: 'tel:+911206916903',
  emailDisplay: 'info@tafrishaala.com',
  emailHref: 'mailto:info@tafrishaala.com',
  location: 'Noida, Uttar Pradesh, India',
};

export const CONVERSION_ACTIONS: ConversionAction[] = [
  {
    id: 'start-learning',
    label: 'START LEARNING →',
    targetId: 'tracks',
    variant: 'primary',
  },
  {
    id: 'talk-to-team',
    label: 'TALK TO TAFRISHAALA →',
    href: 'tel:+911206916903',
    variant: 'secondary',
  },
];
