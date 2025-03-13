export type LanguageType = {
  lang: string;
  display: string;
  index: number;
};

export type CountryItem = {
  name: string;
  code: string;
};

export const allLanguages: LanguageType[] = [
  {
    lang: 'english',
    display: 'English',
    index: 0,
  },
  {
    lang: 'spanish',
    display: 'Español',
    index: 1,
  },
  {
    lang: 'arabic',
    display: 'العربية',
    index: 2,
  },
  {
    lang: 'vietnamese',
    display: 'Tiếng việt',
    index: 3,
  },
  {
    lang: 'french',
    display: 'Français',
    index: 4,
  },
  {
    lang: 'portuguese',
    display: 'Português',
    index: 5,
  },
  {
    lang: 'german',
    display: 'Deutsch',
    index: 6,
  },
  {
    lang: 'russian',
    display: 'Русский',
    index: 7,
  },
  {
    lang: 'italian',
    display: 'Italiano',
    index: 8,
  },
  {
    lang: 'turkish',
    display: 'Türk',
    index: 9,
  },
  {
    lang: 'polish',
    display: 'Polski',
    index: 10,
  },
  {
    lang: 'hebrew',
    display: 'עברית',
    index: 11,
  },
  {
    lang: 'dutch',
    display: 'Nederlands',
    index: 12,
  },
  {
    lang: 'swedish',
    display: 'Svenska',
    index: 13,
  },
  {
    lang: 'ukrainian',
    display: 'Українська',
    index: 14,
  },
  {
    lang: 'thai',
    display: 'ภาษาไทย',
    index: 15,
  },
  {
    lang: 'indonesian',
    display: 'Bahasa Indonesia',
    index: 16,
  },
  {
    lang: 'romanian',
    display: 'Română',
    index: 17,
  },
  {
    lang: 'hungarian',
    display: 'Magyar',
    index: 18,
  },
  {
    lang: 'Malay',
    display: 'Melayu',
    index: 19,
  },
  {
    lang: 'japanese',
    display: '日本',
    index: 20,
  },
  {
    lang: 'korean',
    display: '한국어',
    index: 21,
  },
  {
    lang: 'mongolian',
    display: 'Mонгол',
    index: 22,
  },
  {
    lang: 'chinese',
    display: '中文',
    index: 23,
  },
];

export const allCountries: CountryItem[] = [
  {
    name: 'Venezuela',
    code: 'VE',
  },
  {
    name: 'Colombia',
    code: 'CO',
  },
  {
    name: 'Syrian Arab Republic',
    code: 'SY',
  },
  {
    name: 'Nigeria',
    code: 'NG',
  },
  {
    name: 'Argentina',
    code: 'AR',
  },
  {
    name: 'Peru',
    code: 'PE',
  },
  {
    name: 'Mexico',
    code: 'MX',
  },
  {
    name: 'Ecuador',
    code: 'EC',
  },
  {
    name: 'Viet Nam',
    code: 'VN',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
  },
  {
    name: 'Chile',
    code: 'CL',
  },
  {
    name: 'Philippines',
    code: 'PH',
  },
  {
    name: 'Egypt',
    code: 'EG',
  },
  {
    name: 'Spain',
    code: 'ES',
  },
  {
    name: 'United States',
    code: 'US',
  },
  {
    name: 'Bolivia',
    code: 'BO',
  },
  {
    name: 'Panama',
    code: 'PA',
  },
  {
    name: 'Brazil',
    code: 'BR',
  },
  {
    name: 'Guatemala',
    code: 'GT',
  },
  {
    name: 'Honduras',
    code: 'HN',
  },
  {
    name: 'Costa Rica',
    code: 'CR',
  },
  {
    name: 'Nicaragua',
    code: 'NI',
  },
  {
    name: 'El Salvador',
    code: 'SV',
  },
  {
    name: 'Morocco',
    code: 'MA',
  },
  {
    name: 'Paraguay',
    code: 'PY',
  },
  {
    name: 'Russian Federation',
    code: 'RU',
  },
  {
    name: 'Turkey',
    code: 'TR',
  },
  {
    name: 'Ukraine',
    code: 'UA',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
  },
  {
    name: 'Iraq',
    code: 'IQ',
  },
  {
    name: 'Italy',
    code: 'IT',
  },
  {
    name: 'Uruguay',
    code: 'UY',
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
  },
  {
    name: 'Lebanon',
    code: 'LB',
  },
  {
    name: 'Germany',
    code: 'DE',
  },
  {
    name: 'France',
    code: 'FR',
  },
  {
    name: 'Canada',
    code: 'CA',
  },
  {
    name: 'Afghanistan',
    code: 'AF',
  },
  {
    name: 'India',
    code: 'IN',
  },
  {
    name: 'Cuba',
    code: 'CU',
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
  },
  {
    name: 'Netherlands',
    code: 'NL',
  },
  {
    name: 'Malaysia',
    code: 'MY',
  },
  {
    name: 'Heard Island and Mcdonald Islands',
    code: 'HM',
  },
  {
    name: 'Aland Islands',
    code: 'AX',
  },
  {
    name: 'Albania',
    code: 'AL',
  },
  {
    name: 'Algeria',
    code: 'DZ',
  },
  {
    name: 'American Samoa',
    code: 'AS',
  },
  {
    name: 'AndorrA',
    code: 'AD',
  },
  {
    name: 'Angola',
    code: 'AO',
  },
  {
    name: 'Anguilla',
    code: 'AI',
  },
  {
    name: 'Antarctica',
    code: 'AQ',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
  },
  {
    name: 'Armenia',
    code: 'AM',
  },
  {
    name: 'Aruba',
    code: 'AW',
  },
  {
    name: 'Australia',
    code: 'AU',
  },
  {
    name: 'Austria',
    code: 'AT',
  },
  {
    name: 'Bahamas',
    code: 'BS',
  },
  {
    name: 'Bahrain',
    code: 'BH',
  },
  {
    name: 'Bangladesh',
    code: 'BD',
  },
  {
    name: 'Barbados',
    code: 'BB',
  },
  {
    name: 'Belarus',
    code: 'BY',
  },
  {
    name: 'Belgium',
    code: 'BE',
  },
  {
    name: 'Belize',
    code: 'BZ',
  },
  {
    name: 'Benin',
    code: 'BJ',
  },
  {
    name: 'Bermuda',
    code: 'BM',
  },
  {
    name: 'Bhutan',
    code: 'BT',
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
  },
  {
    name: 'Botswana',
    code: 'BW',
  },
  {
    name: 'Bouvet Island',
    code: 'BV',
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
  },
  {
    name: 'Brunei Darussalam',
    code: 'BN',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
  },
  {
    name: 'Burundi',
    code: 'BI',
  },
  {
    name: 'Cambodia',
    code: 'KH',
  },
  {
    name: 'Cameroon',
    code: 'CM',
  },
  {
    name: 'Cape Verde',
    code: 'CV',
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
  },
  {
    name: 'Chad',
    code: 'TD',
  },
  {
    name: 'China',
    code: 'CN',
  },
  {
    name: 'Christmas Island',
    code: 'CX',
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
  },
  {
    name: 'Comoros',
    code: 'KM',
  },
  {
    name: 'Congo',
    code: 'CG',
  },
  {
    name: 'Congo, The Democratic Republic of the',
    code: 'CD',
  },
  {
    name: 'Cook Islands',
    code: 'CK',
  },
  {
    name: "Cote D'Ivoire",
    code: 'CI',
  },
  {
    name: 'Croatia',
    code: 'HR',
  },
  {
    name: 'Cyprus',
    code: 'CY',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
  },
  {
    name: 'Denmark',
    code: 'DK',
  },
  {
    name: 'Djibouti',
    code: 'DJ',
  },
  {
    name: 'Dominica',
    code: 'DM',
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
  },
  {
    name: 'Eritrea',
    code: 'ER',
  },
  {
    name: 'Estonia',
    code: 'EE',
  },
  {
    name: 'Ethiopia',
    code: 'ET',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    code: 'FK',
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
  },
  {
    name: 'Fiji',
    code: 'FJ',
  },
  {
    name: 'Finland',
    code: 'FI',
  },
  {
    name: 'French Guiana',
    code: 'GF',
  },
  {
    name: 'French Polynesia',
    code: 'PF',
  },
  {
    name: 'French Southern Territories',
    code: 'TF',
  },
  {
    name: 'Gabon',
    code: 'GA',
  },
  {
    name: 'Gambia',
    code: 'GM',
  },
  {
    name: 'Georgia',
    code: 'GE',
  },
  {
    name: 'Ghana',
    code: 'GH',
  },
  {
    name: 'Gibraltar',
    code: 'GI',
  },
  {
    name: 'Greece',
    code: 'GR',
  },
  {
    name: 'Greenland',
    code: 'GL',
  },
  {
    name: 'Grenada',
    code: 'GD',
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
  },
  {
    name: 'Guam',
    code: 'GU',
  },
  {
    name: 'Guernsey',
    code: 'GG',
  },
  {
    name: 'Guinea',
    code: 'GN',
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
  },
  {
    name: 'Guyana',
    code: 'GY',
  },
  {
    name: 'Haiti',
    code: 'HT',
  },
  {
    name: 'Holy See (Vatican City State)',
    code: 'VA',
  },
  {
    name: 'Hong Kong',
    code: 'HK',
  },
  {
    name: 'Hungary',
    code: 'HU',
  },
  {
    name: 'Iceland',
    code: 'IS',
  },
  {
    name: 'Indonesia',
    code: 'ID',
  },
  {
    name: 'Iran, Islamic Republic Of',
    code: 'IR',
  },
  {
    name: 'Ireland',
    code: 'IE',
  },
  {
    name: 'Israel',
    code: 'IL',
  },
  {
    name: 'Jamaica',
    code: 'JM',
  },
  {
    name: 'Japan',
    code: 'JP',
  },
  {
    name: 'Jersey',
    code: 'JE',
  },
  {
    name: 'Jordan',
    code: 'JO',
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
  },
  {
    name: 'Kenya',
    code: 'KE',
  },
  {
    name: 'Kiribati',
    code: 'KI',
  },
  {
    name: "Korea, Democratic People's Republic of",
    code: 'KP',
  },
  {
    name: 'Korea, Republic of',
    code: 'KR',
  },
  {
    name: 'Kuwait',
    code: 'KW',
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
  },
  {
    name: "Lao People's Democratic Republic",
    code: 'LA',
  },
  {
    name: 'Latvia',
    code: 'LV',
  },
  {
    name: 'Lesotho',
    code: 'LS',
  },
  {
    name: 'Liberia',
    code: 'LR',
  },
  {
    name: 'Libyan Arab Jamahiriya',
    code: 'LY',
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
  },
  {
    name: 'Lithuania',
    code: 'LT',
  },
  {
    name: 'Luxembourg',
    code: 'LU',
  },
  {
    name: 'Macao',
    code: 'MO',
  },
  {
    name: 'Macedonia, The Former Yugoslav Republic of',
    code: 'MK',
  },
  {
    name: 'Madagascar',
    code: 'MG',
  },
  {
    name: 'Malawi',
    code: 'MW',
  },
  {
    name: 'Maldives',
    code: 'MV',
  },
  {
    name: 'Mali',
    code: 'ML',
  },
  {
    name: 'Malta',
    code: 'MT',
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
  },
  {
    name: 'Martinique',
    code: 'MQ',
  },
  {
    name: 'Mauritania',
    code: 'MR',
  },
  {
    name: 'Mauritius',
    code: 'MU',
  },
  {
    name: 'Mayotte',
    code: 'YT',
  },
  {
    name: 'Micronesia, Federated States of',
    code: 'FM',
  },
  {
    name: 'Moldova, Republic of',
    code: 'MD',
  },
  {
    name: 'Monaco',
    code: 'MC',
  },
  {
    name: 'Mongolia',
    code: 'MN',
  },
  {
    name: 'Montserrat',
    code: 'MS',
  },
  {
    name: 'Mozambique',
    code: 'MZ',
  },
  {
    name: 'Myanmar',
    code: 'MM',
  },
  {
    name: 'Namibia',
    code: 'NA',
  },
  {
    name: 'Nauru',
    code: 'NR',
  },
  {
    name: 'Nepal',
    code: 'NP',
  },
  {
    name: 'Netherlands Antilles',
    code: 'AN',
  },
  {
    name: 'New Caledonia',
    code: 'NC',
  },
  {
    name: 'New Zealand',
    code: 'NZ',
  },
  {
    name: 'Niger',
    code: 'NE',
  },
  {
    name: 'Niue',
    code: 'NU',
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
  },
  {
    name: 'Norway',
    code: 'NO',
  },
  {
    name: 'Oman',
    code: 'OM',
  },
  {
    name: 'Pakistan',
    code: 'PK',
  },
  {
    name: 'Palau',
    code: 'PW',
  },
  {
    name: 'Palestinian Territory, Occupied',
    code: 'PS',
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
  },
  {
    name: 'Pitcairn',
    code: 'PN',
  },
  {
    name: 'Poland',
    code: 'PL',
  },
  {
    name: 'Portugal',
    code: 'PT',
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
  },
  {
    name: 'Qatar',
    code: 'QA',
  },
  {
    name: 'Reunion',
    code: 'RE',
  },
  {
    name: 'Romania',
    code: 'RO',
  },
  {
    name: 'RWANDA',
    code: 'RW',
  },
  {
    name: 'Saint Helena',
    code: 'SH',
  },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
  },
  {
    name: 'Samoa',
    code: 'WS',
  },
  {
    name: 'San Marino',
    code: 'SM',
  },
  {
    name: 'Sao Tome and Principe',
    code: 'ST',
  },
  {
    name: 'Senegal',
    code: 'SN',
  },
  {
    name: 'Seychelles',
    code: 'SC',
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
  },
  {
    name: 'Singapore',
    code: 'SG',
  },
  {
    name: 'Slovakia',
    code: 'SK',
  },
  {
    name: 'Slovenia',
    code: 'SI',
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
  },
  {
    name: 'Somalia',
    code: 'SO',
  },
  {
    name: 'South Africa',
    code: 'ZA',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
  },
  {
    name: 'Sudan',
    code: 'SD',
  },
  {
    name: 'Suriname',
    code: 'SR',
  },
  {
    name: 'Svalbard and Jan Mayen',
    code: 'SJ',
  },
  {
    name: 'Swaziland',
    code: 'SZ',
  },
  {
    name: 'Sweden',
    code: 'SE',
  },
  {
    name: 'Switzerland',
    code: 'CH',
  },
  {
    name: 'Taiwan, Province of China',
    code: 'TW',
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
  },
  {
    name: 'Tanzania, United Republic of',
    code: 'TZ',
  },
  {
    name: 'Thailand',
    code: 'TH',
  },
  {
    name: 'Timor-Leste',
    code: 'TL',
  },
  {
    name: 'Togo',
    code: 'TG',
  },
  {
    name: 'Tokelau',
    code: 'TK',
  },
  {
    name: 'Tonga',
    code: 'TO',
  },
  {
    name: 'Tunisia',
    code: 'TN',
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
  },
  {
    name: 'Tuvalu',
    code: 'TV',
  },
  {
    name: 'Uganda',
    code: 'UG',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
  },
  {
    name: 'United States Minor Outlying Islands',
    code: 'UM',
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
  },
  {
    name: 'Vanuatu',
    code: 'VU',
  },
  {
    name: 'Virgin Islands, British',
    code: 'VG',
  },
  {
    name: 'Virgin Islands, U.S.',
    code: 'VI',
  },
  {
    name: 'Wallis and Futuna',
    code: 'WF',
  },
  {
    name: 'Western Sahara',
    code: 'EH',
  },
  {
    name: 'Yemen',
    code: 'YE',
  },
  {
    name: 'Zambia',
    code: 'ZM',
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
  },
];

export const countryToLanguage: {[key: string]: string} = {
  AF: 'ps', // Afghanistan
  AL: 'sq', // Albania
  DZ: 'ar', // Algeria
  AS: 'en', // American Samoa
  AD: 'ca', // Andorra
  AO: 'pt', // Angola
  AI: 'en', // Anguilla
  AQ: 'en', // Antarctica
  AG: 'en', // Antigua and Barbuda
  AR: 'es', // Argentina
  AM: 'hy', // Armenia
  AW: 'nl', // Aruba
  AU: 'en', // Australia
  AT: 'de', // Austria
  AZ: 'az', // Azerbaijan
  BS: 'en', // Bahamas
  BH: 'ar', // Bahrain
  BD: 'bn', // Bangladesh
  BB: 'en', // Barbados
  BY: 'be', // Belarus
  BE: 'nl', // Belgium
  BZ: 'en', // Belize
  BJ: 'fr', // Benin
  BM: 'en', // Bermuda
  BT: 'dz', // Bhutan
  BO: 'es', // Bolivia
  BA: 'bs', // Bosnia and Herzegovina
  BW: 'en', // Botswana
  BV: 'no', // Bouvet Island
  BR: 'pt', // Brazil
  IO: 'en', // British Indian Ocean Territory
  BN: 'ms', // Brunei
  BG: 'bg', // Bulgaria
  BF: 'fr', // Burkina Faso
  BI: 'rn', // Burundi
  KH: 'km', // Cambodia
  CM: 'en', // Cameroon
  CA: 'en', // Canada
  CV: 'pt', // Cape Verde
  KY: 'en', // Cayman Islands
  CF: 'fr', // Central African Republic
  TD: 'fr', // Chad
  CL: 'es', // Chile
  CN: 'zh', // China
  CX: 'en', // Christmas Island
  CC: 'en', // Cocos (Keeling) Islands
  CO: 'es', // Colombia
  KM: 'ar', // Comoros
  CG: 'fr', // Congo
  CD: 'fr', // Congo, Democratic Republic of the
  CK: 'en', // Cook Islands
  CR: 'es', // Costa Rica
  CI: 'fr', // Côte d'Ivoire
  HR: 'hr', // Croatia
  CU: 'es', // Cuba
  CY: 'el', // Cyprus
  CZ: 'cs', // Czech Republic
  DK: 'da', // Denmark
  DJ: 'fr', // Djibouti
  DM: 'en', // Dominica
  DO: 'es', // Dominican Republic
  EC: 'es', // Ecuador
  EG: 'ar', // Egypt
  SV: 'es', // El Salvador
  GQ: 'es', // Equatorial Guinea
  ER: 'ti', // Eritrea
  EE: 'et', // Estonia
  ET: 'am', // Ethiopia
  FK: 'en', // Falkland Islands
  FO: 'fo', // Faroe Islands
  FJ: 'en', // Fiji
  FI: 'fi', // Finland
  FR: 'fr', // France
  GF: 'fr', // French Guiana
  PF: 'fr', // French Polynesia
  TF: 'fr', // French Southern Territories
  GA: 'fr', // Gabon
  GM: 'en', // Gambia
  GE: 'ka', // Georgia
  DE: 'de', // Germany
  GH: 'en', // Ghana
  GI: 'en', // Gibraltar
  GR: 'el', // Greece
  GL: 'kl', // Greenland
  GD: 'en', // Grenada
  GP: 'fr', // Guadeloupe
  GU: 'en', // Guam
  GT: 'es', // Guatemala
  GG: 'en', // Guernsey
  GN: 'fr', // Guinea
  GW: 'pt', // Guinea-Bissau
  GY: 'en', // Guyana
  HT: 'ht', // Haiti
  HM: 'en', // Heard Island and McDonald Islands
  VA: 'it', // Holy See (Vatican City State)
  HN: 'es', // Honduras
  HK: 'zh', // Hong Kong
  HU: 'hu', // Hungary
  IS: 'is', // Iceland
  IN: 'hi', // India
  ID: 'id', // Indonesia
  IR: 'fa', // Iran
  IQ: 'ar', // Iraq
  IE: 'en', // Ireland
  IM: 'en', // Isle of Man
  IL: 'he', // Israel
  IT: 'it', // Italy
  JM: 'en', // Jamaica
  JP: 'ja', // Japan
  JE: 'en', // Jersey
  JO: 'ar', // Jordan
  KZ: 'kk', // Kazakhstan
  KE: 'sw', // Kenya
  KI: 'en', // Kiribati
  KP: 'ko', // Korea, Democratic People's Republic of
  KR: 'ko', // Korea, Republic of
  KW: 'ar', // Kuwait
  KG: 'ky', // Kyrgyzstan
  LA: 'lo', // Lao People's Democratic Republic
  LV: 'lv', // Latvia
  LB: 'ar', // Lebanon
  LS: 'en', // Lesotho
  LR: 'en', // Liberia
  LY: 'ar', // Libya
  LI: 'de', // Liechtenstein
  LT: 'lt', // Lithuania
  LU: 'lb', // Luxembourg
  MO: 'zh', // Macao
  MK: 'mk', // North Macedonia
  MG: 'mg', // Madagascar
  MW: 'ny', // Malawi
  MY: 'ms', // Malaysia
  MV: 'dv', // Maldives
  ML: 'fr', // Mali
  MT: 'mt', // Malta
  MH: 'mh', // Marshall Islands
  MQ: 'fr', // Martinique
  MR: 'ar', // Mauritania
  MU: 'en', // Mauritius
  YT: 'fr', // Mayotte
  MX: 'es', // Mexico
  FM: 'en', // Micronesia, Federated States of
  MD: 'ro', // Moldova
  MC: 'fr', // Monaco
  MN: 'mn', // Mongolia
  ME: 'sr', // Montenegro
  MS: 'en', // Montserrat
  MA: 'ar', // Morocco
  MZ: 'pt', // Mozambique
  MM: 'my', // Myanmar
  NA: 'en', // Namibia
  NR: 'na', // Nauru
  NP: 'ne', // Nepal
  NL: 'nl', // Netherlands
  NC: 'fr', // New Caledonia
  NZ: 'en', // New Zealand
  NI: 'es', // Nicaragua
  NE: 'fr', // Niger
  NG: 'en', // Nigeria
  NU: 'en', // Niue
  NF: 'en', // Norfolk Island
  MP: 'en', // Northern Mariana Islands
  NO: 'no', // Norway
  OM: 'ar', // Oman
  PK: 'ur', // Pakistan
  PW: 'en', // Palau
  PS: 'ar', // Palestine, State of
  PA: 'es', // Panama
  PG: 'en', // Papua New Guinea
  PY: 'es', // Paraguay
  PE: 'es', // Peru
  PH: 'en', // Philippines
  PN: 'en', // Pitcairn
  PL: 'pl', // Poland
  PT: 'pt', // Portugal
  PR: 'es', // Puerto Rico
  QA: 'ar', // Qatar
  RE: 'fr', // Réunion
  RO: 'ro', // Romania
  RU: 'ru', // Russian Federation
  RW: 'rw', // Rwanda
  BL: 'fr', // Saint Barthélemy
  SH: 'en', // Saint Helena, Ascension and Tristan da Cunha
  KN: 'en', // Saint Kitts and Nevis
  LC: 'en', // Saint Lucia
  MF: 'fr', // Saint Martin (French part)
  PM: 'fr', // Saint Pierre and Miquelon
  VC: 'en', // Saint Vincent and the Grenadines
  WS: 'sm', // Samoa
  SM: 'it', // San Marino
  ST: 'pt', // Sao Tome and Principe
  SA: 'ar', // Saudi Arabia
  SN: 'fr', // Senegal
  RS: 'sr', // Serbia
  SC: 'en', // Seychelles
  SL: 'en', // Sierra Leone
  SG: 'en', // Singapore
  SX: 'nl', // Sint Maarten (Dutch part)
  SK: 'sk', // Slovakia
  SI: 'sl', // Slovenia
  SB: 'en', // Solomon Islands
  SO: 'so', // Somalia
  ZA: 'en', // South Africa
  GS: 'en', // South Georgia and the South Sandwich Islands
  SS: 'en', // South Sudan
  ES: 'es', // Spain
  LK: 'si', // Sri Lanka
  SD: 'ar', // Sudan
  SR: 'nl', // Suriname
  SJ: 'no', // Svalbard and Jan Mayen
  SZ: 'en', // Eswatini
  SE: 'sv', // Sweden
  CH: 'de', // Switzerland
  SY: 'ar', // Syrian Arab Republic
  TW: 'zh', // Taiwan
  TJ: 'tg', // Tajikistan
  TZ: 'sw', // Tanzania, United Republic of
  TH: 'th', // Thailand
  TL: 'pt', // Timor-Leste
  TG: 'fr', // Togo
  TK: 'en', // Tokelau
  TO: 'to', // Tonga
  TT: 'en', // Trinidad and Tobago
  TN: 'ar', // Tunisia
  TR: 'tr', // Turkey
  TM: 'tk', // Turkmenistan
  TC: 'en', // Turks and Caicos Islands
  TV: 'en', // Tuvalu
  UG: 'en', // Uganda
  UA: 'uk', // Ukraine
  AE: 'ar', // United Arab Emirates
  GB: 'en', // United Kingdom
  US: 'en', // United States
  UM: 'en', // United States Minor Outlying Islands
  UY: 'es', // Uruguay
  UZ: 'uz', // Uzbekistan
  VU: 'bi', // Vanuatu
  VE: 'es', // Venezuela
  VN: 'vi', // Viet Nam
  VG: 'en', // Virgin Islands, British
  VI: 'en', // Virgin Islands, U.S.
  WF: 'fr', // Wallis and Futuna
  EH: 'ar', // Western Sahara
  YE: 'ar', // Yemen
  ZM: 'en', // Zambia
  ZW: 'en', // Zimbabwe
};

export const languageMap = {
  aa: {name: 'Afar', dir: 1, native: 'Afar'},
  ab: {name: 'Abkhazian', dir: 1, native: 'Аҧсуа'},
  af: {name: 'Afrikaans', dir: 1, native: 'Afrikaans'},
  ak: {name: 'Akan', dir: 1, native: 'Akana'},
  am: {name: 'Amharic', dir: 1, native: 'አማርኛ'},
  an: {name: 'Aragonese', dir: 1, native: 'Aragonés'},
  ar: {name: 'Arabic', dir: 0, native: 'العربية'},
  as: {name: 'Assamese', dir: 1, native: 'অসমীয়া'},
  av: {name: 'Avar', dir: 1, native: 'Авар'},
  ay: {name: 'Aymara', dir: 1, native: 'Aymar'},
  az: {name: 'Azerbaijani', dir: 1, native: 'Azərbaycanca / آذربايجان'},
  ba: {name: 'Bashkir', dir: 1, native: 'Башҡорт'},
  be: {name: 'Belarusian', dir: 1, native: 'Беларуская'},
  bg: {name: 'Bulgarian', dir: 1, native: 'Български'},
  bh: {name: 'Bihari', dir: 1, native: 'भोजपुरी'},
  bi: {name: 'Bislama', dir: 1, native: 'Bislama'},
  bm: {name: 'Bambara', dir: 1, native: 'Bamanankan'},
  bn: {name: 'Bengali', dir: 1, native: 'বাংলা'},
  bo: {name: 'Tibetan', dir: 1, native: 'བོད་ཡིག / Bod skad'},
  br: {name: 'Breton', dir: 1, native: 'Brezhoneg'},
  bs: {name: 'Bosnian', dir: 1, native: 'Bosanski'},
  ca: {name: 'Catalan', dir: 1, native: 'Català'},
  ce: {name: 'Chechen', dir: 1, native: 'Нохчийн'},
  ch: {name: 'Chamorro', dir: 1, native: 'Chamoru'},
  co: {name: 'Corsican', dir: 1, native: 'Corsu'},
  cr: {name: 'Cree', dir: 1, native: 'Nehiyaw'},
  cs: {name: 'Czech', dir: 1, native: 'Česky'},
  cu: {
    name: 'Old Church Slavonic / Old Bulgarian',
    dir: 1,
    native: 'словѣньскъ / slověnĭskŭ',
  },
  cv: {name: 'Chuvash', dir: 1, native: 'Чăваш'},
  cy: {name: 'Welsh', dir: 1, native: 'Cymraeg'},
  da: {name: 'Danish', dir: 1, native: 'Dansk'},
  de: {name: 'German', dir: 1, native: 'Deutsch'},
  dv: {name: 'Divehi', dir: 0, native: 'ދިވެހިބަސް'},
  dz: {name: 'Dzongkha', dir: 1, native: 'ཇོང་ཁ'},
  ee: {name: 'Ewe', dir: 1, native: 'Ɛʋɛ'},
  el: {name: 'Greek', dir: 1, native: 'Ελληνικά'},
  en: {name: 'English', dir: 1, native: 'English'},
  eo: {name: 'Esperanto', dir: 1, native: 'Esperanto'},
  es: {name: 'Spanish', dir: 1, native: 'Español'},
  et: {name: 'Estonian', dir: 1, native: 'Eesti'},
  eu: {name: 'Basque', dir: 1, native: 'Euskara'},
  fa: {name: 'Persian', dir: 0, native: 'فارسی'},
  ff: {name: 'Peul', dir: 1, native: 'Fulfulde'},
  fi: {name: 'Finnish', dir: 1, native: 'Suomi'},
  fj: {name: 'Fijian', dir: 1, native: 'Na Vosa Vakaviti'},
  fo: {name: 'Faroese', dir: 1, native: 'Føroyskt'},
  fr: {name: 'French', dir: 1, native: 'Français'},
  fy: {name: 'West Frisian', dir: 1, native: 'Frysk'},
  ga: {name: 'Irish', dir: 1, native: 'Gaeilge'},
  gd: {name: 'Scottish Gaelic', dir: 1, native: 'Gàidhlig'},
  gl: {name: 'Galician', dir: 1, native: 'Galego'},
  gn: {name: 'Guarani', dir: 1, native: "Avañe'ẽ"},
  gu: {name: 'Gujarati', dir: 1, native: 'ગુજરાતી'},
  gv: {name: 'Manx', dir: 1, native: 'Gaelg'},
  ha: {name: 'Hausa', dir: 0, native: 'هَوُسَ'},
  he: {name: 'Hebrew', dir: 0, native: 'עברית'},
  hi: {name: 'Hindi', dir: 1, native: 'हिन्दी'},
  ho: {name: 'Hiri Motu', dir: 1, native: 'Hiri Motu'},
  hr: {name: 'Croatian', dir: 1, native: 'Hrvatski'},
  ht: {name: 'Haitian', dir: 1, native: 'Krèyol ayisyen'},
  hu: {name: 'Hungarian', dir: 1, native: 'Magyar'},
  hy: {name: 'Armenian', dir: 1, native: 'Հայերեն'},
  hz: {name: 'Herero', dir: 1, native: 'Otsiherero'},
  ia: {name: 'Interlingua', dir: 1, native: 'Interlingua'},
  id: {name: 'Indonesian', dir: 1, native: 'Bahasa Indonesia'},
  ie: {name: 'Interlingue', dir: 1, native: 'Interlingue'},
  ig: {name: 'Igbo', dir: 1, native: 'Igbo'},
  ii: {name: 'Sichuan Yi', dir: 1, native: 'ꆇꉙ / 四川彝语'},
  ik: {name: 'Inupiak', dir: 1, native: 'Iñupiak'},
  io: {name: 'Ido', dir: 1, native: 'Ido'},
  is: {name: 'Icelandic', dir: 1, native: 'Íslenska'},
  it: {name: 'Italian', dir: 1, native: 'Italiano'},
  iu: {name: 'Inuktitut', dir: 1, native: 'ᐃᓄᒃᑎᑐᑦ'},
  ja: {name: 'Japanese', dir: 1, native: '日本語'},
  jv: {name: 'Javanese', dir: 1, native: 'Basa Jawa'},
  ka: {name: 'Georgian', dir: 1, native: 'ქართული'},
  kg: {name: 'Kongo', dir: 1, native: 'KiKongo'},
  ki: {name: 'Kikuyu', dir: 1, native: 'Gĩkũyũ'},
  kj: {name: 'Kuanyama', dir: 1, native: 'Kuanyama'},
  kk: {name: 'Kazakh', dir: 1, native: 'Қазақша'},
  kl: {name: 'Greenlandic', dir: 1, native: 'Kalaallisut'},
  km: {name: 'Cambodian', dir: 1, native: 'ភាសាខ្មែរ'},
  kn: {name: 'Kannada', dir: 1, native: 'ಕನ್ನಡ'},
  ko: {name: 'Korean', dir: 1, native: '한국어'},
  kr: {name: 'Kanuri', dir: 1, native: 'Kanuri'},
  ks: {name: 'Kashmiri', dir: 0, native: 'कश्मीरी / كشميري'},
  ku: {name: 'Kurdish', dir: 0, native: 'Kurdî / كوردی'},
  kv: {name: 'Komi', dir: 1, native: 'Коми'},
  kw: {name: 'Cornish', dir: 1, native: 'Kernewek'},
  ky: {name: 'Kirghiz', dir: 1, native: 'Kırgızca / Кыргызча'},
  la: {name: 'Latin', dir: 1, native: 'Latina'},
  lb: {name: 'Luxembourgish', dir: 1, native: 'Lëtzebuergesch'},
  lg: {name: 'Ganda', dir: 1, native: 'Luganda'},
  li: {name: 'Limburgian', dir: 1, native: 'Limburgs'},
  ln: {name: 'Lingala', dir: 1, native: 'Lingála'},
  lo: {name: 'Laotian', dir: 1, native: 'ລາວ / Pha xa lao'},
  lt: {name: 'Lithuanian', dir: 1, native: 'Lietuvių'},
  lv: {name: 'Latvian', dir: 1, native: 'Latviešu'},
  mg: {name: 'Malagasy', dir: 1, native: 'Malagasy'},
  mh: {name: 'Marshallese', dir: 1, native: 'Kajin Majel / Ebon'},
  mi: {name: 'Maori', dir: 1, native: 'Māori'},
  mk: {name: 'Macedonian', dir: 1, native: 'Македонски'},
  ml: {name: 'Malayalam', dir: 1, native: 'മലയാളം'},
  mn: {name: 'Mongolian', dir: 1, native: 'Монгол'},
  mo: {name: 'Moldovan', dir: 1, native: 'Moldovenească'},
  mr: {name: 'Marathi', dir: 1, native: 'मराठी'},
  ms: {name: 'Malay', dir: 1, native: 'Bahasa Melayu'},
  mt: {name: 'Maltese', dir: 1, native: 'bil-Malti'},
  my: {name: 'Burmese', dir: 1, native: 'Myanmasa'},
  na: {name: 'Nauruan', dir: 1, native: 'Dorerin Naoero'},
  nd: {name: 'North Ndebele', dir: 1, native: 'Sindebele'},
  ne: {name: 'Nepali', dir: 1, native: 'नेपाली'},
  ng: {name: 'Ndonga', dir: 1, native: 'Oshiwambo'},
  nl: {name: 'Dutch', dir: 1, native: 'Nederlands'},
  nn: {name: 'Norwegian Nynorsk', dir: 1, native: 'Norsk (nynorsk)'},
  no: {name: 'Norwegian', dir: 1, native: 'Norsk (bokmål / riksmål)'},
  nr: {name: 'South Ndebele', dir: 1, native: 'isiNdebele'},
  nv: {name: 'Navajo', dir: 1, native: 'Diné bizaad'},
  ny: {name: 'Chichewa', dir: 1, native: 'Chi-Chewa'},
  oc: {name: 'Occitan', dir: 1, native: 'Occitan'},
  oj: {name: 'Ojibwa', dir: 1, native: 'ᐊᓂᔑᓈᐯᒧᐎᓐ / Anishinaabemowin'},
  om: {name: 'Oromo', dir: 1, native: 'Oromoo'},
  or: {name: 'Oriya', dir: 1, native: 'ଓଡ଼ିଆ'},
  os: {name: 'Ossetian / Ossetic', dir: 1, native: 'Иронау'},
  pa: {
    name: 'Panjabi / Punjabi',
    dir: 1,
    native: 'ਪੰਜਾਬੀ / पंजाबी / پنجابي',
  },
  pi: {name: 'Pali', dir: 1, native: 'Pāli / पाऴि'},
  pl: {name: 'Polish', dir: 1, native: 'Polski'},
  ps: {name: 'Pashto', dir: 0, native: 'پښتو'},
  pt: {name: 'Portuguese', dir: 1, native: 'Português'},
  qu: {name: 'Quechua', dir: 1, native: 'Runa Simi'},
  rm: {name: 'Raeto Romance', dir: 1, native: 'Rumantsch'},
  rn: {name: 'Kirundi', dir: 1, native: 'Kirundi'},
  ro: {name: 'Romanian', dir: 1, native: 'Română'},
  ru: {name: 'Russian', dir: 1, native: 'Русский'},
  rw: {name: 'Rwandi', dir: 1, native: 'Kinyarwandi'},
  sa: {name: 'Sanskrit', dir: 1, native: 'संस्कृतम्'},
  sc: {name: 'Sardinian', dir: 1, native: 'Sardu'},
  sd: {name: 'Sindhi', dir: 1, native: 'सिनधि'},
  se: {name: 'Northern Sami', dir: 1, native: 'Davvisámegiella'},
  sg: {name: 'Sango', dir: 1, native: 'Sängö'},
  sh: {
    name: 'Serbo-Croatian',
    dir: 1,
    native: 'Srpskohrvatski / Српскохрватски',
  },
  si: {name: 'Sinhalese', dir: 1, native: 'සිංහල'},
  sk: {name: 'Slovak', dir: 1, native: 'Slovenčina'},
  sl: {name: 'Slovenian', dir: 1, native: 'Slovenščina'},
  sm: {name: 'Samoan', dir: 1, native: 'Gagana Samoa'},
  sn: {name: 'Shona', dir: 1, native: 'chiShona'},
  so: {name: 'Somalia', dir: 1, native: 'Soomaaliga'},
  sq: {name: 'Albanian', dir: 1, native: 'Shqip'},
  sr: {name: 'Serbian', dir: 1, native: 'Српски'},
  ss: {name: 'Swati', dir: 1, native: 'SiSwati'},
  st: {name: 'Southern Sotho', dir: 1, native: 'Sesotho'},
  su: {name: 'Sundanese', dir: 1, native: 'Basa Sunda'},
  sv: {name: 'Swedish', dir: 1, native: 'Svenska'},
  sw: {name: 'Swahili', dir: 1, native: 'Kiswahili'},
  ta: {name: 'Tamil', dir: 1, native: 'தமிழ்'},
  te: {name: 'Telugu', dir: 1, native: 'తెలుగు'},
  tg: {name: 'Tajik', dir: 1, native: 'Тоҷикӣ'},
  th: {name: 'Thai', dir: 1, native: 'ไทย / Phasa Thai'},
  ti: {name: 'Tigrinya', dir: 1, native: 'ትግርኛ'},
  tk: {name: 'Turkmen', dir: 1, native: 'Туркмен / تركمن'},
  tl: {name: 'Tagalog', dir: 1, native: 'Tagalog'},
  tn: {name: 'Tswana', dir: 1, native: 'Setswana'},
  to: {name: 'Tonga', dir: 1, native: 'Lea Faka-Tonga'},
  tr: {name: 'Turkish', dir: 1, native: 'Türkçe'},
  ts: {name: 'Tsonga', dir: 1, native: 'Xitsonga'},
  tt: {name: 'Tatar', dir: 1, native: 'Tatarça'},
  tw: {name: 'Twi', dir: 1, native: 'Twi'},
  ty: {name: 'Tahitian', dir: 1, native: 'Reo Mā`ohi'},
  ug: {name: 'Uyghur', dir: 1, native: 'Uyƣurqə / ئۇيغۇرچە'},
  uk: {name: 'Ukrainian', dir: 1, native: 'Українська'},
  ur: {name: 'Urdu', dir: 0, native: 'اردو'},
  uz: {name: 'Uzbek', dir: 1, native: 'Ўзбек'},
  ve: {name: 'Venda', dir: 1, native: 'Tshivenḓa'},
  vi: {name: 'Vietnamese', dir: 1, native: 'Việtnam'},
  vo: {name: 'Volapük', dir: 1, native: 'Volapük'},
  wa: {name: 'Walloon', dir: 1, native: 'Walon'},
  wo: {name: 'Wolof', dir: 1, native: 'Wollof'},
  xh: {name: 'Xhosa', dir: 1, native: 'isiXhosa'},
  yi: {name: 'Yiddish', dir: 0, native: 'ייִדיש'},
  yo: {name: 'Yoruba', dir: 1, native: 'Yorùbá'},
  za: {name: 'Zhuang', dir: 1, native: 'Cuengh / Tôô / 壮语'},
  zh: {name: 'Chinese', dir: 1, native: '中文'},
  zu: {name: 'Zulu', dir: 1, native: 'isiZulu'},
  nb: {name: 'Norwegian Bokmål', dir: 1, native: 'Norsk (bokmål)'},
};

export const countryCodeToNameMap = {
  VE: 'Venezuela',
  CO: 'Colombia',
  SY: 'Syrian Arab Republic',
  NG: 'Nigeria',
  AR: 'Argentina',
  PE: 'Peru',
  MX: 'Mexico',
  EC: 'Ecuador',
  VN: 'Viet Nam',
  DO: 'Dominican Republic',
  CL: 'Chile',
  PH: 'Philippines',
  EG: 'Egypt',
  ES: 'Spain',
  US: 'United States',
  BO: 'Bolivia',
  PA: 'Panama',
  BR: 'Brazil',
  GT: 'Guatemala',
  HN: 'Honduras',
  CR: 'Costa Rica',
  NI: 'Nicaragua',
  SV: 'El Salvador',
  MA: 'Morocco',
  PY: 'Paraguay',
  RU: 'Russian Federation',
  TR: 'Turkey',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  IQ: 'Iraq',
  IT: 'Italy',
  UY: 'Uruguay',
  TT: 'Trinidad and Tobago',
  LB: 'Lebanon',
  DE: 'Germany',
  FR: 'France',
  CA: 'Canada',
  AF: 'Afghanistan',
  IN: 'India',
  CU: 'Cuba',
  AZ: 'Azerbaijan',
  NL: 'Netherlands',
  MY: 'Malaysia',
  HM: 'Heard Island and Mcdonald Islands',
  AX: 'Aland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'AndorrA',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, The Democratic Republic of the',
  CK: 'Cook Islands',
  CI: "Cote D'Ivoire",
  HR: 'Croatia',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  VA: 'Holy See (Vatican City State)',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic Of',
  IE: 'Ireland',
  IL: 'Israel',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea, Democratic People's Republic of",
  KR: 'Korea, Republic of',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic",
  LV: 'Latvia',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia, The Former Yugoslav Republic of',
  MG: 'Madagascar',
  MW: 'Malawi',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  FM: 'Micronesia, Federated States of',
  MD: 'Moldova, Republic of',
  MC: 'Monaco',
  MN: 'Mongolia',
  MS: 'Montserrat',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NE: 'Niger',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PG: 'Papua New Guinea',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RW: 'RWANDA',
  SH: 'Saint Helena',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SN: 'Senegal',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  TW: 'Taiwan, Province of China',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TN: 'Tunisia',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  GB: 'United Kingdom',
  UM: 'United States Minor Outlying Islands',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};
