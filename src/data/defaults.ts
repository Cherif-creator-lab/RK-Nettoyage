export interface DefaultService {
  title: string
  slug: string
  shortDescription: string
  bodyParagraphs: string[]
  icon: string
  order: number
  image: { src: string; alt: string }
}

export interface DefaultZone {
  city: string
  department: string
  slug: string
  isActive: boolean
  localIntro: string
}

export const DEFAULT_HERO_SUBTITLE =
  'Particuliers, entreprises, copropriétés et agences : un seul interlocuteur pour le nettoyage, les espaces verts et les petits travaux, à Lyon et ses alentours.'

export const DEFAULT_SERVICES: DefaultService[] = [
  {
    title: 'Entretien régulier de vos locaux',
    slug: 'entretien-regulier-locaux',
    shortDescription:
      'Nettoyage complet et soigné de vos bureaux et espaces professionnels, pour un lieu toujours propre et accueillant.',
    bodyParagraphs: [
      'Nous assurons l’entretien quotidien ou hebdomadaire de vos bureaux, commerces, cabinets médicaux et espaces professionnels.',
      'Nos interventions couvrent le dépoussiérage des postes de travail, l’aspiration et le lavage des sols, la désinfection des sanitaires et des points de contact, ainsi que la gestion des corbeilles, selon vos horaires.',
    ],
    icon: 'building',
    order: 1,
    image: { src: '/images/sols.webp', alt: "Agent d'entretien lavant le sol d'un hall de bureaux" },
  },
  {
    title: 'Débarras rapide et sécurisé',
    slug: 'debarras-rapide-securise',
    shortDescription:
      'Enlèvement et évacuation de vos encombrants pour libérer vos espaces sans délai.',
    bodyParagraphs: [
      'Appartement, cave, grenier, garage ou local professionnel : nous prenons en charge le tri, la manutention et l’évacuation de vos encombrants en déchetterie agréée.',
      'Intervention rapide et soignée, avec respect des parties communes et remise au propre des lieux après passage.',
    ],
    icon: 'sparkles',
    order: 2,
    image: { src: '/images/chariot.webp', alt: "Agent d'entretien avec chariot de service dans un couloir" },
  },
  {
    title: 'Remise en état après travaux ou déménagement',
    slug: 'remise-en-etat-travaux-demenagement',
    shortDescription:
      'Nettoyage en profondeur et désinfection pour rendre vos locaux opérationnels immédiatement.',
    bodyParagraphs: [
      'Après un chantier, une rénovation ou un déménagement, nous éliminons les poussières fines, traces de colle, plâtre et résidus sur l’ensemble des surfaces.',
      'Nous remettons les sols, vitres, sanitaires et cuisines à neuf pour vous permettre d’emménager ou de livrer le bien sereinement.',
    ],
    icon: 'shield-check',
    order: 3,
    image: { src: '/images/produits.webp', alt: 'Matériel et produits professionnels pour le nettoyage en profondeur' },
  },
  {
    title: 'Entretien de vos espaces extérieurs',
    slug: 'entretien-espaces-exterieurs',
    shortDescription:
      'Tonte des pelouses, taille des haies et soin des espaces verts, pour une image impeccable dès l’entrée.',
    bodyParagraphs: [
      'Nous entretenons les jardins, cours et abords de résidences ou d’entreprises : tonte, débroussaillage, taille de haies et ramassage des feuilles.',
      'Interventions ponctuelles au fil des saisons ou contrat d’entretien annuel adapté à vos extérieurs.',
    ],
    icon: 'leaf',
    order: 4,
    image: { src: '/images/espaces-verts.webp', alt: "Agent d'entretien taillant une haie dans un jardin" },
  },
  {
    title: 'Services résidentiels et gestion des déchets',
    slug: 'services-residentiels-gestion-dechets',
    shortDescription:
      'Nettoyage des allées et parties communes, sorties et rentrées des poubelles pour le confort des résidents.',
    bodyParagraphs: [
      'Pour les copropriétés, syndics et bailleurs, nous assurons la propreté régulière des halls, cages d’escalier, ascenseurs, allées et locaux à vélos ou poubelles.',
      'Nous prenons également en charge la sortie et la rentrée des bacs aux jours de collecte ainsi que le nettoyage et la désinfection des conteneurs.',
    ],
    icon: 'home',
    order: 5,
    image: { src: '/images/hero.webp', alt: "Agent d'entretien dépoussiérant des étagères" },
  },
  {
    title: 'Petits travaux de bricolage',
    slug: 'petits-travaux-bricolage',
    shortDescription:
      'Menues réparations du quotidien, comme le changement d’ampoules, pour faciliter la vie des occupants.',
    bodyParagraphs: [
      'Un seul interlocuteur pour vos petits dépannages : remplacement d’ampoules ou de néons, réglage de portes et poignées, pose de petits équipements, montage de mobilier ou rebouchage léger.',
      'Un service pratique et réactif pour les particuliers, agences immobilières et copropriétés.',
    ],
    icon: 'wrench',
    order: 6,
    image: { src: '/images/petits-travaux.webp', alt: "Agent d'entretien changeant une ampoule au plafond" },
  },
  {
    title: 'Lavage des vitres',
    slug: 'lavage-des-vitres',
    shortDescription:
      'Nettoyage professionnel des vitres et surfaces vitrées (fenêtres, baies, vérandas, devantures) pour un résultat net et sans traces.',
    bodyParagraphs: [
      'Nous intervenons pour le lavage complet des vitres, encadrements, rebords, baies vitrées, vérandas et vitrines commerciales.',
      'Grâce à des techniques professionnelles à la raclette et aux perches adaptées, vos surfaces vitrées retrouvent transparence et luminosité, sans aucune trace.',
    ],
    icon: 'window',
    order: 7,
    image: { src: '/images/vitres.webp', alt: "Agent d'entretien nettoyant une vitre à la raclette" },
  },
]

export const DEFAULT_ZONES: DefaultZone[] = [
  {
    city: 'Lyon',
    department: 'Rhône (69)',
    slug: 'lyon',
    isActive: true,
    localIntro:
      'Intervention rapide dans tous les arrondissements de Lyon (1er au 9e) pour les particuliers, entreprises, commerces et copropriétés.',
  },
  {
    city: 'Villeurbanne',
    department: 'Rhône (69)',
    slug: 'villeurbanne',
    isActive: true,
    localIntro:
      'Entretien de bureaux, nettoyage de parties communes, vitres et petits travaux à Villeurbanne et dans les quartiers Gratte-Ciel, Charpennes, Tonkin.',
  },
  {
    city: 'Vénissieux',
    department: 'Rhône (69)',
    slug: 'venissieux',
    isActive: true,
    localIntro:
      'Nettoyage professionnel, débarras, remise en état et entretien des espaces verts à Vénissieux et dans le sud-est lyonnais.',
  },
  {
    city: 'Bourg-en-Bresse',
    department: 'Ain (01)',
    slug: 'bourg-en-bresse',
    isActive: true,
    localIntro:
      'Prestations de nettoyage, lavage de vitres, débarras et entretien extérieur à Bourg-en-Bresse et dans le bassin bressan.',
  },
  {
    city: 'Vienne',
    department: 'Isère (38)',
    slug: 'vienne',
    isActive: true,
    localIntro:
      'Un interlocuteur unique à Vienne et dans le pays viennois pour le ménage, l’entretien de locaux, les espaces verts et les petits travaux.',
  },
  {
    city: 'Saint-Étienne',
    department: 'Loire (42)',
    slug: 'saint-etienne',
    isActive: true,
    localIntro:
      'Nettoyage de locaux, remise en état après travaux, lavage de vitres et multi-services à Saint-Étienne et ses alentours.',
  },
]
