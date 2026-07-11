# API Docs — KYS UDISE+

**Proxy:** Vite dev `/web-app/api/*` → `https://kys.udiseplus.gov.in`  
**Required header on every call:** `X-APP-SIGNATURE: 9f2c7a4b8e1d6c3f5a9b0e2d4f6a7c8b`

> **Note:** Always use the short numeric `schoolId` (e.g. `4583653`) in all school-specific APIs — never the 11-digit UDISE code. The UDISE code is for display only.

---

## 1. Captcha

**What it does:** Returns a base64-encoded PNG image to display to the user. The captcha is IP-based — UDISE ties the captcha to our backend server's IP. **Both the captcha fetch and the subsequent search must go through the same Express backend** (same IP) for validation to succeed.

**Data returned:** `data` field is the raw base64 PNG string (no `data:image/png;base64,` prefix — the frontend adds it).

> **Note:** `ewDVKv` is a fixed captcha value that only works for org searches (type=5, type=6). For all other search types (1–4) a real captcha from `getCaptcha` is required.

```
GET /web-app/api/getCaptcha
```

Our backend exposes this as:
```
GET /api/search/captcha
```

---

## 1b. Verify Captcha

**What it does:** Checks if the user's typed captcha value is correct — returns `{ data: true }` if correct, `{ data: false }` if wrong. Does **not** consume the captcha; the same captcha value can still be used in the subsequent search call.

**When to use:** Called on the Home page before navigating to AdvanceSearch. Gives the user early feedback (wrong captcha stays on Home, user retypes) without wasting a search API call.

```
GET /web-app/api/verifyCaptcha?captcha=abc123
```

Our backend exposes this as:
```
GET /api/search/verify-captcha?captcha=abc123
```

**Response:**
```json
{ "status": true, "data": true }   // correct captcha
{ "status": true, "data": false }  // wrong captcha
```

---

## 2. Search Schools

**What it does:** Searches schools by name, UDISE code, PIN code, or org type (KVS, NVS, EMRS etc.).  
**Data returned per school:** `udiseschCode`, `schoolName`, `schoolId` (numeric, use this for detail APIs), `stateName`, `districtName`, `blockName`, `address`, `pincode`, `schoolStatus` (0=Operational), `schCatDesc`, `schLocDesc`, `schTypeDesc`, `schMgmtDescSt`, `classFrm`, `classTo`, `latitude`, `longitude`, `lastmodifiedTime`, `yearDesc`, `pmShriYn`.

```
GET /web-app/api/search-schools?searchType=2&searchParam=GOVT+GIRLS+HS+KANPUR&stateId=109&captcha=5UNUN2&yearId=0
```

| searchType | What it searches | Extra param |
|------------|-----------------|-------------|
| `1` | Broad keyword / school name (no state filter) | — |
| `2` | School name with state filter | `stateId` required |
| `3` | 11-digit UDISE code (exact match) | — |
| `4` | PIN code | — |
| `5` | Management org — `searchParam=92` KVS · `searchParam=93` NVS | uses fixed `ewDVKv` captcha |
| `6` | Special category — `searchParam=1` PM SHRI · `searchParam=2` CWSN · `searchParam=3` EMRS | uses fixed `ewDVKv` captcha |

> `yearId=0` means Real Time data. For types 1–4 pass a real captcha from `/api/search/captcha`.

---

## 3. School Detail — 5 APIs (used on Know More / SchoolDetail page)

All 5 are called in parallel. Use numeric `schoolId`.

---

### 3a. School Basic Info

**What it does:** Gets the school's main identity — name, location, classes, management, academic year.  
**Data returned:** `schoolName`, `udiseschCode`, `stateName`, `districtName`, `blockName`, `address`, `classFrm`, `classTo`, `schoolStatusName` (Operational), `schLocDesc` (Urban/Rural), `schCategoryType` (Pr. with Up.Pr. Sec. and H.Sec.), `schTypeDesc` (Co-educational), `schMgmtType` (national management), `schMgmtDescSt` (state management), `yearDesc`, `latitude`, `longitude`, `pmShriYn`.

```
GET /web-app/api/school/by-year?schoolId=4583653&action=1
```

---

### 3b. Student Enrolment & Teacher Count

**What it does:** Gets total student count split by gender, and total teacher count split by type and gender.  
**Data returned:** `totalBoy` (765), `totalGirl` (721), `totalCount` (1486), `totalTeacherReg` (41 regular teachers), `totalTeacherCon` (11 contractual), `totalTeacherMale` (21), `totalTeacherFemale` (31).

```
GET /web-app/api/school-statistics/enrolment-teacher?schoolId=4583653
```

---

### 3c. Infrastructure & Facilities

**What it does:** Gets Yes/No flags for all school facilities — toilets, library, labs, internet, etc.  
**Data returned:** `toiletYn`, `libraryYn`, `electricityYn`, `playgroundYn`, `drinkWaterYn`, `integratedLabYn`, `tinkeringLabYn`, `medchkYn`, `internetYn`, `rampsYn`, `handwashYn`, `solarpanelYn`, `ictLabYn`, `hmRoomYn`, `clsrmsInst` (classrooms installed), `desktopFun` (working desktops), `projectorTot`, `digiBoardTot`.  
> All `Yn` fields: `1` = Yes (active/green), `2` = No (inactive/grey).

```
GET /web-app/api/school/facility?schoolId=4583653
```

---

### 3d. School Profile

**What it does:** Gets deeper school information — when it was established, board affiliation, principal name, website, medium of instruction.  
**Data returned:** `estdYear` (1982), `boardSecName` (CBSE), `boardHighSecName` (CBSE), `headMasterName`, `website`, `email`, `schPhone`, `mediumOfInstrName1` (English), `mediumOfInstrName2` (Hindi), `recogYearPri/Upr/Sec/Hsec` (year each level was recognised), `resiSchDesc` (Non Residential), `cwsnSchYn`.

```
GET /web-app/api/school/profile?schoolId=4583653
```

---

### 3e. Report Card Summary

**What it does:** Gets the school's headline stats used on the Report Card — teachers, grants, beneficiaries, infrastructure summary.  
**Data returned:** Same shape as the full Report Card API below — total teachers, students, grants received, MDM beneficiaries, classrooms, toilets count.

```
GET /web-app/api/school/report-card?schoolId=4583653
```

---

## 4. Report Card — Full Page APIs (used on `/reportcard` page, all called in parallel)

---

### 4a. Main Report Card Data

**What it does:** Full school statistics for the report card — teachers, enrolment, infrastructure counts, grants.  
**Data returned:** `schoolName`, total teachers (regular/para/head), total enrolment, classrooms, toilets, library, electricity, drinking water, MDM beneficiaries, grants (composite/teacher salary/maintenance), inspection counts.

```
GET /web-app/api/school/report-card?schoolId=4583653&yearId=11
```

---

### 4b. Facility Data (Report Card version)

**What it does:** Same facility flags as 3c but year-specific for the report card display.  
**Data returned:** Same fields as 3c — all `Yn` flags plus counts.

```
GET /web-app/api/school/facility?schoolId=4583653&yearId=11
```

---

### 4c. School Profile (Report Card version)

**What it does:** Same profile info as 3d but year-specific.  
**Data returned:** Same fields as 3d — board, estd year, medium, principal, etc.

```
GET /web-app/api/school/profile?schoolId=4583653&yearId=11
```

---

### 4d–4h. Enrolment Breakdowns (flags 1–5)

**What it does:** 5 separate calls returning enrolment tables split by different categories.  
**Data returned:** Each returns class-wise rows (Pre-Primary to Class 12) with Boys/Girls/Total columns.

| flag | Category split |
|------|----------------|
| `1`  | Social category — General, SC, ST, OBC |
| `2`  | Religion — Muslim, Christian, Sikh, Buddhist, Parsi, Jain |
| `3`  | Age/Grade — current year grade-wise breakdown |
| `4`  | EWS (Economically Weaker Section) |
| `5`  | RTE (Right to Education Act students) |

```
GET /web-app/api/getSocialData?flag=1&schoolId=4583653&yearId=11
GET /web-app/api/getSocialData?flag=2&schoolId=4583653&yearId=11
GET /web-app/api/getSocialData?flag=3&schoolId=4583653&yearId=11
GET /web-app/api/getSocialData?flag=4&schoolId=4583653&yearId=11
GET /web-app/api/getSocialData?flag=5&schoolId=4583653&yearId=11
```

---

### 4i. Year List for Report Card Dropdown

**What it does:** Gets the list of available academic years for a school's report card.  
**Data returned:** Array of `{ yearId, yearDesc }` — e.g. `{ yearId: 11, yearDesc: "2024-25" }`.

```
GET /web-app/api/getYearData?udise=4583653&action=1
```

---

## 5. Track School API

**What it does:** Returns a school's full history across every academic year — name, location, category, type, and status for each year. Useful for seeing how a school changed over time (name changes, state reclassification, category upgrades).

**Data returned:** Array of records, one per year, each containing:

| Field           | Example                                   | Meaning                         |
|-----------------|-------------------------------------------|---------------------------------|
| `sessionYear`   | `"2024-25"`                               | Academic year label             |
| `yearId`        | `11`                                      | Numeric year ID                 |
| `schoolId`      | `5512597`                                 | Numeric school ID               |
| `udiseschCode`  | `"29260805606"`                           | 11-digit UDISE code             |
| `schoolName`    | `"KENDRIYA VIDYALAYA BRBNMPL MYSURU"`     | School name that year           |
| `stateName`     | `"KENDRIYA VIDYALAYA SANGHATHAN"`         | State (or org) name             |
| `districtName`  | `"BENGALURU REGION"`                      | District                        |
| `blockName`     | `"BENGALURU REGION"`                      | Block                           |
| `schcatDesc`    | `"6-Pr. Up Pr. and Secondary Only"`       | School category (has prefix)    |
| `schtypeDesc`   | `"3-Co-educational"`                      | School type (has prefix)        |
| `schmgmtDesc`   | `"Kendriya Vidyalaya"`                    | Management                      |
| `schStatusName` | `"Operational"`                           | Current status                  |
| `schoolStatus`  | `0`                                       | `0` = Operational, `1` = Closed |

> Use `clean()` from `utils/formatters.js` to strip the numeric prefix from `schcatDesc` and `schtypeDesc`.

```
GET /web-app/api/school/track?schoolId=5512597
```

Our backend exposes this as:
```
GET /api/schools/:id/track
```

---

## 6. Region Profile — 3 Tab APIs

Used on the Region Profile page. Pass `regionCd` and `yearId`. Called in parallel, one per tab.

---

### 5a. School & Facilities Tab

**What it does:** Gets % statistics for school facilities at a national / state / district / block level.  
**Data returned:** `totSchools`, `totGovSchPer` (% govt schools), `totElecPer` (% with electricity), `totLibPer`, `totPlayGrndPer`, `totDrinkWaterPer`, `totToiletPer`, `totComputerPer`, `totInternetPer`, `totRampPer`, and 8 more facility percentages.

```
GET /web-app/api/facility-per?regionCd=50&yearId=11
```

---

### 5b. Enrolment Tab

**What it does:** Gets % enrolment statistics broken down by gender, level, and category.  
**Data returned:** `totEnrollment` (total students), `totGovEnrolPer` (% in govt schools), `totBoysEnrolPer`, `totGirlsEnrolPer`, `totPryEnrolPer` (% Primary), `totUppPryEnrolPer`, `totSecEnrolPer`, `totHighSecEnrolPer`, `totSCEnrolPer`, `totSTEnrolPer`, `totOBCEnrolPer`, `totMuslimEnrolPer`.

```
GET /web-app/api/enrolment-per?regionCd=50&yearId=11
```

---

### 5c. Teachers Tab

**What it does:** Gets % teacher statistics — gender, qualification, type of appointment, etc.  
**Data returned:** `totTch` (total teachers), `totTchMalePer`, `totTchFemalePer`, `totSchWoutFemTchPer` (% schools with no female teacher), `totTchRegPer` (% regular), `totTchNonRegPer`, `totSchWithSingleTchPer`, `totTchAbove55Per`, `totTchGraduatePer`, `totTchAboveGraduatePer`, `totTchNoProfPer`, `totTchCompTrainedPer`.

```
GET /web-app/api/teacher-per?regionCd=50&yearId=11
```

---

## 6. Dropdown / Master Data APIs

---

### Academic Years

**What it does:** Gets the list of academic years available across the portal.  
**Data returned:** Array of `{ yearId, yearDesc }`.

```
GET /web-app/api/getYears
```

---

### States List

**What it does:** Gets all Indian states with their UDISE state codes (used as `regionCd` for state-level stats).  
**Data returned:** `stateName`, `udiseStateCode` (use as `regionCd`), `stateId` (use as `stateId` param for district API).

```
GET /web-app/api/getStateData?yearId=11
```

---

### Districts for a State

**What it does:** Gets all districts in a state (cascade from state dropdown).  
**Data returned:** `districtName`, `udiseDistrictCode` (use as `regionCd`), `districtId` (use for block API).

```
GET /web-app/api/getDistrictData?stateId=128&yearId=11
```

---

### Blocks for a District

**What it does:** Gets all blocks in a district (cascade from district dropdown).  
**Data returned:** `blockName`, `udiseBlockCode` (use as `regionCd`), `blockId`.

```
GET /web-app/api/getBlockData?districtId=100&yearId=11
```

---

## 7. Key ID Reference

| yearId | Academic Year |
|--------|---------------|
| `0`    | Real Time (live data) |
| `13`   | 2026-27 |
| `12`   | 2025-26 |
| `11`   | 2024-25 |
| `10`   | 2023-24 |
| `9`    | 2022-23 |
| `8`    | 2021-22 |

| regionCd | Meaning |
|----------|---------|
| `50`     | National (all India) |
| Use `udiseStateCode` from States API | Any specific state |
| Use `udiseDistrictCode` from Districts API | Any district |
| Use `udiseBlockCode` from Blocks API | Any block |

**schoolId vs udiseschCode:**
- `schoolId` = short numeric integer (e.g. `4583653`) — use in ALL detail/report/facility APIs
- `udiseschCode` = 11-digit string (e.g. `27251900607`) — display only, never pass to APIs
