import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/** Brand — TRL Racing 로고/타이틀 (public/Ethnocentric-Regular.otf) */
export const fontBrand = localFont({
  src: '../../public/Ethnocentric-Regular.otf',
  weight: '400',
  variable: '--font-brand',
  display: 'swap',
});

/** Display — Hero 제목·레이싱 번호·섹션 헤드라인 */
export const fontDisplay = localFont({
  src: '../../public/Ethnocentric-Regular.otf',
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

/** Data / Mono — 날짜·랩타임·상태·메타 정보 */
export const fontData = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-data',
  display: 'swap',
});
