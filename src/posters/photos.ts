export interface PosterPhoto {
  src: string;
  description: string;
  credit: string;
}

const unsplash = (file: string, id: string, description: string): PosterPhoto => ({
  src: `/design-assets/photos/${file}.jpg`,
  description,
  credit: `https://images.unsplash.com/${id}`,
});

export const POSTER_PHOTOS = {
  'woman-portrait-1': unsplash(
    'woman-portrait-1',
    'photo-1573496359142-b8d87734a5a2',
    'Smiling woman in a grey blazer',
  ),
  'woman-portrait-2': unsplash(
    'woman-portrait-2',
    'photo-1580489944761-15a19d654956',
    'Smiling woman with her hair up',
  ),
  'woman-portrait-3': unsplash(
    'woman-portrait-3',
    'photo-1614786269829-d24616faf56d',
    'Woman in a black outfit, full length',
  ),
  'woman-portrait-4': unsplash(
    'woman-portrait-4',
    'photo-1508002366005-75a695ee2d17',
    'Laughing woman with curly hair',
  ),
  'woman-portrait-5': unsplash(
    'woman-portrait-5',
    'photo-1573497019940-1c28c88b4f3e',
    'Smiling woman in a striped jacket',
  ),
  'woman-portrait-6': unsplash(
    'woman-portrait-6',
    'photo-1494790108377-be9c29b29330',
    'Smiling woman in a red top',
  ),
  'man-portrait-1': unsplash(
    'man-portrait-1',
    'photo-1560250097-0b93528c311a',
    'Man with glasses in a dark blazer',
  ),
  'man-portrait-2': unsplash(
    'man-portrait-2',
    'photo-1519085360753-af0119f7cbe7',
    'Man in a suit with arms crossed',
  ),
  'man-portrait-3': unsplash(
    'man-portrait-3',
    'photo-1507003211169-0a1dd7228f2d',
    'Smiling man in a white t-shirt',
  ),
  'team-1': unsplash('team-1', 'photo-1522071820081-009f0129c71c', 'Team around a laptop'),
  'team-2': unsplash('team-2', 'photo-1522202176988-66273c2fd55f', 'Students working together'),
  'team-3': unsplash('team-3', 'photo-1572021335469-31706a17aaef', 'Coworkers smiling at a laptop'),
  'meeting-1': unsplash(
    'meeting-1',
    'photo-1519074002996-a69e7ac46a42',
    'Man talking in a meeting',
  ),
  'laptop-analytics': unsplash(
    'laptop-analytics',
    'photo-1460925895917-afdab827c52f',
    'Laptop showing analytics',
  ),
  'workspace-1': unsplash('workspace-1', 'photo-1551434678-e076c223a692', 'Team working at a desk'),
  'designer-tablet': unsplash(
    'designer-tablet',
    'photo-1572044162444-ad60f128bdea',
    'Person drawing on a tablet',
  ),
  'desk-imac': unsplash(
    'desk-imac',
    'photo-1602064172250-43f8909056c7',
    'Desktop computer on a wooden desk',
  ),
  'phone-hand-1': unsplash(
    'phone-hand-1',
    'photo-1592890288564-76628a30a657',
    'Hand holding a phone',
  ),
  'phone-hand-2': unsplash(
    'phone-hand-2',
    'photo-1523206489230-c012c64b2b48',
    'Phone floating above a palm',
  ),
  'basketball-1': unsplash(
    'basketball-1',
    'photo-1546519638-68e109498ffc',
    'Ball under a basketball ring',
  ),
  'basketball-2': unsplash(
    'basketball-2',
    'photo-1628779238951-be2c9f2a59f4',
    'Basketball on a hoop',
  ),
  'hockey-1': unsplash('hockey-1', 'photo-1545471977-94cac22e71ed', 'Ice hockey game'),
  'hockey-2': unsplash('hockey-2', 'photo-1580748141549-71748dbe0bdc', 'Hockey players on ice'),
  'football-1': unsplash(
    'football-1',
    'photo-1566577739112-5180d4bf9390',
    'American football close up',
  ),
  'football-field': unsplash(
    'football-field',
    'photo-1557174949-3b1f5b2e8fac',
    'Aerial view of a football field',
  ),
  'autumn-mug': unsplash(
    'autumn-mug',
    'photo-1574376407492-c3cf78231def',
    'Mug with marshmallows and autumn leaves',
  ),
  'autumn-leaves': unsplash(
    'autumn-leaves',
    'photo-1429198739803-7db875882052',
    'Orange autumn leaves',
  ),
  'yoga-1': unsplash('yoga-1', 'photo-1544367567-0f2fcb009e0b', 'Yoga silhouette at sunset'),
  'yoga-2': unsplash('yoga-2', 'photo-1506126613408-eca07ce68773', 'Meditation on a parquet floor'),
  pumpkins: unsplash('pumpkins', 'photo-1477516561410-f0b5dd8319e4', 'Glowing jack-o-lanterns'),
  'microphone-1': unsplash(
    'microphone-1',
    'photo-1511671782779-c97d3d27a1d4',
    'Condenser microphone with bokeh',
  ),
  'microphone-2': unsplash(
    'microphone-2',
    'photo-1485579149621-3123dd979885',
    'Vintage microphone',
  ),
  candles: unsplash('candles', 'photo-1690694278121-21aee2888368', 'Row of lit candles'),
  'self-care': unsplash('self-care', 'photo-1645724466583-9adee761f530', 'Soap bottle and towel'),
  'coffee-1': unsplash(
    'coffee-1',
    'photo-1595434091143-b375ced5fe5c',
    'White cup on a wooden table',
  ),
  'coffee-book': unsplash('coffee-book', 'photo-1543233604-3baca4d35513', 'Latte on top of books'),
  'city-night': unsplash(
    'city-night',
    'photo-1473116519190-356a1463fbcf',
    'City at night from above',
  ),
  'house-1': unsplash('house-1', 'photo-1580587771525-78b9dba3b914', 'Modern white house'),
  'house-2': unsplash(
    'house-2',
    'photo-1721815693498-cc28507c0ba2',
    'Two storey house with large windows',
  ),
  'interior-1': unsplash('interior-1', 'photo-1560448204-e02f11c3d0e2', 'Beige living room'),
  'interior-2': unsplash('interior-2', 'photo-1593696140826-c58b021acf8b', 'Open plan dining room'),
  'arcade-1': unsplash('arcade-1', 'photo-1511512578047-dfb367046420', 'Room of arcade machines'),
  'console-1': unsplash(
    'console-1',
    'photo-1550745165-9bc0b252726f',
    'Vintage console and joystick',
  ),
} as const satisfies Record<string, PosterPhoto>;

export type PosterPhotoName = keyof typeof POSTER_PHOTOS;
