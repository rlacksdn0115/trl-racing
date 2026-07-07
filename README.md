# TRL Racing — 공식 웹사이트

TRL Racing(TorqueLINE Racing)의 공식 웹사이트입니다.
팀 소개 · 멤버 · 경기 일정/결과 · 소식 · 갤러리와 자체 관리자(CMS)를 포함한 운영형 사이트입니다.

> **Race Together. Improve Together.**

## 기술 스택

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Supabase** — Database / Auth(관리자 로그인) / Storage(이미지)
- **next-intl** — 한국어(기본, `/`) / 영어(`/en/...`) 다국어
- CSS Modules + CSS 변수 디자인 토큰 (Tailwind 미사용)
- 폰트: Chakra Petch(Display) · Pretendard(본문) · IBM Plex Mono(데이터)

## 빠르게 실행해 보기 (Supabase 없이)

```bash
npm install
npm run dev   # http://localhost:3000
```

Supabase 환경 변수가 없으면 사이트는 **내장 시드 데이터**(멤버 5명, 경기 3건, 소식 3건)로
렌더링됩니다. 실제 운영과 CMS 사용은 아래 Supabase 설정이 필요합니다.

---

## 운영 세팅 (처음 한 번만)

### 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 에서 새 프로젝트를 생성합니다.
2. 프로젝트 대시보드 → **SQL Editor** 를 엽니다.
3. 이 저장소의 [`supabase/schema.sql`](./supabase/schema.sql) 내용 전체를 붙여넣고 **Run** — 테이블, 보안 정책(RLS), Storage 버킷이 만들어집니다.
4. 이어서 [`supabase/seed.sql`](./supabase/seed.sql) 을 실행 — 멤버 5명과 기존 경기/소식 데이터가 들어갑니다.

### 2. 관리자 계정 만들기

1. Supabase 대시보드 → **Authentication → Users → Add user → Create new user**
2. 관리자 이메일/비밀번호를 입력해 생성합니다. (이 계정으로 `/admin/login` 에 로그인)
3. **회원가입은 열려 있지 않습니다.** 관리자 추가는 항상 이 방법으로만 합니다.

### 3. 환경 변수 설정

Supabase 대시보드 → **Project Settings → API** 에서 값을 복사해:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. 배포 (Vercel 기준)

1. 이 저장소를 GitHub에서 **Fork** 합니다.
2. [vercel.com](https://vercel.com) → **Add New Project** → Fork한 저장소 선택
3. **Environment Variables** 에 위 두 값을 입력하고 Deploy
4. 이후에는 GitHub에 push할 때마다 자동 배포됩니다.

> 환경 변수는 **빌드 시점에 필요**합니다. Vercel에서 변수를 나중에 추가/수정했다면
> **Redeploy** 를 한 번 해주세요.

---

## 관리자(CMS) 사용법

- 접속: `사이트주소/admin` (Footer 하단의 `admin` 링크, 또는 단축키 **Cmd/Ctrl + Shift + A**)
- 관리 항목:
  - **경기** — 일정 등록 → 경기 후 같은 항목에 결과·후기·YouTube 영상 입력 (일정과 결과가 하나의 데이터)
  - **멤버** — 프로필/헬멧 이미지, 장비, SNS, 공개 여부, 정렬
  - **소식** — 카테고리, 한/영 본문, 대표 이미지, 관련 경기 연결
  - **갤러리** — 이미지 업로드, 설명, 경기 연결
  - **차량** — 출전 차량 마스터 데이터
  - **설정** — Hero 영상 URL, 모집 여부, Discord/Instagram/YouTube/문의 링크
- 모든 콘텐츠는 한국어/영어 병기 입력란이 있습니다. 비워두면 반대 언어 값으로 대체 표시됩니다.
- 이미지는 파일 업로드(Supabase Storage) 또는 URL 직접 입력 둘 다 가능합니다.

## 프로젝트 구조

```
src/
├─ app/
│  ├─ (site)/[locale]/     공개 페이지 (/, about, members, schedule, results, races, news, gallery, join)
│  └─ (admin)/admin/       관리자 (login + 대시보드/CRUD)
├─ components/             공개 사이트 컴포넌트 (+ components/admin: CMS 전용)
├─ i18n/                   next-intl 라우팅 설정
├─ lib/
│  ├─ supabase/            Supabase 클라이언트 (server/browser/middleware)
│  ├─ queries/             공개 페이지 조회 + fallback 시드 데이터
│  └─ admin/               CMS 조회·서버 액션
├─ types/                  콘텐츠 타입
messages/                  UI 문자열 (ko.json / en.json)
supabase/                  schema.sql / seed.sql
public/brand, members/     로고·헬멧 등 정적 에셋
```

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 실행
npm run lint    # ESLint
```

## 알아두면 좋은 것

- **디자인 토큰**은 `src/app/globals.css` 의 `:root` CSS 변수에 있습니다. 색·간격을 바꾸려면 여기만 수정하면 됩니다.
- **Hero 영상**: 관리자 설정에서 YouTube/mp4 URL 입력 시 데스크톱에서 음소거 자동재생됩니다. 모바일과 모션 축소 설정 사용자에게는 정적 배경이 나옵니다. 비우면 항상 정적 배경입니다.
- **로고**: 현재 `public/brand/` 의 PNG(legacy 자산)를 사용합니다. 벡터(SVG) 로고가 준비되면 같은 경로에 교체하는 것을 권장합니다 (`docs/design.md` §4.1의 파일명 참고).
- **트랙 맵**: 경기별 트랙 맵 이미지를 업로드하면 카드·상세에 표시되고, 없으면 장식용 라인이 나옵니다.
- 기획/디자인/기능 명세 원본은 [`docs/`](./docs) 폴더에 있습니다 (`TRL.md`, `feature.md`, `design.md`, `plan.md`).
